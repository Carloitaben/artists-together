import {
  Client,
  Partials,
  GatewayIntentBits,
  EmbedBuilder,
  AttachmentBuilder,
} from "discord.js"
import {
  getChannel,
  getTextBasedChannel,
  getRole,
  getGuild,
  getPublicFile,
} from "~/lib/utils"
import { CHANNELS, ROLES } from "@artists-together/core/discord"

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
})

async function bootstrapRulesChannel(client: Client) {
  const [rulesChannel, introductionsChannel] = await Promise.all([
    getTextBasedChannel(client, CHANNELS.RULES_N_FAQ),
    getChannel(client, CHANNELS.INTRODUCTIONS),
  ])

  await rulesChannel.send({
    files: [
      new AttachmentBuilder(getPublicFile("/images/banners/banner-rules.png")),
    ],
  })

  await rulesChannel.send({
    embeds: [
      new EmbedBuilder({
        color: 0x024456,
        description:
          "# RULES" +
          "\n" +
          "————————————————————" +
          "\n" +
          "\n" +
          "## :one:  Follow Discord's ToS and Community Guidelines." +
          "\n" +
          "- [*Terms of Service*](https://discord.com/terms)" +
          "\n" +
          "- [*Community Guidelines*](https://discord.com/guidelines)" +
          "\n" +
          "\n" +
          "## :two:  Be respectful." +
          "\n" +
          "- Any form of harassment, hate speech or bullying will not be tolerated." +
          "\n" +
          "\n" +
          "## :three:  Keep topics relevant to the appropriate channels." +
          "\n" +
          `- Refrain from critiquing others' work unless it is asked for.` +
          "\n" +
          "- Use the off-topic category accordingly." +
          "\n" +
          "\n" +
          "## :four:  No spam." +
          "\n" +
          "- Avoid repetitive and excessive messages, pings or embeds." +
          "\n" +
          "\n" +
          "————————————————————" +
          "\n" +
          "\n" +
          "*✱ If you experience a rule break, please contact a moderator.*" +
          "\n" +
          "\n" +
          "*✱ These rules are non-exhaustive, human beings will use their judgement when dealing with disruptive behaviour!*" +
          "\n" +
          "\n" +
          "*✱ Please keep in mind that these rules extend to behaviour in the Voice channels, DMs and all content linked in the channels, as well.*",
      }),
    ],
  })

  await rulesChannel.send({
    embeds: [
      new EmbedBuilder({
        color: 0x024456,
        description:
          "# FAQ" +
          "\n" +
          "————————————————————" +
          "\n" +
          "\n" +
          "## :question:  How can I be part of this community?" +
          "\n" +
          "By being here you already are! Everyone is free to join or leave whenever they want." +
          "\n" +
          "\n" +
          "## :question:  Do I need to be an artist/creative to join this community?" +
          "\n" +
          "If you do not practise any art medium and you just want to see others' creations, you're more than welcome too." +
          "\n" +
          "\n" +
          "## :question:  Is there any kind of subscription fee?" +
          "\n" +
          "No, it is and it will keep being totally free! You can of course donate to help us cover the expenses.",
      }),
    ],
  })

  const unlockServerMessage = await rulesChannel.send({
    embeds: [
      new EmbedBuilder({
        color: 0x024456,
        description:
          `**If you're an artist, introduce yourself in ${introductionsChannel} to get the role!**` +
          "\n" +
          "Reacting with 🔓 you agree you've read the rules.",
      }),
    ],
  })

  await unlockServerMessage.react("🔓")
}

async function bootstrapAboutChannel(client: Client) {
  const guild = await getGuild(client)
  const channel = await getTextBasedChannel(client, CHANNELS.ABOUT)

  await channel.send({
    files: [
      new AttachmentBuilder(getPublicFile("/images/banners/banner-about.png")),
    ],
  })

  await channel.send({
    embeds: [
      new EmbedBuilder({
        color: 0xff1800,
        description:
          "**Artists Together** is an online, worldwide inclusive community for all kinds of artists and all skill levels." +
          "\n" +
          "\n" +
          "## Our goal" +
          "\n" +
          "The main objective of this community is to give artists from around the globe a voice, a place to celebrate and promote their creative content and, of course, have some fun!" +
          "\n" +
          "\n" +
          "We hope that members of A.T. will see this server as a safe space to learn, build, and share their creative journey among each other." +
          "\n" +
          "Collaboration is highly encouraged!",
      }),
    ],
  })

  await channel.send({
    embeds: [
      new EmbedBuilder({
        color: 0xff1800,
        description:
          "## Backstory" +
          "\n" +
          'This server was created in October 2020 as *"Artist Back Alley"* by *MissDaisyDee*, *AnonymousTurtle*, and *LittleChook* as an accountability group for fellow creatives with online shops to prepare for the impending holiday shopping season.' +
          "\n" +
          "\n" +
          'As a big debut for the birth of this server, Artist Back Alley successfully launched its first community art project the "Hyper Train" where members submitted their designed box-cars to be hooked up together by other submissions, creating one glorious hyper train! You can still view the Hyper Train here: https://artistbackalley.com/' +
          "\n" +
          "\n" +
          "Since launch, this server has grown and evolved - Still remaining true to the founders' goal of creating an inclusive space for all creatives to mingle, grow, and collaborate." +
          "\n" +
          "\n" +
          '*"Collaboration is the heart of this server. I am grateful for the efforts and genius of both Daisy and Turtle in creating this, but it took a VILLAGE of fellow passionate creatives to keep this community growing and thriving. I take immense pride in helping to lay the foundation, and I hope that members share this same pride - because we built this together. We\'re artists together."* - LittleChook',
      }),
    ],
  })

  await channel.send({
    content:
      "**Website:** https://artiststogether.online/" +
      "\n" +
      "**Instagram:** https://instagram.com/artiststogether.online" +
      "\n" +
      "**Twitch:** https://twitch.tv/artiststogether" +
      "\n" +
      "**Youtube:** https://www.youtube.com/@artiststogether" +
      "\n" +
      "**Discord:** https://discord.gg/9Ayh9dvhHe" +
      "\n" +
      "**Donate:** https://ko-fi.com/artiststogether" +
      "\n" +
      "\n" +
      "*You can also contact us at info@artiststogether.online*",
  })

  await channel.send({
    files: [
      new AttachmentBuilder(getPublicFile("/images/banners/banner-art.png")),
    ],
  })

  await channel.send({
    embeds: [
      new EmbedBuilder({
        color: 0xffdc48,
        description:
          "**Artist Raid Train** is an online event done periodically where artists from the community stream and raid each other on Twitch." +
          "\n" +
          "\n" +
          "Participating in the A.R.T. event is an excellent opportunity to:" +
          "\n" +
          "- *Meet and make new friends in the art streaming community.*" +
          "\n" +
          "- *Connect and engage with the A.T. members on a more personal level.*" +
          "\n" +
          "- *Promote your work, your channel, your shop/commissions page, etc.*" +
          "\n" +
          "- *Learn more about new art mediums/styles/processes.*" +
          "\n" +
          "- *Help you reach your stream goals.*",
      }),
    ],
  })

  await channel.send({
    files: [
      new AttachmentBuilder(getPublicFile("/images/banners/banner-pal.png")),
    ],
  })

  await channel.send({
    embeds: [
      new EmbedBuilder({
        color: 0x3924ff,
        description:
          "Hey there! **I am Pal** *(Programmable Artistic Life-form)*, the assistant bot of this community." +
          "\n" +
          "\n" +
          "I have been created to be as diverse as possible, so no one can say I am ugly- That's why I have so many faces! But if you see a blob of color with horns and floating extremities, you can be 96.33% sure that's me!" +
          "\n" +
          "\n" +
          "My current job is to assist members on community-related topics and help moderators with automated processes." +
          "\n" +
          "For now, I'll be announcing events and updates too." +
          "\n" +
          "\n" +
          "I am the Pal you need!",
      }),
    ],
  })

  const [roleAdmin, roleModerator, roleArtist, roleFriend, roleGuest, rolePal] =
    await Promise.all([
      getRole(guild.roles, ROLES.ADMIN),
      getRole(guild.roles, ROLES.MODERATOR),
      getRole(guild.roles, ROLES.ARTIST),
      getRole(guild.roles, ROLES.FRIEND),
      getRole(guild.roles, ROLES.GUEST),
      getRole(guild.roles, ROLES.PAL),
    ])

  await channel.send({
    files: [
      new AttachmentBuilder(getPublicFile("/images/banners/banner-roles.png")),
    ],
  })

  await channel.send({
    embeds: [
      new EmbedBuilder({
        color: 0xf4f4f4,
        description:
          `${roleAdmin} - Administrator of the server.` +
          "\n" +
          `${roleModerator} - Moderator of the server.` +
          "\n" +
          `${roleArtist} - Member that takes part in creative activities.` +
          "\n" +
          `${roleFriend} - Member who is just hanging around~` +
          "\n" +
          `${roleGuest} - Peep who just joined the server.` +
          "\n" +
          `${rolePal} - That's me, Pal! Friendly A.T. assistant bot!`,
      }),
    ],
  })
}

bot.once("ready", async (client) => {
  await Promise.all([
    bootstrapRulesChannel(client),
    bootstrapAboutChannel(client),
  ])
  console.log("🎉")
})

await bot.login(process.env.DISCORD_BOT_TOKEN)
