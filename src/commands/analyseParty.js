import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
  .setName("analyse")
  .setDescription("yea");

export async function execute(interaction) {
  console.log(interaction);
}
