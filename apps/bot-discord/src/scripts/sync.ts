import { REST, Routes } from "discord.js"
import { getRegistrations } from "~/lib/core"

const registrations = await getRegistrations()
const rest = new REST({ version: "10" }).setToken(
  String(process.env.DISCORD_BOT_TOKEN)
)
const body = Array.from(registrations.builders.values()).map((value) =>
  value.toJSON()
)

try {
  await rest.put(
    Routes.applicationGuildCommands(
      String(process.env.DISCORD_BOT_ID),
      String(process.env.DISCORD_SERVER_ID)
    ),
    {
      body,
    }
  )

  console.log(`Synced ${body.length} commands`)
} catch (error) {
  console.error(error)
}
