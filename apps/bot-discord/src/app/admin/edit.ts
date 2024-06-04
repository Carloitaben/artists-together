import {
  ActionRowBuilder,
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  EmbedBuilder,
  ModalBuilder,
  PermissionFlagsBits,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js"
import { CHANNELS } from "@artists-together/core/discord"
import { registerContextMenuCommand, registerEventHandler } from "~/lib/core"
import { template } from "~/lib/messages"
import { getTextBasedChannel, parseMentions } from "~/lib/utils"

const MODAL_ID = "admin-edit-message"

const INPUT_ID = {
  EMBED_TITLE: `${MODAL_ID}-embed-title`,
  EMBED_COLOR: `${MODAL_ID}-embed-color`,
  EMBED_CONTENT: `${MODAL_ID}-embed-content`,
  MESSAGE: `${MODAL_ID}-message`,
}

function isValidColor(color: string) {
  return /^#[0-9A-F]{6}$/i.test(color)
}

function encode({
  channelId,
  messageId,
  hasMessage,
  hasEmbed,
}: {
  channelId: string
  messageId: string
  hasMessage: boolean
  hasEmbed: boolean
}) {
  return [
    MODAL_ID,
    channelId,
    messageId,
    Number(hasMessage),
    Number(hasEmbed),
  ].join("@")
}

function decode(id: string) {
  const [_, channelId, messageId, hasMessage, hasEmbed] = id.split("@")

  return {
    channelId,
    messageId,
    hasMessage: Boolean(parseInt(hasMessage)),
    hasEmbed: Boolean(parseInt(hasEmbed)),
  }
}

const builder = new ContextMenuCommandBuilder()
  .setName("Edit PAL message")
  .setType(ApplicationCommandType.Message)
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

registerContextMenuCommand(builder, async (interaction) => {
  if (!interaction.isMessageContextMenuCommand()) return

  if (interaction.targetMessage.author.id !== process.env.DISCORD_BOT_ID) {
    return interaction.reply({
      content: template.oops("That message isn't mine"),
      ephemeral: true,
    })
  }

  if (!interaction.targetMessage.editable) {
    return interaction.reply({
      content: template.oops("Editing window closed for that message"),
      ephemeral: true,
    })
  }

  const hasEmbed = interaction.targetMessage.embeds?.[0]

  const hasMessage = !!interaction.targetMessage.content

  const isErrorMessage =
    interaction.targetMessage.channelId === CHANNELS.BOT_SHENANIGANS

  if ((!hasEmbed && !hasMessage) || isErrorMessage) {
    return interaction.reply({
      content: template.oops("Can't make changes to that kind of message"),
      ephemeral: true,
    })
  }

  const modal = new ModalBuilder().setTitle("Editing message")

  if (hasMessage) {
    const messageInput = new TextInputBuilder()
      .setCustomId(INPUT_ID.MESSAGE)
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false)
      .setLabel("Message")
      .setPlaceholder("Message (supports Markdown)")
      .setValue(interaction.targetMessage.content)

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(messageInput)
    )
  }

  if (hasEmbed) {
    const [embed] = interaction.targetMessage.embeds

    const titleInput = new TextInputBuilder()
      .setCustomId(INPUT_ID.EMBED_TITLE)
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
      .setLabel("Embed Title")
      .setPlaceholder("Seriously cool embed")
      .setValue(embed?.title || "")

    const colorInput = new TextInputBuilder()
      .setCustomId(INPUT_ID.EMBED_COLOR)
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
      .setLabel("Embed color (in hexadecimal)")
      .setPlaceholder("#3924ff")
      .setValue(embed?.hexColor || "")

    const contentInput = new TextInputBuilder()
      .setCustomId(INPUT_ID.EMBED_CONTENT)
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setLabel("Embed content (supports Markdown)")
      .setPlaceholder("This is an **awesome** embed!")
      .setValue(embed?.description || "")

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(titleInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(colorInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(contentInput)
    )
  }

  modal.setCustomId(
    encode({
      channelId: interaction.targetMessage.channelId,
      messageId: interaction.targetMessage.id,
      hasMessage,
      hasEmbed,
    })
  )

  return interaction.showModal(modal)
})

registerEventHandler("interactionCreate", async (interaction) => {
  if (!interaction.isModalSubmit()) return
  if (!interaction.customId.startsWith(MODAL_ID)) return

  if (!interaction.guild) {
    throw Error("Missing guild property in modal interaction")
  }

  if (!interaction.channel) {
    throw Error("Missing channel property in modal interaction")
  }

  const { channelId, messageId, hasMessage, hasEmbed } = decode(
    interaction.customId
  )

  const channel = await getTextBasedChannel(interaction.client, channelId)
  const message = await channel.messages.fetch(messageId)

  if (!message.editable) {
    return interaction.reply({
      content: template.oops("Editing window closed for that message"),
      ephemeral: true,
    })
  }

  if (hasMessage) {
    const messageInput = interaction.fields.getTextInputValue(INPUT_ID.MESSAGE)
    const content = await parseMentions(interaction.guild.roles, messageInput)
    await message.edit({
      content,
    })
  }

  if (hasEmbed) {
    const embedContentInput = interaction.fields.getTextInputValue(
      INPUT_ID.EMBED_CONTENT
    )

    const embedTitleInput = interaction.fields.getTextInputValue(
      INPUT_ID.EMBED_TITLE
    )

    const embedColorInput =
      interaction.fields.getTextInputValue(INPUT_ID.EMBED_COLOR) || "#f4f4f4"

    if (embedColorInput && !isValidColor(embedColorInput)) {
      return interaction.reply({
        content: template.oops(
          `The color code ${embedColorInput} doesn't seem to be valid`
        ),
        ephemeral: true,
      })
    }

    const content = await parseMentions(
      interaction.guild.roles,
      embedContentInput
    )

    await message.edit({
      content: message.content,
      embeds: [
        new EmbedBuilder({
          title: embedTitleInput,
          description: content,
        }).setColor(embedColorInput as `#${string}`),
      ],
    })
  }

  return interaction.reply({
    content: template.done(),
    ephemeral: true,
  })
})
