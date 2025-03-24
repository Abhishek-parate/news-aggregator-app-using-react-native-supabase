import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Feed, Category, FeedWithCategory } from '../types';
import { fetchRssFeed } from '../lib/rss-parser';

export const useFeeds = () => {
  const [loading, setLoading] = useState(false);
  const [feeds, setFeeds] = useState<FeedWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const getFeeds = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('feeds')
        .select(`
          *,
          category:categories(*)
        `)
        .order('title');

      if (error) {
        throw error;
      }

      setFeeds(data as FeedWithCategory[]);
      return data as FeedWithCategory[];
    } catch (error) {
      console.error('Error fetching feeds:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getFeedsByCategory = async (categoryId: number) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('feeds')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('category_id', categoryId)
        .order('title');

      if (error) {
        throw error;
      }

      return data as FeedWithCategory[];
    } catch (error) {
      console.error('Error fetching feeds by category:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getFeed = async (id: number) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('feeds')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data as FeedWithCategory;
    } catch (error) {
      console.error('Error fetching feed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      setCategories(data);
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createFeed = async (feed: Omit<Feed, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      
      // Validate the feed URL by trying to fetch it
      await fetchRssFeed(feed.url);
      
      const { data, error } = await supabase
        .from('feeds')
        .insert({
          ...feed,
          active: true,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error creating feed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateFeed = async (
    id: number,
    updates: Partial<Omit<Feed, 'id' | 'created_at' | 'updated_at'>>
  ) => {
    try {
      setLoading(true);
      
      // If URL is being updated, validate it
      if (updates.url) {
        await fetchRssFeed(updates.url);
      }
      
      const { data, error } = await supabase
        .from('feeds')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error updating feed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteFeed = async (id: number) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('feeds')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error deleting feed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (
    id: number,
    updates: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>
  ) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    feeds,
    categories,
    getFeeds,
    getFeedsByCategory,
    getFeed,
    getCategories,
    createFeed,
    updateFeed,
    deleteFeed,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};