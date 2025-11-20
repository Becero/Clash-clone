import { Injectable } from '@angular/core';
import { Guild, GuildMember, ChatMessage } from '../models/guild.model';

@Injectable({
  providedIn: 'root'
})
export class GuildService {
  private readonly guilds: Guild[] = [
    { id: 'dragonscale', name: 'Escamas do Dragão', memberCount: 50, trophiesRequired: 1000, totalTrophies: 45800, badgeUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/guilds/badge_01.png' },
    { id: 'ironclad', name: 'Legião de Ferro', memberCount: 48, trophiesRequired: 800, totalTrophies: 39200, badgeUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/guilds/badge_02.png' },
    { id: 'shadowblades', name: 'Lâminas Sombrias', memberCount: 35, trophiesRequired: 1200, totalTrophies: 31500, badgeUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/guilds/badge_03.png' },
    { id: 'mystic', name: 'Arcanos Místicos', memberCount: 50, trophiesRequired: 2000, totalTrophies: 55100, badgeUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/guilds/badge_04.png' },
  ];

  private readonly members: GuildMember[] = this.generateMembers();
  private readonly chatHistory: ChatMessage[] = this.generateChatHistory();

  getGuildById(id: string): Guild | undefined {
    return this.guilds.find(g => g.id === id);
  }

  getGuildMembers(id: string): GuildMember[] {
    // Retorna a mesma lista de membros para qualquer guilda, para fins de demonstração
    return this.members;
  }
  
  getChatHistory(id: string): ChatMessage[] {
    // Retorna o mesmo histórico para qualquer guilda
    return this.chatHistory;
  }

  searchGuilds(term: string): Guild[] {
    if (!term.trim()) {
      return this.guilds;
    }
    return this.guilds.filter(g => g.name.toLowerCase().includes(term.toLowerCase()));
  }

  private generateMembers(): GuildMember[] {
    const members: GuildMember[] = [];
    for (let i = 1; i <= 50; i++) {
      let role: 'Mestre' | 'Lord' | 'Aventureiro' = 'Aventureiro';
      if (i === 1) role = 'Mestre';
      if (i > 1 && i <= 5) role = 'Lord';
      
      members.push({
        id: `member-${i}`,
        name: i === 2 ? 'Herói' : `Membro ${i}`,
        trophies: 3000 - i * 40 + Math.floor(Math.random() * 100),
        role: role
      });
    }
    return members;
  }

  private generateChatHistory(): ChatMessage[] {
      return [
        { id: 1, authorId: 'member-3', authorName: 'Membro 3', authorRole: 'Lord', timestamp: '10:45', type: 'text', message: 'Bom dia pessoal! Alguém para uma batalha amigável?' },
        { id: 2, authorId: 'member-10', authorName: 'Membro 10', authorRole: 'Aventureiro', timestamp: '10:50', type: 'cardRequest', request: { cardName: 'Bola de Fogo', cardImageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/fireball.png', donations: 3, maxDonations: 8 } },
        { id: 3, authorId: 'member-5', authorName: 'Membro 5', authorRole: 'Lord', timestamp: '11:02', type: 'text', message: 'Doado! Boa sorte.' },
        { id: 4, authorId: 'member-25', authorName: 'Membro 25', authorRole: 'Aventureiro', timestamp: '11:15', type: 'text', message: 'Estou preso nos 1500 troféus, alguma dica de deck?' },
        { id: 5, authorId: 'member-1', authorName: 'Membro 1', authorRole: 'Mestre', timestamp: '11:20', type: 'text', message: 'Tente usar o Golem de Pedra com a Bruxa, é uma combinação forte.' },
      ];
  }
}
