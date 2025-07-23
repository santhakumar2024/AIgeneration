export type UserRole = 'patient' | 'caregiver' | 'supporter';

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  reason: string;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  relevanceScore: number;
}

export interface TopicContent {
  introduction: string;
  normal: {
    title: string;
    items: string[];
    advice: string;
  };
  monitor: {
    title: string;
    items: string[];
    advice: string;
  };
  urgent: {
    title: string;
    items: string[];
    advice: string;
  };
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  content: TopicContent;
  category: string;
  priority: 'low' | 'medium' | 'high';
  roles: UserRole[];
  tags: string[];
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  topicId?: string;
}

export interface AppState {
  currentRole: UserRole | null;
  selectedTopic: Topic | null;
  searchQuery: string;
  searchResults: SearchResult[];
  recommendations: AIRecommendation[];
  isSearchVisible: boolean;
  isTopicModalOpen: boolean;
  isChatbotOpen: boolean;
  chatMessages: ChatMessage[];
  searchType: 'general' | 'topics';
}
