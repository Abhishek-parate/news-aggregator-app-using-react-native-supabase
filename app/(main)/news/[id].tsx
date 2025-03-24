import React, { useEffect, useState } from 'react';
import { 
  View, 
  ScrollView, 
  SafeAreaView, 
  Image, 
  TouchableOpacity, 
  Share,
  Dimensions
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Header } from '../../../components/Header';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Loading } from '../../../components/ui/Loading';
import { BookmarkButton } from '../../../components/BookmarkButton';
import { Ionicons } from '@expo/vector-icons';
import { useNews } from '../../../hooks/useNews';
import { NewsWithFeed } from '../../../types';
import { formatDate, extractDomain, sanitizeHtml } from '../../../lib/utils';
import { WebView } from 'react-native-webview';

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const newsId = id ? parseInt(id, 10) : undefined;
  const [news, setNews] = useState<NewsWithFeed | null>(null);
  const [loading, setLoading] = useState(true);
  const { getNewsById } = useNews();
  const contentWidth = Dimensions.get('window').width - 40; // Content width minus padding

  useEffect(() => {
    const fetchNewsDetail = async () => {
      if (newsId) {
        setLoading(true);
        try {
          const newsData = await getNewsById(newsId);
          setNews(newsData);
        } catch (error) {
          console.error('Error fetching news detail:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchNewsDetail();
  }, [newsId]);

  const handleShare = async () => {
    if (!news) return;

    try {
      await Share.share({
        message: `${news.title} - ${news.url}`,
      });
    } catch (error) {
      console.error('Error sharing article:', error);
    }
  };

  const handleReadFullArticle = () => {
    if (!news) return;
    router.push({
      pathname: '/browser',
      params: { url: news.url, title: news.title }
    });
  };

  const handleCategoryPress = () => {
    if (!news?.category) return;
    router.push(`/category/${news.category.id}`);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Header showBackButton />
        <Loading text="Loading article..." />
      </SafeAreaView>
    );
  }

  if (!news) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Header showBackButton />
        <View className="flex-1 bg-background items-center justify-center p-4">
          <Ionicons name="alert-circle-outline" size={60} color="#C6F1E7" className="mb-4" />
          <Text variant="h5" weight="semibold" className="text-center mb-2">
            Article Not Found
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            The article you're looking for doesn't exist or has been removed.
          </Text>
          <Button 
            onPress={() => router.back()}
            icon={<Ionicons name="arrow-back" size={20} color="#FFFFFF" />}
          >
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }
}