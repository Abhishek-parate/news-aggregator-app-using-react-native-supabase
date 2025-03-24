import React, { useState, useRef } from 'react';
import { 
  SafeAreaView, 
  View, 
  TouchableOpacity, 
  ActivityIndicator, 
  Share,
  StatusBar,
  Alert
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { WebView } from 'react-native-webview';
import { Text } from '../../components/ui/Text';
import { Ionicons } from '@expo/vector-icons';

export default function BrowserScreen() {
  const { url, title } = useLocalSearchParams<{ url: string; title?: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState(url);
  const [pageTitle, setPageTitle] = useState(title || 'Loading...');
  const webViewRef = useRef<WebView>(null);

  const handleBack = () => {
    router.back();
  };

  const handleReload = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${pageTitle} - ${currentUrl}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleWebViewNavigationStateChange = (navState: any) => {
    setCurrentUrl(navState.url);
    if (navState.title) {
      setPageTitle(navState.title);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View className="flex-row items-center border-b border-gray-200 px-2 py-2">
        <TouchableOpacity
          onPress={handleBack}
          className="p-2"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>

        <View className="flex-1 mx-2">
          <Text numberOfLines={1} weight="medium" className="mb-0.5">
            {pageTitle}
          </Text>
          <Text numberOfLines={1} variant="caption" className="text-gray-500">
            {currentUrl}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleReload}
          className="p-2"
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={22} color="#6B7280" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleShare}
          className="p-2"
          activeOpacity={0.7}
        >
          <Ionicons name="share-outline" size={22} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* WebView */}
      <View className="flex-1">
        <WebView
          ref={webViewRef}
          source={{ uri: url }}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          onNavigationStateChange={handleWebViewNavigationStateChange}
          startInLoadingState={true}
          renderLoading={() => (
            <View className="absolute inset-0 bg-white items-center justify-center">
              <ActivityIndicator size="large" color="#11CBD7" />
            </View>
          )}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            Alert.alert(
              'Error',
              `Failed to load: ${nativeEvent.description}`,
              [{ text: 'OK', onPress: handleBack }]
            );
          }}
        />
        
        {isLoading && (
          <View className="absolute top-0 left-0 right-0 h-1">
            <View className="h-full bg-primary" style={{ width: '10%' }} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}