import dayjs from "dayjs"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import { ROLES } from "@artists-together/core/discord"
import { registerEventHandler } from "~/lib/core"
import { cron, getGuild } from "~/lib/utils"

dayjs.extend(isSameOrAfter)

registerEventHandler("ready", (client) => {
  cron("0 0 * * *", async () => {
    const guild = await getGuild(client)
    const members = await guild.members.fetch()

    console.log("[kick-guests] members size", members.size)

    members.forEach(async (member) => {
      if (!member.roles.cache.has(ROLES.GUEST)) return
      if (member.roles.cache.has(ROLES.FRIEND)) return
      if (member.roles.cache.has(ROLES.ARTIST)) return

      const joinedAt = dayjs(member.joinedAt)
      const aMonthAgo = dayjs().add(-1, "month")
      const timedOut = joinedAt.isBefore(aMonthAgo)

      console.log(`[kick-guests] checking guest: ${member.user.username}`, {
        timedOut,
      })

      if (!timedOut) return

      console.log(`[kick-guests] sending dm to guest: ${member.user.username}`)

      await member.user
        .send(
          "Hello 👋 I’m Pal, assistant bot from the Artists Together community." +
            "\n" +
            "\n" +
            "It looks like you joined the server a while ago but did not accept the rules." +
            "\n" +
            "To mitigate inactivity we have to kick you from the server, but you’re free to join again whenever you want!" +
            "\n" +
            "https://discord.gg/9Ayh9dvhHe"
        )
        .catch((error) => {
          console.log(
            `[kick-guests] error sending dm to guest: ${member.user.username}`
          )
          console.error(error)
        })

      console.log(`[kick-guests] kicking guest: ${member.user.username}`)
      await member.kick("Inactivity")
    })
  })
})
