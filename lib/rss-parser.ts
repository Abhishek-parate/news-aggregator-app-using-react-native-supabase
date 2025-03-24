import * as rssParser from 'react-native-rss-parser';
import { extractImageFromHtml, parseRssDate } from './utils';
import { supabase } from './supabase';
import { News } from '../types';

/**
 * Fetch and parse an RSS feed
 */
export const fetchRssFeed = async (
  url: string
): Promise<rssParser.FeedItem[]> => {
  try {
    const response = await fetch(url);
    const text = await response.text();
    const feed = await rssParser.parse(text);
    return feed.items;
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    throw error;
  }
};

/**
 * Process RSS feed items and save to database
 */
export const processAndSaveFeedItems = async (
  feedId: number,
  items: rssParser.FeedItem[]
): Promise<void> => {
  try {
    // Process each item
    const newsItems = items.map((item) => {
      const imageUrl = 
        item.enclosures?.find((e) => e.mimeType?.startsWith('image'))?.url || 
        extractImageFromHtml(item.content || item.description || '');
      
      const publishedDate = parseRssDate(
        item.published || new Date().toISOString()
      );
      
      return {
        title: item.title || '',
        description: item.description || null,
        content: item.content || null,
        image_url: imageUrl,
        url: item.links[0]?.url || '',
        published_at: publishedDate.toISOString(),
        feed_id: feedId,
        guid: item.id,
      };
    });
    
    // Get existing news items to avoid duplicates
    const { data: existingNews } = await supabase
      .from('news')
      .select('guid')
      .eq('feed_id', feedId);
    
    const existingGuids = new Set(existingNews?.map((n) => n.guid) || []);
    
    // Filter out existing items
    const newItems = newsItems.filter((item) => !existingGuids.has(item.guid));
    
    if (newItems.length === 0) {
      return;
    }
    
    // Insert new items
    const { error } = await supabase.from('news').insert(newItems);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error processing and saving feed items:', error);
    throw error;
  }
};

/**
 * Update all RSS feeds
 */
export const updateAllFeeds = async (): Promise<void> => {
  try {
    // Get all active feeds
    const { data: feeds, error } = await supabase
      .from('feeds')
      .select('*')
      .eq('active', true);
    
    if (error) {
      throw error;
    }
    
    if (!feeds || feeds.length === 0) {
      return;
    }
    
    // Process each feed
    await Promise.all(
      feeds.map(async (feed) => {
        try {
          const items = await fetchRssFeed(feed.url);
          await processAndSaveFeedItems(feed.id, items);
        } catch (feedError) {
          console.error(`Error updating feed ${feed.id}:`, feedError);
          // Continue with other feeds even if one fails
        }
      })
    );
  } catch (error) {
    console.error('Error updating all feeds:', error);
    throw error;
  }
};