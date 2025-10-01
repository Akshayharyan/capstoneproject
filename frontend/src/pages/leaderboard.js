// src/pages/Leaderboard.js
import React from "react";

const leaderboardData = [
  {
    rank: 1,
    name: "Sophia Carter",
    points: 1500,
    badges: 5,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCQYJ1sngN1ZEbfNZXlKtvk3g6mv1eX6a3dFMygynN_0lIyfFumT-ipJYnTnXW5xg8dzWqQSDYzuEudk8_oXj8q4AqYGZXZsqyuP0XtRwkFuuz25ct-G8ItTYo4jmrUJkGYW8SKAS9iFQKipvcrsAeUzTg13zNGQsjBe0vt-nsc9JwyD2YN4nEc4Z_7UFKSUtmeykKGLxqkqaAOUSs0KdVDyOfon9c6y5XGvzEQZxLR2DRc0hfc9U48AsyFL2N7RB2ZBs6fZJvHJxA",
  },
  {
    rank: 2,
    name: "Ethan Bennett",
    points: 1450,
    badges: 4,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCQYJ1sngN1ZEbfNZXlKtvk3g6mv1eX6a3dFMygynN_0lIyfFumT-ipJYnTnXW5xg8dzWqQSDYzuEudk8_oXj8q4AqYGZXZsqyuP0XtRwkFuuz25ct-G8ItTYo4jmrUJkGYW8SKAS9iFQKipvcrsAeUzTg13zNGQsjBe0vt-nsc9JwyD2YN4nEc4Z_7UFKSUtmeykKGLxqkqaAOUSs0KdVDyOfon9c6y5XGvzEQZxLR2DRc0hfc9U48AsyFL2N7RB2ZBs6fZJvHJxA",
  },
  {
    rank: 3,
    name: "Olivia Hayes",
    points: 1400,
    badges: 4,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCQYJ1sngN1ZEbfNZXlKtvk3g6mv1eX6a3dFMygynN_0lIyfFumT-ipJYnTnXW5xg8dzWqQSDYzuEudk8_oXj8q4AqYGZXZsqyuP0XtRwkFuuz25ct-G8ItTYo4jmrUJkGYW8SKAS9iFQKipvcrsAeUzTg13zNGQsjBe0vt-nsc9JwyD2YN4nEc4Z_7UFKSUtmeykKGLxqkqaAOUSs0KdVDyOfon9c6y5XGvzEQZxLR2DRc0hfc9U48AsyFL2N7RB2ZBs6fZJvHJxA",
  },
  {
    rank: 4,
    name: "Liam Foster",
    points: 1350,
    badges: 3,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCQYJ1sngN1ZEbfNZXlKtvk3g6mv1eX6a3dFMygynN_0lIyfFumT-ipJYnTnXW5xg8dzWqQSDYzuEudk8_oXj8q4AqYGZXZsqyuP0XtRwkFuuz25ct-G8ItTYo4jmrUJkGYW8SKAS9iFQKipvcrsAeUzTg13zNGQsjBe0vt-nsc9JwyD2YN4nEc4Z_7UFKSUtmeykKGLxqkqaAOUSs0KdVDyOfon9c6y5XGvzEQZxLR2DRc0hfc9U48AsyFL2N7RB2ZBs6fZJvHJxA",
  },
  {
    rank: 5,
    name: "Ava Morgan",
    points: 1300,
    badges: 3,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCQYJ1sngN1ZEbfNZXlKtvk3g6mv1eX6a3dFMygynN_0lIyfFumT-ipJYnTnXW5xg8dzWqQSDYzuEudk8_oXj8q4AqYGZXZsqyuP0XtRwkFuuz25ct-G8ItTYo4jmrUJkGYW8SKAS9iFQKipvcrsAeUzTg13zNGQsjBe0vt-nsc9JwyD2YN4nEc4Z_7UFKSUtmeykKGLxqkqaAOUSs0KdVDyOfon9c6y5XGvzEQZxLR2DRc0hfc9U48AsyFL2N7RB2ZBs6fZJvHJxA",
  },
];

const trophyColors = {
  1: "text-yellow-400",
  2: "text-gray-400",
  3: "text-purple-400",
};

const LeaderboardRow = ({ player }) => {
  return (
    <tr
      className={`${
        player.rank === 1
          ? "bg-primary-accent/20 dark:bg-primary-accent/10"
          : ""
      }`}
    >
      <td className="py-5 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
        {player.rank}
      </td>
      <td className="px-3 py-5 text-sm">
        <div className="flex items-center gap-4">
          <img
            src={player.image}
            alt={player.name}
            className="h-10 w-10 rounded-full"
          />
          <div className="font-medium text-gray-900 dark:text-white">
            {player.name}
          </div>
        </div>
      </td>
      <td className="px-3 py-5 text-sm font-semibold text-primary">
        {player.points}
      </td>
      <td className="px-3 py-5 text-sm text-text-light dark:text-text-dark">
        {player.badges}
      </td>
      <td className="py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        {player.rank <= 3 && (
          <span
            className={`material-symbols-outlined ${trophyColors[player.rank]}`}
          >
            military_tech
          </span>
        )}
      </td>
    </tr>
  );
};

const Leaderboard = () => {
  return (
   <div className="min-h-screen bg-background-light dark:bg-background-dark px-6 pt-4 pb-12">

      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Leaderboard
          </h1>
          <p className="mt-2 text-base text-text-light dark:text-text-dark">
            See who's at the top of their game!
          </p>
        </header>

        <div className="overflow-hidden rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-gray-900">
          <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6 w-1/12">
                  Rank
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white w-4/12">
                  Name
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white w-3/12">
                  Points
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white w-2/12">
                  Badges
                </th>
                <th className="py-3.5 pl-3 pr-4 sm:pr-6 w-2/12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {leaderboardData.map((player) => (
                <LeaderboardRow key={player.rank} player={player} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
