import React from 'react';
import { View, FlatList, RefreshControl, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Header } from '../../components/Header';
import { Text } from '../../components/ui/Text';
import { NewsCard } from '../../components/NewsCard';
import { Button } from '../../components/ui/Button';
import { Loading } from '../../components/ui/Loading';
import { useBookmarks } from '../../hooks/useBookmarks';
import { NewsWithFeed } from '../../types';
import { useAuthContext } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function BookmarksScreen() {
  const { user } = useAuthContext();
  const { bookmarks, loading, refreshing, refreshBookmarks } = useBookmarks();

  const handleRefresh = async () => {
    await refreshBookmarks();
  };

  const renderNewsItem = ({ item }: { item: NewsWithFeed }) => {
    return <NewsCard item={item} />;
  };

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Header title="Bookmarks" />
        <View className="flex-1 bg-background items-center justify-center p-4">
          <Ionicons name="bookmark" size={60} color="#C6F1E7" className="mb-4" />
          <Text variant="h5" weight="semibold" className="text-center mb-2">
            Sign in to view bookmarks
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            Create an account or sign in to save and view your bookmarked articles.
          </Text>
          <Button 
            onPress={() => router.push('/login')}
            icon={<Ionicons name="log-in-outline" size={20} color="#FFFFFF" />}
          >
            Sign In
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Bookmarks" />
      <View className="flex-1 bg-background">
        {loading ? (
          <Loading text="Loading bookmarks..." />
        ) : bookmarks.length === 0 ? (
          <View className="flex-1 items-center justify-center p-4">
            <Ionicons name="bookmark" size={60} color="#C6F1E7" className="mb-4" />
            <Text variant="h5" weight="semibold" className="text-center mb-2">
              No bookmarks yet
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              Save articles that interest you by tapping the bookmark icon when viewing them.
            </Text>
            <Button 
              onPress={() => router.push('/')}
              icon={<Ionicons name="home-outline" size={20} color="#FFFFFF" />}
            >
              Browse News
            </Button>
          </View>
        ) : (
          <FlatList
            data={bookmarks}
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
                  Your Bookmarks
                </Text>
                <Text className="text-gray-600">
                  Articles you've saved for later
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}