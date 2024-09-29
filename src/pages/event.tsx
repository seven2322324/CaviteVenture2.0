import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/superadmin/Layout';
import NavBar from '@/components/navbar/NavBar';
import axios, { AxiosError } from 'axios';
import Fuse from 'fuse.js'; // Ensure this is installed via npm or yarn
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'react-lottie';
import Image from 'next/image';
import searchAnimation from '../assets/Animation - 1726097531245.json'; // Adjust path if needed

interface EventData {
  _id: string;
  title: string;
  location: string;
  date: string;
  imageUrl: string;
  description: string;
}

interface User {
  role: 'admin' | 'superadmin' | 'user';
}

// Specify the correct type for the error
function handleError(error: AxiosError): string {
  const status = error?.response?.status;
  if (status === 404) {
    return 'No events found. Please try again later.';
  } else if (status === 500) {
    return "Server error. We're working on it!";
  } else if (!navigator.onLine) {
    return 'You appear to be offline. Please check your network connection.';
  } else {
    return 'An unexpected error occurred. Please refresh the page or try again later.';
  }
}

export default function Event({ user }: { user?: User }) {
  const [events, setEvents] = useState<EventData[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [isSearchFocused, setSearchFocused] = useState<boolean>(false);
  const router = useRouter();

  // Ensure user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
    }
  }, [router]);

  // Fetch events and filter logic
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events');
        setEvents(response.data);
        setFilteredEvents(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error fetching events:', error); // Log the error
          setErrorMessage(handleError(error));
        }
      }
    };
    fetchEvents();
  }, []);

  // Search configuration with Fuse.js
  const fuse = new Fuse(events, {
    keys: ['title', 'location', 'description'],
    threshold: 0.3,
  });

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === '') {
      setFilteredEvents(events);
    } else {
      try {
        // Use AI-powered backend search first
        const response = await axios.post('/api/search', { term });
        const relevantEvents = response.data.result.split('\n').filter(Boolean);
        const results = events.filter((event) =>
          relevantEvents.includes(event.title)
        );
        setFilteredEvents(results);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // If AI search fails, fallback to Fuse.js fuzzy search
        const results = fuse.search(term).map((result) => result.item);
        setFilteredEvents(results);
      }
    }
  };

  const openModal = (event: EventData) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  const openEditModal = (event: EventData) => {
    setSelectedEvent(event);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedEvent(null);
  };

  const handleEditEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      // Ensure only admins and superadmins can edit
      if (user && (user.role === 'admin' || user.role === 'superadmin')) {
        const response = await axios.put(
          `/api/events/${selectedEvent._id}`,
          selectedEvent
        );
        setEvents(
          events.map((event) =>
            event._id === selectedEvent._id ? response.data : event
          )
        );
        closeEditModal();
      } else {
        alert('You do not have permission to edit this event.');
      }
    } catch (error) {
      console.error('Failed to update event:', error); // Log the error
    }
  };

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: searchAnimation,
  };

  return (
    <Layout>
      <NavBar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold text-center mb-6 text-gray-900">
          Upcoming Events
        </h1>

        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onFocus={() => setSearchFocused(true)} // Set search focus to true
            onBlur={() => setSearchFocused(false)} // Set search focus to false
            onChange={handleSearch}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {isSearchFocused && searchTerm.trim() === '' ? (
          <div className="flex justify-center">
            <Lottie options={lottieOptions} height={500} width={500} />
          </div>
        ) : errorMessage ? (
          <p className="text-red-600 text-center">{errorMessage}</p>
        ) : filteredEvents.length === 0 ? (
          <p className="text-center text-xl text-gray-700">
            No events available.
          </p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredEvents.map((event, index) => (
              <motion.div
                key={index}
                className="bg-white shadow-lg rounded-lg overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src={event.imageUrl} // Directly use the image URL from the database
                  alt={event.title}
                  className="w-full h-56 object-cover"
                  width={500}
                  height={200}
                />
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {event.title}
                  </h2>
                  <p className="text-gray-600 mt-2">{event.location}</p>
                  <p className="text-gray-500 mt-1">{event.date}</p>
                  <div
                    className="text-gray-700 mt-4"
                    dangerouslySetInnerHTML={{ __html: event.description }}
                  />
                </div>
                <div className="p-6 text-center">
                  <button
                    onClick={() => openModal(event)}
                    className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Learn More
                  </button>
                  {(user && (user.role === 'admin' || user.role === 'superadmin')) && (
                    <button
                      onClick={() => openEditModal(event)}
                      className="mt-4 px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      Edit Event
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Modal for displaying the selected event */}
        <AnimatePresence>
          {isModalOpen && selectedEvent && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-lg overflow-hidden shadow-lg max-w-4xl w-full mx-auto p-8 relative"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <button
                  className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
                  onClick={closeModal}
                >
                  ✕
                </button>
                <Image
                  src={selectedEvent.imageUrl} // Directly use the image URL from the database
                  alt={selectedEvent.title}
                  className="w-full h-96 object-cover rounded-t-lg"
                  width={500}
                  height={200}
                />
                <div className="p-6">
                  <h2 className="text-4xl font-semibold text-gray-900 mb-4">
                    {selectedEvent.title}
                  </h2>
                  <p className="text-gray-600">
                    <strong>Location:</strong> {selectedEvent.location}
                  </p>
                  <p className="text-gray-600">
                    <strong>Date:</strong> {selectedEvent.date}
                  </p>
                  <div
                    className="text-gray-700 mt-4"
                    dangerouslySetInnerHTML={{
                      __html: selectedEvent.description,
                    }}
                  />
                </div>
                <div className="mt-6 text-center">
                  <button
                    className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal for editing the event */}
        <AnimatePresence>
          {isEditModalOpen && selectedEvent && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-lg overflow-hidden shadow-lg max-w-4xl w-full mx-auto p-8 relative"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <button
                  className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
                  onClick={closeEditModal}
                >
                  ✕
                </button>
                <form onSubmit={handleEditEvent}>
                  <div className="grid grid-cols-1 gap-4">
                    <label className="block">
                      <span className="text-gray-700">Title</span>
                      <input
                        type="text"
                        className="form-input mt-1 block w-full"
                        value={selectedEvent.title}
                        onChange={(e) =>
                          setSelectedEvent({
                            ...selectedEvent,
                            title: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label className="block">
                      <span className="text-gray-700">Location</span>
                      <input
                        type="text"
                        className="form-input mt-1 block w-full"
                        value={selectedEvent.location}
                        onChange={(e) =>
                          setSelectedEvent({
                            ...selectedEvent,
                            location: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label className="block">
                      <span className="text-gray-700">Date</span>
                      <input
                        type="date"
                        className="form-input mt-1 block w-full"
                        value={selectedEvent.date}
                        onChange={(e) =>
                          setSelectedEvent({
                            ...selectedEvent,
                            date: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label className="block">
                      <span className="text-gray-700">Image URL</span>
                      <input
                        type="text"
                        className="form-input mt-1 block w-full"
                        value={selectedEvent.imageUrl}
                        onChange={(e) =>
                          setSelectedEvent({
                            ...selectedEvent,
                            imageUrl: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label className="block">
                      <span className="text-gray-700">Description</span>
                      <textarea
                        className="form-textarea mt-1 block w-full"
                        value={selectedEvent.description}
                        onChange={(e) =>
                          setSelectedEvent({
                            ...selectedEvent,
                            description: e.target.value,
                          })
                        }
                      />
                    </label>
                  </div>
                  <div className="mt-6 text-center">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
