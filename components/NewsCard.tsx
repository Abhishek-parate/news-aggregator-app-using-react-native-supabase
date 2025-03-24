import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { NewsWithFeed } from '../types';
import Card from './ui/Card';
import Text from './ui/Text';
import { COLORS } from '../constants/colors';
import { formatRelativeTime, truncateText, extractDomain } from '../lib/utils';
import BookmarkButton from './BookmarkButton';
import { Feather } from '@expo/vector-icons';

interface NewsCardProps {
  item: NewsWithFeed;
  compact?: boolean;
  showCategory?: boolean;
  onPress?: () => void;
  onBookmarkToggle?: (id: number, isBookmarked: boolean) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({
  item,
  compact = false,
  showCategory = true,
  onPress,
  onBookmarkToggle,
}) => {
  const windowWidth = Dimensions.get('window').width;
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/news/${item.id}`);
    }
  };

  const handleBookmarkToggle = (isBookmarked: boolean) => {
    if (onBookmarkToggle) {
      onBookmarkToggle(item.id, isBookmarked);
    }
  };

  if (compact) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handlePress}
        style={styles.compactContainer}
      >
        <Card variant="outlined" padding="small" style={styles.compactCard}>
          <View style={styles.compactContent}>
            {item.image_url ? (
              <Image
                source={{ uri: item.image_url }}
                style={styles.compactImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.compactImage, styles.placeholder]}>
                <Feather name="image" size={20} color={COLORS.gray[400]} />
              </View>
            )}
            
            <View style={styles.compactTextContainer}>
              <Text
                variant="small"
                weight="medium"
                numberOfLines={2}
                style={styles.compactTitle}
              >
                {item.title}
              </Text>
              
              <View style={styles.compactMeta}>
                <Text variant="caption" color={COLORS.gray[500]}>
                  {item.feed?.title || extractDomain(item.url)} • {formatRelativeTime(item.published_at)}
                </Text>
              </View>
            </View>
            
            <BookmarkButton
              isBookmarked={item.isBookmarked || false}
              onToggle={handleBookmarkToggle}
              size={18}
              style={styles.compactBookmark}
            />
          </View>
        </Card>
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={styles.container}
    >
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text variant="caption" color={COLORS.gray[500]}>
            {formatRelativeTime(item.published_at)}
          </Text>
          
          <BookmarkButton
            isBookmarked={item.isBookmarked || false}
            onToggle={handleBookmarkToggle}
          />
        </View>
        
        {item.image_url && (
          <Image
            source={{ uri: item.image_url }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        
        <View style={styles.content}>
          <Text variant="h4" weight="semibold" style={styles.title}>
            {item.title}
          </Text>
          
          {item.description && (
            <Text
              variant="body"
              color={COLORS.gray[600]}
              style={styles.description}
              numberOfLines={3}
            >
              {truncateText(item.description, 150)}
            </Text>
          )}
          
          <View style={styles.meta}>
            {showCategory && item.category && (
              <View
                style={[
                  styles.category,
                  { backgroundColor: item.category.color || COLORS.primary },
                ]}
              >
                <Text variant="caption" weight="medium" color={COLORS.white}>
                  {item.category.name}
                </Text>
              </View>
            )}
            
            <Text variant="small" color={COLORS.gray[600]}>
              {item.feed?.title || extractDomain(item.url)}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 12,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  category: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  // Compact styles
  compactContainer: {
    marginBottom: 8,
  },
  compactCard: {
    flexDirection: 'row',
  },
  compactContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
  },
  compactTextContainer: {
    flex: 1,
  },
  compactTitle: {
    marginBottom: 4,
  },
  compactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactBookmark: {
    marginLeft: 8,
  },
  placeholder: {
    backgroundColor: COLORS.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NewsCard;