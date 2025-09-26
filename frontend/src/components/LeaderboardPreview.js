// src/components/LeaderboardPreview.js
import React from "react";

const entries = [
  { rank: 1, name: "Alex", points: 1500, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkZjYm6fV-1dafvHpjZo7eir74Jd6j6jGcJKGAuFq1wM6gs_ojux0k0u1YogzxWMPj1-TOHsWT1ufh-c12wEsJXKfQPxZcBcKxg5u_Hh006S0te0Thp-yyJ04coK2CAExqd30OQB4W8D0S4jZNhfNqGRKV9xjmvbHRFh44sI2loSM7dULKgo0qF7hwRJjeGm7sKfVyo74mSv3gGE_dlClTPcgr7FsXZ9yzo75GgR5O_jaQIAUI3KvU40lHJ0ehcwRAf5BNDDtbslk" },
  { rank: 2, name: "Jordan", points: 1200, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHuHVvilbX239z6T1Gl-IYFW_sb3NiFjnYLeBhuFGnyFArac_Jf_gwPdiHD7ncM-49bt_dtOH7GVL62NYeSKOP5MwGhsMFw5WsnQBUBUqbPubp7bLlYIHDs7ghsUI2Y1gHhcXdzfayWzZGEyZA25bLaZKLx4hOwCwexNkngfZPRJ8guVjr5zMRna0yaEQSDUl9Q21rpuLYBMk-jS6kFadI5VAcEkQBkP96iLuN7lfckNliJQZJJba0VdVC6OioXieDrYIubxTK4iw" },
  { rank: 3, name: "Taylor", points: 1000, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5zIzRPjn3XrZ1w8WSVOf7OfqfbTQOSY6GvWnFhdpqtFRKe7MCG5I7vKeqxAzZoWmGVZYb654_lXAsstmP_kDxTUuaSAwDcfzS75_kifYH8knaTQO8jzb-mH6_EtOYIvFIT--QCN3dTUXAWl49fyaMl4ymhP45iLLaFsKHwY-3oakPg4DBGV44mdLtd0zwUCe4KjDw9pdrLNBNGCTUI18hT6M3ebh9wsEm59OLDdo5jDPTZ9XdXYN7-D8M4MvOwZdss82OQJvXxwE" },
];

export default function LeaderboardPreview() {
  return (
    <section id="leaderboard" className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Leaderboard Preview</h2>
        </div>

        <div className="max-w-3xl mx-auto overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="grid grid-cols-3 p-4 bg-gray-50 text-sm font-semibold text-gray-600">
            <div>Rank</div>
            <div className="text-left">User</div>
            <div className="text-right">Points</div>
          </div>

          <ul>
            {entries.map((e) => (
              <li key={e.rank} className="grid grid-cols-3 items-center p-4 border-t border-gray-200">
                <div className={`font-bold text-lg ${e.rank === 1 ? "gold-rank" : e.rank === 2 ? "silver-rank" : "bronze-rank"}`}>{e.rank}</div>
                <div className="flex items-center gap-3">
                  <img alt={`${e.name}'s avatar`} className="h-10 w-10 rounded-full" src={e.img} />
                  <span className="font-semibold text-gray-800">{e.name}</span>
                </div>
                <div className="text-right font-semibold text-gray-600">{e.points}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
