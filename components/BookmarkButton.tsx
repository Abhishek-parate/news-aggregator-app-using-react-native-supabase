import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: (isBookmarked: boolean) => void;
  size?: number;
  style?: ViewStyle;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  isBookmarked,
  onToggle,
  size = 24,
  style,
}) => {
  const [loading, setLoading] = useState(false);
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const handlePress = async () => {
    if (loading) return;
    
    setLoading(true);
    const newState = !bookmarked;
    setBookmarked(newState);
    
    try {
      onToggle(newState);
    } catch (error) {
      // Revert state if operation fails
      setBookmarked(!newState);
      console.error('Error toggling bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={handlePress}
      disabled={loading}
      style={[styles.button, style]}
    >
      {bookmarked ? (
        <Feather name="bookmark" size={size} color={COLORS.accent} />
      ) : (
        <Feather name="bookmark" size={size} color={COLORS.gray[400]} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 4,
  },
});

export default BookmarkButton;