export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      feeds: {
        Row: {
          id: number;
          title: string;
          url: string;
          category_id: number;
          created_at: string;
          updated_at: string;
          description: string | null;
          image_url: string | null;
          active: boolean;
        };
        Insert: {
          id?: number;
          title: string;
          url: string;
          category_id: number;
          created_at?: string;
          updated_at?: string;
          description?: string | null;
          image_url?: string | null;
          active?: boolean;
        };
        Update: {
          id?: number;
          title?: string;
          url?: string;
          category_id?: number;
          created_at?: string;
          updated_at?: string;
          description?: string | null;
          image_url?: string | null;
          active?: boolean;
        };
      };
      categories: {
        Row: {
          id: number;
          name: string;
          created_at: string;
          updated_at: string;
          icon: string | null;
          color: string | null;
        };
        Insert: {
          id?: number;
          name: string;
          created_at?: string;
          updated_at?: string;
          icon?: string | null;
          color?: string | null;
        };
        Update: {
          id?: number;
          name?: string;
          created_at?: string;
          updated_at?: string;
          icon?: string | null;
          color?: string | null;
        };
      };
      news: {
        Row: {
          id: number;
          title: string;
          description: string | null;
          content: string | null;
          image_url: string | null;
          url: string;
          published_at: string;
          feed_id: number;
          created_at: string;
          updated_at: string;
          guid: string;
        };
        Insert: {
          id?: number;
          title: string;
          description?: string | null;
          content?: string | null;
          image_url?: string | null;
          url: string;
          published_at: string;
          feed_id: number;
          created_at?: string;
          updated_at?: string;
          guid: string;
        };
        Update: {
          id?: number;
          title?: string;
          description?: string | null;
          content?: string | null;
          image_url?: string | null;
          url?: string;
          published_at?: string;
          feed_id?: number;
          created_at?: string;
          updated_at?: string;
          guid?: string;
        };
      };
      bookmarks: {
        Row: {
          id: number;
          user_id: string;
          news_id: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          news_id: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          news_id?: number;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
          role: 'user' | 'admin';
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          role?: 'user' | 'admin';
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          role?: 'user' | 'admin';
        };
      };
      user_feed_views: {
        Row: {
          id: number;
          user_id: string;
          news_id: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          news_id: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          news_id?: number;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}