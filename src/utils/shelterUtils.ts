import { AppColors } from '../theme/colors';

/**
 * Get color based on shelter capacity
 */
export const getCapacityColor = (capacity?: number): string => {
  if (!capacity) return AppColors.mediumGrey; // Medium grey - unknown
  if (capacity >= 100) return AppColors.success; // Success green - high capacity
  if (capacity >= 50) return AppColors.warning; // Warning gold - medium capacity
  return AppColors.error; // Muted red - low capacity
};

/**
 * Get capacity text description
 */
export const getCapacityText = (capacity?: number): string => {
  if (!capacity) return 'Unknown';
  if (capacity >= 100) return 'High';
  if (capacity >= 50) return 'Medium';
  return 'Low';
};

/**
 * Format shelter address
 */
export const formatShelterAddress = (
  address?: string,
  city?: string
): string => {
  if (address && city) {
    return `${address}, ${city}`;
  }
  return address || city || 'Address not provided';
};
