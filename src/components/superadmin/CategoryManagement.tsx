// components/SuperAdmin/CategoryManagement.tsx
import { useState, useEffect } from "react";
import axios from "axios";

interface CategoryData {
  question: string;
  answer: string;
}

const CategoryManagement = () => {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([
    { question: "", answer: "" },
    { question: "", answer: "" },
    { question: "", answer: "" },
    { question: "", answer: "" },
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing category data on component mount
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        // Log to check if the fetch function is called
        console.log("Fetching category data...");
        const response = await axios.get("/api/about-category");

        // Log the response to see what is being returned
        console.log("API Response:", response);

        // Check if response contains the expected data
        if (response.data && Array.isArray(response.data.categories)) {
          setCategoryData(response.data.categories);
        } else {
          console.warn("API response does not contain 'categories':", response.data);
          setCategoryData([
            { question: "", answer: "" },
            { question: "", answer: "" },
            { question: "", answer: "" },
            { question: "", answer: "" },
          ]); // Set to default state if data is not in the expected format
        }
      } catch (error) {
        console.error("Error fetching Category Questions/Answers:", error);
        setError("Failed to load Category Questions/Answers.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, []);

  const handleCategorySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await axios.post("/api/about-category", { categories: categoryData });
      alert("Category Questions/Answers updated successfully!");
    } catch (error) {
      console.error("Error updating Category Questions/Answers:", error);
      alert("Failed to update Category Questions/Answers.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <form onSubmit={handleCategorySubmit} className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Category Questions/Answers</h2>
      {categoryData.map((category, index) => (
        <div key={index} className="mb-6">
          <label className="block font-medium mb-2" htmlFor={`question-${index}`}>
            Question {index + 1}
          </label>
          <input
            type="text"
            id={`question-${index}`}
            value={category.question}
            onChange={(e) => {
              const newCategories = [...categoryData];
              newCategories[index].question = e.target.value;
              setCategoryData(newCategories);
            }}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
          <label className="block font-medium mt-3 mb-2" htmlFor={`answer-${index}`}>
            Answer
          </label>
          <textarea
            id={`answer-${index}`}
            value={category.answer}
            onChange={(e) => {
              const newCategories = [...categoryData];
              newCategories[index].answer = e.target.value;
              setCategoryData(newCategories);
            }}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            rows={3}
            required
          ></textarea>
        </div>
      ))}
      <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">
        Save Category Questions/Answers
      </button>
    </form>
  );
};

export default CategoryManagement;
