import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useBookmarks } from '../hooks/useBookmarks';
import { useAuthContext } from '../context/AuthContext';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface BookmarkButtonProps {
  newsId: number;
  isBookmarked?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const BookmarkButton = ({
  newsId,
  isBookmarked: initialIsBookmarked = false,
  size = 'medium',
}: BookmarkButtonProps) => {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const { toggleBookmark } = useBookmarks();
  const { user } = useAuthContext();

  const iconSizes = {
    small: 18,
    medium: 22,
    large: 26,
  };

  const handleToggleBookmark = async () => {
    if (!user) {
      // Redirect to login if not logged in
      router.push('/login');
      return;
    }

    try {
      // Optimistically update UI
      setIsBookmarked(!isBookmarked);
      
      // Make API call
      const result = await toggleBookmark(newsId);
      
      // Revert if there was an error
      if (result.error) {
        setIsBookmarked(isBookmarked);
        console.error('Error toggling bookmark:', result.error);
      }
    } catch (error) {
      // Revert on error
      setIsBookmarked(isBookmarked);
      console.error('Error toggling bookmark:', error);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handleToggleBookmark}
      className="items-center justify-center"
    >
      <Ionicons
        name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
        size={iconSizes[size]}
        color={isBookmarked ? '#FA4659' : '#6B7280'}
      />
    </TouchableOpacity>
  );
};