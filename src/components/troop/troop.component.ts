import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Troop } from '../arena/arena.component';

@Component({
  selector: 'app-troop',
  templateUrl: './troop.component.html',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"absolute w-24 h-28 flex flex-col items-center justify-end"', // Increased height for 3D model
    '[style.left.px]': 'troop().position.x - 48', // Center the troop
    '[style.top.px]': 'troop().position.y - 80', // Adjust vertical position
    '[style.z-index]': 'troop().position.y', // Simple depth sorting
  },
})
export class TroopComponent {
  troop = input.required<Troop>();
}