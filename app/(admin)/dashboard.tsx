import React, { useEffect } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Text } from '../../components/ui/Text';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { AnalyticsChart } from '../../components/AnalyticsChart';
import { Loading } from '../../components/ui/Loading';
import { useUsers } from '../../hooks/useUsers';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';

export default function DashboardScreen() {
  const { 
    userAnalytics,
    categoryViews,
    dailyViews,
    bookmarkStats,
    loading,
    fetchAnalytics
  } = useUsers();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleNavigate = (route: string) => {
    router.push(route);
  };

  if (loading) {
    return <Loading fullScreen text="Loading dashboard..." />;
  }

  // Format the dates for better display
  const formattedDailyViews = dailyViews.map(item => ({
    ...item,
    date: format(parseISO(item.date), 'MMM dd')
  }));

  const formattedBookmarkStats = bookmarkStats.map(item => ({
    ...item,
    date: format(parseISO(item.date), 'MMM dd')
  }));

  return (
    <ScrollView className="flex-1 bg-background p-4">
      {/* Stats Cards */}
      <View className="flex-row flex-wrap mb-4">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleNavigate('/users')}
          className="w-1/2 pr-2 mb-4"
        >
          <Card>
            <View className="p-3">
              <Text variant="caption" className="text-gray-600 mb-1">
                Total Users
              </Text>
              <Text variant="h4" weight="bold" className="text-primary">
                {userAnalytics.totalUsers}
              </Text>
              <View className="flex-row items-center mt-1">
                <Text variant="caption" className="text-success mr-1">
                  +{userAnalytics.newUsers}
                </Text>
                <Text variant="caption" className="text-gray-600">
                  new this week
                </Text>
              </View>
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleNavigate('/analytics')}
          className="w-1/2 pl-2 mb-4"
        >
          <Card>
            <View className="p-3">
              <Text variant="caption" className="text-gray-600 mb-1">
                Active Users
              </Text>
              <Text variant="h4" weight="bold" className="text-accent">
                {userAnalytics.activeUsers}
              </Text>
              <Text variant="caption" className="text-gray-600 mt-1">
                in the last 7 days
              </Text>
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleNavigate('/feeds')}
          className="w-1/2 pr-2"
        >
          <Card>
            <View className="p-3">
              <Text variant="caption" className="text-gray-600 mb-1">
                Total Views
              </Text>
              <Text variant="h4" weight="bold" className="text-secondary">
                {dailyViews.reduce((total, item) => total + item.count, 0)}
              </Text>
              <Text variant="caption" className="text-gray-600 mt-1">
                article views
              </Text>
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleNavigate('/analytics')}
          className="w-1/2 pl-2"
        >
          <Card>
            <View className="p-3">
              <Text variant="caption" className="text-gray-600 mb-1">
                Bookmarks
              </Text>
              <Text variant="h4" weight="bold" className="text-primary">
                {bookmarkStats.reduce((total, item) => total + item.count, 0)}
              </Text>
              <Text variant="caption" className="text-gray-600 mt-1">
                saved articles
              </Text>
            </View>
          </Card>
        </TouchableOpacity>
      </View>

      {/* Charts */}
      <AnalyticsChart 
        title="Daily Article Views"
        data={formattedDailyViews}
        type="line"
        xKey="date"
        yKey="count"
      />

      <AnalyticsChart 
        title="Bookmarks This Week"
        data={formattedBookmarkStats}
        type="bar"
        xKey="date"
        yKey="count"
      />

      <AnalyticsChart 
        title="Popular Categories"
        data={categoryViews}
        type="pie"
        xKey="category"
        yKey="count"
      />

      {/* Quick Actions */}
      <Card className="mb-4">
        <CardHeader>
          <Text variant="h6" weight="semibold">
            Quick Actions
          </Text>
        </CardHeader>
        <CardContent>
          <View className="flex-row flex-wrap">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleNavigate('/add-feed')}
              className="w-1/2 p-2 items-center"
            >
              <View className="bg-secondary rounded-full w-12 h-12 items-center justify-center mb-1">
                <Ionicons name="add" size={24} color="#11CBD7" />
              </View>
              <Text variant="caption" className="text-center">
                Add Feed
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleNavigate('/feeds')}
              className="w-1/2 p-2 items-center"
            >
              <View className="bg-secondary rounded-full w-12 h-12 items-center justify-center mb-1">
                <Ionicons name="refresh" size={24} color="#11CBD7" />
              </View>
              <Text variant="caption" className="text-center">
                Update Feeds
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleNavigate('/users')}
              className="w-1/2 p-2 items-center"
            >
              <View className="bg-secondary rounded-full w-12 h-12 items-center justify-center mb-1">
                <Ionicons name="people" size={24} color="#11CBD7" />
              </View>
              <Text variant="caption" className="text-center">
                Manage Users
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleNavigate('/analytics')}
              className="w-1/2 p-2 items-center"
            >
              <View className="bg-secondary rounded-full w-12 h-12 items-center justify-center mb-1">
                <Ionicons name="analytics" size={24} color="#11CBD7" />
              </View>
              <Text variant="caption" className="text-center">
                View Analytics
              </Text>
            </TouchableOpacity>
          </View>
        </CardContent>
      </Card>
    </ScrollView>
  );
}