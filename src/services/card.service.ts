import { Injectable } from '@angular/core';
import { Card } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private cards: Card[] = [
    // --- Comum ---
    {
      id: 'skeletons',
      name: 'Esqueletos',
      type: 'Tropa',
      rarity: 'Comum',
      elixirCost: 1,
      imageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/skeletons.png',
      troopImageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/troops/skeletons.png',
      description: 'Um trio de esqueletos frágeis. Distração barata e eficaz.',
      hp: 67,
      damage: 67,
      attackSpeed: 1,
      speed: 4,
      count: 3
    },
    {
      id: 'goblin_spear',
      name: 'Goblin Lanceiro',
      type: 'Tropa',
      rarity: 'Comum',
      elixirCost: 2,
      imageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/goblin_spear.png',
      troopImageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/troops/goblin_spear.png',
      description: 'Um pequeno goblin verde com uma lança afiada. Rápido e irritante.',
      hp: 110,
      damage: 50,
      attackSpeed: 1.2,
      speed: 4,
      range: 150
    },
    {
      id: 'arrows',
      name: 'Flechas',
      type: 'Feitiço',
      rarity: 'Comum',
      elixirCost: 3,
      imageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/arrows.png',
      description: 'Uma chuva de flechas que cobre uma grande área, excelente contra hordas.',
      damage: 120,
      radius: 120
    },
     {
      id: 'zombie_horde',
      name: 'Horda de Zumbis',
      type: 'Tropa',
      rarity: 'Comum',
      elixirCost: 4,
      imageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/zombie_horde.png',
      troopImageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/troops/zombie.png',
      description: 'Um grupo de zumbis lentos mas resistentes que avançam sem medo.',
      hp: 200,
      damage: 80,
      attackSpeed: 1.5,
      speed: 1.5,
      count: 4
    },

    // --- Heroico ---
    {
      id: 'fireball',
      name: 'Bola de Fogo',
      type: 'Feitiço',
      rarity: 'Heroico',
      elixirCost: 4,
      imageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/fireball.png',
      description: 'Uma bola de fogo que causa dano em área. Ótima para limpar o campo.',
      damage: 325,
      radius: 80
    },
    {
      id: 'mage_apprentice',
      name: 'Mago Aprendiz',
      type: 'Tropa',
      rarity: 'Heroico',
      elixirCost: 4,
      imageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/mage.png',
      troopImageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/troops/mage.png',
      description: 'Dispara projéteis mágicos à distância, causando dano em área.',
      hp: 590,
      damage: 220,
      attackSpeed: 1.7,
      speed: 2,
      range: 160
    },
     {
      id: 'poison_cloud',
      name: 'Nuvem de Veneno',
      type: 'Feitiço',
      rarity: 'Heroico',
      elixirCost: 4,
      imageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/poison.png',
      description: 'Cria uma área tóxica que causa dano contínuo a tropas e construções.',
      damage: 60, // Per tick
      radius: 100
    },

    // --- Divino ---
    {
      id: 'rogue_shadow',
      name: 'Ladino das Sombras',
      type: 'Tropa',
      rarity: 'Divino',
      elixirCost: 3,
      imageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/rogue.png',
      troopImageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/troops/rogue.png',
      description: 'Fica invisível até atacar. Rápido e letal, ataca alvos únicos.',
       hp: 750,
       damage: 200,
       attackSpeed: 1.1,
       speed: 5
    },
    {
      id: 'witch_night',
      name: 'Bruxa da Noite',
      type: 'Tropa',
      rarity: 'Divino',
      elixirCost: 5,
      imageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/witch.png',
      troopImageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/troops/witch.png',
      description: 'Invoca esqueletos continuamente e ataca com seu cajado sombrio.',
      hp: 720,
      damage: 260,
      attackSpeed: 1.5,
      speed: 2.5
    },
     {
      id: 'giant',
      name: 'Gigante',
      type: 'Tropa',
      rarity: 'Divino',
      elixirCost: 5,
      imageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/giant.png',
      troopImageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/troops/giant.png',
      description: 'Lento, mas muito resistente. Foca em atacar construções.',
      hp: 3300,
      damage: 211,
      attackSpeed: 1.5,
      speed: 1.5
    },
    {
        id: 'stone_golem',
        name: 'Golem de Pedra',
        type: 'Tropa',
        rarity: 'Divino',
        elixirCost: 8,
        imageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/golem.png',
        troopImageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/troops/golem.png',
        description: 'Um gigante de pedra lento e poderoso. Ao ser destruído, se divide em dois Golemitas.',
        hp: 4200,
        damage: 250,
        attackSpeed: 2.5,
        speed: 1
    },
  ];

  getCards(): Card[] {
    // Return a shuffled list of cards
    return [...this.cards].sort(() => Math.random() - 0.5);
  }
}