import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js"

import { registerSlashCommand } from "~/lib/core"
import { template } from "~/lib/messages"

import handleExtinguishSubcommand from "./extinguish"
import handleStatusSetSubcommand from "./status/set"
import handleStatusRemoveSubcommand from "./status/remove"
import handleSendMessageSubcommand from "./send/message"
import handleSendEmbedSubcommand from "./send/embed"

const SUBCOMMANDS = {
  EXTINGUISH: "extinguish",
  SEND: {
    MESSAGE: "message",
    EMBED: "embed",
  },
  STATUS: {
    SET: "set",
    REMOVE: "remove",
  },
} as const

const builder = new SlashCommandBuilder()
  .setName("admin")
  .setDescription("Admin-only commands")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addSubcommandGroup((group) =>
    group
      .setName("send")
      .setDescription("Makes PAL send something in the current channel")
      .addSubcommand((subcommand) =>
        subcommand
          .setName(SUBCOMMANDS.SEND.MESSAGE)
          .setDescription("Send a text message as PAL in the current channel")
          .addStringOption((option) =>
            option.setName("message").setDescription("Message to send"),
          )
          .addAttachmentOption((option) =>
            option.setName("attachment").setDescription("Optional attatchment"),
          ),
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName(SUBCOMMANDS.SEND.EMBED)
          .setDescription("Send an embed as PAL in the current channel"),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName(SUBCOMMANDS.EXTINGUISH)
      .setDescription("Removes all messages from ART emergencies"),
  )
  .addSubcommandGroup((group) =>
    group
      .setName("status")
      .setDescription("Status-related commands")
      .addSubcommand((subcommand) =>
        subcommand
          .setName(SUBCOMMANDS.STATUS.SET)
          .setDescription("Sets a new status for PAL")
          .addStringOption((option) =>
            option.setName("status").setDescription("Status").setRequired(true),
          ),
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName(SUBCOMMANDS.STATUS.REMOVE)
          .setDescription("Removes PAL status"),
      ),
  )

registerSlashCommand(builder, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    switch (interaction.options.getSubcommand()) {
      case SUBCOMMANDS.EXTINGUISH:
        return handleExtinguishSubcommand(interaction)
      case SUBCOMMANDS.STATUS.SET:
        return handleStatusSetSubcommand(interaction)
      case SUBCOMMANDS.STATUS.REMOVE:
        return handleStatusRemoveSubcommand(interaction)
      case SUBCOMMANDS.SEND.MESSAGE:
        return handleSendMessageSubcommand(interaction)
      case SUBCOMMANDS.SEND.EMBED:
        return handleSendEmbedSubcommand(interaction)
      default:
        console.log("[admin-slash-command] unknown interaction")
        return interaction.reply({
          content: template.oops("Unknown subcommand"),
          ephemeral: true,
        })
    }
  }
})
