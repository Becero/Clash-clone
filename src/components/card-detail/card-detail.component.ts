import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../models/card.model';
import { CardComponent } from '../card/card.component';

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

  onClose(): void {
    this.close.emit();
  }

  onUseCard(): void {
    this.useCard.emit(this.card());
  }
}
