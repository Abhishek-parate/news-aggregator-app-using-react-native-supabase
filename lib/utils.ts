import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Format a date string
 */
export const formatDate = (
  dateString: string,
  formatStr: string = 'MMM dd, yyyy'
): string => {
  try {
    const date = parseISO(dateString);
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format a date as relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return dateString;
  }
};

/**
 * Extract image from HTML content
 */
export const extractImageFromHtml = (html: string): string | null => {
  try {
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = html.match(imgRegex);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting image from HTML:', error);
    return null;
  }
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (
  text: string,
  maxLength: number = 100
): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get initials from name
 */
export const getInitials = (name: string): string => {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Generate random color
 */
export const getRandomColor = (): string => {
  const colors = [
    '#11CBD7', // Primary
    '#C6F1E7', // Secondary
    '#FA4659', // Accent
    '#4C51BF', // Indigo
    '#38B2AC', // Teal
    '#ED8936', // Orange
    '#9F7AEA', // Purple
    '#667EEA', // Indigo
    '#F56565', // Red
    '#ED64A6', // Pink
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Check if a string is a valid URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Sanitize HTML to prevent XSS attacks
 */
export const sanitizeHtml = (html: string): string => {
  // This is a very basic implementation
  // For a production app, use a proper sanitization library
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '');
};

/**
 * Extract domain from URL
 */
export const extractDomain = (url: string): string => {
  try {
    const { hostname } = new URL(url);
    return hostname.replace('www.', '');
  } catch (error) {
    console.error('Error extracting domain:', error);
    return url;
  }
};

/**
 * Parse RSS date formats
 */
export const parseRssDate = (dateString: string): Date => {
  try {
    return new Date(dateString);
  } catch (error) {
    console.error('Error parsing RSS date:', error);
    return new Date();
  }
};