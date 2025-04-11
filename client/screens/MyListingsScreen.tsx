// // screens/MyListingsScreen.tsx
// // Purpose: This file defines the MyListingsScreen component, which displays the user's listings in a list format.
// // Description: The MyListingsScreen component fetches the user's listings from the server and displays them in a FlatList. It handles loading states, error states, and empty states. Each listing can be clicked to navigate to its details page. The screen is styled for both iOS and Android platforms.
// import React, { useState, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   FlatList, 
//   Image, 
//   TouchableOpacity, 
//   ActivityIndicator, 
//   StyleSheet,
//   Alert,
//   SafeAreaView,
//   Platform,
//   StatusBar
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import { tabStyles } from '../styles/tabStyles';
// import { listingsService, Listing } from '../services/listingsService';
// import { formatPrice } from '../utils/formatUtils';
// import { getTimeAgo } from '@/utils/dateUtils';
// import { getStatusBarHeight } from '../utils/statusBarHelper';

// export default function MyListingsScreen(): React.ReactElement {
//   const [listings, setListings] = useState<Listing[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [imageError, setImageError] = useState<Record<string, boolean>>({});
//   const router = useRouter();
  
//   useEffect(() => {
//     fetchMyListings();
//   }, []);

//   const fetchMyListings = async (): Promise<void> => {
//     try {
//       setLoading(true);
//       // Use the service to get user's listings
//       const data = await listingsService.getUserListings();
//       setListings(data);
//       setError(null);
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.error?.message || 'Failed to fetch your listings';
//       setError(errorMessage);
//       console.error('Error fetching listings:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderListingItem = ({ item }: { item: Listing }): React.ReactElement => {
//     const itemImageError = imageError[item._id] || false;
    
//     return (
//       <TouchableOpacity 
//         style={styles.listingCard}
//         onPress={() => router.push({
//           pathname: '/myProductDetails',
//           params: { productId: item._id }
//         })}
//       >
//         <View style={styles.listingImageContainer}>
//           <Image 
//             source={
//               itemImageError 
//                 ? require('../assets/images/placeholder.png') 
//                 : { uri: item.pictures[0] }
//             } 
//             style={styles.listingImage}
//             onError={() => {
//               setImageError(prev => ({
//                 ...prev,
//                 [item._id]: true
//               }));
//             }}
//           />
//           {item.condition === 'new' && (
//             <View style={styles.badgeNew}>
//               <Text style={styles.badgeText}>NEW</Text>
//             </View>
//           )}
//         </View>
        
//         <View style={styles.listingInfo}>
//           <Text style={styles.listingTitle} numberOfLines={1}>{item.title}</Text>
//           <Text style={styles.listingDescription} numberOfLines={2}>{item.description}</Text>
          
//           <View style={styles.listingFooter}>
//             <Text style={styles.timeAgo}>{getTimeAgo(item.createdAt)}</Text>
//             <Text style={styles.listingPrice}>{formatPrice(item.price)}</Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <SafeAreaView style={tabStyles.safeArea}>
//       <View style={tabStyles.container}>
//         <View style={styles.header}>
//           <TouchableOpacity 
//             onPress={() => router.back()} 
//             style={styles.backButton}
//             hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
//           >
//             <Ionicons name="arrow-back" size={24} color="#333" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>My Listings</Text>
//           <View style={{width: 24}} />
//         </View>
        
//         {loading ? (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color="#007bff" />
//             <Text style={styles.loadingText}>Loading your listings...</Text>
//           </View>
//         ) : error ? (
//           <View style={styles.errorContainer}>
//             <Ionicons name="alert-circle" size={48} color="#ff6b6b" />
//             <Text style={styles.errorText}>{error}</Text>
//             <TouchableOpacity style={styles.retryButton} onPress={fetchMyListings}>
//               <Text style={styles.retryButtonText}>Retry</Text>
//             </TouchableOpacity>
//           </View>
//         ) : listings.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <Ionicons name="basket-outline" size={48} color="#aaa" />
//             <Text style={styles.emptyText}>You don't have any listings yet</Text>
//             <TouchableOpacity 
//               style={styles.createButton}
//               onPress={() => router.push('/(tabs)/post')}
//             >
//               <Text style={styles.createButtonText}>Create a Listing</Text>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <FlatList
//             data={listings}
//             renderItem={renderListingItem}
//             keyExtractor={item => item._id}
//             style={styles.listingList}
//             contentContainerStyle={styles.listingListContent}
//             showsVerticalScrollIndicator={false}
//             refreshing={loading}
//             onRefresh={fetchMyListings}
//           />
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//     backgroundColor: '#fff',
//     zIndex: 10,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   backButton: {
//     padding: 8,
//     zIndex: 10,
//   },
//   listingList: {
//     flex: 1,
//   },
//   listingListContent: {
//     padding: 16,
//   },
//   listingCard: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     overflow: 'hidden',
//     position: 'relative',
//   },
//   listingImageContainer: {
//     width: 120,
//     height: 120,
//     position: 'relative',
//   },
//   listingImage: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
//   listingInfo: {
//     flex: 1,
//     padding: 12,
//     justifyContent: 'space-between',
//   },
//   listingTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 6,
//   },
//   listingDescription: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 8,
//   },
//   listingFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   listingPrice: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#007bff',
//   },
//   timeAgo: {
//     fontSize: 12,
//     color: '#999',
//   },
//   badgeNew: {
//     position: 'absolute',
//     top: 8,
//     left: 8,
//     backgroundColor: '#2ecc71',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//   },
//   badgeText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: '700',
//   },
//   loadingContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: '#666',
//   },
//   errorContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   errorText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   retryButton: {
//     backgroundColor: '#007bff',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   retryButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   emptyContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   emptyText: {
//     marginTop: 12,
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#666',
//     marginBottom: 24,
//   },
//   createButton: {
//     backgroundColor: '#007bff',
//     paddingHorizontal: 24,
//     paddingVertical: 14,
//     borderRadius: 8,
//   },
//   createButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
// });


// screens/MyListingsScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet,
  Alert,
  SafeAreaView,
  Platform,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { listingsService, Listing } from '../services/listingsService';
import { formatPrice } from '../utils/formatUtils';
import { getTimeAgo } from '@/utils/dateUtils';
import { getStatusBarHeight } from '../utils/statusBarHelper';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function MyListingsScreen(): React.ReactElement {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const router = useRouter();
  
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async (): Promise<void> => {
    try {
      setLoading(true);
      // Use the service to get user's listings
      const data = await listingsService.getUserListings();
      setListings(data);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to fetch your listings';
      setError(errorMessage);
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderListingItem = ({ item }: { item: Listing }): React.ReactElement => {
    const itemImageError = imageError[item._id] || false;
    
    return (
      <TouchableOpacity 
        style={[styles.listingCard, isDarkMode && styles.darkListingCard]}
        onPress={() => router.push({
          pathname: '/myProductDetails',
          params: { productId: item._id }
        })}
      >
        <View style={styles.listingImageContainer}>
          <Image 
            source={
              itemImageError 
                ? require('../assets/images/placeholder.png') 
                : { uri: item.pictures[0] }
            } 
            style={styles.listingImage}
            onError={() => {
              setImageError(prev => ({
                ...prev,
                [item._id]: true
              }));
            }}
          />
          {item.condition === 'new' && (
            <View style={styles.badgeNew}>
              <Text style={styles.badgeText}>NEW</Text>
            </View>
          )}
        </View>
        
        <View style={styles.listingInfo}>
          <Text style={[styles.listingTitle, isDarkMode && styles.darkText]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.listingDescription, isDarkMode && styles.darkSubText]} numberOfLines={2}>
            {item.description}
          </Text>
          
          <View style={styles.listingFooter}>
            <Text style={[styles.timeAgo, isDarkMode && styles.darkSubText]}>
              {getTimeAgo(item.createdAt)}
            </Text>
            <Text style={styles.listingPrice}>{formatPrice(item.price)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, isDarkMode && styles.darkSafeArea]}>
      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
        <View style={[styles.header, isDarkMode && styles.darkHeader]}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#ECEDEE" : "#333"} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>My Listings</Text>
          <View style={{width: 24}} />
        </View>
        
        {loading ? (
          <View style={[styles.loadingContainer, isDarkMode && styles.darkLoadingContainer]}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>
              Loading your listings...
            </Text>
          </View>
        ) : error ? (
          <View style={[styles.errorContainer, isDarkMode && styles.darkErrorContainer]}>
            <Ionicons name="alert-circle" size={48} color="#ff6b6b" />
            <Text style={[styles.errorText, isDarkMode && styles.darkText]}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchMyListings}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : listings.length === 0 ? (
          <View style={[styles.emptyContainer, isDarkMode && styles.darkEmptyContainer]}>
            <Ionicons name="basket-outline" size={48} color={isDarkMode ? "#9BA1A6" : "#aaa"} />
            <Text style={[styles.emptyText, isDarkMode && styles.darkText]}>
              You don't have any listings yet
            </Text>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => router.push('/(tabs)/post')}
            >
              <Text style={styles.createButtonText}>Create a Listing</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={listings}
            renderItem={renderListingItem}
            keyExtractor={item => item._id}
            style={[styles.listingList, isDarkMode && styles.darkListingList]}
            contentContainerStyle={styles.listingListContent}
            showsVerticalScrollIndicator={false}
            refreshing={loading}
            onRefresh={fetchMyListings}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  darkSafeArea: {
    backgroundColor: '#151718',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  darkContainer: {
    backgroundColor: '#151718',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    zIndex: 10,
  },
  darkHeader: {
    backgroundColor: '#1E2022',
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  darkText: {
    color: '#ECEDEE',
  },
  darkSubText: {
    color: '#9BA1A6',
  },
  backButton: {
    padding: 8,
    zIndex: 10,
  },
  listingList: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  darkListingList: {
    backgroundColor: '#151718',
  },
  listingListContent: {
    padding: 16,
  },
  listingCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  darkListingCard: {
    backgroundColor: '#1E2022',
    shadowOpacity: 0.2,
  },
  listingImageContainer: {
    width: 120,
    height: 120,
    position: 'relative',
  },
  listingImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  listingInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  listingDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  listingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listingPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007bff',
  },
  timeAgo: {
    fontSize: 12,
    color: '#999',
  },
  badgeNew: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#2ecc71',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  darkLoadingContainer: {
    backgroundColor: '#151718',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  darkErrorContainer: {
    backgroundColor: '#151718',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  darkEmptyContainer: {
    backgroundColor: '#151718',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});