import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CardComponent } from './components/card/card.component';
import { CardService } from './services/card.service';
import { Card } from './models/card.model';
import { CommonModule } from '@angular/common';
import { ArenaComponent } from './components/arena/arena.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CardComponent, ArenaComponent]
})
export class AppComponent {
  private cardService = inject(CardService);

  DECK_SIZE = 8;

  allCards = signal<Card[]>([]);
  deck = signal<(Card | null)[]>(Array(this.DECK_SIZE).fill(null));
  showArena = signal(false);

  averageElixir = computed(() => {
    const cardsInDeck = this.deck().filter((card): card is Card => card !== null);
    if (cardsInDeck.length === 0) {
      return '0.0';
    }
    const totalElixir = cardsInDeck.reduce((sum, card) => sum + card.elixirCost, 0);
    return (totalElixir / cardsInDeck.length).toFixed(1);
  });

  isCardInDeck = computed(() => {
    const deckIds = new Set(this.deck().filter(Boolean).map(c => c!.id));
    return (card: Card) => deckIds.has(card.id);
  });
  
  isDeckFull = computed(() => {
    return this.deck().every(card => card !== null);
  });

  constructor() {
    this.allCards.set(this.cardService.getCards());
  }

  addCardToDeck(newCard: Card): void {
    if (this.isCardInDeck()(newCard)) {
      return;
    }

    const emptySlotIndex = this.deck().indexOf(null);
    if (emptySlotIndex !== -1) {
      this.deck.update(currentDeck => {
        const newDeck = [...currentDeck];
        newDeck[emptySlotIndex] = newCard;
        return newDeck;
      });
    }
  }

  removeCardFromDeck(index: number): void {
    this.deck.update(currentDeck => {
      const newDeck = [...currentDeck];
      newDeck[index] = null;
      return newDeck;
    });
  }

  enterArena(): void {
    if (this.isDeckFull()) {
      this.showArena.set(true);
    }
  }

  exitArena(): void {
    this.showArena.set(false);
  }
}