import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

interface ClassicChallengeReward {
  pointsRequired: number;
  reward: {
    name: string;
    imageUrl: string;
  };
}

@Component({
  selector: 'app-classic-challenge',
  templateUrl: './classic-challenge.component.html',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassicChallengeComponent {
  points = input.required<number>();
  close = output<void>();

  readonly MAX_POINTS = 5000;

  readonly rewards: ClassicChallengeReward[] = [
    {
      pointsRequired: 500,
      reward: {
        name: '500 Ouro',
        imageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/icons/gold_pile.png',
      },
    },
    {
      pointsRequired: 1000,
      reward: {
        name: 'Baú de Prata',
        imageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/chests/chest_silver.png',
      },
    },
    {
      pointsRequired: 1750,
      reward: {
        name: '1000 Ouro',
        imageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/icons/gold_pile.png',
      },
    },
    {
      pointsRequired: 2500,
      reward: {
        name: 'Baú de Ouro',
        imageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/chests/chest_gold.png',
      },
    },
    {
      pointsRequired: 3500,
      reward: {
        name: 'Baú Mágico',
        imageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/chests/chest_magic.png',
      },
    },
    {
      pointsRequired: 5000,
      reward: {
        name: 'Baú Lendário',
        imageUrl: 'https://cdn.jsdelivr.net/gh/rodolfo-s/rpg-deck-builder-assets@main/chests/chest_legendary.png',
      },
    },
  ];

  progressPercent = computed(() => (this.points() / this.MAX_POINTS) * 100);

  onClose(): void {
    this.close.emit();
  }
}
