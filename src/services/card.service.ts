import { Injectable } from '@angular/core';
import { Card } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private cards: Card[] = [
    {
      id: 'goblin_spear',
      name: 'Goblin Lanceiro',
      type: 'Tropa',
      rarity: 'Comum',
      elixirCost: 2,
      imageUrl: 'https://picsum.photos/seed/goblin/300/400',
      description: 'Um pequeno goblin verde com uma lança afiada. Rápido e irritante.',
      hp: 110,
      damage: 50,
      attackSpeed: 1.2,
      speed: 4,
      range: 150
    },
     {
      id: 'skeletons',
      name: 'Exército de Esqueletos',
      type: 'Tropa',
      rarity: 'Comum',
      elixirCost: 1,
      imageUrl: 'https://picsum.photos/seed/skeletons/300/400',
      description: 'Um trio de esqueletos frágeis. Distração barata e eficaz.',
      hp: 67,
      damage: 67,
      attackSpeed: 1,
      speed: 4
    },
    {
      id: 'zombie_horde',
      name: 'Horda de Zumbis',
      type: 'Tropa',
      rarity: 'Comum',
      elixirCost: 4,
      imageUrl: 'https://picsum.photos/seed/zombies/300/400',
      description: 'Um grupo de zumbis lentos mas resistentes que avançam sem medo.',
      hp: 200,
      damage: 80,
      attackSpeed: 1.5,
      speed: 1.5
    },
     {
      id: 'arrows',
      name: 'Flechas',
      type: 'Feitiço',
      rarity: 'Comum',
      elixirCost: 3,
      imageUrl: 'https://picsum.photos/seed/arrows/300/400',
      description: 'Uma chuva de flechas que cobre uma grande área, excelente contra hordas.'
    },
    {
      id: 'fireball',
      name: 'Bola de Fogo',
      type: 'Feitiço',
      rarity: 'Raro',
      elixirCost: 4,
      imageUrl: 'https://picsum.photos/seed/fireball/300/400',
      description: 'Uma bola de fogo que causa dano em área. Ótima para limpar o campo.'
    },
    {
      id: 'mage_apprentice',
      name: 'Mago Aprendiz',
      type: 'Tropa',
      rarity: 'Raro',
      elixirCost: 4,
      imageUrl: 'https://picsum.photos/seed/mage/300/400',
      description: 'Dispara projéteis mágicos à distância, causando dano em área.',
      hp: 590,
      damage: 220,
      attackSpeed: 1.7,
      speed: 2,
      range: 160
    },
     {
      id: 'tesla_tower',
      name: 'Torre Tesla',
      type: 'Construção',
      rarity: 'Raro',
      elixirCost: 4,
      imageUrl: 'https://picsum.photos/seed/tesla/300/400',
      description: 'Uma torre defensiva que ataca alvos aéreos e terrestres com eletricidade.'
    },
    {
      id: 'rogue_shadow',
      name: 'Ladino das Sombras',
      type: 'Tropa',
      rarity: 'Épico',
      elixirCost: 3,
      imageUrl: 'https://picsum.photos/seed/rogue/300/400',
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
      rarity: 'Épico',
      elixirCost: 5,
      imageUrl: 'https://picsum.photos/seed/witch/300/400',
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
      rarity: 'Épico',
      elixirCost: 5,
      imageUrl: 'https://picsum.photos/seed/giant/300/400',
      description: 'Lento, mas muito resistente. Foca em atacar construções.',
      hp: 3300,
      damage: 211,
      attackSpeed: 1.5,
      speed: 1.5
    },
    {
      id: 'vampire_lord',
      name: 'Lorde Vampiro',
      type: 'Tropa',
      rarity: 'Lendário',
      elixirCost: 6,
      imageUrl: 'https://picsum.photos/seed/vampire/300/400',
      description: 'Rouba a vida de seus inimigos a cada ataque, tornando-se mais forte.',
      hp: 1400,
      damage: 180,
      attackSpeed: 1.8,
      speed: 2.5
    },
    {
      id: 'dragon_whelp',
      name: 'Filhote de Dragão',
      type: 'Tropa',
      rarity: 'Lendário',
      elixirCost: 4,
      imageUrl: 'https://picsum.photos/seed/dragon/300/400',
      description: 'Uma tropa voadora que cospe fogo, causando dano em área contínuo.',
      hp: 1000,
      damage: 160,
      attackSpeed: 1.6,
      speed: 3,
      range: 120
    },
    {
        id: 'stone_golem',
        name: 'Golem de Pedra',
        type: 'Tropa',
        rarity: 'Épico',
        elixirCost: 8,
        imageUrl: 'https://picsum.photos/seed/golem/300/400',
        description: 'Um gigante de pedra lento e poderoso. Ao ser destruído, se divide em dois Golemitas.',
        hp: 4200,
        damage: 250,
        attackSpeed: 2.5,
        speed: 1
    },
    {
        id: 'archer_queen',
        name: 'Rainha Arqueira',
        type: 'Tropa',
        rarity: 'Lendário',
        elixirCost: 5,
        imageUrl: 'https://picsum.photos/seed/archer/300/400',
        description: 'Uma arqueira de elite com alcance incrível e dano altíssimo.',
        hp: 1250,
        damage: 300,
        attackSpeed: 1.2,
        speed: 3,
        range: 200
    },
    {
        id: 'ice_spirit',
        name: 'Espírito de Gelo',
        type: 'Tropa',
        rarity: 'Comum',
        elixirCost: 1,
        imageUrl: 'https://picsum.photos/seed/ice/300/400',
        description: 'Salta sobre os inimigos, congelando-os por um curto período.',
        hp: 90,
        damage: 25,
        attackSpeed: 1,
        speed: 5
    },
    {
        id: 'poison_cloud',
        name: 'Nuvem de Veneno',
        type: 'Feitiço',
        rarity: 'Raro',
        elixirCost: 4,
        imageUrl: 'https://picsum.photos/seed/poison/300/400',
        description: 'Cria uma área tóxica que causa dano contínuo a tropas e construções.'
    }
  ];

  getCards(): Card[] {
    // Return a shuffled list of cards
    return [...this.cards].sort(() => Math.random() - 0.5);
  }
}