import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { router } from 'expo-router';
import { Profile } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState(supabase.auth.getUser());
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current session
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUser(supabase.auth.getUser());
        fetchProfile(data.session.user.id);
      } else {
        setLoading(false);
      }
    };
    
    getSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session ? supabase.auth.getUser() : null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
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

      if (data) {
        setProfile(data);
        setIsAdmin(data.role === 'admin');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      
      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: fullName,
          username: email.split('@')[0],
          role: 'user',
        });

        if (profileError) {
          throw profileError;
        }
      }
      
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      router.replace('/login');
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'yourapp://reset-password',
      });
      
      if (error) {
        throw error;
      }
      
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error('No user logged in');
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.user.id);
      
      if (error) {
        throw error;
      }
      
      await fetchProfile(user.user.id);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    profile,
    isAdmin,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  };
};