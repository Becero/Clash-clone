import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { GuildService } from '../../services/guild.service';

@Component({
  selector: 'app-guild-hub',
  templateUrl: './guild-hub.component.html',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuildHubComponent {
  private guildService = inject(GuildService);

  searchTerm = signal('');
  
  searchResults = computed(() => this.guildService.searchGuilds(this.searchTerm()));

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }
}
