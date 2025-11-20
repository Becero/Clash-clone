import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../models/card.model';
import { CardComponent } from '../card/card.component';

type DetailTab = 'description' | 'stats' | 'art';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CardComponent],
})
export class CardDetailComponent {
  card = input.required<Card>();

  close = output<void>();
  useCard = output<Card>();

  activeTab = signal<DetailTab>('description');

  statsAsArray = computed(() => {
    const card = this.card();
    const stats = card.displayStats ?? {};

    const allStats: Record<string, string | number> = {
      'Raridade': card.rarity ?? '—',
      'Tipo': card.type ?? '—',
      ...stats
    };

    return Object.entries(allStats).map(([key, value]) => ({ key, value }));
  });

  selectTab(tab: DetailTab): void {
    this.activeTab.set(tab);
  }

  onClose(): void {
    this.close.emit();
  }

  onUseCard(): void {
    this.useCard.emit(this.card());
  }
}
