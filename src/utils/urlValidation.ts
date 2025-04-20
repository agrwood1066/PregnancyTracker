import { Linking } from 'react-native';

interface ValidatedUrl {
  displayUrl: string;
  actualUrl: string;
  isValid: boolean;
  error?: string;
}

export const validateUrl = async (url: string): Promise<ValidatedUrl> => {
  try {
    // Basic URL format validation
    if (!url.startsWith('https://')) {
      return {
        displayUrl: url,
        actualUrl: url,
        isValid: false,
        error: 'URL must start with https://',
      };
    }

    // Try to parse the URL
    const parsedUrl = new URL(url);
    
    // Check if the URL is accessible
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      return {
        displayUrl: url,
        actualUrl: url,
        isValid: false,
        error: 'URL cannot be opened',
      };
    }

    // Get the final URL after any redirects
    const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    const finalUrl = response.url;

    // Create a clean display URL
    const displayUrl = new URL(finalUrl).hostname.replace('www.', '');

    return {
      displayUrl,
      actualUrl: finalUrl,
      isValid: true,
    };
  } catch (error) {
    return {
      displayUrl: url,
      actualUrl: url,
      isValid: false,
      error: 'Invalid URL format',
    };
  }
};

export const formatDisplayUrl = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.replace('www.', '');
  } catch {
    return url;
  }
};

export const sanitizeUrl = (url: string): string => {
  // Remove any whitespace
  let sanitized = url.trim();
  
  // Add https:// if not present
  if (!sanitized.startsWith('http://') && !sanitized.startsWith('https://')) {
    sanitized = `https://${sanitized}`;
  }
  
  // Ensure https:// is used
  if (sanitized.startsWith('http://')) {
    sanitized = sanitized.replace('http://', 'https://');
  }
  
  return sanitized;
};

export const isUrlValid = (url: string): boolean => {
  try {
    new URL(url);
    return url.startsWith('https://');
  } catch {
    return false;
  }
};

export const extractDomain = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.replace('www.', '');
  } catch {
    return url;
  }
};

export const getUrlMetadata = async (url: string): Promise<{
  title?: string;
  description?: string;
  imageUrl?: string;
}> => {
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    // Basic metadata extraction (you might want to use a proper HTML parser)
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const descriptionMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i);
    const imageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/i);
    
    return {
      title: titleMatch ? titleMatch[1] : undefined,
      description: descriptionMatch ? descriptionMatch[1] : undefined,
      imageUrl: imageMatch ? imageMatch[1] : undefined,
    };
  } catch (error) {
    console.error('Error fetching URL metadata:', error);
    return {};
  }
}; 