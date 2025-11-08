import { Timestamp } from 'firebase/firestore';

/**
 * Format a Firebase Timestamp to a readable date string
 */
export const formatDate = (timestamp: Timestamp): string => {
  return new Date(timestamp.seconds * 1000).toLocaleDateString();
};

/**
 * Format a Firebase Timestamp to a short date (e.g., "Jan 15")
 */
export const formatShortDate = (timestamp: Timestamp): string => {
  return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format a Firebase Timestamp to a date with year (e.g., "Jan 15, 2025")
 */
export const formatDateWithYear = (timestamp: Timestamp): string => {
  return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format a Firebase Timestamp to a relative time string (e.g., "2 hours ago")
 */
export const formatRelativeTime = (timestamp: Timestamp): string => {
  const now = new Date();
  const date = new Date(timestamp.seconds * 1000);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return formatShortDate(timestamp);
  }
};

/**
 * Check if a timestamp is in the past
 */
export const isPast = (timestamp: Timestamp): boolean => {
  return timestamp.toDate() < new Date();
};

/**
 * Check if a timestamp is today
 */
export const isToday = (timestamp: Timestamp): boolean => {
  const date = new Date(timestamp.seconds * 1000);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};
