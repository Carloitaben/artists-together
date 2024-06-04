import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js"
import { registerEventHandler } from "~/lib/core"
import { parseMentions } from "~/lib/utils"
import { template } from "~/lib/messages"

const MODAL_ID = "admin-send-embed"

const INPUT_ID = {
  EMBED_TITLE: `${MODAL_ID}-title`,
  EMBED_COLOR: `${MODAL_ID}-color`,
  EMBED_CONTENT: `${MODAL_ID}-content`,
}

const BUTTON_ID = {
  CREATE: `${MODAL_ID}-button-create`,
  CANCEL: `${MODAL_ID}-button-cancel`,
} as const

const createButton = new ButtonBuilder()
  .setCustomId(BUTTON_ID.CREATE)
  .setStyle(ButtonStyle.Primary)
  .setLabel("Send embed")

const cancelButton = new ButtonBuilder()
  .setCustomId(BUTTON_ID.CANCEL)
  .setStyle(ButtonStyle.Secondary)
  .setLabel("Cancel")

function isValidColor(color: string) {
  return /^#[0-9A-F]{6}$/i.test(color)
}

export default async function handleSendEmbedSubcommand(
  interaction: ChatInputCommandInteraction,
) {
  if (!interaction.guild) {
    throw Error("Missing guild property in modal interaction")
  }

  if (!interaction.channel) {
    throw Error("Expected channel property in interaction")
  }

  if (!("name" in interaction.channel)) {
    throw Error("Expected name property in channel")
  }

  const modal = new ModalBuilder()
    .setCustomId(MODAL_ID)
    .setTitle(`New embed in #${interaction.channel.name}`)

  const titleInput = new TextInputBuilder()
    .setCustomId(INPUT_ID.EMBED_TITLE)
    .setStyle(TextInputStyle.Short)
    .setRequired(false)
    .setLabel("Embed title")
    .setPlaceholder("Seriously cool embed")

  const colorInput = new TextInputBuilder()
    .setCustomId(INPUT_ID.EMBED_COLOR)
    .setStyle(TextInputStyle.Short)
    .setRequired(false)
    .setLabel("Embed color (in hexadecimal)")
    .setPlaceholder("#3924ff")

  const contentInput = new TextInputBuilder()
    .setCustomId(INPUT_ID.EMBED_CONTENT)
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setLabel("Embed content (supports Markdown)")
    .setPlaceholder("This is an **awesome** embed!")

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(titleInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(colorInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(contentInput),
  )

  return interaction.showModal(modal)
}

registerEventHandler("interactionCreate", async (interaction) => {
  if (!interaction.isModalSubmit()) return
  if (!interaction.customId.startsWith(MODAL_ID)) return

  if (!interaction.guild) {
    throw Error("Missing guild property in modal interaction")
  }

  if (!interaction.channel) {
    throw Error("Missing channel property in modal interaction")
  }

  const contentInput = interaction.fields.getTextInputValue(
    INPUT_ID.EMBED_CONTENT,
  )
  const titleInput = interaction.fields.getTextInputValue(INPUT_ID.EMBED_TITLE)
  const colorInput =
    interaction.fields.getTextInputValue(INPUT_ID.EMBED_COLOR) || "#f4f4f4"

  if (!isValidColor(colorInput)) {
    return interaction.reply({
      content: template.oops(
        `The color code ${colorInput} doesn't seem to be valid`,
      ),
      ephemeral: true,
    })
  }

  const content = await parseMentions(interaction.guild.roles, contentInput)

  console.log("[admin-send-embed-command] sending confirmation")

  const embed = new EmbedBuilder({
    title: titleInput,
    description: content,
  }).setColor(colorInput as `#${string}`)

  const response = await interaction.reply({
    content:
      "Sending a message in this channel with the following embed. Sound good?",
    ephemeral: true,
    fetchReply: true,
    embeds: [embed],
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        createButton,
        cancelButton,
      ),
    ],
  })

  try {
    const confirmation = await response.awaitMessageComponent({
      time: 60_000,
    })

    if (!confirmation.channel) {
      throw Error("Expected channel property on confirmation interaciton")
    }

    switch (confirmation.customId) {
      case BUTTON_ID.CANCEL:
        return confirmation.update({
          content: template.cancel(),
          embeds: [],
          components: [],
        })
      case BUTTON_ID.CREATE:
        await interaction.channel.send({
          embeds: [embed],
        })

        return confirmation.update({
          content: template.done(),
          embeds: [],
          components: [],
        })
    }
  } catch (error) {
    await response.edit({
      content: template.timeout(),
      embeds: [],
      components: [],
    })
  }
})
