// pages/profile.tsx
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import NavBar from '@/components/navbar/NavBar';
import Avatar from '@/components/profile/Avatar';
import Data from '@/components/profile/Data'

const Profile = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/signin');
    }
  }, [router]);

  return (
    <div>
      <NavBar />
      <h1>Profile</h1>
      <Avatar/>
      <Data/>
      <div>profile content goes here</div>
    </div>
  );
};

export default Profile;
