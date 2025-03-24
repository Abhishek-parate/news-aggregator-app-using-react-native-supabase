import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Feed, Category, FeedWithCategory } from '../types';
import { fetchRssFeed, processAndSaveFeedItems } from '../lib/rss-parser';

export const useFeeds = (categoryId?: number) => {
  const [feeds, setFeeds] = useState<FeedWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeeds();
    fetchCategories();
  }, [categoryId]);

  const fetchFeeds = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('feeds')
        .select(`
          *,
          category:categories(*)
        `)
        .order('title');

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      if (data) {
        setFeeds(data as FeedWithCategory[]);
      }
    } catch (error) {
      console.error('Error fetching feeds:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      if (data) {
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const addFeed = async (feed: Partial<Feed>) => {
    try {
      setLoading(true);
      
      // First check if the feed URL is valid and can be parsed
      const items = await fetchRssFeed(feed.url || '');
      
      // Insert feed into database
      const { data, error } = await supabase
        .from('feeds')
        .insert(feed)
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // Process and save feed items
        await processAndSaveFeedItems(data.id, items);
        
        // Refresh feeds
        await fetchFeeds();
        
        return { data, error: null };
      }
      
      return { data: null, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateFeed = async (id: number, updates: Partial<Feed>) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('feeds')
        .update(updates)
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Refresh feeds
      await fetchFeeds();
      
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteFeed = async (id: number) => {
    try {
      setLoading(true);
      
      // Delete feed
      const { error } = await supabase
        .from('feeds')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Refresh feeds
      await fetchFeeds();
      
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (category: Partial<Category>) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select();

      if (error) {
        throw error;
      }

      // Refresh categories
      await fetchCategories();
      
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: number, updates: Partial<Category>) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Refresh categories
      await fetchCategories();
      
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      setLoading(true);
      
      // Delete category
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Refresh categories
      await fetchCategories();
      
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const refreshFeed = async (feedId: number) => {
    try {
      setLoading(true);
      
      // Get feed
      const { data: feed, error: feedError } = await supabase
        .from('feeds')
        .select('*')
        .eq('id', feedId)
        .single();

      if (feedError || !feed) {
        throw feedError || new Error('Feed not found');
      }

      // Fetch and process items
      const items = await fetchRssFeed(feed.url);
      await processAndSaveFeedItems(feed.id, items);
      
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    feeds,
    categories,
    loading,
    addFeed,
    updateFeed,
    deleteFeed,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshFeed,
  };
};