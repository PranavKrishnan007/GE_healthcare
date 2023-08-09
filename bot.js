const {Client, IntentsBitField} = require('discord.js')
const { config } = require('dotenv')
const { decodeReply } = require('next/dist/server/app-render/entry-base')
config();

const client = new Client({intents : [
  IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.MessageContent
  ]});

client.on('messageCreate', () => {

})

client.on('messageCreate', (message) => {
  if(message.content === "ping"){
    message.reply("pong");
  }
})

client.login(process.env.DISCORD_BOT_TOKEN)
