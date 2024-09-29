import React, { useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter from Next.js
import { useAuth } from './api/auth/useAuth'; // Use the custom hook for auth
import AboutExplanation from '@/components/admin/AboutExplanation';
import CategoryManagement from '@/components/admin/CategoryManagement';
import EventManagement from '@/components/admin/EventManagement';
import SiteManagement from '@/components/admin/SiteManagement';
import UserManagement from '@/components/admin/UserManagement';

const Admini = () => {
  const { loading, authenticated, error } = useAuth(['admin', 'superadmin']); // Destructure loading, authenticated, and error
  const [selectedSection, setSelectedSection] = useState<string>('aboutExplanation');
  const router = useRouter(); // Use Next.js useRouter for navigation

  const sections = [
    { id: 'aboutExplanation', label: 'About Explanation Management' },
    { id: 'categoryManagement', label: 'Category Questions/Answers Management' },
    { id: 'siteManagement', label: 'Site Management' },
    { id: 'eventManagement', label: 'Event Management' },
    { id: 'userManagement', label: 'User Management' }, // User Management section
  ];

  if (loading) {
    return <div>Loading...</div>; // Show loading while checking authentication
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error if there is an authentication issue
  }

  if (!authenticated) {
    return <div>Unauthorized: You do not have permission to access this page</div>; // Show unauthorized message if not authenticated
  }

  // Function to handle back navigation to profile page
  const handleBackToProfile = () => {
    router.push('/profile');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin: Management Dashboard</h1>

      {/* Back to Profile Button */}
      <div className="mb-6">
        <button
          onClick={handleBackToProfile}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-200"
        >
          Back to Profile
        </button>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 p-4 border-r bg-gray-50 shadow-sm">
          <h2 className="text-lg font-medium mb-6 text-gray-700">Management Sections</h2>
          <ul className="space-y-2">
            {sections.map(({ id, label }) => (
              <li key={id}>
                <button
                  onClick={() => setSelectedSection(id)}
                  className={`block w-full text-left py-3 px-4 mb-2 rounded-lg ${
                    selectedSection === id
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-200'
                  } transition-all duration-200`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {selectedSection === 'aboutExplanation' && <AboutExplanation />}
          {selectedSection === 'categoryManagement' && <CategoryManagement />}
          {selectedSection === 'siteManagement' && <SiteManagement />}
          {selectedSection === 'eventManagement' && <EventManagement />}
          {selectedSection === 'userManagement' && <UserManagement />}
          
          {/* Fallback for undefined sections */}
          {!sections.map(s => s.id).includes(selectedSection) && <div>Section not found</div>}
        </main>
      </div>
    </div>
  );
};

export default Admini;
