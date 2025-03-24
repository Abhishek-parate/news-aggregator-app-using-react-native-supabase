import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Text } from '../../components/ui/Text';
import { Input } from '../../components/ui/Input';
import { NewsCard } from '../../components/NewsCard';
import { Loading } from '../../components/ui/Loading';
import { Ionicons } from '@expo/vector-icons';
import { useNews } from '../../hooks/useNews';
import { router } from 'expo-router';
import { NewsWithFeed } from '../../types';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NewsWithFeed[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { searchNews } = useNews();

  // Handle search when query changes (with debounce)
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchNews(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching news:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleClear = () => {
    setQuery('');
    setSearchResults([]);
  };

  const handleBack = () => {
    router.back();
  };

  const renderNewsItem = ({ item }: { item: NewsWithFeed }) => {
    return <NewsCard item={item} layout="horizontal" />;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-3 flex-row items-center bg-white">
        <TouchableOpacity
          onPress={handleBack}
          className="mr-3 p-1"
        >
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        
        <Input
          placeholder="Search news..."
          value={query}
          onChangeText={setQuery}
          leftIcon={<Ionicons name="search" size={20} color="#6B7280" />}
          rightIcon={query ? <Ionicons name="close" size={20} color="#6B7280" /> : undefined}
          onPressRightIcon={handleClear}
          className="flex-1 m-0"
          autoFocus
        />
      </View>

      <View className="flex-1 bg-background px-4">
        {isSearching ? (
          <Loading text="Searching..." />
        ) : searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            renderItem={renderNewsItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerClassName="py-4"
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <Text variant="body-sm" className="mb-3 text-gray-500">
                {searchResults.length} results found
              </Text>
            }
          />
        ) : query ? (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="search" size={48} color="#C6F1E7" className="mb-4" />
            <Text variant="h6" className="text-center mb-2">
              No results found
            </Text>
            <Text className="text-gray-600 text-center">
              Try different keywords or browse all news
            </Text>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="search" size={48} color="#C6F1E7" className="mb-4" />
            <Text variant="h6" className="text-center mb-2">
              Search News
            </Text>
            <Text className="text-gray-600 text-center">
              Type to search for news by title or content
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}