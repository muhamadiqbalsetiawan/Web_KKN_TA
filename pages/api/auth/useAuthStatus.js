import { useSession } from 'next-auth/react';

export default function useAuthStatus() {
  const { data, status } = useSession();

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  return { isAuthenticated, isLoading, user: data?.user };
}
