import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCircle, FaBars, FaTimes, FaHome, FaImage, FaCalendarAlt, FaCog, FaSignOutAlt } from 'react-icons/fa';

const NavBar: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found. Please log in.');

        const response = await fetch('/api/user-role', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch user role');

        const data = await response.json();
        setRole(data.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/signin');
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfileMenu = () => setProfileOpen(!profileOpen);

  const handleKeyDownProfileMenu = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleProfileMenu();
    }
  };

  const navigateTo = (path: string) => {
    if ((role === 'superadmin' || role === 'admin') || path === '/feedback') {
      router.push(path);
    } else {
      console.error('Navigation not allowed for this role');
      alert('Access denied. Insufficient permissions.');
    }
  };

  return (
    <nav className="bg-[#fae8b4] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <span className="text-3xl">🏞️</span>
              <span className="text-gray-800 text-xl font-semibold">CaviteVenture</span>
            </Link>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex space-x-4">
              <NavItem href="/dashboard" icon={<FaHome />} text="Home" />
              <NavItem href="/exhibit" icon={<FaImage />} text="Exhibit" />
              <NavItem href="/event" icon={<FaCalendarAlt />} text="Event" />
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <ProfileMenu
              role={role}
              profileOpen={profileOpen}
              toggleProfileMenu={toggleProfileMenu}
              handleKeyDownProfileMenu={handleKeyDownProfileMenu}
              navigateTo={navigateTo}
              handleLogout={handleLogout}
            />
          </div>

          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FaTimes className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FaBars className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="sm:hidden bg-white"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <MobileNavItem href="/dashboard" icon={<FaHome />} text="Home" />
              <MobileNavItem href="/exhibit" icon={<FaImage />} text="Exhibit" />
              <MobileNavItem href="/event" icon={<FaCalendarAlt />} text="Event" />
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <FaUserCircle className="h-10 w-10 text-gray-500" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">User Profile</div>
                  <div className="text-sm font-medium text-gray-500">{role || 'Loading...'}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                {role === 'superadmin' && (
                  <MobileProfileMenuItem
                    onClick={() => navigateTo('/superadmin')}
                    icon={<FaCog />}
                    text="SuperAdmin Dashboard"
                  />
                )}
                {role === 'admin' && (
                  <MobileProfileMenuItem
                    onClick={() => navigateTo('/admin')}
                    icon={<FaCog />}
                    text="Admin Dashboard"
                  />
                )}
                {(role === 'admin' || role === 'superadmin') && (
                  <MobileProfileMenuItem
                    onClick={() => navigateTo('/feedback')}
                    icon={<FaImage />}
                    text="Feedback"
                  />
                )}
                <MobileProfileMenuItem href="/profile" icon={<FaUserCircle />} text="View Profile" />
                <MobileProfileMenuItem onClick={handleLogout} icon={<FaSignOutAlt />} text="Logout" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const NavItem: React.FC<{ href: string; icon: React.ReactNode; text: string }> = ({ href, icon, text }) => (
  <Link href={href} className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition duration-150 ease-in-out">
    {icon}
    <span>{text}</span>
  </Link>
);

const MobileNavItem: React.FC<{ href: string; icon: React.ReactNode; text: string }> = ({ href, icon, text }) => (
  <Link href={href} className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2">
    {icon}
    <span>{text}</span>
  </Link>
);

const ProfileMenu: React.FC<{
  role: string | null;
  profileOpen: boolean;
  toggleProfileMenu: () => void;
  handleKeyDownProfileMenu: (e: React.KeyboardEvent) => void;
  navigateTo: (path: string) => void;
  handleLogout: () => void;
}> = ({ role, profileOpen, toggleProfileMenu, handleKeyDownProfileMenu, navigateTo, handleLogout }) => (
  <div className="relative">
    <button
      onClick={toggleProfileMenu}
      onKeyDown={handleKeyDownProfileMenu}
      className="bg-gray-100 p-1 rounded-full text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      aria-expanded={profileOpen}
      aria-haspopup="true"
    >
      <FaUserCircle className="h-6 w-6" />
    </button>
    <AnimatePresence>
      {profileOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          {role === 'superadmin' && (
            <ProfileMenuItem
              onClick={() => navigateTo('/superadmin')}
              icon={<FaCog />}
              text="SuperAdmin Dashboard"
            />
          )}
          {role === 'admin' && (
            <ProfileMenuItem
              onClick={() => navigateTo('/admin')}
              icon={<FaCog />}
              text="Admin Dashboard"
            />
          )}
          {(role === 'admin' || role === 'superadmin') && (
            <ProfileMenuItem
              onClick={() => navigateTo('/feedback')}
              icon={<FaImage />}
              text="Feedback"
            />
          )}
          <ProfileMenuItem href="/profile" icon={<FaUserCircle />} text="View Profile" />
          <ProfileMenuItem onClick={handleLogout} icon={<FaSignOutAlt />} text="Logout" />
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const ProfileMenuItem: React.FC<{
  onClick?: () => void;
  href?: string;
  icon: React.ReactNode;
  text: string;
}> = ({ onClick, href, icon, text }) => {
  const content = (
    <div className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
      {icon}
      <span className="ml-2">{text}</span>
    </div>
  );

  return onClick ? (
    <button onClick={onClick} className="w-full text-left focus:outline-none">
      {content}
    </button>
  ) : (
    <Link href={href || '#'} className="block">
      {content}
    </Link>
  );
};

const MobileProfileMenuItem: React.FC<{
  onClick?: () => void;
  href?: string;
  icon: React.ReactNode;
  text: string;
}> = ({ onClick, href, icon, text }) => {
  const content = (
    <div className="flex items-center px-5 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
      {icon}
      <span className="ml-3">{text}</span>
    </div>
  );

  return onClick ? (
    <button onClick={onClick} className="w-full text-left focus:outline-none">
      {content}
    </button>
  ) : (
    <Link href={href || '#'} className="block">
      {content}
    </Link>
  );
};

export default NavBar;
