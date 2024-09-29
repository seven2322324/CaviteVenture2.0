import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import Image from "next/image";

interface EventData {
  title: string;
  location: string;
  date: string;
  imageUrl: string;
  description: string;
}

const EventManagement = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [newEvent, setNewEvent] = useState<EventData>({
    title: "",
    location: "",
    date: "",
    imageUrl: "",
    description: "",
  });
  const [eventSuggestions, setEventSuggestions] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("/api/events")
      .then((response) => setEvents(response.data))
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  useEffect(() => {
    if (newEvent.title) {
      const suggestions = [
        `${newEvent.title} Workshop`,
        `${newEvent.title} Conference`,
        `Advanced ${newEvent.title} Seminar`,
      ];
      setEventSuggestions(suggestions);
    } else {
      setEventSuggestions([]);
    }
  }, [newEvent.title]);

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      alert("Please select a file.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64Image = reader.result as string;

      if (file.size > 5 * 1024 * 1024) {
        setImageError("Image is too large. Please select an image smaller than 5MB.");
        return;
      }

      setImageError(null);
      setNewEvent((prevEvent) => ({
        ...prevEvent,
        imageUrl: base64Image,
      }));
    };
    reader.onerror = () => {
      alert("Failed to read image file.");
    };
  };

  const analyzeDescription = (description: string): string | null => {
    if (description.length < 20) {
      return "Description is too short. Consider adding more details.";
    }
    if (description.length > 500) {
      return "Description is too long. Consider shortening it.";
    }
    return null;
  };

  const handleCreateEvent = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newEvent.imageUrl) {
      alert("Please upload an image or provide an image URL.");
      return;
    }

    const descriptionError = analyzeDescription(newEvent.description);
    if (descriptionError) {
      alert(descriptionError);
      return;
    }

    try {
      const response = await axios.post("/api/create-event", newEvent);
      alert("Event created successfully!");
      setEvents((prevEvents) => [...prevEvents, response.data]);
      setNewEvent({ title: "", location: "", date: "", imageUrl: "", description: "" });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error creating event:", error.response?.data || error.message);
      } else {
        console.error("Unknown error:", error);
      }
      alert("Failed to create event. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Event Management</h2>
      <form onSubmit={handleCreateEvent} className="space-y-6">
        <div>
          <label className="block text-lg font-medium mb-2">Event Title</label>
          <input
            type="text"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
          {eventSuggestions.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              <p>Suggestions:</p>
              <ul className="list-disc list-inside">
                {eventSuggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <label className="block text-lg font-medium mb-2">Location</label>
          <input
            type="text"
            value={newEvent.location}
            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium mb-2">Date</label>
          <input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium mb-2">Upload Image</label>
          <input
            type="file"
            onChange={handleImageUpload}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
          {imageError && <p className="text-red-500 mt-2">{imageError}</p>}
        </div>

        <div>
          <label className="block text-lg font-medium mb-2">Description</label>
          <ReactQuill
            value={newEvent.description}
            onChange={(value) => setNewEvent({ ...newEvent, description: value })}
            className="bg-white"
          />
          <p className="text-sm text-gray-500 mt-2">
            {analyzeDescription(newEvent.description) || "Description looks good!"}
          </p>
        </div>

        <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">
          Create Event
        </button>
      </form>

      <div className="mt-6">
        <h3 className="text-xl font-medium mb-4">Events List</h3>
        {events.length === 0 ? (
          <p>No events created yet.</p>
        ) : (
          <ul>
            {events.map((event, index) => (
              <li key={index} className="mb-4 p-4 border rounded-lg">
                <h4 className="text-lg font-bold">{event.title}</h4>
                <p>Location: {event.location}</p>
                <p>Date: {event.date}</p>
                <Image src={event.imageUrl} alt={event.title} width={500} height={300} className="w-full h-auto mt-2" />
                <div dangerouslySetInnerHTML={{ __html: event.description }} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EventManagement;
