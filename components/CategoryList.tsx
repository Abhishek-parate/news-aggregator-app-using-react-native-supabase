import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { router } from 'expo-router';
import { Category } from '../types';
import Text from './ui/Text';
import { COLORS } from '../constants/colors';
import { Feather } from '@expo/vector-icons';

interface CategoryListProps {
  categories: Category[];
  horizontal?: boolean;
  style?: StyleProp<ViewStyle>;
  selectedId?: number;
  showAll?: boolean;
  onSelectCategory?: (category: Category | null) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  horizontal = true,
  style,
  selectedId,
  showAll = true,
  onSelectCategory,
}) => {
  const handleCategoryPress = (category: Category) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    } else {
      router.push(`/category/${category.id}`);
    }
  };

  const handleAllPress = () => {
    if (onSelectCategory) {
      onSelectCategory(null);
    } else {
      router.push('/');
    }
  };

  const renderItem = ({ item }: { item: Category }) => {
    const isSelected = selectedId === item.id;
    const iconName = item.icon || 'tag';
    
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleCategoryPress(item)}
        style={[
          styles.categoryItem,
          horizontal ? styles.horizontalItem : styles.verticalItem,
          isSelected && styles.selectedItem,
          {
            backgroundColor: isSelected
              ? (item.color || COLORS.primary)
              : COLORS.gray[100],
          },
        ]}
      >
        <Feather
          name={iconName as any}
          size={16}
          color={isSelected ? COLORS.white : COLORS.gray[700]}
          style={styles.icon}
        />
        <Text
          variant="small"
          weight={isSelected ? 'semibold' : 'medium'}
          color={isSelected ? COLORS.white : COLORS.gray[700]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={horizontal ? styles.horizontalList : styles.verticalList}
        ListHeaderComponent={
          showAll ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleAllPress}
              style={[
                styles.categoryItem,
                horizontal ? styles.horizontalItem : styles.verticalItem,
                !selectedId && styles.selectedItem,
                {
                  backgroundColor: !selectedId
                    ? COLORS.primary
                    : COLORS.gray[100],
                },
              ]}
            >
              <Feather
                name="grid"
                size={16}
                color={!selectedId ? COLORS.white : COLORS.gray[700]}
                style={styles.icon}
              />
              <Text
                variant="small"
                weight={!selectedId ? 'semibold' : 'medium'}
                color={!selectedId ? COLORS.white : COLORS.gray[700]}
              >
                All
              </Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  horizontalList: {
    paddingHorizontal: 16,
  },
  verticalList: {
    padding: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
  },
  horizontalItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  verticalItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  selectedItem: {
    backgroundColor: COLORS.primary,
  },
  icon: {
    marginRight: 8,
  },
});

export default CategoryList;