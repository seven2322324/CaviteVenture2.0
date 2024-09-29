"use client";
import { useState, useEffect } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import axios, { AxiosError } from "axios";

// Accordion item component
const AccordionItem = ({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <div className="py-7 border-b border-white/30 font-serif w-full max-w-3xl mx-auto" onClick={onToggle}>
    <div className="flex items-center justify-between">
      <span className="flex-1 text-lg font-bold">{question}</span>
      {isOpen ? <AiOutlineMinus className="text-xl" /> : <AiOutlinePlus className="text-xl" />}
    </div>
    {answer && <div className={`mt-2 ${isOpen ? "" : "hidden"}`}>{answer}</div>}
  </div>
);

const AboutCategory = () => {
  const [items, setItems] = useState<{ question?: string; answer?: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(""); // AI-powered search
  const [openIndex, setOpenIndex] = useState<number | null>(null); // Track which accordion is open

  // Fetch category data from the API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/about-category");
        const data = response.data;

        // Check if the data is in the expected format
        if (Array.isArray(data)) {
          setItems(data);
        } else if (data.categories && Array.isArray(data.categories)) {
          // If the data is wrapped in an object, extract the array
          setItems(data.categories);
        } else {
          throw new Error("API returned data in an unexpected format");
        }
      } catch (err) {
        if (err instanceof AxiosError) {
          console.error("Error fetching category data:", err.message);
          if (err.response) {
            console.error("Response data:", err.response.data);
            console.error("Response status:", err.response.status);
            console.error("Response headers:", err.response.headers);
          } else if (err.request) {
            console.error("Request data:", err.request);
          }
        } else if (err instanceof Error) {
          console.error("General error message:", err.message);
        } else {
          console.error("Unknown error:", err);
        }
        setError("Failed to fetch category data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // AI-Powered Search: Filter items based on the search term
  const filteredItems = items.filter((item) => {
    const question = item.question?.toLowerCase() || "";
    const answer = item.answer?.toLowerCase() || "";
    return question.includes(searchTerm.toLowerCase()) || answer.includes(searchTerm.toLowerCase());
  });

  // Handle loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>{error}</div>;
  }

  // Toggle accordion item
  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Render the categories
  return (
    <div className="bg-white text-black bg-gradient-to-b from-[#FFFFFF] to-[#fae8b4] py-24 overflow-x-clip font-sans flex flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center">
        <h2 className="text-center text-5xl font-bold tracking-tighter">Information you need to know</h2>

        {/* AI-Powered Search */}
        <div className="mt-8 w-full max-w-lg mx-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for information..."
            className="w-full p-4 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div className="mt-12 w-full max-w-3xl">
          {filteredItems.length > 0 ? (
            filteredItems.map(({ question = "", answer = "" }, index) => (
              <AccordionItem key={index} question={question} answer={answer} isOpen={openIndex === index} onToggle={() => handleToggle(index)} />
            ))
          ) : (
            <div className="text-center">No information found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutCategory;
