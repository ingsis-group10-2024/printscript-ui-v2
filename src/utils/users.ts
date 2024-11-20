import {Pagination} from "./pagination.ts";

export type PaginatedUsers = Pagination & {
  users: User[]
}

export type User = {
  name: string,
  id: string
  nickname?: string;  // Optional
  email?: string;     // Optional
}
