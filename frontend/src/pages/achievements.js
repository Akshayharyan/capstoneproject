// src/pages/Achievements.js
import React from "react";

const Achievements = () => {
  const badges = [
    {
      title: "Python Master",
      desc: "Mastered Python",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBiMxvqsnTV9BeBNNyTiok4epZoXm3hS8y6nUMB3BQwQ2f5G3_nGogSdXhJFUIbI2ZbLgNg9f7LHhv9ry2a83N9KnVVHhCBWGe2hpAsu8pLuTpJlHe2sAWzW-m5jYpSxuvyAZQ4L_rjNxwCAyaOqCeoFJsQva2kHR8ckgBsLU9XG-PqrltKgMhPt7SJRwFEAzuaaLjjBS6qI-gS95lP8Y6uQ565KacV5MrJ4k7gjioZ6YmtKp2it71W6HgIefsXqA6g9BpaxPk0IwE",
    },
    {
      title: "SQL Expert",
      desc: "Became an expert in SQL",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0LtDSKq7KqK1LHT7MSop0DZr8hTtRxAETezZZqamx4PBElQHBCFWwbiioacsJECYl5EvFDh52CTJBHO7Z7H1Ipg-XTkCdbogKtZ-RwDv3SHtDh-1lLcUSC6tSxgMSqYvL76epw3jcD5r4gKfTp5rwAbUsGXxIW0IDcOPb2tk4NTnOMjWc69s__U58NaPe3kii-6gsGpY4S_EBuGS6RBtiUKSrZQrgmy1j-PxXOM4pAnb2GSBYWKq09KN4Ce5Efnb9BopqKtdEkcQ",
    },
    {
      title: "Data Analyst Pro",
      desc: "Advanced data analysis",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDp89IvhHI1VmEHKTBT3qCRLP-h9fO8gdNJoAUQ1XQ-UOblogkkuZR9quz3e0iCRwO6FSya0fnVsGORVzGFbkc2F7z5kLK5xwdpUDYU1dFv9Fd-Ujp_QFoU7Aqgh8spQziV3PI6ihlju7CIYH4Faj91A0EcYik5lkymz5dQjvfTFb2SaAaOMwUCHv9fhs6C34IawnbFws5349HvKzQX0sD-U2c0FgsDEf6AvN716VoHAQUYAQ6UAyFKmhBZMT7DB8I8vdk54xM8VUE",
    },
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark px-6 pt-6 pb-12">
      <div className="mb-8 md:mb-12">
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
          Achievements
        </h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Unlock new badges by completing courses and challenges.
        </p>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
        {badges.map((badge, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center group"
          >
            <div className="relative w-full aspect-square p-2 rounded-xl bg-gray-200/50 dark:bg-gray-800/50 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/20">
              <div
                className="w-full h-full bg-center bg-no-repeat bg-contain rounded-lg"
                style={{ backgroundImage: `url(${badge.img})` }}
              />
            </div>
            <h3 className="mt-4 font-bold text-base text-gray-900 dark:text-white">
              {badge.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {badge.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
