import React from 'react';
import { View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Text } from './ui/Text';
import { Card } from './ui/Card';
import { BookmarkButton } from './BookmarkButton';
import { NewsWithFeed } from '../types';
import { formatRelativeTime, truncateText, extractDomain } from '../lib/utils';

interface NewsCardProps {
  item: NewsWithFeed;
  layout?: 'horizontal' | 'vertical' | 'compact';
  showCategory?: boolean;
}

export const NewsCard = ({
  item,
  layout = 'vertical',
  showCategory = true,
}: NewsCardProps) => {
  const handlePress = () => {
    router.push(`/news/${item.id}`);
  };

  if (layout === 'horizontal') {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        className="mb-4"
      >
        <Card>
          <View className="flex-row">
            {item.image_url ? (
              <Image
                source={{ uri: item.image_url }}
                className="w-24 h-24 rounded-l-lg"
                resizeMode="cover"
              />
            ) : (
              <View className="w-24 h-24 bg-secondary rounded-l-lg items-center justify-center">
                <Text variant="body-sm" className="text-primary font-rubik-medium">
                  {item.feed.title.charAt(0)}
                </Text>
              </View>
            )}
            <View className="flex-1 p-3">
              {showCategory && (
                <View className="flex-row items-center mb-1">
                  <View
                    className="h-2 w-2 rounded-full mr-1"
                    style={{ backgroundColor: item.category?.color || '#11CBD7' }}
                  />
                  <Text variant="caption" className="text-gray-500">
                    {item.category?.name || item.feed.title}
                  </Text>
                </View>
              )}
              <Text
                numberOfLines={2}
                weight="medium"
                className="mb-1"
              >
                {truncateText(item.title, 60)}
              </Text>
              <View className="flex-row items-center justify-between mt-auto">
                <Text variant="caption" className="text-gray-500">
                  {formatRelativeTime(item.published_at)}
                </Text>
                <BookmarkButton
                  newsId={item.id}
                  isBookmarked={item.isBookmarked}
                  size="small"
                />
              </View>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }

  if (layout === 'compact') {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        className="py-3 border-b border-gray-200"
      >
        <View className="flex-row items-center">
          <View className="flex-1 pr-2">
            <Text numberOfLines={2} weight="medium" className="mb-1">
              {truncateText(item.title, 80)}
            </Text>
            <View className="flex-row items-center justify-between">
              <Text variant="caption" className="text-gray-500">
                {extractDomain(item.url)} • {formatRelativeTime(item.published_at)}
              </Text>
              <BookmarkButton
                newsId={item.id}
                isBookmarked={item.isBookmarked}
                size="small"
              />
            </View>
          </View>
          {item.image_url && (
            <Image
              source={{ uri: item.image_url }}
              className="w-16 h-16 rounded-md"
              resizeMode="cover"
            />
          )}
        </View>
      </TouchableOpacity>
    );
  }

  // Default vertical layout
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      className="mb-5"
    >
      <Card padding="none">
        {item.image_url ? (
          <Image
            source={{ uri: item.image_url }}
            className="w-full h-48 rounded-t-lg"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-32 bg-secondary rounded-t-lg items-center justify-center">
            <Text variant="h3" className="text-primary font-rubik-medium">
              {item.feed.title.charAt(0)}
            </Text>
          </View>
        )}
        <View className="p-3">
          {showCategory && (
            <View className="flex-row items-center mb-2">
              <View
                className="h-2 w-2 rounded-full mr-1"
                style={{ backgroundColor: item.category?.color || '#11CBD7' }}
              />
              <Text variant="caption" className="text-gray-500">
                {item.category?.name || item.feed.title}
              </Text>
            </View>
          )}
          <Text
            numberOfLines={2}
            weight="medium"
            variant="h6"
            className="mb-2"
          >
            {item.title}
          </Text>
          {item.description && (
            <Text
              numberOfLines={2}
              variant="body-sm"
              className="text-gray-600 mb-2"
            >
              {truncateText(item.description, 120)}
            </Text>
          )}
          <View className="flex-row items-center justify-between mt-1">
            <Text variant="caption" className="text-gray-500">
              {formatRelativeTime(item.published_at)}
            </Text>
            <BookmarkButton
              newsId={item.id}
              isBookmarked={item.isBookmarked}
            />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};