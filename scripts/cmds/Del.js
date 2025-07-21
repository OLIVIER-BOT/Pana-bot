 module.exports = {
  config: {
    name: "del",
    version: "1.1",
    author: "Luka Ryota Kissé",
    countDown: 0,
    role: 2, // Admin bot seulement
    shortDescription: {
      en: "Disable a command temporarily",
      fr: "Désactive une commande temporairement"
    },
    longDescription: {
      en: "Temporarily removes a command from the bot's memory (not from disk)",
      fr: "Supprime temporairement une commande de la mémoire du bot (sans supprimer le fichier)"
    },
    category: "admin",
    guide: {
      en: "{pn} <commandName>",
      fr: "{pn} <nomCommande>"
    }
  },

  onStart: async function ({ message, args }) {
    const commands = global.GoatBot.commands;
    const aliases = global.GoatBot.aliases;

    const commandToRemove = args[0]?.toLowerCase();

    if (!commandToRemove)
      return message.reply("❌ Tu dois spécifier le nom de la commande à désactiver.");

    const protectedCommands = ["help", "del"];
    if (protectedCommands.includes(commandToRemove))
      return message.reply(`❌ La commande "${commandToRemove}" est protégée.`);

    const command = commands.get(commandToRemove);
    if (!command)
      return message.reply(`❌ La commande "${commandToRemove}" n'existe pas.`);

    // Supprimer la commande de la mémoire
    commands.delete(commandToRemove);

    // Supprimer les alias associés
    if (command.config.aliases) {
      for (const alias of command.config.aliases) {
        aliases.delete(alias);
      }
    }

    message.reply(`✅ La commande "${commandToRemove}" a été désactivée jusqu'au prochain redémarrage du bot.`);
  }
};
