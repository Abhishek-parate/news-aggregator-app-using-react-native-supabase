import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { NewsWithFeed } from '../types';
import { useAuth } from './useAuth';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<NewsWithFeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    } else {
      setBookmarks([]);
      setLoading(false);
    }
  }, [user]);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData || !userData.user) {
        setBookmarks([]);
        return;
      }

      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          news_id,
          news:news(
            *,
            feed:feeds(*),
            category:feeds(category:categories(*))
          )
        `)
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        // Format bookmarks
        const formattedBookmarks: NewsWithFeed[] = data.map((item: any) => ({
          ...item.news,
          feed: item.news.feed,
          category: item.news.category,
          isBookmarked: true,
        }));

        setBookmarks(formattedBookmarks);
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const toggleBookmark = async (newsId: number) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData || !userData.user) {
        return { error: 'User not authenticated' };
      }

      // Check if bookmark exists
      const { data: existingBookmark } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userData.user.id)
        .eq('news_id', newsId)
        .maybeSingle();

      if (existingBookmark) {
        // Remove bookmark
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('id', existingBookmark.id);

        if (error) {
          throw error;
        }

        // Update local state
        setBookmarks(bookmarks.filter((b) => b.id !== newsId));
        
        return { isBookmarked: false, error: null };
      } else {
        // Add bookmark
        const { error } = await supabase.from('bookmarks').insert({
          user_id: userData.user.id,
          news_id: newsId,
        });

        if (error) {
          throw error;
        }

        // Refresh bookmarks
        await fetchBookmarks();
        
        return { isBookmarked: true, error: null };
      }
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const refreshBookmarks = async () => {
    setRefreshing(true);
    await fetchBookmarks();
  };

  return {
    bookmarks,
    loading,
    refreshing,
    toggleBookmark,
    refreshBookmarks,
  };
};