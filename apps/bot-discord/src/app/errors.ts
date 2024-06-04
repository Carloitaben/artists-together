import { oneOf } from "@artists-together/core/utils"
import { CHANNELS, ROLES } from "@artists-together/core/discord"
import { EmbedBuilder } from "discord.js"
import { registerEventHandler } from "~/lib/core"
import { getTextBasedChannel } from "~/lib/utils"

const MESSAGE_TITLE = [
  "Oopsie!",
  "Yikes!",
  "Uh-oh!",
  "Darn it!",
  "Well, this is awkward!",
  "Oh snap!",
]

const MESSAGE_SUBTITLE = [
  "Something went wrong…",
  "I stumbled upon an issue…",
  "I hit a little snag…",
  "Something's not quite right…",
  "I goofed up…",
  "A hiccup in the system…",
]

registerEventHandler("ready", async (client) => {
  const channel = await getTextBasedChannel(client, CHANNELS.BOT_SHENANIGANS)

  process.on("uncaughtException", async (error) => {
    await channel.send({
      content:
        `<@&${ROLES.TECH_SUPPORT}>` +
        " " +
        oneOf(MESSAGE_TITLE) +
        " " +
        oneOf(MESSAGE_SUBTITLE),
      embeds: [
        new EmbedBuilder({
          color: 0xff1800,
          fields: [
            {
              name: "Name",
              value: `\`${error.name}\``,
              inline: false,
            },
            {
              name: "Message",
              value: `\`${error.message}\``,
              inline: false,
            },
            {
              name: "Stack trace",
              value: error.stack
                ? `\`\`\`${error.stack}\`\`\``
                : "No stack trace found",
              inline: false,
            },
          ],
        }),
      ],
    })
  })
})
