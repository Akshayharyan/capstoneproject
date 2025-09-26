// src/components/Features.js
import React from "react";

const cards = [
  { title: "Quests & Levels", text: "Embark on interactive quests and level up your skills with each challenge completed.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9x4XTfzUdGEVLdKxf1m28Er6SVDNKboKQsX2_Cw_MmbgRMJkh8NGi6JQ6MgTSXEG8x_mqkbhhAGfDychlKCz7tIq2VoAzCK3FnhVI7Uba_8jzrsX-VcT2G2VljMRMl95FW9oo_zio_CzOj5NbZBmWiYolrTN20bmcw0MlY7PQnu2NpY_2Spq2vf9o_kjwxaQ2YwOZj_KycYQqwrLBcz0ZEU4-yQdW5LfKiYpGaojT4UzgnZdinOS5pPfbo8AI5cJ7H5Brw-B28xA" },
  { title: "Badges & Achievements", text: "Earn badges for mastering new skills and excelling in challenges.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxhBILRMTvccOKjbM6--n_EFou8LNcEnS2fV5QqjHVDH7PlLTaSc2f6_AbEhv-5QfBzN_a7EgrV49rImnANJw8Osb3jCTgzbYzm9b25SxBz5ylueRTv7Swq2_4sBfhVxNMZAxEZtFnQuseqx0y5GzbbpEo2owPJUAelKieEBxUPiSPzNVaLh4n1lheoN_G-haAYJTutuov7geTI6OFp951ble_nQhR0OH2W_sFPtdFNsyeRZXjNQk1BBd6naRZ80ud-AsPdDPlV9E" },
  { title: "Leaderboards", text: "Compete with your team and climb the leaderboards to showcase your expertise.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWH5QJiPcV8dQrC1CqaSGOwslRAFrd6FDBwktl2-fHTrGUWZL1lrzaHPtX9fKFpfcy4UHmOgn9PV3N5EQdMjlZehde48Al8Y2T-L-ZWL-NYnz_FmbvYmrCAhMLWDKXd7bGOg9kU-KI7U__2ceWi-sAZTEVzHqAO-SaZDSIpjPa8YS_rl25YIo57A5YKVWEsC9vYcL9MSmsC14-W3mU7P30R21OIlkv5hN6lrODeRtcQfMNk64u436mfu3NdxDNlJ9GdD4jFBFXW5I" },
  { title: "Coding Sandbox", text: "Practice coding in a safe environment with real-world scenarios and instant feedback.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqmU2sZt9DgF5B4pZJlim9W0CB39CJ3kfVSWpvrqHBydkEakR98uLHcwvcepthO8CMKoGngI4u1lyXzKmM6UyODxmst0SGrwFiLktWLVpYLqydw0D_pyuEjzrz92Zzv12aBg3IPyTizjcO3hlffZUH7BKJenUY93naHg2ZFRXCUJDlRN2kwbF9XGRsEXIX5h0cZgjkqvoP4hPZjic99r7__ucANAXqeKIvaEmMxwxl0ybjJ__mE1h-cCwMTA7tfvyZgHF8ftsqI9o" },
];

export default function Features() {
  return (
    <section className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Unlock Your Potential</h2>
          <p className="mt-3 max-w-xl mx-auto text-gray-600">Explore the features that make SkillQuest the ultimate training platform.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((c) => (
            <div key={c.title} className="p-6 rounded-xl bg-white border border-gray-200 shadow-lg hover:shadow-lg transition-all transform hover:-translate-y-2">
              <img className="w-full h-40 object-cover rounded-lg mb-4" src={c.img} alt={c.title} />
              <h3 className="text-lg font-bold text-gray-900">{c.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
