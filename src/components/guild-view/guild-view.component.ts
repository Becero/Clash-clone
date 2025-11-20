import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { GuildService } from '../../services/guild.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-guild-view',
  templateUrl: './guild-view.component.html',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuildViewComponent {
  private guildService = inject(GuildService);
  private userService = inject(UserService);

  activeTab = signal<'chat' | 'members'>('chat');

  user = this.userService.user;
  guild = computed(() => this.guildService.getGuildById(this.user().guildId!));
  members = computed(() => this.guildService.getGuildMembers(this.user().guildId!));
  chatHistory = computed(() => this.guildService.getChatHistory(this.user().guildId!));

  rankedMembers = computed(() => {
    return [...this.members()].sort((a, b) => b.trophies - a.trophies);
  });

  selectTab(tab: 'chat' | 'members'): void {
    this.activeTab.set(tab);
  }
}
