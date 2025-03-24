import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Profile, UserAnalytics, ViewsAnalytics, CategoryAnalytics, BookmarkAnalytics } from '../types';
import { format, subDays } from 'date-fns';

export const useUsers = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<Profile[]>([]);

  // Get all users
  const getUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setUsers(data);
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get a single user
  const getUser = async (userId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update a user
  const updateUser = async (
    userId: string,
    updates: Partial<Omit<Profile, 'id' | 'created_at'>>
  ) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete a user (admin only)
  const deleteUser = async (userId: string) => {
    try {
      setLoading(true);
      
      // Delete profile first (due to foreign key constraints)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        throw profileError;
      }

      // Delete auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);

      if (authError) {
        throw authError;
      }

      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Toggle user role (admin/user)
  const toggleUserRole = async (userId: string, currentRole: 'admin' | 'user') => {
    try {
      setLoading(true);
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          role: newRole,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error toggling user role:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get user analytics
  const getUserAnalytics = async (): Promise<UserAnalytics> => {
    try {
      setLoading(true);
      
      // Get total users
      const { count: totalUsers, error: totalError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (totalError) {
        throw totalError;
      }

      // Get new users in the last 7 days
      const sevenDaysAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd');
      const { count: newUsers, error: newError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo);

      if (newError) {
        throw newError;
      }

      // Get active users (users who viewed content in the last 7 days)
      const { count: activeUsers, error: activeError } = await supabase
        .from('user_feed_views')
        .select('user_id', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo)
        .limit(1);

      if (activeError) {
        throw activeError;
      }

      return {
        totalUsers: totalUsers || 0,
        newUsers: newUsers || 0,
        activeUsers: activeUsers || 0,
      };
    } catch (error) {
      console.error('Error getting user analytics:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get view analytics over time
  const getViewsAnalytics = async (days: number = 30): Promise<ViewsAnalytics[]> => {
    try {
      setLoading(true);
      
      // Generate array of dates
      const dates = Array.from({ length: days }, (_, i) => {
        const date = subDays(new Date(), i);
        return format(date, 'yyyy-MM-dd');
      }).reverse();
      
      // Get views for each date
      const analytics = await Promise.all(
        dates.map(async (date) => {
          const nextDate = format(new Date(date + 'T23:59:59'), 'yyyy-MM-dd');
          
          const { count, error } = await supabase
            .from('user_feed_views')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', date)
            .lt('created_at', nextDate);

          if (error) {
            throw error;
          }

          return {
            date,
            count: count || 0,
          };
        })
      );

      return analytics;
    } catch (error) {
      console.error('Error getting views analytics:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get category analytics
  const getCategoryAnalytics = async (): Promise<CategoryAnalytics[]> => {
    try {
      setLoading(true);
      
      // Get categories with view counts
      const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('id, name');

      if (catError) {
        throw catError;
      }

      if (!categories || categories.length === 0) {
        return [];
      }

      const analytics = await Promise.all(
        categories.map(async (category) => {
          // Get feeds in this category
          const { data: feeds, error: feedError } = await supabase
            .from('feeds')
            .select('id')
            .eq('category_id', category.id);

          if (feedError) {
            throw feedError;
          }

          if (!feeds || feeds.length === 0) {
            return {
              category: category.name,
              count: 0,
            };
          }

          const feedIds = feeds.map(feed => feed.id);

          // Get news items from these feeds
          const { data: news, error: newsError } = await supabase
            .from('news')
            .select('id')
            .in('feed_id', feedIds);

          if (newsError) {
            throw newsError;
          }

          if (!news || news.length === 0) {
            return {
              category: category.name,
              count: 0,
            };
          }

          const newsIds = news.map(item => item.id);

          // Count views for these news items
          const { count, error: viewError } = await supabase
            .from('user_feed_views')
            .select('*', { count: 'exact', head: true })
            .in('news_id', newsIds);

          if (viewError) {
            throw viewError;
          }

          return {
            category: category.name,
            count: count || 0,
          };
        })
      );

      return analytics.sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error('Error getting category analytics:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get bookmark analytics over time
  const getBookmarkAnalytics = async (days: number = 30): Promise<BookmarkAnalytics[]> => {
    try {
      setLoading(true);
      
      // Generate array of dates
      const dates = Array.from({ length: days }, (_, i) => {
        const date = subDays(new Date(), i);
        return format(date, 'yyyy-MM-dd');
      }).reverse();
      
      // Get bookmarks for each date
      const analytics = await Promise.all(
        dates.map(async (date) => {
          const nextDate = format(new Date(date + 'T23:59:59'), 'yyyy-MM-dd');
          
          const { count, error } = await supabase
            .from('bookmarks')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', date)
            .lt('created_at', nextDate);

          if (error) {
            throw error;
          }

          return {
            date,
            count: count || 0,
          };
        })
      );

      return analytics;
    } catch (error) {
      console.error('Error getting bookmark analytics:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    users,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    toggleUserRole,
    getUserAnalytics,
    getViewsAnalytics,
    getCategoryAnalytics,
    getBookmarkAnalytics,
  };
};