export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      authors: {
        Row: {
          created_at: string
          id: string
          name: string | null
          name_last_first: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          name_last_first?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          name_last_first?: string | null
        }
        Relationships: []
      }
      book_shelf: {
        Row: {
          book: string | null
          bookshelf: string | null
          created_at: string
          id: string
        }
        Insert: {
          book?: string | null
          bookshelf?: string | null
          created_at?: string
          id?: string
        }
        Update: {
          book?: string | null
          bookshelf?: string | null
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_shelf_book_fkey"
            columns: ["book"]
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_shelf_bookshelf_fkey"
            columns: ["bookshelf"]
            referencedRelation: "bookshelves"
            referencedColumns: ["id"]
          }
        ]
      }
      books: {
        Row: {
          author: string | null
          average_rating: number | null
          created_at: string
          id: string
          original_publication_year: number | null
          page_number: number | null
          publication_year: number | null
          publisher: string | null
          title: string | null
        }
        Insert: {
          author?: string | null
          average_rating?: number | null
          created_at?: string
          id?: string
          original_publication_year?: number | null
          page_number?: number | null
          publication_year?: number | null
          publisher?: string | null
          title?: string | null
        }
        Update: {
          author?: string | null
          average_rating?: number | null
          created_at?: string
          id?: string
          original_publication_year?: number | null
          page_number?: number | null
          publication_year?: number | null
          publisher?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "books_author_fkey"
            columns: ["author"]
            referencedRelation: "authors"
            referencedColumns: ["id"]
          }
        ]
      }
      bookshelves: {
        Row: {
          created_at: string
          id: string
          title: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
        }
        Relationships: []
      }
      user_book: {
        Row: {
          book: string | null
          created_at: string
          date_added: string | null
          date_read: string | null
          id: string
          private_notes: string | null
          rating: number | null
          read_count: number | null
          review: string | null
          spoiler: string | null
        }
        Insert: {
          book?: string | null
          created_at?: string
          date_added?: string | null
          date_read?: string | null
          id?: string
          private_notes?: string | null
          rating?: number | null
          read_count?: number | null
          review?: string | null
          spoiler?: string | null
        }
        Update: {
          book?: string | null
          created_at?: string
          date_added?: string | null
          date_read?: string | null
          id?: string
          private_notes?: string | null
          rating?: number | null
          read_count?: number | null
          review?: string | null
          spoiler?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_book_book_fkey"
            columns: ["book"]
            referencedRelation: "books"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
