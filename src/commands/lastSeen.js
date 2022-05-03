import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
  .setName("last")
  .setDescription("yea");

export default function execute(interaction) {
  console.log(interaction);
}
