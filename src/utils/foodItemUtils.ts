import { FoodItem } from '../services/FoodService';
import { AppColors } from '../theme/colors';
import { Timestamp } from 'firebase/firestore';

/**
 * Check if a food item is expired
 */
export const isExpired = (expiryTime: Timestamp): boolean => {
  return expiryTime.toDate() < new Date();
};

/**
 * Get status color for a food item
 */
export const getFoodItemStatusColor = (item: FoodItem): string => {
  if (isExpired(item.expiryTime)) return AppColors.declined; // Muted red for expired
  if (item.approvedRequest?.status === 'picked_up') return AppColors.pickedUp; // Deep teal for picked up
  if (item.approvedRequest?.status === 'approved') return AppColors.approved; // Success green for approved
  if (item.requests && item.requests.length > 0) return AppColors.pending; // Warning gold for pending requests
  return AppColors.available; // Success green for available
};

/**
 * Get status text for a food item
 */
export const getFoodItemStatusText = (item: FoodItem): string => {
  if (isExpired(item.expiryTime)) return '⚠️ Expired';
  if (item.approvedRequest?.status === 'picked_up') return 'Picked Up';
  if (item.approvedRequest?.status === 'approved') return '✓ Approved';
  if (item.requests && item.requests.some(req => req.status === 'requested')) {
    const pendingCount = item.requests.filter(req => req.status === 'requested').length;
    return `${pendingCount} Request${pendingCount > 1 ? 's' : ''}`;
  }
  return '✓ Available';
};

/**
 * Get request status color
 */
export const getRequestStatusColor = (status: string): string => {
  switch (status) {
    case 'approved':
      return AppColors.approved;
    case 'picked_up':
      return AppColors.pickedUp;
    case 'requested':
      return AppColors.pending;
    case 'declined':
      return AppColors.declined;
    default:
      return AppColors.mediumGrey; // Medium grey for unknown status
  }
};

/**
 * Get request status text
 */
export const getRequestStatusText = (status: string): string => {
  switch (status) {
    case 'approved':
      return '✓ Approved';
    case 'picked_up':
      return '✓ Picked Up';
    case 'requested':
      return 'Pending';
    case 'declined':
      return 'Declined';
    default:
      return status;
  }
};

/**
 * Sort food items with expired items at the bottom
 */
export const sortFoodItems = (items: FoodItem[]): FoodItem[] => {
  return [...items].sort((a, b) => {
    const aExpired = isExpired(a.expiryTime);
    const bExpired = isExpired(b.expiryTime);
    
    // If expiry status differs, non-expired items come first
    if (aExpired !== bExpired) {
      return aExpired ? 1 : -1;
    }
    
    // Otherwise, sort by creation date (newest first)
    return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
  });
};
