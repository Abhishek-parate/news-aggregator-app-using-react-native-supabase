import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { NewsWithFeed } from '../types';

export const useBookmarks = (userId: string) => {
  const [loading, setLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState<NewsWithFeed[]>([]);

  // Get all bookmarks for a user
  const getBookmarks = async () => {
    if (!userId) return [];
    
    try {
      setLoading(true);
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
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to match the NewsWithFeed type
      const transformedData = data.map(item => ({
        ...item.news,
        isBookmarked: true,
      })) as NewsWithFeed[];
      
      setBookmarks(transformedData);
      return transformedData;
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Add a bookmark
  const addBookmark = async (newsId: number) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('bookmarks')
        .insert({
          user_id: userId,
          news_id: newsId,
        });

      if (error) {
        throw error;
      }

      // Update local state
      await getBookmarks();
      return true;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Remove a bookmark
  const removeBookmark = async (newsId: number) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', userId)
        .eq('news_id', newsId);

      if (error) {
        throw error;
      }

      // Update local state
      setBookmarks(bookmarks.filter(b => b.id !== newsId));
      return true;
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Toggle a bookmark (add if not exists, remove if exists)
  const toggleBookmark = async (newsId: number) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      
      // Check if bookmark exists
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .eq('news_id', newsId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        // Bookmark exists, remove it
        return await removeBookmark(newsId);
      } else {
        // Bookmark doesn't exist, add it
        return await addBookmark(newsId);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Check if a news item is bookmarked
  const isBookmarked = async (newsId: number) => {
    if (!userId) return false;
    
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .eq('news_id', newsId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking bookmark status:', error);
      throw error;
    }
  };

  return {
    loading,
    bookmarks,
    getBookmarks,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
  };
};