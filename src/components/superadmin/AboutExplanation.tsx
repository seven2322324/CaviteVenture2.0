import { useState, useEffect } from 'react';

interface AboutData {
  title: string;
  description: string;
  images: { url: string; alt: string }[];
}

const AboutExplanation = () => {
  const [aboutData, setAboutData] = useState<AboutData>({
    title: '',
    description: '',
    images: [
      { url: '', alt: 'Binakayan' },
      { url: '', alt: 'Cavite City' },
      { url: '', alt: 'Rosario' },
      { url: '', alt: 'Zapote' },
    ],
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
  const [descriptionFeedback, setDescriptionFeedback] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/about-explanation');
        const data = await response.json();
        setAboutData(data);
        analyzeDescription(data.description);
        generateTitleSuggestions(data.title);
      } catch (error) {
        console.error('Error fetching About Explanation:', error);
        setError('Failed to load About Explanation.');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  // Simple logic for generating title suggestions
  const generateTitleSuggestions = (currentTitle: string) => {
    const suggestions = [
      `${currentTitle} - Overview`,
      `${currentTitle} - Introduction`,
      `Learn More About ${currentTitle}`,
    ];
    setTitleSuggestions(suggestions);
  };

  // Simple image URL validation (checks for basic file extensions)
  const validateImageUrl = (url: string): boolean => {
    return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/.test(url);
  };

  // Simple description analysis logic
  const analyzeDescription = (description: string) => {
    if (description.length < 50) {
      setDescriptionFeedback('Description is too short. Consider adding more details.');
    } else if (description.length > 1000) {
      setDescriptionFeedback('Description is too long. Consider shortening it.');
    } else {
      setDescriptionFeedback(null);
    }
  };

  // Handle form submission
  const handleAboutSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate images
    for (const image of aboutData.images) {
      if (!validateImageUrl(image.url)) {
        alert(`Invalid image URL: ${image.url}. Please provide a valid image URL.`);
        return;
      }
    }

    // Check description feedback
    if (descriptionFeedback) {
      if (!window.confirm('Description feedback detected: ' + descriptionFeedback + '. Do you want to proceed?')) {
        return;
      }
    }

    try {
      const response = await fetch('/api/about-explanation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutData),
      });

      if (response.ok) {
        alert('About Explanation updated successfully!');
      } else {
        alert('Failed to update About Explanation.');
      }
    } catch (error) {
      console.error('Error updating About Explanation:', error);
      alert('Failed to update About Explanation.');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <form onSubmit={handleAboutSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">About Explanation</h2>

      <div>
        <label className="block text-lg font-medium mb-2">Title</label>
        <input
          type="text"
          value={aboutData.title}
          onChange={(e) => {
            setAboutData({ ...aboutData, title: e.target.value });
            generateTitleSuggestions(e.target.value);
          }}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          required
        />
        {titleSuggestions.length > 0 && (
          <div className="mt-2 text-sm text-gray-600">
            <p>Suggestions:</p>
            <ul className="list-disc list-inside">
              {titleSuggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        <label className="block text-lg font-medium mb-2">Description</label>
        <textarea
          value={aboutData.description}
          onChange={(e) => {
            setAboutData({ ...aboutData, description: e.target.value });
            analyzeDescription(e.target.value);
          }}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          rows={5}
          required
        ></textarea>
        {descriptionFeedback && (
          <p className="text-sm text-red-500 mt-2">{descriptionFeedback}</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Images</h3>
        {aboutData.images.map((image, index) => (
          <div key={index} className="mb-4">
            <label className="block font-medium mb-1">Image {index + 1} URL</label>
            <input
              type="text"
              value={image.url}
              onChange={(e) => {
                const newImages = [...aboutData.images];
                newImages[index].url = e.target.value;
                setAboutData({ ...aboutData, images: newImages });
              }}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              required
            />
            <label className="block font-medium mt-2 mb-1">Alt Text</label>
            <input
              type="text"
              value={image.alt}
              onChange={(e) => {
                const newImages = [...aboutData.images];
                newImages[index].alt = e.target.value;
                setAboutData({ ...aboutData, images: newImages });
              }}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
        ))}
      </div>

      <button type="submit" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition">
        Save About Explanation
      </button>
    </form>
  );
};

export default AboutExplanation;
