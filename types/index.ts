import { Database } from './supabase';

// Feed type
export type Feed = Database['public']['Tables']['feeds']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type News = Database['public']['Tables']['news']['Row'];
export type Bookmark = Database['public']['Tables']['bookmarks']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type UserFeedView = Database['public']['Tables']['user_feed_views']['Row'];

// Extended types with relationships
export type NewsWithFeed = News & {
  feed: Feed;
  category: Category;
  isBookmarked?: boolean;
};

export type FeedWithCategory = Feed & {
  category: Category;
};

export type CategoryWithFeeds = Category & {
  feeds: Feed[];
};

// Analytics types
export type ViewsAnalytics = {
  date: string;
  count: number;
};

export type CategoryAnalytics = {
  category: string;
  count: number;
};

export type UserAnalytics = {
  newUsers: number;
  totalUsers: number;
  activeUsers: number;
};

export type BookmarkAnalytics = {
  date: string;
  count: number;
};