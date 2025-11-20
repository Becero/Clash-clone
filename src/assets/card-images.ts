export const CardImages = {
  skeletons: {
    card: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/skeletons.png',
    troop: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/troops/skeletons.png'
  },

  goblin_spear: {
    card: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/goblin_spear.png',
    troop: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/troops/goblin_spear.png'
  },

  arrows: {
    card: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/arrows.png'
  },

  zombie_horde: {
    card: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/zombie_horde.png',
    troop: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/troops/zombie.png'
  },

  fireball: {
    card: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/fireball.png'
  },

  mage_apprentice: {
    card: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/mage.png',
    troop: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/troops/mage.png'
  },

  poison_cloud: {
    card: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/poison.png'
  },

  rogue_shadow: {
    card: new URL('../assets/images/rogue_shadow_realistic.jpeg', import.meta.url).href,
    troop: new URL('../assets/images/rogue_shadow_realistic.jpeg', import.meta.url).href
  },

  witch_night: {
    card: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/witch.png',
    troop: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/troops/witch.png'
  },

  giant: {
    card: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/giant.png',
    troop: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/troops/giant.png'
  },

  stone_golem: {
    card: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/cards/golem.png',
    troop: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/troops/golem.png'
  }
} as const;
