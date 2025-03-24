import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Profile, UserAnalytics, CategoryAnalytics, ViewsAnalytics, BookmarkAnalytics } from '../types';
import { format, subDays } from 'date-fns';

export const useUsers = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics>({
    newUsers: 0,
    totalUsers: 0,
    activeUsers: 0,
  });
  const [categoryViews, setCategoryViews] = useState<CategoryAnalytics[]>([]);
  const [dailyViews, setDailyViews] = useState<ViewsAnalytics[]>([]);
  const [bookmarkStats, setBookmarkStats] = useState<BookmarkAnalytics[]>([]);

  useEffect(() => {
    fetchUsers();
    fetchAnalytics();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Get total user count
      const { count: totalUsers, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        throw countError;
      }

      // Get new users (last 7 days)
      const lastWeek = format(subDays(new Date(), 7), 'yyyy-MM-dd');
      const { count: newUsers, error: newUsersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', lastWeek);

      if (newUsersError) {
        throw newUsersError;
      }

      // Get active users (users who viewed content in last 7 days)
      const { data: activeUsersData, error: activeUsersError } = await supabase
        .from('user_feed_views')
        .select('user_id')
        .gte('created_at', lastWeek)
        .limit(1000);

      if (activeUsersError) {
        throw activeUsersError;
      }

      const activeUsers = activeUsersData 
        ? new Set(activeUsersData.map(u => u.user_id)).size 
        : 0;

      // Get category view stats
      const { data: categoryData, error: categoryError } = await supabase
        .from('user_feed_views')
        .select(`
          news_id,
          news:news(
            feed_id,
            feed:feeds(
              category_id,
              category:categories(name)
            )
          )
        `)
        .limit(1000);

      if (categoryError) {
        throw categoryError;
      }

      if (categoryData) {
        const categoryMap = new Map<string, number>();
        
        categoryData.forEach((view: any) => {
          const categoryName = view.news?.feed?.category?.name;
          if (categoryName) {
            categoryMap.set(
              categoryName, 
              (categoryMap.get(categoryName) || 0) + 1
            );
          }
        });
        
        const categoryStats: CategoryAnalytics[] = Array.from(categoryMap.entries())
          .map(([category, count]) => ({ category, count }))
          .sort((a, b) => b.count - a.count);
        
        setCategoryViews(categoryStats);
      }

      // Get daily views (last 7 days)
      const { data: viewsData, error: viewsError } = await supabase
        .from('user_feed_views')
        .select('created_at')
        .gte('created_at', lastWeek)
        .limit(1000);

      if (viewsError) {
        throw viewsError;
      }

      if (viewsData) {
        const viewsMap = new Map<string, number>();
        
        // Initialize last 7 days
        for (let i = 0; i < 7; i++) {
          const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
          viewsMap.set(date, 0);
        }
        
        viewsData.forEach((view: any) => {
          const date = format(new Date(view.created_at), 'yyyy-MM-dd');
          viewsMap.set(date, (viewsMap.get(date) || 0) + 1);
        });
        
        const viewsStats: ViewsAnalytics[] = Array.from(viewsMap.entries())
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        setDailyViews(viewsStats);
      }
      
      // Get bookmark stats (last 7 days)
      const { data: bookmarkData, error: bookmarkError } = await supabase
        .from('bookmarks')
        .select('created_at')
        .gte('created_at', lastWeek)
        .limit(1000);

      if (bookmarkError) {
        throw bookmarkError;
      }

      if (bookmarkData) {
        const bookmarkMap = new Map<string, number>();
        
        // Initialize last 7 days
        for (let i = 0; i < 7; i++) {
          const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
          bookmarkMap.set(date, 0);
        }
        
        bookmarkData.forEach((bookmark: any) => {
          const date = format(new Date(bookmark.created_at), 'yyyy-MM-dd');
          bookmarkMap.set(date, (bookmarkMap.get(date) || 0) + 1);
        });
        
        const bookmarkStats: BookmarkAnalytics[] = Array.from(bookmarkMap.entries())
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        setBookmarkStats(bookmarkStats);
      }

      // Set user analytics
      setUserAnalytics({
        totalUsers: totalUsers || 0,
        newUsers: newUsers || 0,
        activeUsers: activeUsers || 0,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: 'user' | 'admin') => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      // Refresh users
      await fetchUsers();
      
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    userAnalytics,
    categoryViews,
    dailyViews,
    bookmarkStats,
    fetchUsers,
    fetchAnalytics,
    updateUserRole,
  };
};