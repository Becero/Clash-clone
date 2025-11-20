import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Card } from '../../models/card.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class CardComponent {
  card = input.required<Card>();
  isInDeck = input<boolean>(false);

  rarityClass = computed(() => {
    switch (this.card().rarity) {
      case 'Comum':
        return 'bg-gradient-to-br from-slate-500 to-slate-700';
      case 'Heroico':
        return 'bg-gradient-to-br from-orange-400 to-orange-600';
      case 'Divino':
        return 'bg-gradient-to-br from-purple-500 to-purple-800';
      default:
        return 'bg-gray-400';
    }
  });
}
