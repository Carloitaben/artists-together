import { Glob } from "bun"
import type {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  ClientEvents,
  ContextMenuCommandBuilder,
  MessageContextMenuCommandInteraction,
  SlashCommandBuilder,
  UserContextMenuCommandInteraction,
} from "discord.js"

type RegisterEventCallback<T extends keyof ClientEvents> = (
  ...args: ClientEvents[T]
) => void

const handlersMap = new Map<
  keyof ClientEvents,
  Set<RegisterEventCallback<any>>
>()

export function registerEventHandler<T extends keyof ClientEvents>(
  event: T,
  callback: RegisterEventCallback<T>
) {
  const set = handlersMap.get(event) ?? new Set<RegisterEventCallback<T>>()
  set.add(callback)
  handlersMap.set(event, set)
}

type CommandBuilderStub = Pick<
  SlashCommandBuilder | ContextMenuCommandBuilder,
  "name" | "toJSON"
>

const buildersMap = new Map<string, CommandBuilderStub>()

export function registerSlashCommand<T extends CommandBuilderStub>(
  builder: T,
  callback: (
    interaction: AutocompleteInteraction | ChatInputCommandInteraction
  ) => void
) {
  if (buildersMap.has(builder.name)) {
    throw Error(`Found duplicated command: ${builder.name}`)
  }

  buildersMap.set(builder.name, builder)

  registerEventHandler("interactionCreate", (interaction) => {
    if (interaction.isAutocomplete()) {
      console.log("[isAutocomplete event]", interaction.commandName)
      if (interaction.commandName === builder.name) return callback(interaction)
    }

    if (interaction.isChatInputCommand()) {
      console.log("[interactionCreate event]", interaction.commandName)
      if (interaction.commandName === builder.name) return callback(interaction)
    }
  })
}

export function registerContextMenuCommand<T extends ContextMenuCommandBuilder>(
  builder: T,
  callback: (
    interaction:
      | MessageContextMenuCommandInteraction
      | UserContextMenuCommandInteraction
  ) => void
) {
  if (buildersMap.has(builder.name)) {
    throw Error(`Found duplicated command: ${builder.name}`)
  }

  buildersMap.set(builder.name, builder)

  registerEventHandler("interactionCreate", (interaction) => {
    if (interaction.isContextMenuCommand()) {
      console.log("[contextMenuCommand event]", interaction.commandName)
      if (interaction.commandName === builder.name) return callback(interaction)
    }
  })
}

export async function getRegistrations() {
  const files = new Glob("src/app/**/*.ts").scan(".")

  for await (const file of files) {
    // Let side-effects run
    await import(file)
  }

  return {
    handlers: handlersMap,
    builders: buildersMap,
  }
}
