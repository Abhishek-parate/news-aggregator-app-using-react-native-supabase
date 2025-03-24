import React, { useEffect, useState } from 'react';
import { View, FlatList, SafeAreaView, RefreshControl, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Header } from '../../../components/Header';
import { Text } from '../../../components/ui/Text';
import { NewsCard } from '../../../components/NewsCard';
import { FeedItem } from '../../../components/FeedItem';
import { Loading } from '../../../components/ui/Loading';
import { useNews } from '../../../hooks/useNews';
import { useFeeds } from '../../../hooks/useFeeds';
import { NewsWithFeed, FeedWithCategory } from '../../../types';
import { Ionicons } from '@expo/vector-icons';

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const feedId = useLocalSearchParams<{ feedId: string }>().feedId;
  const categoryId = id ? parseInt(id, 10) : undefined;
  const parsedFeedId = feedId ? parseInt(feedId, 10) : undefined;
  
  const [activeTab, setActiveTab] = useState<'news' | 'feeds'>('news');
  const { news, loading: loadingNews, refreshing, refreshNews } = useNews(parsedFeedId, categoryId);
  const { feeds, categories, loading: loadingFeeds } = useFeeds(categoryId);
  const [category, setCategory] = useState<string>('Category');

  useEffect(() => {
    if (categoryId && categories.length > 0) {
      const categoryItem = categories.find((c) => c.id === categoryId);
      if (categoryItem) {
        setCategory(categoryItem.name);
      }
    }
  }, [categoryId, categories]);

  useEffect(() => {
    // If a feedId is provided, make sure we're showing news
    if (parsedFeedId) {
      setActiveTab('news');
    }
  }, [parsedFeedId]);

  const handleRefresh = async () => {
    await refreshNews();
  };

  const handleFeedPress = (feed: FeedWithCategory) => {
    router.push(`/category/${categoryId}?feedId=${feed.id}`);
  };

  const clearFeedFilter = () => {
    router.replace(`/category/${categoryId}`);
  };

  const renderNewsItem = ({ item }: { item: NewsWithFeed }) => {
    return <NewsCard item={item} />;
  };

  const renderFeedItem = ({ item }: { item: FeedWithCategory }) => {
    return (
      <FeedItem
        feed={item}
        onPress={() => handleFeedPress(item)}
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title={category} showBackButton showSearchButton />
      <View className="flex-1 bg-background">
        <View className="px-4 pt-4">
          {/* Tab Selector */}
          <View className="flex-row mb-4 bg-white rounded-lg p-1">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveTab('news')}
              className={`flex-1 py-2 rounded-md items-center ${
                activeTab === 'news' ? 'bg-primary' : 'bg-transparent'
              }`}
            >
              <Text
                weight="medium"
                className={activeTab === 'news' ? 'text-white' : 'text-gray-600'}
              >
                News
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveTab('feeds')}
              className={`flex-1 py-2 rounded-md items-center ${
                activeTab === 'feeds' ? 'bg-primary' : 'bg-transparent'
              }`}
            >
              <Text
                weight="medium"
                className={activeTab === 'feeds' ? 'text-white' : 'text-gray-600'}
              >
                Feeds
              </Text>
            </TouchableOpacity>
          </View>

          {/* Feed Filter Indicator */}
          {parsedFeedId && activeTab === 'news' && (
            <View className="flex-row items-center mb-4 bg-secondary rounded-lg px-3 py-2">
              <Text variant="body-sm" className="flex-1 text-gray-800">
                Filtered by feed: {feeds.find(f => f.id === parsedFeedId)?.title || 'Feed'}
              </Text>
              <TouchableOpacity
                onPress={clearFeedFilter}
                className="ml-2"
              >
                <Ionicons name="close-circle" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* News Tab */}
        {activeTab === 'news' && (
          loadingNews ? (
            <Loading text="Loading news..." />
          ) : news.length === 0 ? (
            <View className="flex-1 items-center justify-center p-4">
              <Ionicons name="newspaper" size={60} color="#C6F1E7" className="mb-4" />
              <Text variant="h5" weight="semibold" className="text-center mb-2">
                No news articles found
              </Text>
              <Text className="text-gray-600 text-center">
                There are no news articles in this category yet.
              </Text>
            </View>
          ) : (
            <FlatList
              data={news}
              renderItem={renderNewsItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerClassName="px-4 pb-4"
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={['#11CBD7']}
                  tintColor="#11CBD7"
                />
              }
            />
          )
        )}

        {/* Feeds Tab */}
        {activeTab === 'feeds' && (
          loadingFeeds ? (
            <Loading text="Loading feeds..." />
          ) : feeds.length === 0 ? (
            <View className="flex-1 items-center justify-center p-4">
              <Ionicons name="list" size={60} color="#C6F1E7" className="mb-4" />
              <Text variant="h5" weight="semibold" className="text-center mb-2">
                No feeds found
              </Text>
              <Text className="text-gray-600 text-center">
                There are no feeds in this category yet.
              </Text>
            </View>
          ) : (
            <FlatList
              data={feeds}
              renderItem={renderFeedItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerClassName="px-4 pb-4"
              showsVerticalScrollIndicator={false}
            />
          )
        )}
      </View>
    </SafeAreaView>
  );
}