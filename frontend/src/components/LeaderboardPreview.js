import React from "react";

export default function LeaderboardPreview() {
  const leaderboard = [
    { rank: 1, name: "Akshay", points: 1500, avatar: "https://i.pravatar.cc/40?img=11" },
    { rank: 2, name: "Anand", points: 1200, avatar: "https://i.pravatar.cc/40?img=6" },
    { rank: 3, name: "Mayuresh", points: 1000, avatar: "https://i.pravatar.cc/40?img=7" },
  ];

  return (
    <section id="leaderboard-preview" className="py-20 md:py-28 bg-gray-900 text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Leaderboard Preview</h2>

        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-700 text-gray-300">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4 text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((player, index) => (
                <tr
                  key={index}
                  className={`${
                    player.rank === 1
                      ? "bg-yellow-900/30"
                      : player.rank === 2
                      ? "bg-blue-900/30"
                      : player.rank === 3
                      ? "bg-red-900/30"
                      : "bg-gray-800"
                  } border-b border-gray-700`}
                >
                  <td className="py-4 px-4 font-bold text-yellow-400">{player.rank}</td>
                  <td className="py-4 px-4 flex items-center space-x-3">
                    <img src={player.avatar} alt={player.name} className="w-8 h-8 rounded-full" />
                    <span className="font-medium">{player.name}</span>
                  </td>
                  <td className="py-4 px-4 text-right font-medium">{player.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
