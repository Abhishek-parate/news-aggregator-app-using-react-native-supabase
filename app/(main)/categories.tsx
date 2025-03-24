import React from 'react';
import { View, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Header } from '../../components/Header';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Loading } from '../../components/ui/Loading';
import { useFeeds } from '../../hooks/useFeeds';
import { Category } from '../../types';
import { Ionicons } from '@expo/vector-icons';

export default function CategoriesScreen() {
  const { categories, loading } = useFeeds();

  const handleCategoryPress = (categoryId: number) => {
    router.push(`/category/${categoryId}`);
  };

  const renderCategoryItem = ({ item }: { item: Category }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleCategoryPress(item.id)}
        className="mb-3"
      >
        <Card>
          <View className="flex-row items-center">
            <View 
              className="w-12 h-12 rounded-md items-center justify-center mr-3"
              style={{ backgroundColor: item.color || '#11CBD7' }}
            >
              {item.icon ? (
                <Ionicons name={item.icon as any} size={24} color="#FFFFFF" />
              ) : (
                <Text variant="h6" className="text-white font-rubik-medium">
                  {item.name.charAt(0)}
                </Text>
              )}
            </View>
            <View className="flex-1">
              <Text weight="medium" numberOfLines={1} className="mb-1">
                {item.name}
              </Text>
              <Text variant="caption" className="text-gray-500">
                Updated {new Date(item.updated_at).toLocaleString()}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Categories" showSearchButton />
      <View className="flex-1 bg-background">
        {loading ? (
          <Loading text="Loading categories..." />
        ) : categories.length === 0 ? (
          <View className="flex-1 items-center justify-center p-4">
            <Ionicons name="grid" size={60} color="#C6F1E7" className="mb-4" />
            <Text variant="h5" weight="semibold" className="text-center mb-2">
              No categories found
            </Text>
            <Text className="text-gray-600 text-center">
              Categories will appear here once they are added by an administrator.
            </Text>
          </View>
        ) : (
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerClassName="p-4"
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View className="mb-4">
                <Text variant="h5" weight="semibold" className="mb-1">
                  Browse Categories
                </Text>
                <Text className="text-gray-600">
                  Find news by category
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}