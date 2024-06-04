import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ChatInputCommandInteraction,
  ComponentType,
  TextChannel,
} from "discord.js"
import { CHANNELS } from "@artists-together/core/discord"
import { template } from "~/lib/messages"
import { getTextBasedChannel } from "~/lib/utils"

const BUTTON_IDS = {
  DELETE: "confirm",
  CANCEL: "cancel",
} as const

const deleteButton = new ButtonBuilder()
  .setCustomId(BUTTON_IDS.DELETE)
  .setStyle(ButtonStyle.Danger)
  .setLabel("Delete all messages")

const cancelButton = new ButtonBuilder()
  .setCustomId(BUTTON_IDS.CANCEL)
  .setStyle(ButtonStyle.Secondary)
  .setLabel("Cancel")

async function deleteAllMessages(channel: TextChannel) {
  const messages = await channel.messages.fetch({ limit: 100 })

  if (messages.size) {
    await Promise.all(messages.map((message) => message.delete()))
    await deleteAllMessages(channel)
  }
}

export default async function handleExtinguishSubcommand(
  interaction: ChatInputCommandInteraction,
) {
  const channel = await getTextBasedChannel(
    interaction.client,
    CHANNELS.ART_EMERGENCIES
  )

  if (channel.type !== ChannelType.GuildText) {
    throw Error("Expected ART_EMERGENCIES channel type to be GuildText")
  }

  console.log("[admin-extinguish-command] replying with confirmation")

  const response = await interaction.reply({
    content: `This will delete all messages from the ${channel} channel. Are you sure?`,
    ephemeral: true,
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        deleteButton,
        cancelButton,
      ),
    ],
  })

  try {
    const confirmation = await response.awaitMessageComponent({
      time: 60_000,
      filter: (i) => i.user.id === interaction.user.id,
      componentType: ComponentType.Button,
    })

    switch (confirmation.customId) {
      case BUTTON_IDS.DELETE:
        await confirmation.update({
          content: "Deleting messages…",
          components: [],
        })

        try {
          await deleteAllMessages(channel)
          return confirmation.editReply({
            content: template.done(),
            components: [],
          })
        } catch (error) {
          console.error(error)
          return confirmation.editReply({
            content: template.oops(
              "There was an error while deleting messages.",
            ),
            components: [],
          })
        }
      case BUTTON_IDS.CANCEL:
        return confirmation.update({
          content: template.cancel(),
          components: [],
        })
    }
  } catch (error) {
    return response.edit({
      content: template.timeout(),
      components: [],
    })
  }
}
