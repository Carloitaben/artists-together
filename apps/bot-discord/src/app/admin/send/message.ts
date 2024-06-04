import { ChatInputCommandInteraction } from "discord.js"
import { parseMentions } from "~/lib/utils"
import { template } from "~/lib/messages"

export default async function handleSendMessageSubcommand(
  interaction: ChatInputCommandInteraction,
) {
  const message = interaction.options.getString("message")
  const attachment = interaction.options.getAttachment("attachment")

  if (!interaction.guild) {
    throw Error("Missing guild property in modal interaction")
  }

  if (!interaction.channel) {
    throw Error("Expected channel property in interaction")
  }

  if (!message && !attachment) {
    console.log("[admin-say-command] cannot send empty message")

    return interaction.reply({
      ephemeral: true,
      content: "I cannot send an empty message!",
    })
  }

  const parsedMessage = await parseMentions(
    interaction.guild.roles,
    message || "",
  )

  await interaction.channel
    .send({
      content: parsedMessage,
      files: attachment ? [attachment.url] : undefined,
    })
    .catch((error) => console.log("error sending message", error))

  console.log("[admin-say-command] done")
  return interaction
    .reply({
      content: template.done(),
      ephemeral: true,
    })
    .catch((error) => console.log("error replying", error))
}
