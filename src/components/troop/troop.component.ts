import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Troop } from '../../models/arena.model';

@Component({
  selector: 'app-troop',
  templateUrl: './troop.component.html',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // container da tropa na arena
    '[class]': '"absolute w-24 h-28 flex flex-col items-center justify-end"',
    '[class.is-attacking]': 'troop().action === "attacking"',
    '[class.is-dying]': 'troop().action === "dying"',
    '[style.left.px]': 'troop().position.x - 48', // centraliza no X
    '[style.top.px]': 'troop().position.y - 80',  // ajusta altura
    '[style.z-index]': 'troop().position.y',      // depth sorting simples
  },
})
export class TroopComponent {
  troop = input.required<Troop>();

  // porcentagem da barra de vida, já limitada entre 0 e 100
  hpPercent = computed(() => {
    const t = this.troop();
    const maxHp = t.card.hp || 1; // evita divisão por 0 / undefined
    const pct = (t.hp / maxHp) * 100;
    return Math.max(0, Math.min(100, pct));
  });
}
