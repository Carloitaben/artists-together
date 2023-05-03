import { and, connect, discordPollVotes, eq } from "db"

import { registerEventHandler } from "~/lib/core"
import { polls } from "~/store/polls"

registerEventHandler("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return
  if (!interaction.customId.startsWith("poll-button-")) return

  if (!interaction.message.nonce) {
    throw Error("Expected poll UUID in message nonce property")
  }

  const poll = polls.get(String(interaction.message.nonce))

  if (!poll) {
    throw Error(`Could not find cached poll with id ${interaction.message.nonce}`)
  }

  const answer = parseInt(interaction.customId.replace("poll-button-", ""))
  const db = connect()

  const [existingUserVote] = await db
    .select()
    .from(discordPollVotes)
    .where(and(eq(discordPollVotes.pollId, poll.id), eq(discordPollVotes.userId, interaction.user.id)))
    .limit(1)

  if (existingUserVote) {
    if (existingUserVote.answer === answer) {
      return interaction.reply({
        content: "done!",
        ephemeral: true,
      })
    }

    await db.update(discordPollVotes).set({ answer }).where(eq(discordPollVotes.id, existingUserVote.id))

    return interaction.reply({
      content: "updated!",
      ephemeral: true,
    })
  }

  await db.insert(discordPollVotes).values({
    pollId: poll.id,
    userId: interaction.user.id,
    answer,
  })

  return interaction.reply({
    content: "inserted!",
    ephemeral: true,
  })
})