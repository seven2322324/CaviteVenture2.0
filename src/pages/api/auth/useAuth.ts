import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface UseAuthReturn {
  loading: boolean;
  authenticated: boolean;
  error: string | null;
}

// Custom hook to handle authentication and role validation from MongoDB
export const useAuth = (allowedRoles: string[]): UseAuthReturn => {
  const [loading, setLoading] = useState(true); // Loading state for initial validation
  const [authenticated, setAuthenticated] = useState(false); // Authenticated state
  const [error, setError] = useState<string | null>(null); // Store any errors
  const router = useRouter();

  useEffect(() => {
    const validateUser = async () => {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage

      if (!token) {
        console.log('No token found, redirecting to signin...');
        setError('No token found, redirecting to signin...');
        router.push('/signin');
        setLoading(false); // Stop loading if token is missing
        return;
      }

      try {
        // Make an API call to fetch the role from the backend
        const response = await fetch('/api/user-role', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Send token to the backend
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorMessage = response.status === 401 ? 'Unauthorized' : 'Failed to fetch user role';
          setError(errorMessage);
          router.push('/signin');
          setLoading(false); // Ensure loading stops
          return;
        }

        const data = await response.json();
        console.log('User role from MongoDB:', data.role); // Debugging log

        // If the role is not one of the allowed roles, redirect to dashboard
        if (!allowedRoles.includes(data.role)) {
          console.log(`User role (${data.role}) does not have permission, redirecting to dashboard...`);
          setError('Insufficient permissions, redirecting to dashboard...');
          router.push('/dashboard');
          setLoading(false); // Stop loading once redirection happens
          return;
        }

        // User is authenticated and authorized
        setAuthenticated(true);
        setError(null); // Clear any previous errors
      } catch (error: unknown) {
        const err = error as Error;
        console.error('Error during role validation:', err.message);
        setError('Failed to authenticate. Please try again.');
        router.push('/signin');
      } finally {
        // Ensure loading is stopped even if there's an error
        setLoading(false);
      }
    };

    validateUser();
  }, [allowedRoles, router]);

  // Return loading, authenticated, and error states
  return { loading, authenticated, error };
};
