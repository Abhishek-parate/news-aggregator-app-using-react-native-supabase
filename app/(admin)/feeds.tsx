import React, { useState } from 'react';
import { View, FlatList, Alert, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Text } from '../../components/ui/Text';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { FeedItem } from '../../components/FeedItem';
import { Loading } from '../../components/ui/Loading';
import { useFeeds } from '../../hooks/useFeeds';
import { FeedWithCategory } from '../../types';
import { Ionicons } from '@expo/vector-icons';
import { updateAllFeeds } from '../../lib/rss-parser';

export default function AdminFeedsScreen() {
  const { feeds, loading, deleteFeed, refreshFeed } = useFeeds();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [updatingFeedId, setUpdatingFeedId] = useState<number | null>(null);
  const [isUpdatingAll, setIsUpdatingAll] = useState(false);

  const filteredFeeds = feeds.filter(feed => 
    feed.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feed.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feed.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFeed = () => {
    router.push('/add-feed');
  };

  const handleEditFeed = (id: number) => {
    router.push(`/edit-feed/${id}`);
  };

  const handleDeleteFeed = (id: number) => {
    Alert.alert(
      'Delete Feed',
      'Are you sure you want to delete this feed? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteFeed(id);
            if (result.error) {
              Alert.alert('Error', result.error);
            }
          },
        },
      ]
    );
  };

  const handleRefreshFeed = async (id: number) => {
    setUpdatingFeedId(id);
    try {
      const result = await refreshFeed(id);
      if (result.error) {
        Alert.alert('Error', result.error);
      } else {
        Alert.alert('Success', 'Feed updated successfully');
      }
    } catch (error) {
      console.error('Error refreshing feed:', error);
      Alert.alert('Error', 'Failed to update feed');
    } finally {
      setUpdatingFeedId(null);
    }
  };

  const handleRefreshAll = async () => {
    setIsUpdatingAll(true);
    try {
      await updateAllFeeds();
      Alert.alert('Success', 'All feeds updated successfully');
    } catch (error) {
      console.error('Error updating all feeds:', error);
      Alert.alert('Error', 'Failed to update all feeds');
    } finally {
      setIsUpdatingAll(false);
    }
  };

  const renderFeedItem = ({ item }: { item: FeedWithCategory }) => {
    return (
      <FeedItem
        feed={item}
        isAdmin
        onEdit={handleEditFeed}
        onDelete={handleDeleteFeed}
        onRefresh={handleRefreshFeed}
      />
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Fetch latest feeds data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <View className="flex-1 bg-background">
      <View className="p-4">
        <Input
          placeholder="Search feeds..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Ionicons name="search" size={20} color="#6B7280" />}
        />
      </View>

      {loading ? (
        <Loading text="Loading feeds..." />
      ) : feeds.length === 0 ? (
        <View className="flex-1 items-center justify-center p-4">
          <Ionicons name="newspaper" size={60} color="#C6F1E7" className="mb-4" />
          <Text variant="h5" weight="semibold" className="text-center mb-2">
            No feeds found
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            Add your first RSS feed to get started
          </Text>
          <Button 
            onPress={handleAddFeed}
            icon={<Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />}
          >
            Add Feed
          </Button>
        </View>
      ) : (
        <FlatList
          data={filteredFeeds}
          renderItem={renderFeedItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerClassName="px-4 pb-4"
          ListHeaderComponent={
            <View className="flex-row items-center justify-between mb-3">
              <Text variant="body-sm" className="text-gray-600">
                {filteredFeeds.length} feeds found
              </Text>
              <Button
                size="sm"
                variant="outline"
                loading={isUpdatingAll}
                onPress={handleRefreshAll}
                className="h-8"
                icon={<Ionicons name="refresh" size={16} color="#11CBD7" />}
              >
                Update All
              </Button>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#11CBD7']}
              tintColor="#11CBD7"
            />
          }
          ListEmptyComponent={
            searchQuery ? (
              <View className="items-center justify-center py-8">
                <Text className="text-gray-600 text-center">
                  No feeds match your search
                </Text>
              </View>
            ) : null
          }
        />
      )}

      {feeds.length > 0 && (
        <View className="p-4">
          <Button
            fullWidth
            onPress={handleAddFeed}
            icon={<Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />}
          >
            Add New Feed
          </Button>
        </View>
      )}
    </View>
  );
}