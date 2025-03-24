import React, { useState } from 'react';
import { View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Text } from '../../components/ui/Text';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useFeeds } from '../../hooks/useFeeds';
import { Ionicons } from '@expo/vector-icons';
import { isValidUrl } from '../../lib/utils';

export default function AddFeedScreen() {
  const { addFeed, categories, addCategory } = useFeeds();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a feed title');
      return false;
    }

    if (!url.trim()) {
      Alert.alert('Error', 'Please enter a feed URL');
      return false;
    }

    if (!isValidUrl(url)) {
      Alert.alert('Error', 'Please enter a valid URL');
      return false;
    }

    if (!categoryId && !newCategoryName.trim()) {
      Alert.alert('Error', 'Please select or create a category');
      return false;
    }

    if (imageUrl && !isValidUrl(imageUrl)) {
      Alert.alert('Error', 'Please enter a valid image URL or leave it empty');
      return false;
    }

    return true;
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await addCategory({
        name: newCategoryName,
        color: '#11CBD7',
      });

      if (error) {
        Alert.alert('Error', error);
      } else if (data) {
        setCategoryId(data[0].id);
        setShowNewCategoryInput(false);
        setNewCategoryName('');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      Alert.alert('Error', 'Failed to add category');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let finalCategoryId = categoryId;

      // If new category was entered but not yet created
      if (!categoryId && newCategoryName.trim()) {
        const { data, error } = await addCategory({
          name: newCategoryName,
          color: '#11CBD7',
        });

        if (error) {
          Alert.alert('Error', error);
          return;
        }

        if (data) {
          finalCategoryId = data[0].id;
        }
      }

      const { data, error } = await addFeed({
        title,
        url,
        description: description || null,
        image_url: imageUrl || null,
        category_id: finalCategoryId!,
        active: true,
      });

      if (error) {
        Alert.alert('Error', error);
      } else {
        Alert.alert(
          'Success', 
          'Feed added successfully!',
          [
            { 
              text: 'OK', 
              onPress: () => router.push('/feeds') 
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error adding feed:', error);
      Alert.alert('Error', 'Failed to add feed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Card className="mb-6">
        <Text variant="h6" weight="semibold" className="mb-4">
          Feed Information
        </Text>

        <Input
          label="Title"
          placeholder="Enter feed title"
          value={title}
          onChangeText={setTitle}
        />

        <Input
          label="URL"
          placeholder="Enter RSS feed URL"
          value={url}
          onChangeText={setUrl}
          keyboardType="url"
          autoCapitalize="none"
        />

        <Input
          label="Description (optional)"
          placeholder="Enter feed description"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Input
          label="Image URL (optional)"
          placeholder="Enter feed image URL"
          value={imageUrl}
          onChangeText={setImageUrl}
          keyboardType="url"
          autoCapitalize="none"
        />

        <View className="mb-4">
          <Text className="text-gray-700 mb-1 font-rubik-medium">
            Category
          </Text>

          {showNewCategoryInput ? (
            <View>
              <Input
                placeholder="Enter new category name"
                value={newCategoryName}
                onChangeText={setNewCategoryName}
              />
              <View className="flex-row mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => setShowNewCategoryInput(false)}
                  className="flex-1 mr-2"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  loading={isLoading}
                  onPress={handleAddCategory}
                  className="flex-1 ml-2"
                >
                  Add Category
                </Button>
              </View>
            </View>
          ) : (
            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-2"
              >
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    activeOpacity={0.7}
                    onPress={() => setCategoryId(category.id)}
                    className={`mr-2 px-4 py-2 rounded-full border ${
                      categoryId === category.id
                        ? 'bg-primary border-primary'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <Text
                      className={`${
                        categoryId === category.id ? 'text-white' : 'text-gray-800'
                      }`}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Button
                variant="outline"
                size="sm"
                onPress={() => {
                  setCategoryId(null);
                  setShowNewCategoryInput(true);
                }}
                icon={<Ionicons name="add" size={16} color="#11CBD7" />}
              >
                Add New Category
              </Button>
            </View>
          )}
        </View>
      </Card>

      <View className="flex-row">
        <Button
          variant="outline"
          className="flex-1 mr-2"
          onPress={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          className="flex-1 ml-2"
          loading={isLoading}
          onPress={handleSubmit}
        >
          Add Feed
        </Button>
      </View>
    </ScrollView>
  );
}