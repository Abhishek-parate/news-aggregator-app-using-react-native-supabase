import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Text } from './ui/Text';
import { Card } from './ui/Card';
import { Ionicons } from '@expo/vector-icons';
import { FeedWithCategory } from '../types';

interface FeedItemProps {
  feed: FeedWithCategory;
  isAdmin?: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onRefresh?: (id: number) => void;
}

export const FeedItem = ({
  feed,
  isAdmin = false,
  onEdit,
  onDelete,
  onRefresh,
}: FeedItemProps) => {
  const handlePress = () => {
    if (isAdmin) {
      // In admin view, clicking opens edit screen
      if (onEdit) {
        onEdit(feed.id);
      }
    } else {
      // In user view, clicking navigates to feed news
      router.push(`/category/${feed.category_id}?feedId=${feed.id}`);
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress} className="mb-3">
      <Card>
        <View className="flex-row">
          {feed.image_url ? (
            <Image
              source={{ uri: feed.image_url }}
              className="w-16 h-16 rounded-md mr-3"
              resizeMode="cover"
            />
          ) : (
            <View className="w-16 h-16 bg-secondary rounded-md mr-3 items-center justify-center">
              <Text className="text-2xl text-primary font-rubik-bold">
                {feed.title.charAt(0)}
              </Text>
            </View>
          )}
          <View className="flex-1 justify-center">
            <Text weight="medium" numberOfLines={1}>
              {feed.title}
            </Text>
            <View className="flex-row items-center mt-1">
              <View
                className="h-2 w-2 rounded-full mr-1"
                style={{ backgroundColor: feed.category?.color || '#11CBD7' }}
              />
              <Text variant="caption" className="text-gray-500">
                {feed.category?.name || 'Uncategorized'}
              </Text>
            </View>
            {feed.description && (
              <Text
                variant="caption"
                className="text-gray-600 mt-1"
                numberOfLines={1}
              >
                {feed.description}
              </Text>
            )}
          </View>

          {isAdmin && (
            <View className="flex justify-center">
              {onRefresh && (
                <TouchableOpacity
                  className="p-2"
                  onPress={() => onRefresh(feed.id)}
                >
                  <Ionicons name="refresh" size={18} color="#6B7280" />
                </TouchableOpacity>
              )}
              {onEdit && (
                <TouchableOpacity
                  className="p-2"
                  onPress={() => onEdit(feed.id)}
                >
                  <Ionicons name="pencil" size={18} color="#6B7280" />
                </TouchableOpacity>
              )}
              {onDelete && (
                <TouchableOpacity
                  className="p-2"
                  onPress={() => onDelete(feed.id)}
                >
                  <Ionicons name="trash-bin" size={18} color="#FA4659" />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
};