// Load Enviorment Variables
import "dotenv/config";

import { Client, Intents } from "discord.js";

import {
  createLogger,
  getCommandFiles,
  getCommands,
  registerCommands,
} from "./utils.js";

const logger = createLogger();

async function main() {
  logger.info("Starting Setup Process");
  // Load Command Files
  logger.debug("Loading Commands");
  const commandFiles = await getCommandFiles();
  const commands = await getCommands(commandFiles);
  logger.success("Commands Loaded");

  await registerCommands(commands).catch((error) =>
    logger.error("Error Registering Commands: ", error)
  );

  console.log(commands);

  const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

  client.once("ready", () => {
    logger.info("Bot is Ready!");
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    console.log(interaction);

    const { commandName } = interaction;

    const command = await import(`./commands/${commandName.toLowerCase()}`);
    if (!command) return;
    await command.execute();

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }

    // if (interaction.commandName === "yeet") {
    //   await interaction.reply("Pong!");
    // }
  });

  // Login to Discord with your client's token
  await client
    .login(process.env.DISCORD_API_TOKEN)
    .catch((error) => logger.error("Error Logging In (Discord): ", error));

  logger.success("Login Sucessful (Discord)");
}

main().catch((error) => logger.error(`Error in Main Function: ${error}`));
