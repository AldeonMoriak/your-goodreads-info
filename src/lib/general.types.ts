
export type Nullable<T> = T | null;

export type UserBook = {
  id?: string;
  book?: string;
  read_count: number;
  review: string;
  spoiler: string;
  date_added: Nullable<string>;
  date_read: Nullable<string>;
  private_notes: string;
  rating: number;
};

export type Author = {
  id?: string;
  name: string;
  name_last_first: string;
};

export type Shelf = {
  id?: string;
  book?: string;
  bookshelf?: string;
  title?: string;
};

export type Book = {
  author?: string;
  title: string;
  publisher: string;
  average_rating: number;
  page_number: number;
  publication_year: number;
  original_publication_year: number;
};

