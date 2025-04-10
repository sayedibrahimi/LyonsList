// client/styles/tabStyles.ts
// Purpose: This file contains the styles for the tab screens in the React Native application.
import { StyleSheet, Platform, StatusBar } from 'react-native';
import { colors, spacing, fontSize } from './theme';
import { getStatusBarHeight } from '../utils/statusBarHelper';

// Get the status bar height
const statusBarHeight = getStatusBarHeight();

export const tabStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? statusBarHeight : StatusBar.currentHeight || 0,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  input: {
    width: '100%',
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
  },
  button: {
    width: '100%',
    padding: spacing.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: spacing.sm,
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: 'bold',
  },
  placeholderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    marginVertical: spacing.lg,
    backgroundColor: colors.lightGray,
    borderRadius: 10,
    minHeight: 200,
  },
  placeholderText: {
    fontSize: fontSize.lg,
    color: colors.gray,
  },
});