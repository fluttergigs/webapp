import type { User } from '~/services/auth/auth.types';

export interface Snippet {
  id: number;
  name: string;
  title: string; // Alternative/display name for the snippet
  documentId: string;
  description: string;
  code: string; // The actual code content
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

export interface UpdateSnippetRequest {
  data: Partial<Snippet>;
}

export interface CreateSnippetRequest {
  data: {
    title: string;
    description: string;
    code: string;
    language: string;
    tags?: string[]; // array of tag names/slugs
  };
}
