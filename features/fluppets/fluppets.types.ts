import type { User } from '~/services/auth/auth.types';

export interface Snippet {
  id: number;
  name: string;
  documentId: string;
  description: string;
  type: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  language: string;
  tags: Tags;
  views: number;
  slug: string;

  [key: string]: any;
}

export interface Tag {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  snippets: Snippets;
}

export interface SnippetFilterOptions {
  tags: string[];
  searchQuery: string;
  sortKey: 'views' | 'createdAt';
}

export type Snippets = Snippet[];
export type Tags = Tag[];
