import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function Index() {
  // const { user } = useAuth();
  const user = "test";
  return <Redirect href={user ? '../(tabs)/search' : '../auth/login'} />;
}