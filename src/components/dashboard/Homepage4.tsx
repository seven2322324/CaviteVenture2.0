import React, { useState } from 'react';

const faqs = [
  { question: "When is the Museum open?", answer: "The Museum is open from 9:00 AM to 5:00 PM every day." },
  { question: "Do I have to pay the full price for admission?", answer: "No, there are discounts available for students, seniors, and children." },
  { question: "How much is admission to the Museum?", answer: "General admission is $20 for adults, $10 for children under 12, and free for members." },
  { question: "Is there a time when admission is reduced?", answer: "Yes, reduced admission is available on Mondays from 3:00 PM to 5:00 PM." },
  { question: "Can anyone bypass the Admissions line?", answer: "Museum members and those with pre-purchased tickets can bypass the admissions line." },
  { question: "When is the Museum Shop open?", answer: "The Museum Shop is open during Museum hours, from 9:00 AM to 5:00 PM." },
];

const Homepage4 = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null); // Ensure state can be number or null

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index); // Toggle between open and close
  };

  return (
    <section className="bg-[#f8f8f8] p-10">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>
      <hr className="border-t-2 border-gray-300 mb-6" />

      {/* FAQ Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {faqs.map((faq, index: number) => (
          <div key={index} className="border-b-2 border-gray-300 py-4">
            <div
              onClick={() => toggleFAQ(index)}
              className="flex justify-between items-center cursor-pointer"
            >
              <h2 className="text-lg font-medium">{faq.question}</h2>
              <span>{openFAQ === index ? "▲" : "▼"}</span>
            </div>
            {openFAQ === index && (
              <p className="mt-2 text-gray-600">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Homepage4;
