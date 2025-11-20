import { GuildMemberRole } from "./guild.model";

export interface User {
  name: string;
  level: number;
  xp: number;
  xpForNextLevel: number;
  gold: number;
  trophies: number;
  classicPoints?: number; // Pontos do Desafio Clássico
  guildId?: string;       // ID da Guilda do jogador
  guildRole?: GuildMemberRole; // Cargo do jogador na Guilda
}
