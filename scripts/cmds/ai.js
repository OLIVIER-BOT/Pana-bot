const axios = require('axios');

const fonts = {
  mathsans: {
    a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂",
    j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆", n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋",
    s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
    A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨",
    J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬", N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱",
    S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹",
  }
};

const Prefixes = [
  'bot',
  'Ai',
  'ai',
];

module.exports = {
  config: {
    name: "bot",
    version: "1",
    author: "isagi",
    longDescription: "Command with no prefix\n💬 - LLaMA, a large language model developed by Meta AI that can understand and respond to human input in a conversational manner. I'm a type of artificial intelligence designed to generate human-like text responses.",
    category: "bot",
    guide: {
      en: "{p} questions",
    },
  },
  onStart: async function () {
    // Initialization logic here if needed
  },
  onChat: async function ({ api, event, args, message }) {
    try {
      // Check if the message starts with a valid prefix
      const prefix = Prefixes.find((p) => event.body && event.body.trim().toLowerCase().startsWith(p.toLowerCase()));
      if (!prefix) {
        return; // Ignore the command if prefix is not recognized
      }

      // Extract the question from the message
      const prompt = event.body.substring(prefix.length).trim();
      const senderID = event.senderID;
      const senderInfo = await api.getUserInfo(senderID); // Use senderID directly
      const senderName = senderInfo[senderID].name;
      const genderText = senderInfo[senderID]?.gender === 1 ? "♀" : senderInfo[senderID]?.gender === 2 ? "♂" : "🏳‍🌈 LGBT";

      if (!prompt) {
        await message.reply(`ʚıɞ bot ʚıɞ   :\n\nsalut ${senderName} ⁉ 🙃`);
        api.setMessageReaction("⁉", event.messageID, () => {}, true);
        return;
      }

      // Make a GET request to the AI API
      const response = await axios.get(`https://c-v1.onrender.com/chat/coral?prompt=${encodeURIComponent(prompt)}`);
      const answer = response.data.response;

      // Apply the font transformation
      let formattedAnswer = "";
      for (let letter of answer) {
        formattedAnswer += letter in fonts.mathsans ? fonts.mathsans[letter] : letter;
      }

      await message.reply(`ʚıɞ bot ʚıɞ :\n\n${formattedAnswer}\n\n[${genderText}] ${senderName}`);
      api.setMessageReaction("💬", event.messageID, () => {}, true);

    } catch (error) {
      console.error("Error:", error.message);
      await message.reply("Sorry, I couldn't process your question at the moment.");
    }
  }
};
