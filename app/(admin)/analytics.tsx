import React, { useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { Text } from '../../components/ui/Text';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { AnalyticsChart } from '../../components/AnalyticsChart';
import { Button } from '../../components/ui/Button';
import { Loading } from '../../components/ui/Loading';
import { useUsers } from '../../hooks/useUsers';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';

export default function AnalyticsScreen() {
  const { 
    userAnalytics,
    categoryViews,
    dailyViews,
    bookmarkStats,
    loading,
    fetchAnalytics
  } = useUsers();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedChart, setSelectedChart] = useState<'daily' | 'category' | 'bookmarks'>('daily');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshing(false);
  };

  // Format the dates for better display
  const formattedDailyViews = dailyViews.map(item => ({
    ...item,
    date: format(parseISO(item.date), 'MMM dd')
  }));

  const formattedBookmarkStats = bookmarkStats.map(item => ({
    ...item,
    date: format(parseISO(item.date), 'MMM dd')
  }));

  if (loading && !refreshing) {
    return <Loading fullScreen text="Loading analytics..." />;
  }

  return (
    <ScrollView 
      className="flex-1 bg-background p-4"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#11CBD7']}
          tintColor="#11CBD7"
        />
      }
    >
      {/* User Stats Card */}
      <Card className="mb-4">
        <CardHeader>
          <Text variant="h6" weight="semibold">
            User Statistics
          </Text>
        </CardHeader>
        <CardContent>
          <View className="flex-row flex-wrap">
            <View className="w-1/2 pr-4 mb-2">
              <Text variant="caption" className="text-gray-600 mb-1">
                Total Users
              </Text>
              <Text variant="h5" weight="bold" className="text-primary">
                {userAnalytics.totalUsers}
              </Text>
            </View>

            <View className="w-1/2 pl-4 mb-2">
              <Text variant="caption" className="text-gray-600 mb-1">
                New This Week
              </Text>
              <Text variant="h5" weight="bold" className="text-accent">
                {userAnalytics.newUsers}
              </Text>
            </View>

            <View className="w-1/2 pr-4">
              <Text variant="caption" className="text-gray-600 mb-1">
                Active Users
              </Text>
              <Text variant="h5" weight="bold" className="text-secondary">
                {userAnalytics.activeUsers}
              </Text>
            </View>

            <View className="w-1/2 pl-4">
              <Text variant="caption" className="text-gray-600 mb-1">
                Engagement Rate
              </Text>
              <Text variant="h5" weight="bold" className="text-primary">
                {userAnalytics.totalUsers > 0 
                  ? `${Math.round((userAnalytics.activeUsers / userAnalytics.totalUsers) * 100)}%` 
                  : '0%'}
              </Text>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* Chart Type Selector */}
      <View className="flex-row mb-4 bg-white rounded-lg p-1">
        <Button
          variant={selectedChart === 'daily' ? 'primary' : 'ghost'}
          size="sm"
          className="flex-1"
          onPress={() => setSelectedChart('daily')}
        >
          Daily Views
        </Button>
        <Button
          variant={selectedChart === 'category' ? 'primary' : 'ghost'}
          size="sm"
          className="flex-1"
          onPress={() => setSelectedChart('category')}
        >
          Categories
        </Button>
        <Button
          variant={selectedChart === 'bookmarks' ? 'primary' : 'ghost'}
          size="sm"
          className="flex-1"
          onPress={() => setSelectedChart('bookmarks')}
        >
          Bookmarks
        </Button>
      </View>

      {/* Selected Chart */}
      {selectedChart === 'daily' && (
        <AnalyticsChart 
          title="Daily Article Views"
          data={formattedDailyViews}
          type="line"
          xKey="date"
          yKey="count"
          height={350}
        />
      )}

      {selectedChart === 'category' && (
        <AnalyticsChart 
          title="Views by Category"
          data={categoryViews}
          type="pie"
          xKey="category"
          yKey="count"
          height={350}
        />
      )}

      {selectedChart === 'bookmarks' && (
        <AnalyticsChart 
          title="Daily Bookmarks"
          data={formattedBookmarkStats}
          type="bar"
          xKey="date"
          yKey="count"
          height={350}
        />
      )}

      {/* Top Categories Table */}
      <Card className="mb-4">
        <CardHeader>
          <Text variant="h6" weight="semibold">
            Top Categories
          </Text>
        </CardHeader>
        <CardContent>
          {categoryViews.length === 0 ? (
            <Text className="text-gray-600 text-center py-2">
              No category data available
            </Text>
          ) : (
            <View>
              <View className="flex-row pb-2 mb-2 border-b border-gray-200">
                <Text weight="medium" className="flex-1">
                  Category
                </Text>
                <Text weight="medium" className="w-16 text-right">
                  Views
                </Text>
                <Text weight="medium" className="w-16 text-right">
                  % of Total
                </Text>
              </View>
              
              {categoryViews.slice(0, 5).map((item, index) => (
                <View key={index} className="flex-row py-2 border-b border-gray-100">
                  <Text className="flex-1">{item.category}</Text>
                  <Text className="w-16 text-right">{item.count}</Text>
                  <Text className="w-16 text-right">
                    {Math.round((item.count / categoryViews.reduce((sum, cat) => sum + cat.count, 0)) * 100)}%
                  </Text>
                </View>
              ))}
            </View>
          )}
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="mb-4">
        <CardHeader>
          <Text variant="h6" weight="semibold">
            Weekly Summary
          </Text>
        </CardHeader>
        <CardContent>
          <View className="flex-row mb-2">
            <View className="w-3 h-3 rounded-full bg-primary mt-1 mr-2" />
            <View className="flex-1">
              <Text className="text-gray-800">
                Total Views: {dailyViews.reduce((sum, day) => sum + day.count, 0)}
              </Text>
            </View>
          </View>
          
          <View className="flex-row mb-2">
            <View className="w-3 h-3 rounded-full bg-accent mt-1 mr-2" />
            <View className="flex-1">
              <Text className="text-gray-800">
                Total Bookmarks: {bookmarkStats.reduce((sum, day) => sum + day.count, 0)}
              </Text>
            </View>
          </View>
          
          <View className="flex-row mb-2">
            <View className="w-3 h-3 rounded-full bg-secondary mt-1 mr-2" />
            <View className="flex-1">
              <Text className="text-gray-800">
                New Users: {userAnalytics.newUsers}
              </Text>
            </View>
          </View>
          
          <View className="flex-row">
            <View className="w-3 h-3 rounded-full bg-green-500 mt-1 mr-2" />
            <View className="flex-1">
              <Text className="text-gray-800">
                Most Active Day: {
                  dailyViews.length > 0 
                    ? dailyViews.reduce((max, day) => day.count > max.count ? day : max, dailyViews[0]).date
                    : 'N/A'
                }
              </Text>
            </View>
          </View>
        </CardContent>
      </Card>
    </ScrollView>
  );
}