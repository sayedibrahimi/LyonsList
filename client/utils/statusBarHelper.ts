// client/utils/statusBarHelper.ts
import { Platform, StatusBar, Dimensions } from 'react-native';

export const getStatusBarHeight = (): number => {
  if (Platform.OS === 'ios') {
    // On iOS, use a standard estimate for status bar (20pt) for older devices,
    // or 44pt for iPhone X and newer with the notch
    const { height, width } = Dimensions.get('window');
    return height > 800 || width > 800 ? 44 : 20;
  } else {
    // On Android, we can use StatusBar.currentHeight
    return StatusBar.currentHeight || 24;
  }
};

export const getHeaderHeight = (): number => {
  return getStatusBarHeight() + 56; // 56 is a standard header height
};