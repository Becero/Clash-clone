import { Injectable } from '@angular/core';
import { Card } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  private readonly cards: ReadonlyArray<Card> = [

    /* =====================================================
     *                      COMUM
     * ===================================================== */
    {
      id: 'skeletons',
      name: 'Esqueletos',
      type: 'Tropa',
      rarity: 'Comum',
      elixirCost: 1,
      imageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/skeletons.png',
      troopImageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/troops/skeletons.png',
      description: 'Um trio de esqueletos frágeis. Ótimos para cercar tropas inimigas e causar dano rápido.',
      hp: 81,
      damage: 81,
      attackSpeed: 1,
      speed: 4,
      range: 30,
      targets: 'Terrestre',
      count: 3,
      displayStats: {
        'Pontos de Vida': 81,
        'Dano': 81,
        'Alvos': 'Terrestre',
        'Alcance': 'Corpo a Corpo',
        'Velocidade de Ataque': '1.0s',
        'Velocidade': 'Rápido',
        'Contagem': 'x3'
      }
    },

    {
      id: 'goblin_spear',
      name: 'Goblin Lanceiro',
      type: 'Tropa',
      rarity: 'Comum',
      elixirCost: 2,
      imageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/goblin_spear.png',
      troopImageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/troops/goblin_spear.png',
      description: 'Um pequeno goblin verde com uma lança afiada.',
      hp: 133,
      damage: 61,
      attackSpeed: 1.2,
      speed: 5,
      range: 150,
      targets: 'Aéreo e Terrestre',
      displayStats: {
        'Pontos de Vida': 133,
        'Dano': 61,
        'Alvos': 'Aéreo e Terrestre',
        'Alcance': 'Médio (5)',
        'Velocidade de Ataque': '1.2s',
        'Velocidade': 'Muito Rápido'
      }
    },

    {
      id: 'arrows',
      name: 'Flechas',
      type: 'Feitiço',
      rarity: 'Comum',
      elixirCost: 3,
      imageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/arrows.png',
      description: 'Uma chuva de flechas que cobre uma grande área.',
      damage: 292,
      radius: 120,
      displayStats: {
        'Dano em Área': 292,
        'Raio': 'Grande (4.0)'
      }
    },

    {
      id: 'zombie_horde',
      name: 'Horda de Zumbis',
      type: 'Tropa',
      rarity: 'Comum',
      elixirCost: 4,
      imageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/zombie_horde.png',
      troopImageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/troops/zombie.png',
      description: 'Um grupo de zumbis lentos mas resistentes.',
      hp: 242,
      damage: 97,
      attackSpeed: 1.5,
      speed: 1.5,
      range: 30,
      targets: 'Terrestre',
      count: 4,
      displayStats: {
        'Pontos de Vida': 242,
        'Dano': 97,
        'Alvos': 'Terrestre',
        'Alcance': 'Corpo a Corpo',
        'Velocidade de Ataque': '1.5s',
        'Velocidade': 'Lento',
        'Contagem': 'x4'
      }
    },

    /* =====================================================
     *                      HEROICO
     * ===================================================== */
    {
      id: 'fireball',
      name: 'Bola de Fogo',
      type: 'Feitiço',
      rarity: 'Heroico',
      elixirCost: 4,
      imageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/fireball.png',
      description: 'Uma bola de fogo que causa dano em área.',
      damage: 692,
      radius: 80,
      displayStats: {
        'Dano em Área': 692,
        'Raio': 'Médio (2.5)'
      }
    },

    {
      id: 'mage_apprentice',
      name: 'Mago Aprendiz',
      type: 'Tropa',
      rarity: 'Heroico',
      elixirCost: 4,
      imageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/mage.png',
      troopImageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/troops/mage.png',
      description: 'Dispara projéteis mágicos com dano em área.',
      hp: 712,
      damage: 266,
      attackSpeed: 1.7,
      speed: 2,
      range: 165,
      targets: 'Aéreo e Terrestre',
      displayStats: {
        'Pontos de Vida': 712,
        'Dano em Área': 266,
        'Alvos': 'Aéreo e Terrestre',
        'Alcance': 'Longo (5.5)',
        'Velocidade de Ataque': '1.7s',
        'Velocidade': 'Médio'
      }
    },

    {
      id: 'poison_cloud',
      name: 'Nuvem de Veneno',
      type: 'Feitiço',
      rarity: 'Heroico',
      elixirCost: 4,
      imageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/poison.png',
      description: 'Cria uma área tóxica que causa dano contínuo.',
      damage: 72,
      radius: 105,
      displayStats: {
        'Dano por Segundo': 72,
        'Duração': '8s',
        'Raio': 'Grande (3.5)'
      }
    },

    /* =====================================================
     *                      DIVINO
     * ===================================================== */
    {
      id: 'rogue_shadow',
      name: 'Ladino das Sombras',
      type: 'Tropa',
      rarity: 'Divino',
      elixirCost: 3,
      imageUrl: 'https://i.imgur.com/8sC8g5a.jpeg',
      troopImageUrl: 'https://i.imgur.com/8sC8g5a.jpeg',
      description: 'Rápido e letal, ataca com dano massivo.',
      hp: 907,
      damage: 242,
      attackSpeed: 1.1,
      speed: 5,
      range: 30,
      targets: 'Terrestre',
      displayStats: {
        'Pontos de Vida': 907,
        'Dano': 242,
        'Alvos': 'Terrestre',
        'Alcance': 'Corpo a Corpo',
        'Velocidade de Ataque': '1.1s',
        'Velocidade': 'Muito Rápido'
      }
    },

    {
      id: 'witch_night',
      name: 'Bruxa da Noite',
      type: 'Tropa',
      rarity: 'Divino',
      elixirCost: 5,
      imageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/witch.png',
      troopImageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/troops/witch.png',
      description: 'Invoca esqueletos continuamente.',
      hp: 871,
      damage: 314,
      attackSpeed: 1.5,
      speed: 2.5,
      range: 30,
      targets: 'Terrestre',
      displayStats: {
        'Pontos de Vida': 871,
        'Dano': 314,
        'Alvos': 'Terrestre',
        'Alcance': 'Corpo a Corpo',
        'Velocidade de Ataque': '1.5s',
        'Velocidade': 'Médio'
      }
    },

    {
      id: 'giant',
      name: 'Gigante',
      type: 'Tropa',
      rarity: 'Divino',
      elixirCost: 5,
      imageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/giant.png',
      troopImageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/troops/giant.png',
      description: 'Ignora tropas e vai direto para construções.',
      hp: 3993,
      damage: 254,
      attackSpeed: 1.5,
      speed: 1.5,
      range: 40,
      targets: 'Construções',
      displayStats: {
        'Pontos de Vida': 3993,
        'Dano': 254,
        'Alvos': 'Construções',
        'Alcance': 'Corpo a Corpo',
        'Velocidade de Ataque': '1.5s',
        'Velocidade': 'Lento'
      }
    },

    {
      id: 'stone_golem',
      name: 'Golem de Pedra',
      type: 'Tropa',
      rarity: 'Divino',
      elixirCost: 8,
      imageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/golem.png',
      troopImageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/troops/golem.png',
      description: 'A tropa mais resistente do jogo.',
      hp: 5088,
      damage: 302,
      attackSpeed: 2.5,
      speed: 1,
      range: 40,
      targets: 'Construções',
      displayStats: {
        'Pontos de Vida': 5088,
        'Dano': 302,
        'Alvos': 'Construções',
        'Alcance': 'Corpo a Corpo',
        'Velocidade de Ataque': '2.5s',
        'Velocidade': 'Lento'
      }
    }
  ];

  getCards(): Card[] {
    return this.shuffle([...this.cards]);
  }

  getAllCards(): ReadonlyArray<Card> {
    return this.cards;
  }

  getTroopCards(): Card[] {
    return this.cards.filter(c => c.type === 'Tropa');
  }

  getSpellCards(): Card[] {
    return this.cards.filter(c => c.type === 'Feitiço');
  }

  getByRarity(rarity: string): Card[] {
    return this.cards.filter(c => c.rarity === rarity);
  }

  getById(id: string): Card | undefined {
    return this.cards.find(c => c.id === id);
  }

  getRandomDeck(size: number): Card[] {
    return this.shuffle([...this.cards]).slice(0, size);
  }

  private shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
