import React from 'react';
import { 
  View, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet 
} from 'react-native';
import { router } from 'expo-router';
import { Text } from './ui/Text';
import { Category } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface CategoryListProps {
  categories: Category[];
  selectedCategoryId?: number;
  showAllOption?: boolean;
}

export const CategoryList = ({
  categories,
  selectedCategoryId,
  showAllOption = true,
}: CategoryListProps) => {
  const handleCategoryPress = (categoryId?: number) => {
    if (categoryId) {
      router.push(`/category/${categoryId}`);
    } else {
      router.push('/');
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="py-2"
    >
      {showAllOption && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleCategoryPress()}
          className={`mr-2 px-4 py-2 rounded-full flex-row items-center 
                     ${selectedCategoryId === undefined ? 'bg-primary' : 'bg-gray-100'}`}
        >
          <Ionicons
            name="home"
            size={16}
            color={selectedCategoryId === undefined ? '#FFFFFF' : '#6B7280'}
            className="mr-1"
          />
          <Text
            weight="medium"
            className={selectedCategoryId === undefined ? 'text-white' : 'text-gray-700'}
          >
            All
          </Text>
        </TouchableOpacity>
      )}

      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          activeOpacity={0.7}
          onPress={() => handleCategoryPress(category.id)}
          className={`mr-2 px-4 py-2 rounded-full 
                     ${selectedCategoryId === category.id ? 'bg-primary' : 'bg-gray-100'}`}
        >
          <Text
            weight="medium"
            className={selectedCategoryId === category.id ? 'text-white' : 'text-gray-700'}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};