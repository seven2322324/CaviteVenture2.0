import { useState } from 'react';
import AboutExplanation from '../components/superadmin/AboutExplanation';
import CategoryManagement from '../components/superadmin/CategoryManagement';
import UserManagement from '../components/superadmin/UserManagement';
import AdminManagement from '../components/superadmin/AdminManagement';
import SiteManagement from '../components/superadmin/SiteManagement';
import EventManagement from '../components/superadmin/EventManagement';

export default function SuperAdmin() {
  const [selectedSection, setSelectedSection] = useState<string>('aboutExplanation');

  const sections = [
    { id: 'aboutExplanation', label: 'About Explanation Management' },
    { id: 'categoryManagement', label: 'Category Questions/Answers Management' },
    { id: 'userManagement', label: 'User Management' },
    { id: 'adminManagement', label: 'Admin Management' },
    { id: 'siteManagement', label: 'Site Management' },
    { id: 'eventManagement', label: 'Event Management' },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Superadmin: Management Dashboard</h1>

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
          {selectedSection === 'userManagement' && <UserManagement />}
          {selectedSection === 'adminManagement' && <AdminManagement />}
          {selectedSection === 'siteManagement' && <SiteManagement />}
          {selectedSection === 'eventManagement' && <EventManagement />}
          {/* Fallback for undefined sections */}
          {!sections.map(s => s.id).includes(selectedSection) && <div>Section not found</div>}
        </main>
      </div>
    </div>
  );
}
