import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { News, NewsWithFeed } from '../types';
import { useAuth } from './useAuth';

export const useNews = (feedId?: number, categoryId?: number) => {
  const [news, setNews] = useState<NewsWithFeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    fetchNews();
  }, [feedId, categoryId]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('news')
        .select(`
          *,
          feed:feeds(*),
          category:feeds(category:categories(*))
        `)
        .order('published_at', { ascending: false });

      if (feedId) {
        query = query.eq('feed_id', feedId);
      }

      if (categoryId) {
        query = query.eq('feeds.category_id', categoryId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      if (data) {
        // Format news items
        const formattedNews: NewsWithFeed[] = data.map((item: any) => ({
          ...item,
          feed: item.feed,
          category: item.category,
        }));

        // If user is logged in, check which items are bookmarked
        if (user) {
          const { data: user } = await supabase.auth.getUser();
          if (user) {
            const { data: bookmarks } = await supabase
              .from('bookmarks')
              .select('news_id')
              .eq('user_id', user.user?.id);

            if (bookmarks) {
              const bookmarkedIds = new Set(bookmarks.map((b) => b.news_id));
              formattedNews.forEach((item) => {
                item.isBookmarked = bookmarkedIds.has(item.id);
              });
            }
          }
        }

        setNews(formattedNews);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getNewsById = async (id: number): Promise<NewsWithFeed | null> => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select(`
          *,
          feed:feeds(*),
          category:feeds(category:categories(*))
        `)
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // Format news item
        const newsItem: NewsWithFeed = {
          ...data,
          feed: data.feed,
          category: data.category,
        };

        // If user is logged in, check if item is bookmarked
        if (user) {
          const { data: user } = await supabase.auth.getUser();
          if (user) {
            const { data: bookmark } = await supabase
              .from('bookmarks')
              .select('*')
              .eq('news_id', id)
              .eq('user_id', user.user?.id)
              .maybeSingle();

            newsItem.isBookmarked = !!bookmark;
          }
        }

        // Record view
        if (user) {
          const { data: userData } = await supabase.auth.getUser();
          if (userData && userData.user) {
            await supabase.from('user_feed_views').insert({
              user_id: userData.user.id,
              news_id: id,
            });
          }
        }

        return newsItem;
      }

      return null;
    } catch (error) {
      console.error('Error getting news by ID:', error);
      return null;
    }
  };

  const refreshNews = async () => {
    setRefreshing(true);
    await fetchNews();
  };

  const searchNews = async (query: string): Promise<NewsWithFeed[]> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('news')
        .select(`
          *,
          feed:feeds(*),
          category:feeds(category:categories(*))
        `)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('published_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        // Format news items
        const formattedNews: NewsWithFeed[] = data.map((item: any) => ({
          ...item,
          feed: item.feed,
          category: item.category,
        }));

        // If user is logged in, check which items are bookmarked
        if (user) {
          const { data: user } = await supabase.auth.getUser();
          if (user) {
            const { data: bookmarks } = await supabase
              .from('bookmarks')
              .select('news_id')
              .eq('user_id', user.user?.id);

            if (bookmarks) {
              const bookmarkedIds = new Set(bookmarks.map((b) => b.news_id));
              formattedNews.forEach((item) => {
                item.isBookmarked = bookmarkedIds.has(item.id);
              });
            }
          }
        }

        return formattedNews;
      }

      return [];
    } catch (error) {
      console.error('Error searching news:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    news,
    loading,
    refreshing,
    fetchNews,
    getNewsById,
    refreshNews,
    searchNews,
  };
};