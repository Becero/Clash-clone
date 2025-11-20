import { Injectable, computed, signal } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Estado principal do jogador
  readonly user = signal<User>({
    name: 'Herói',
    level: 8,
    xp: 1234,
    xpForNextLevel: 2000,
    gold: 7890,
    trophies: 1250,
    classicPoints: 1230, // Pontos de exemplo para o desafio
    guildId: 'dragonscale', // Exemplo: Usuário pertence a esta guilda
    guildRole: 'Mestre' // Exemplo: Usuário é o Mestre da guilda
  });

  // Progresso de XP (0–1)
  readonly xpProgress = computed(() => {
    const u = this.user();
    if (!u.xpForNextLevel || u.xpForNextLevel <= 0) return 0;
    return Math.min(1, u.xp / u.xpForNextLevel);
  });

  // Progresso de XP em %
  readonly xpProgressPercent = computed(() => {
    return Math.round(this.xpProgress() * 100);
  });

  constructor() {}

  addXp(amount: number): void {
    if (amount <= 0) return;

    this.user.update(u => {
      let xp = u.xp + amount;
      let level = u.level;

      // Lógica bem simples de level up — dá pra trocar por algo mais elaborado depois
      while (xp >= u.xpForNextLevel) {
        xp -= u.xpForNextLevel;
        level++;
      }

      return {
        ...u,
        level,
        xp
      };
    });
  }

  addGold(amount: number): void {
    if (amount === 0) return;
    this.user.update(u => ({
      ...u,
      gold: Math.max(0, u.gold + amount)
    }));
  }

  addTrophies(amount: number): void {
    if (amount === 0) return;
    this.user.update(u => ({
      ...u,
      trophies: Math.max(0, u.trophies + amount)
    }));
  }
}
