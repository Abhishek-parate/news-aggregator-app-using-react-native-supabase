import React, { useState, useEffect } from 'react';
import { View, FlatList, RefreshControl, Alert } from 'react-native';
import { Text } from '../../components/ui/Text';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Loading } from '../../components/ui/Loading';
import { UserListItem } from '../../components/UserListItem';
import { useUsers } from '../../hooks/useUsers';
import { Profile } from '../../types';
import { Ionicons } from '@expo/vector-icons';

export default function UsersScreen() {
  const { users, loading, fetchUsers, updateUserRole } = useUsers();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    (user.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.username || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  const handleToggleAdmin = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      const { error } = await updateUserRole(userId, newRole);
      if (error) {
        Alert.alert('Error', error);
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      Alert.alert('Error', 'Failed to update user role');
    }
  };

  const renderUserItem = ({ item }: { item: Profile }) => {
    return (
      <UserListItem
        user={item}
        onToggleAdmin={handleToggleAdmin}
      />
    );
  };

  return (
    <View className="flex-1 bg-background">
      <View className="p-4">
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Ionicons name="search" size={20} color="#6B7280" />}
        />
      </View>

      {loading ? (
        <Loading text="Loading users..." />
      ) : users.length === 0 ? (
        <View className="flex-1 items-center justify-center p-4">
          <Ionicons name="people" size={60} color="#C6F1E7" className="mb-4" />
          <Text variant="h5" weight="semibold" className="text-center mb-2">
            No users found
          </Text>
          <Text className="text-gray-600 text-center">
            There are no registered users in the system.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-4"
          ListHeaderComponent={
            <View className="flex-row items-center justify-between mb-3">
              <Text variant="body-sm" className="text-gray-600">
                {filteredUsers.length} users found
              </Text>
              <Card className="py-1 px-3">
                <Text variant="caption" className="text-gray-700">
                  Admins: {users.filter(u => u.role === 'admin').length}
                </Text>
              </Card>
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
                  No users match your search
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}