import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Text } from '../../../components/ui/Text';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Loading } from '../../../components/ui/Loading';
import { useFeeds } from '../../../hooks/useFeeds';
import { Ionicons } from '@expo/vector-icons';
import { isValidUrl } from '../../../lib/utils';
import { Feed } from '../../../types';
import { supabase } from '../../../lib/supabase';

export default function EditFeedScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const feedId = id ? parseInt(id, 10) : undefined;
  
  const { updateFeed, categories, addCategory } = useFeeds();
  const [feed, setFeed] = useState<Feed | null>(null);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [active, setActive] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      if (!feedId) return;

      setIsLoadingFeed(true);
      try {
        const { data, error } = await supabase
          .from('feeds')
          .select('*')
          .eq('id', feedId)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setFeed(data);
          setTitle(data.title);
          setUrl(data.url);
          setDescription(data.description || '');
          setImageUrl(data.image_url || '');
          setCategoryId(data.category_id);
          setActive(data.active);
        }
      } catch (error) {
        console.error('Error fetching feed:', error);
        Alert.alert('Error', 'Failed to load feed details');
      } finally {
        setIsLoadingFeed(false);
      }
    };

    fetchFeed();
  }, [feedId]);

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
    if (!validateForm() || !feedId) return;

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

      const { error } = await updateFeed(feedId, {
        title,
        url,
        description: description || null,
        image_url: imageUrl || null,
        category_id: finalCategoryId!,
        active,
      });

      if (error) {
        Alert.alert('Error', error);
      } else {
        Alert.alert(
          'Success', 
          'Feed updated successfully!',
          [
            { 
              text: 'OK', 
              onPress: () => router.push('/feeds') 
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error updating feed:', error);
      Alert.alert('Error', 'Failed to update feed');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingFeed) {
    return <Loading fullScreen text="Loading feed details..." />;
  }

  if (!feed) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-4">
        <Ionicons name="alert-circle-outline" size={60} color="#C6F1E7" className="mb-4" />
        <Text variant="h5" weight="semibold" className="text-center mb-2">
          Feed Not Found
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          The feed you're trying to edit doesn't exist or has been deleted.
        </Text>
        <Button 
          onPress={() => router.push('/feeds')}
          icon={<Ionicons name="arrow-back" size={20} color="#FFFFFF" />}
        >
          Back to Feeds
        </Button>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Card className="mb-6">
        <Text variant="h6" weight="semibold" className="mb-4">
          Edit Feed
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

        <View className="mb-4">
          <Text className="text-gray-700 mb-1 font-rubik-medium">
            Status
          </Text>
          <View className="flex-row">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActive(true)}
              className={`mr-2 px-4 py-2 rounded-full border ${
                active ? 'bg-primary border-primary' : 'bg-white border-gray-300'
              }`}
            >
              <Text className={active ? 'text-white' : 'text-gray-800'}>
                Active
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActive(false)}
              className={`mr-2 px-4 py-2 rounded-full border ${
                !active ? 'bg-primary border-primary' : 'bg-white border-gray-300'
              }`}
            >
              <Text className={!active ? 'text-white' : 'text-gray-800'}>
                Inactive
              </Text>
            </TouchableOpacity>
          </View>
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
          Save Changes
        </Button>
      </View>
    </ScrollView>
  );
}