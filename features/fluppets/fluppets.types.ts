import { User } from "~/services/auth/auth.types";

export interface Snippet {
  id: string;
  name: string;
  documentId: string;
  description: string;
  type: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;

  [key: string]: any;
}

export type Snippet = Snippet[];
