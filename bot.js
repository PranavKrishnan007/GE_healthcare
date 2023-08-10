const {Client, IntentsBitField} = require('discord.js')
const { config } = require('dotenv')
const { collection, getDocs } = require('firebase/firestore');
const { Parser } = require('json2csv');
const fs = require('fs');
const { db } = require('./bot_firebase')
config();

const client = new Client({intents : [
  IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.MessageContent
  ]});

client.on('ready', c => {
  console.log(c.user.tag);
})

client.on('messageCreate', async (message) => {
  if(message.content ==="stats"){
    const userCollectionRef = collection(db, "users");
    const userSnapshot = await getDocs(userCollectionRef);

    const data = [];

    userSnapshot.docs.forEach(docSnapshot => {
      const docData = docSnapshot.data();
      if ('registered' in docData) {
        data.push({
          name: docData.name,
          email: docData.email
        });
      }
    });

    const csvParser = new Parser();
    const csvData = csvParser.parse(data);

    fs.writeFileSync('userData.csv', csvData);

    message.channel.send({
      files: ['userData.csv']
    });
  }
});

client.on('messageCreate', (message) => {
  if(message.content === "ping"){
    message.reply("pong");
  }
})

client.login(process.env.DISCORD_BOT_TOKEN)
