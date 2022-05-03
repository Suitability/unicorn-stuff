import Signale_pkg from "signale";
const { Signale } = Signale_pkg;

import fs from "fs";

import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

const logger = createLogger();

export function createLogger() {
  // Logger Config: https://github.com/klaussinani/signale#install
  const options = {};

  const signale = new Signale(options);
  return signale;
}

export async function getCommandFiles() {
  // Synchronously get a List of all files in the Directory
  const files = fs.readdirSync("./src/commands");

  // Filter only the files which end in .JS
  const filteredFiles = files.filter((file) => file.endsWith(".js"));

  return filteredFiles;
}

export async function getCommands(commandFiles) {
  const commands = [];

  // Loop Over Every File and import it
  for (const file of commandFiles) {
    const command = await import(`./commands/${file}`);
    commands.push(command.data.toJSON());
  }

  return commands;
}

export async function registerCommands(commands) {
  const { DISCORD_CLIENT_ID, DISCORD_GUILD_ID, DISCORD_API_TOKEN } =
    process.env;
  const rest = new REST({ version: "9" }).setToken(DISCORD_API_TOKEN);
  console.log(commands);
  try {
    logger.debug("Started Refreshing Application (/) Commands.");

    await rest.put(
      Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID),
      {
        body: commands,
      }
    );

    logger.success("Reloaded Application (/) Commands.");
  } catch (error) {
    throw error;
  }
}
