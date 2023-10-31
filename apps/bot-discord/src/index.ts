import { Client, Partials, GatewayIntentBits } from "discord.js"

import { env } from "~/lib/env"
import { connect } from "~/lib/ws"
import { getRegistrations } from "~/lib/core"

const bot = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.Guilds,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
})

bot.once("ready", () => console.log("🚀"))

const registrations = await getRegistrations()

registrations.handlers.forEach((callbacks, event) => {
  bot.addListener(event, (...args) => callbacks.forEach((callback) => callback(...args)))
})

await Promise.all([bot.login(env.DISCORD_BOT_TOKEN), connect()])
