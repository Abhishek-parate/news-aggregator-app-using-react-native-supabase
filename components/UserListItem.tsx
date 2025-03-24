import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Card } from './ui/Card';
import { Text } from './ui/Text';
import { Button } from './ui/Button';
import { Profile } from '../types';
import { formatDate, getInitials } from '../lib/utils';

interface UserListItemProps {
  user: Profile;
  onToggleAdmin: (userId: string, newRole: 'user' | 'admin') => void;
}

export const UserListItem = ({ user, onToggleAdmin }: UserListItemProps) => {
  const isAdmin = user.role === 'admin';

  const handleToggleAdmin = () => {
    onToggleAdmin(user.id, isAdmin ? 'user' : 'admin');
  };

  return (
    <Card className="mb-3">
      <View className="flex-row items-center">
        {user.avatar_url ? (
          <Image
            source={{ uri: user.avatar_url }}
            className="w-12 h-12 rounded-full mr-4"
          />
        ) : (
          <View className="w-12 h-12 rounded-full bg-secondary items-center justify-center mr-4">
            <Text variant="h6" className="text-primary">
              {getInitials(user.full_name || user.username || 'User')}
            </Text>
          </View>
        )}
        
        <View className="flex-1">
          <Text weight="medium">
            {user.full_name || user.username || 'Unnamed User'}
          </Text>
          <Text variant="caption" className="text-gray-500">
            {user.username ? `@${user.username}` : ''}
          </Text>
          <View className="flex-row items-center mt-1">
            <View
              className={`px-2 py-0.5 rounded-full mr-2 ${
                isAdmin ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <Text
                variant="caption"
                className={isAdmin ? 'text-white' : 'text-gray-700'}
              >
                {isAdmin ? 'Admin' : 'User'}
              </Text>
            </View>
            <Text variant="caption" className="text-gray-500">
              Joined {formatDate(user.created_at, 'MMM dd, yyyy')}
            </Text>
          </View>
        </View>
        
        <Button
          variant={isAdmin ? 'outline' : 'primary'}
          size="sm"
          onPress={handleToggleAdmin}
        >
          {isAdmin ? 'Remove Admin' : 'Make Admin'}
        </Button>
      </View>
    </Card>
  );
};