// pages/dashboard.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NavBar from '@/components/navbar/NavBar';
import Homepage from '@/components/dashboard/homepage';
import Homepage2 from '@/components/dashboard/Homepage2';
import Homepage3 from '@/components/dashboard/Homepage3';
import Homepage4 from '@/components/dashboard/Homepage4';
import Location1 from '@/components/dashboard/Location1';

// Styled components or CSS-in-JS styling (optional)
const styles = {
  container: {
    fontFamily: "'Arial', sans-serif",
    padding: '20px',
    textAlign: 'center' as const,
  },
  heading: {
    fontSize: '32px',
    fontWeight: 'bold',
  },
  message: {
    fontSize: '18px',
    color: '#333',
    marginTop: '20px',
  },
  error: {
    fontSize: '16px',
    color: 'red',
    marginTop: '20px',
  },
  loading: {
    fontSize: '18px',
    color: '#666',
  },
};

interface DashboardData {
  message: string;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/signin');
        return;
      }

      try {
        const response = await fetch('/api/dashboard', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result: DashboardData = await response.json();
          setData(result);
        } else {
          setError('Failed to fetch dashboard data');
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError('An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  return (
    <div style={styles.container}>
      <NavBar />
      <h1 style={styles.heading}>Dashboard</h1>
      {loading ? (
        <p style={styles.loading}>Loading...</p>
      ) : error ? (
        <p style={styles.error}>{error}</p>
      ) : data ? (
        <div>
          <p style={styles.message}>Welcome, {data.message}</p>
          <Homepage />
          <Homepage2 />
          <Homepage3 />
          <Homepage4 />
          <Location1 />
        </div>
      ) : null}
    </div>
  );
}
