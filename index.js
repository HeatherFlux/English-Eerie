const Discord = require("discord.js");
const _ = require("lodash");
const client = new Discord.Client();
const stories = require("./stories.json");
let activeStory = stories.BeastOnTheMoor;

const cards = [
  "Clue",
  "Clue",
  "Clue",
  "Clue",
  "Secondary Harmed",
  "Secondary Harmed",
  "Secondary Harmed",
  "Secondary Harmed",
  "Secondary Obstructs",
  "Secondary Obstructs",
  "Secondary Obstructs",
  "Secondary Obstructs",
  "Environment Obstructs",
  "Environment Obstructs",
  "Environment Obstructs",
  "Environment Obstructs",
];

let shuffledDeck = [];
let greyLadyCount = 0;
let tokens = {
  resolve: 0,
  spirit: 0,
};

let obstruc1 = 3;
let obstruc2 = 3;

const createDeck = () => {
  obstruc1 = 3;
  obstruc2 = 3;
  const shuffled = _.shuffle(cards);
  d1 = _.shuffle(shuffled.slice(0, 5).concat("Grey Lady"));
  d2 = _.shuffle(shuffled.slice(5, 10).concat("Grey Lady"));
  d3 = _.shuffle(shuffled.slice(10, 16).concat("Grey Lady"));
  shuffledDeck = [...d1, ...d2, ...d3];
};

const drawCard = (msg) => {
  const card = shuffledDeck.pop();
  switch (card) {
    case "Clue":
      msg.channel.send(card);
      msg.channel.send("Helper Promts:");
      msg.channel.send(">>> " + activeStory.clues);
      break;
    case "Secondary Harmed":
      msg.channel.send(card);
      msg.channel.send("Helper Promts:");
      msg.channel.send(">>> " + activeStory.secondaryCharacters);
      break;
    case "Secondary Obstructs":
      msg.channel.send(card);
      msg.channel.send(obstruc1++);
      msg.channel.send("Helper Promts:");
      msg.channel.send(">>> " + activeStory.secondaryObstacles);
      break;
    case "Environment Obstructs":
      msg.channel.send(card);
      msg.channel.send(obstruc2++);
      msg.channel.send("Helper Promts:");
      msg.channel.send(">>> " + activeStory.environmentObstacles);
      break;
    case "Grey Lady":
      greyLadyCount++;
      msg.channel.send(card);
      switch (greyLadyCount) {
        case 1:
          msg.channel.send(">>> " + activeStory.tension1);
          break;
        case 2:
          msg.channel.send(">>> " + activeStory.tension2);
          break;
        case 3:
          msg.channel.send(">>> " + activeStory.tension3);
          msg.channel.send("The story comes to a close.");
          greyLadyCount = 0;
          break;
      }
      break;

    default:
      break;
  }
};

const createProtagonist = () => {
  const random = Math.floor(4 * Math.random()) + 1;
  tokens.spirit = 3 + random;
  tokens.resolve = 3 + (4 - random);
};

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const newGame = (msg) => {
  createDeck();
  createProtagonist();
  greyLadyCount = 0;

  msg.channel.send("Synopsis");
  msg.channel.send(">>> " + activeStory.synopsis);
  msg.channel.send("Locations");
  msg.channel.send(">>> " + activeStory.locations);
  msg.channel.send("Characters");
  msg.channel.send(">>> " + activeStory.secondaryCharacters);
  msg.channel.send("Spirit: " + tokens.spirit + " Resolve: " + tokens.resolve);
};

client.on("message", (msg) => {
  switch (msg.content) {
    case "!new game":
      newGame(msg);
      msg.channel.send("Tell me a scary story");
      break;
    case "!draw":
      drawCard(msg);
      break;
    case "!roll":
      msg.channel.send(Math.floor(10 * Math.random()) + 1);
      break;
    case "!tokens":
      msg.channel.send(
        "Spirit: " + tokens.spirit + " Resolve: " + tokens.resolve
      );
      break;
    case "!spirit":
      tokens.spirit = tokens.spirit - 1;
      msg.channel.send(tokens.spirit);
      break;
    case "!resolve":
      tokens.resolve = tokens.resolve - 1;
      msg.channel.send(tokens.resolve);
      break;
    case "!help":
      msg.channel.send(
        "!new game --- Starts a New Game\n!draw --- Draws a card\n!token --- Shows Current Spirit/Resolve\n!spirit --- Reduces Spirt\n!resolve --- Reduces Resolves\n!story <story name> --- Sets The Story\n!stories --- List Playable Stories\n!help --- Displays this message"
      );
    case "!story beast":
      activeStory = stories.BeastOnTheMoor;
      msg.channel.send("Beast On The Moor");
      break;
    case "!story river":
      activeStory = stories.TheLostRiver;
      msg.channel.send("The Lost River");
      break;
    case "!story veins":
      activeStory = stories.DarkVeins;
      msg.channel.send("Dark Veins");
      break;
    case "!stories":
      msg.channel.send("beast, river, veins");
    default:
      break;
  }
});

client.login(process.env("DISCORD_BOT_VARIABLE"));
