"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const EventsButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleContinue = () => {
    setIsModalOpen(false);
    router.push("/signup");
  };

  // Handle escape key to close modal for accessibility
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isModalOpen]);

  return (
    <>
      <a
        onClick={handleButtonClick}
        className="cursor-pointer hover:underline transition-colors"
      >
        Events
      </a>

      {isModalOpen && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black/50 z-50"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <p>Only signed-in users can see the event page.</p>
            <button
              onClick={handleContinue}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EventsButton;
