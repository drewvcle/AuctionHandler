import { config } from 'dotenv';
config();
const TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
import schedule from 'node-schedule';
import { updateWin, getTop } from './spreadsheetMJS.mjs';

import { ChannelType, time, Client, GatewayIntentBits, Partials, Collection, CommandInteractionOptionResolver, userMention, channelMention, roleMention, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, UserSelectMenuBuilder } from 'discord.js';
const { Guilds, GuildMembers, GuildMessages, MessageContent } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
import { REST } from '@discordjs/rest';
import { channel } from 'node:diagnostics_channel';

const rest = new REST({ version: '10'}).setToken(TOKEN);



function scheduleMessage(){
  const date = new Date (new Date().getTime() + 2000)
  schedule.scheduleJob(date, () => console.log('Scheduled Message!'));
}

function lbEmbed(s1, s2){
  var e = new EmbedBuilder().setTimestamp();
  e.addFields({name: 'Name', value: s1, inline: true});
  e.addFields({name: 'Auctions Won', value: s2, inline: true});
  e.setColor(0x40C7F4);
  e.setTitle('Auction Leaderboards');
  return e;
}


// Discord Essentials
const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages, MessageContent],
  partials: [User, Message, GuildMember, ThreadMember],
});

//Please replace 'fill' with the channel IDs.
const channelIDs = ['fill', 'fill', 'fill', 'fill', 'fill', 'fill', 'fill', 'fill'];
var status = ['Done', 'Done', 'Done', 'Done', 'Done', 'Done', 'Done', 'Done'];
var AuctionCountDown = ['Done', 'Done', 'Done', 'Done', 'Done', 'Done', 'Done', 'Done'];


const day = 86400000;
const second = 1000;

var set = 0;
var channelMessages = new Array();

//Please replace 'fill' with users who were contracted to be pinged for upcoming auctions.
var whoToPing = 'fill';
var whoToPing2 = 'fill';
var whoToPing3 = 'fill';

var queueArray = [];

var auctionMess = '';
var findNum1;
var findNum2;
// Writes the ID of users in the Queue channel
async function overwriteQueue(queueChannel){
  channelMessages = [];
  queueArray = [];
  channelMessages = await queueChannel.messages.fetch({limit: 100});
  channelMessages.forEach(msg => queueArray.push(msg.author.id));
  queueArray.pop();
  
}
//Writes the auction message to the specific auction channel
var auctionStringArray = ['', '', '', '', '', '', '', ''];
function insertAuctionMess(auctionMessage, queueChan){
  switch (queueChan){
    case channelIDs[0]:
      auctionStringArray[0] = auctionMessage;
      break;
    case channelIDs[1]:
      auctionStringArray[1] = auctionMessage;
      break;
    case channelIDs[2]:
      auctionStringArray[2] = auctionMessage;
      break;
    case channelIDs[3]:
      auctionStringArray[3] = auctionMessage;
      break;
    case channelIDs[4]:
      auctionStringArray[4] = auctionMessage;
      break;
    case channelIDs[5]:
      auctionStringArray[5] = auctionMessage;
      break;
    case channelIDs[6]:
      auctionStringArray[6] = auctionMessage;
      break;
    case channelIDs[7]:
      auctionStringArray[7] = auctionMessage;
      break;
    
  }
}

//Checks to see if the specified user is in the first 3 of the queue channel. If so, then ping.
function checkGJuicePing(privchannel, queueChannel, queueArray){
  overwriteQueue(queueChannel);
  if(queueArray.length > 3 && queueArray[queueArray.length - 4] === whoToPing)
    privchannel.send('<@' + whoToPing + '>: <#892874661594030141>');
  if(queueArray.length > 3 && queueArray[queueArray.length - 4] === whoToPing2)
    privchannel.send('<@' + whoToPing2 + '>: <#892874661594030141>');
  if(queueArray.length > 3 && queueArray[queueArray.length - 4] === whoToPing3)
    privchannel.send('<@' + whoToPing3 + '>: <#892874661594030141>');
}


//Displays the timers
function displayTimers(privchannel){
  var str = '';
  for(let i = 0; i < channelIDs.length; i++)
    str += '<#' + channelIDs[i] + '>: ' + status[i] + '\n';

  privchannel.send(str);
}


//Gets the index number of the required channel
function changeStatus(getchannel){
  for(let i = 0; i < channelIDs.length; i++){
    if(getchannel === channelIDs[i])
      return i;
  }
  return -1;
}

client.on('ready', () => {
  console.log('The bot is ready.');
})
 client.on('messageCreate', async message => {
  //Initialization of bot
  if(set == 0){
    const queueChannel = client.channels.cache.get(`892874661594030141`);
    overwriteQueue(queueChannel);
    set++;
  // Occurs when an auction is created in the specific channel.
   } else if(((message.content.includes('<@&892900925071577128>')) || (message.content.includes('<@&1096843608696570017>')) || (message.content.includes('<@&1096842944234934382>')) || message.content.includes('<@&892901214046535690>')) && message.content.toLowerCase().includes('item 1')){
        const getchannel = await client.channels.fetch(message.channel.id);

        if(!channelIDs.includes('' + getchannel))
          return;
        
        const userping = message.author.id;
        //ID of private channel
        const privchannel = client.channels.cache.get(`892865839374692352`);
        // Runs command after a day
        const date = new Date(new Date().getTime() + day);
        // Checks the queue after 3 minutes
        const datecheck = new Date(new Date().getTime() + 180000);
        // Creates date formatted in Relative Time. Used for !timers
        const dateStatus = time(new Date(), 'R');
        const getChannelString = '' + getchannel;

        //Creates specific auction message for !auction by splicing out words that are not required
        auctionMess = message.content;
        // Find auction 1 line
        var findAuc = auctionMess.toLowerCase().indexOf("item 1");
        var tempMsg = auctionMess.slice(findAuc);
        var findNL = tempMsg.indexOf("\n");
        var auction1 = tempMsg.slice(0,findNL);
        // Find auction 2 line
        var auction2 = "";
        findAuc = auctionMess.toLowerCase().indexOf("item 2");
        if (findAuc != -1){
          tempMsg = auctionMess.slice(findAuc);
          findNL = tempMsg.indexOf("\n");
          auction2 = tempMsg.slice(0,findNL);
          auction2 = "\n" + auction2;
        }
        auctionMess = auction1 + auction2;
        auctionMess += "\n";
        insertAuctionMess(auctionMess, getChannelString);

        // Used to create timer for !auction
        const statusNum = changeStatus('' + getchannel);
        status[statusNum] = dateStatus;
        var timeNow = new Date().getTime();
        timeNow = timeNow/1000 - (timeNow%1000)/1000;
        const dateCountdown2 = time(timeNow + day/1000 , 'R');
        AuctionCountDown[statusNum] = dateCountdown2;

        // Runs after 3 minutes to check if users in queue channel are to be pinged
        //Please replace 'fill' with the queue channel ID.
        const queueChannel = client.channels.cache.get(`fill`);
        schedule.scheduleJob(datecheck, () => {
          checkGJuicePing(privchannel, queueChannel, queueArray);
      });
        // Pings handler after a day that an auction is done
        schedule.scheduleJob(date, () => {
          status[statusNum] = 'Done';
          privchannel.send('<@' + userping + '>, <#' + getchannel + '> is done.');

      });
   // !timer command. Please replace 'fill' with the Handler's channel ID.
   } else if(message.content.startsWith('!timers') && await client.channels.fetch(message.channel.id) == "fill"){
    const privchannel = client.channels.cache.get(`fill`);
    displayTimers(privchannel);
   // !auction command
   } else if(message.content.startsWith('!auction')){
    const getchannel = await client.channels.fetch(message.channel.id);
    
    var s = '';
      const embedAuction = new EmbedBuilder()
        .setTimestamp();
        // This builds auction information and timer
        for(let i = 0; i < 8; i++){
          if(status[i] != 'Done'){
            embedAuction.addFields({name: ' > <#' + channelIDs[i] + '>' + ' — ' + AuctionCountDown[i], value: auctionStringArray[i]});
            s += ' > <#' + channelIDs[i] + '>\n' + auctionStringArray[i];
          }
        }

        if(s === ""){
          embedAuction.setColor(0xfc0303);
          embedAuction.setTitle('No auctions available.');
        }
        else{
          embedAuction.setColor(0x4CEB34);
          embedAuction.setTitle('Active Auctions')
        }

      getchannel.send({ embeds: [embedAuction]});
   //Displays Leaderboard. Please replace 'fill' with the Auction chat ID, Handler Channel's ID, and Staff's Channel's ID.
  } else if(message.content.startsWith('!lb') && (await client.channels.fetch(message.channel.id) == "fill" || await client.channels.fetch(message.channel.id) == "fill" || await client.channels.fetch(message.channel.id) == "fill")){    
    const getchannel = await client.channels.fetch(message.channel.id);
    
    getTop(50).then(async function(board){
      var tens = 10;
      var lbStringIDs = '';
      var lbStringWins = '';
      for(let i = tens - 10; i < tens; i++){
        lbStringIDs += '#' + (i+1) + ': <@' + board.ids[i] + '>\n';
        lbStringWins += board.wins[i] + '\n';
      }
      var embedLB = lbEmbed(lbStringIDs, lbStringWins);

      const left = new ButtonBuilder()
        .setCustomId('left')
        .setLabel('<-')
        .setStyle(ButtonStyle.Danger);
      const leftDis = new ButtonBuilder()
        .setCustomId('left')
        .setLabel('<-')
        .setStyle(ButtonStyle.Danger)
        .setDisabled(true);
      const right = new ButtonBuilder()
        .setCustomId('right')
        .setLabel('->')
        .setStyle(ButtonStyle.Success);
      const rightDis = new ButtonBuilder()
        .setCustomId('right')
        .setLabel('->')
        .setStyle(ButtonStyle.Success)
        .setDisabled(true);

        const row = new ActionRowBuilder().addComponents(left, right);
        const rowLDis = new ActionRowBuilder().addComponents(leftDis, right);
        const rowRDis = new ActionRowBuilder().addComponents(left, rightDis);
      
        const response = await message.reply({
          embeds: [embedLB],
          components: [rowLDis],
        });
        lbStringIDs = '';
        lbStringWins = '';
      

        const collectorFilter = i => i.user.id === message.author.id;

        while(true){
          try {
          const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
          
          if (confirmation.customId === 'left') {
            tens -= 10;
            for(let i = tens - 10; i < tens; i++){
              lbStringIDs += '#' + (i+1) + ': <@' + board.ids[i] + '>\n';
              lbStringWins += board.wins[i] + '\n';
            }

            embedLB = lbEmbed(lbStringIDs, lbStringWins);
            if(tens == 10)
              await confirmation.update({ embeds: [embedLB], components: [rowLDis] });
            else if(tens > 10 && tens < 50)
              await confirmation.update({ embeds: [embedLB], components: [row] });
            else if (tens == 50)
              await confirmation.update({ embeds: [embedLB], components: [rowRDis] });
            lbStringIDs = '';
            lbStringWins = '';
          } else if (confirmation.customId === 'right') {
            tens += 10;
            for(let i = tens - 10; i < tens; i++){
              lbStringIDs += '#' + (i+1) + ': <@' + board.ids[i] + '>\n';
              lbStringWins += board.wins[i] + '\n';
            }
            embedLB = lbEmbed(lbStringIDs, lbStringWins);
            if(tens == 10)
              await confirmation.update({ embeds: [embedLB], components: [rowLDis] });
            else if(tens > 10 && tens < 50)
              await confirmation.update({ embeds: [embedLB], components: [row] });
            else if (tens == 50)
              await confirmation.update({ embeds: [embedLB], components: [rowRDis] });
            lbStringIDs = '';
            lbStringWins = '';
          }
        
        } catch (e) {
          break;
          } 


          
      } 
  
    });
    //Updates Google Sheet's Leaderboards
   } else if(message.content.toLowerCase().includes('taking') && message.content.toLowerCase().includes('<@')){
    const getchannel = await client.channels.fetch(message.channel.id);

    if(!channelIDs.includes('' + getchannel))
      return;
    
    function getStringBid(str, start){
      var end, shift;
      if(start == '@'){
        end = ">";
        shift = 1;
      } else if (start == "for"){
        end = "\n";
        shift = 4;
      } else {
        return;
      }

      var begin = str.indexOf(start) + shift;
      var close = str.indexOf(end);
      return str.slice(begin, close);
    }

    var endAucMsg = message.content;
    const numPings = endAucMsg.replace(/[^@]/g, "").length;
    const sleep = (duration) => {
      return new Promise(resolve => setTimeout(resolve, duration));
    }

    //Test Case 1: 2 IDs in 2 different lines
    if(numPings == 2 && endAucMsg.includes("\n")){
      var delim = endAucMsg.indexOf('\n');
      var msg1 = endAucMsg.slice(0, delim) + "\n";
      var msg2 = endAucMsg.slice(delim + 1) + "\n";
      var id2 = getStringBid(msg2, "@");
      var char2 = getStringBid(msg2, "for");
      var id1 = getStringBid(msg1, "@");
      var char1 = getStringBid(msg1, "for")

      updateWin(id1, char1);
      sleep(5000).then(() => {
        updateWin(id2, char2);
      })
      

      // Test Case 2: 2 IDs in 1 line
    } else if(numPings == 2){
      var delim = endAucMsg.indexOf('and');
      var msg1 = endAucMsg.slice(0, delim);
      var msg2 = endAucMsg.slice(delim) + ' ';
      var id2 = getStringBid(msg2, "@");
      var char2 = getStringBid(msg2, "for");
      var id1 = getStringBid(msg1, "@");
      var char1 = getStringBid(msg1, "for")

      updateWin(id1, char1);
      sleep(5000).then(() => {
        updateWin(id2, char2);
      })


      // Test Case 3: 1 ID, 2 wins
    } else if(numPings == 1 && endAucMsg.includes("and")) {
      var delim = endAucMsg.indexOf('and');
      var msg1 = endAucMsg.slice(0, delim);
      var msg2 = endAucMsg.slice(delim) + ' ';
      var char2 = getStringBid(msg2, "for");
      var id1 = getStringBid(msg1, "@");
      var char1 = getStringBid(msg1, "for")

      updateWin(id1, char1);
      sleep(5000).then(() => {
        updateWin(id1, char2);
      })
      

      // Test Case 4: 1 ID, 1 win
    } else if(numPings == 1){
      var msg1 = endAucMsg + '\n';
      var id1 = getStringBid(msg1, "@");
      var char1 = getStringBid(msg1, "for")

      updateWin(id1, char1);
    }
  }
   


}); 


client.login(TOKEN);




