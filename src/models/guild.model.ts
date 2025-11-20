export type GuildMemberRole = 'Mestre' | 'Lord' | 'Aventureiro';

export interface Guild {
  id: string;
  name: string;
  memberCount: number;
  trophiesRequired: number;
  totalTrophies: number;
  badgeUrl: string;
}

export interface GuildMember {
  id: string;
  name: string;
  trophies: number;
  role: GuildMemberRole;
}

export interface CardRequest {
  cardName: string;
  cardImageUrl: string;
  donations: number;
  maxDonations: number;
}

export interface ChatMessage {
  id: number;
  authorId: string;
  authorName: string;
  authorRole: GuildMemberRole;
  timestamp: string;
  type: 'text' | 'cardRequest';
  message?: string;
  request?: CardRequest;
}
