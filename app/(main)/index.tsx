import React, { useEffect, useState } from 'react';
import { View, FlatList, RefreshControl, SafeAreaView } from 'react-native';
import { Header } from '../../components/Header';
import { Text } from '../../components/ui/Text';
import { NewsCard } from '../../components/NewsCard';
import { CategoryList } from '../../components/CategoryList';
import { Loading } from '../../components/ui/Loading';
import { useNews } from '../../hooks/useNews';
import { useFeeds } from '../../hooks/useFeeds';
import { NewsWithFeed } from '../../types';
import { updateAllFeeds } from '../../lib/rss-parser';
import { useAuthContext } from '../../context/AuthContext';

export default function HomeScreen() {
  const { profile } = useAuthContext();
  const { news, loading, refreshing, refreshNews } = useNews();
  const { categories, loading: loadingCategories } = useFeeds();
  const [isUpdatingFeeds, setIsUpdatingFeeds] = useState(false);

  useEffect(() => {
    // Auto update feeds when app loads
    const updateFeeds = async () => {
      if (!isUpdatingFeeds) {
        setIsUpdatingFeeds(true);
        try {
          await updateAllFeeds();
          await refreshNews();
        } catch (error) {
          console.error('Error updating feeds:', error);
        } finally {
          setIsUpdatingFeeds(false);
        }
      }
    };

    updateFeeds();
  }, []);

  const handleRefresh = async () => {
    await refreshNews();
  };

  const renderNewsItem = ({ item }: { item: NewsWithFeed }) => {
    return <NewsCard item={item} />;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header 
        title="News" 
        showSearchButton 
        showProfileButton 
      />
      <View className="flex-1 bg-background">
        <View className="px-4 pt-4">
          {!loadingCategories && (
            <CategoryList 
              categories={categories}
              showAllOption
            />
          )}
        </View>

        {loading ? (
          <Loading text="Loading news..." />
        ) : news.length === 0 ? (
          <View className="flex-1 items-center justify-center px-4">
            <Text variant="h6" className="text-center mb-2">
              No news articles found
            </Text>
            <Text className="text-gray-600 text-center">
              Please add RSS feeds or check back later for updates.
            </Text>
          </View>
        ) : (
          <FlatList
            data={news}
            renderItem={renderNewsItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerClassName="px-4 py-4"
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={['#11CBD7']}
                tintColor="#11CBD7"
              />
            }
            ListHeaderComponent={
              <View className="mb-4">
                <Text variant="h5" weight="semibold">
                  {profile ? `Hello, ${profile.full_name?.split(' ')[0] || 'there'}!` : 'Latest News'}
                </Text>
                <Text className="text-gray-600">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}