export type RootStackParamList = {
    // Auth routes
    login: undefined;
    register: undefined;
    'forgot-password': undefined;
    
    // Main routes
    index: undefined;
    bookmarks: undefined;
    profile: undefined;
    search: undefined;
    categories: undefined;
    'category/[id]': { id: number };
    'news/[id]': { id: number };
    browser: { url: string; title?: string };
    
    // Admin routes
    dashboard: undefined;
    feeds: undefined;
    'add-feed': undefined;
    'edit-feed/[id]': { id: number };
    users: undefined;
    analytics: undefined;
  };