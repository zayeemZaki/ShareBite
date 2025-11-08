import { Linking, Platform } from 'react-native';

/**
 * Opens the phone dialer with the given phone number
 * Returns true if successful, false otherwise
 */
export const handleCall = async (phoneNumber: string): Promise<boolean> => {
  try {
    const url = Platform.OS === 'ios' 
      ? `telprompt:${phoneNumber}` 
      : `tel:${phoneNumber}`;
    
    const supported = await Linking.canOpenURL(url);
    
    if (supported) {
      await Linking.openURL(url);
      return true;
    } else {
      console.warn('Phone calls are not supported on this device');
      return false;
    }
  } catch (error) {
    console.error('Error opening phone dialer:', error);
    return false;
  }
};

/**
 * Opens the email client with the given email address
 * Returns true if successful, false otherwise
 */
export const handleEmail = async (email: string): Promise<boolean> => {
  try {
    const url = `mailto:${email}`;
    const supported = await Linking.canOpenURL(url);
    
    if (supported) {
      await Linking.openURL(url);
      return true;
    } else {
      console.warn('Email is not supported on this device');
      return false;
    }
  } catch (error) {
    console.error('Error opening email:', error);
    return false;
  }
};

/**
 * Opens the SMS app with the given phone number
 * Returns true if successful, false otherwise
 */
export const handleSMS = async (phoneNumber: string, message?: string): Promise<boolean> => {
  try {
    const url = Platform.OS === 'ios'
      ? `sms:${phoneNumber}${message ? `&body=${encodeURIComponent(message)}` : ''}`
      : `sms:${phoneNumber}${message ? `?body=${encodeURIComponent(message)}` : ''}`;
    
    const supported = await Linking.canOpenURL(url);
    
    if (supported) {
      await Linking.openURL(url);
      return true;
    } else {
      console.warn('SMS is not supported on this device');
      return false;
    }
  } catch (error) {
    console.error('Error opening SMS:', error);
    return false;
  }
};

/**
 * Opens a URL in the device's default browser
 * Returns true if successful, false otherwise
 */
export const handleOpenURL = async (url: string): Promise<boolean> => {
  try {
    const supported = await Linking.canOpenURL(url);
    
    if (supported) {
      await Linking.openURL(url);
      return true;
    } else {
      console.warn(`Cannot open URL: ${url}`);
      return false;
    }
  } catch (error) {
    console.error('Error opening URL:', error);
    return false;
  }
};

/**
 * Opens the device's maps app with directions to the given address or coordinates
 * Returns true if successful, false otherwise
 */
export const handleOpenMaps = async (address: string): Promise<boolean> => {
  try {
    const url = Platform.OS === 'ios'
      ? `maps:0,0?q=${encodeURIComponent(address)}`
      : `geo:0,0?q=${encodeURIComponent(address)}`;
    
    const supported = await Linking.canOpenURL(url);
    
    if (supported) {
      await Linking.openURL(url);
      return true;
    } else {
      // Fallback to Google Maps web
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      await Linking.openURL(googleMapsUrl);
      return true;
    }
  } catch (error) {
    console.error('Error opening maps:', error);
    return false;
  }
};
