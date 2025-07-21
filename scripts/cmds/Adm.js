module.exports = {
  config: {
    name: "adm",
    version: "2.0",
    author: "Votre Nom",
    countDown: 5,
    role: 2, // Seulement pour admin
    shortDescription: {
      en: "Gestion des restrictions de commandes",
      fr: "Gestion des restrictions de commandes"
    },
    longDescription: {
      en: "Permet de restreindre des commandes à l'admin seulement",
      fr: "Permet de restreindre des commandes à l'administrateur seulement"
    },
    category: "admin",
    guide: {
      en: "{pn} <lock/unlock/list> <commandName>",
      fr: "{pn} <lock/unlock/list> <nomCommande>"
    }
  },

  onStart: async function ({ message, args, event, usersData }) {
    const [action, commandName] = args;
    const adminUID = global.GoatBot.config.adminBot; // UID de l'admin principal
    const senderID = event.senderID;

    // Vérifier si l'utilisateur est admin
    if (senderID !== adminUID) {
      return message.reply("❌ Vous n'avez pas la permission d'utiliser cette commande.");
    }

    if (!action) {
      return message.reply(getHelpMessage(this.config));
    }

    switch (action.toLowerCase()) {
      case 'lock':
        await lockCommand(commandName, message);
        break;
        
      case 'unlock':
        await unlockCommand(commandName, message);
        break;
        
      case 'list':
        await listRestrictedCommands(message);
        break;
        
      default:
        message.reply("❌ Action non valide. Utilisez 'lock', 'unlock' ou 'list'");
    }
  }
};

// Stockage des commandes restreintes (pourrait être sauvegardé dans une DB)
const restrictedCommands = new Set();

async function lockCommand(commandName, message) {
  if (!commandName) {
    return message.reply("❌ Spécifiez une commande à verrouiller");
  }

  const command = global.GoatBot.commands.get(commandName.toLowerCase());
  if (!command) {
    return message.reply(`❌ La commande "${commandName}" n'existe pas`);
  }

  // Vérifier si la commande est déjà restreinte
  if (restrictedCommands.has(commandName.toLowerCase())) {
    return message.reply(`⚠️ La commande "${commandName}" est déjà verrouillée`);
  }

  // Ajouter aux commandes restreintes
  restrictedCommands.add(commandName.toLowerCase());
  message.reply(`✅ La commande "${commandName}" est maintenant réservée à l'admin`);
}

async function unlockCommand(commandName, message) {
  if (!commandName) {
    return message.reply("❌ Spécifiez une commande à déverrouiller");
  }

  // Vérifier si la commande est restreinte
  if (!restrictedCommands.has(commandName.toLowerCase())) {
    return message.reply(`⚠️ La commande "${commandName}" n'est pas verrouillée`);
  }

  // Retirer des commandes restreintes
  restrictedCommands.delete(commandName.toLowerCase());
  message.reply(`✅ La commande "${commandName}" est maintenant accessible à tous`);
}

async function listRestrictedCommands(message) {
  if (restrictedCommands.size === 0) {
    return message.reply("ℹ️ Aucune commande n'est actuellement restreinte");
  }

  const list = Array.from(restrictedCommands).map(cmd => `• ${cmd}`).join('\n');
  message.reply(`🔒 Commandes restreintes:\n${list}`);
}

function getHelpMessage(config) {
  return `🔐 Gestion des restrictions de commandes:

Usage: ${config.name} <action> [commande]

Actions:
• lock [commande] - Réserve une commande à l'admin
• unlock [commande] - Rend une commande accessible à tous
• list - Liste des commandes restreintes

Exemples:
• ${config.name} lock echo
• ${config.name} unlock ping
• ${config.name} list`;
}

// Middleware pour vérifier les restrictions (à ajouter dans votre système de commandes)
/*
global.GoatBot.onCommandStart = function({ commandName, event, message }) {
  if (restrictedCommands.has(commandName) && event.senderID !== global.GoatBot.config.adminBot) {
    message.reply("❌ Cette commande est réservée à l'administrateur");
    return false; // Bloque l'exécution
  }
  return true; // Autorise l'exécution
};
*/
