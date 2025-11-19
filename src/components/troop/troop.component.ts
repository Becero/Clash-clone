import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Troop } from '../arena/arena.component';

@Component({
  selector: 'app-troop',
  templateUrl: './troop.component.html',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"absolute w-20 h-20 flex flex-col items-center"',
    '[style.left.px]': 'troop().position.x - 40', // Center the troop
    '[style.top.px]': 'troop().position.y - 40',
  },
})
export class TroopComponent {
  troop = input.required<Troop>();
}
