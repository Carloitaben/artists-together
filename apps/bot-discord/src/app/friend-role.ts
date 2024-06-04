import { registerEventHandler } from "~/lib/core"
import { getMember } from "~/lib/utils"
import { ROLES } from "@artists-together/core/discord"

const MESSAGE_ID =
  process.env.NODE_ENV === "production" ? "1150447914641010729" : ""

const REACTION = "🔓"

registerEventHandler(
  "messageReactionAdd",
  async (partialReaction, partialUser) => {
    if (!partialReaction.message.inGuild()) return
    if (partialReaction.message.id !== MESSAGE_ID) return
    if (partialUser.bot) return

    if (partialReaction.emoji.name !== REACTION) {
      return partialReaction.remove()
    }

    const member = await getMember(
      partialReaction.message.guild.members,
      partialUser.id
    )

    if (member.roles.cache.has(ROLES.FRIEND)) return
    if (member.roles.cache.has(ROLES.ARTIST)) return

    await Promise.all([
      member.roles.remove(ROLES.GUEST),
      member.roles.add(ROLES.FRIEND),
    ])
  }
)
