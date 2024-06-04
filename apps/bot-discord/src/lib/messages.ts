import { oneOf } from "@artists-together/core/utils"

function timeout(message?: string) {
  const prefix = [["Oops!", "Oopsie!", "Uh-oh!", "Whoops!"]]

  const meat = [
    "No response in 1 minute, so we're canceling!",
    "No confirmation in a minute, so we're calling it off!",
    "Canceling since we didn't hear back in 60 seconds!",
    "No worries, but we're canceling due to no response in 1 minute!",
  ]

  return [oneOf(prefix), message || oneOf(meat)].join(" ")
}

function cancel(message?: string) {
  const prefix = [
    "",
    "All good!",
    "Easy-peasy!",
    "Got it!",
    "No problemo!",
    "Sure thing!",
  ]

  const meat = [
    "Action cancelled",
    "Cancelled and done",
    "Cancelled and dusted!",
    "Cancelled for you",
    "Cancelled like a pro",
    "Cancelled with a smile",
    "Cancelled with a snap",
    "Cancelled, as easy as pie!",
    "Cancelled, just like magic!",
    "Cancelled, no sweat!",
    "Consider it cancelled, my friend!",
  ]

  const emoji = ["", "✅", "✨", "👋", "👍", "😄", "😄", "😎", "🙌", "🥧", "🪄"]

  return [oneOf(prefix), message || oneOf(meat), oneOf(emoji)]
    .filter(Boolean)
    .join(" ")
}

function done(message?: string) {
  const prefix = [
    "",
    "Bingo!",
    "High-five!",
    "Hooray!",
    "Nailed it!",
    "Ta-da!",
    "Voilà!",
  ]

  const meat = [
    "All wrapped up!",
    "Done and dusted!",
    "Done like a pro!",
    "It's all set!",
    "It's all wrapped up!",
    "It's finished!",
    "It's good to go!",
    "Job well done!",
    "Mission accomplished!",
    "Task completed!",
    "Task wrapped!",
  ]

  const emoji = [
    "",
    "✅",
    "✨",
    "🌟",
    "🎈",
    "🎉",
    "👌",
    "👍",
    "💪",
    "😄",
    "🚀",
    "🪄",
  ]

  return [oneOf(prefix), message || oneOf(meat), oneOf(emoji)]
    .filter(Boolean)
    .join(" ")
}

function oops(message?: string) {
  const prefix = ["Oops!", "Oopsie!", "Uh-oh!", "Whoops!"]

  const meat = [
    "Something went wrong…",
    "I stumbled upon an issue…",
    "I hit a little snag…",
    "Something's not quite right…",
    "I goofed up…",
    "A hiccup in the system…",
  ]

  return [oneOf(prefix), message || oneOf(meat), "😅"].filter(Boolean).join(" ")
}

export const template = {
  timeout,
  cancel,
  done,
  oops,
}
