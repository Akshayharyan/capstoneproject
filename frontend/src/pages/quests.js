// src/pages/Quests.js
import React from "react";

const quests = [
  {
    id: 1,
    title: "Introduction to Company Culture",
    difficulty: "Beginner",
    status: "Completed",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCEYKjxBjqki3B1nduHAhkK5a6XYOrI_CZNyvGqtUiFak5KSCudPAdMugaz5dcNd0ZtADD9T0r57Uda66Rqb0DdkcBNLj25gVk_vS27X4_saJ2o_xVPfi3nDerbSIfDyD0FWZSP3dumdgX-g8UKR8QitRVo3S_D_lyNA1AIg0l5zolPRDlLJzHojy7ciG2guSu7fStPrFPivQgDqzTDNGcOoTzyUt8u6Ht0DwGnLGBYoXSX7n5-6rLhbNwTo-BYSHg2V2BgoUeKWqA",
  },
  {
    id: 2,
    title: "Mastering Communication Skills",
    difficulty: "Intermediate",
    status: "In Progress",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCKGAns_CO1EAK_Vj2h01KJrX5KNJniYBgzMueUsHB7ykmHuoUJZO94c_TFxKMXBcH2Q83DgcVEBBkNAWrTU2q49hqQ8iimGgR561o3NNAXZ-JFhUAMUzLtLAbhwWrf7puqhKGpCmYAlVH6si08MDsAYK_mm6yvwx7QB19FmQZ_5-qi327D3MgRWMaBgJfyPlU_Eovo02pYpFXStqjYgF228TYGiLuq_BsjNBFL6W4N6Sdjt2MPHDD33ZQpZxymCdO-ZZlueaBsTqg",
  },
  {
    id: 3,
    title: "Project Management Essentials",
    difficulty: "Intermediate",
    status: "Locked",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDp3lMprYxj_PJmAay17TzRTfmY4PCCqYMWc3bgyIevlgkEMVLq7bqCg2YIX2iJUQmUpEneT53nfsaKE0yC8oiF3E_dixPvh6Mrtcghva7mZ5eqO2IdqEz9ss7oIwA-TdpDpNaG20cvMy97ubC019cymS3Goyh8hXtwyMBzV9R84CNDzfxpdxPpFv1vYesZDYNmJlXtwIPyAWYVFy4kvlGLAbpJtZ1WyCpFCiX4Mf1Bqeny0G8U_fr4HDhrw0JCJfSj15WYUBuOPm8",
  },
  {
    id: 4,
    title: "Advanced Problem Solving",
    difficulty: "Advanced",
    status: "Locked",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDufB_en7Pljm6D2gypz6Q-nU-_3sVozPeWodmwlmj_MokhBhPOwnBx2tf7Oru3V_trDP09KKj2OGF6OQL_dV4LXnaASCdWzOvSs8s9XmafgXr6Fn65tiqZAKVShfpfwxqyPfXIyxFUsFm9AHDAlh7F2WiEp8nURAtErNNpq7jPkGMQ6xS1MhohQNjVOkVnktzIbsuqYdJdQ_e5Q6b_5bOxLA6XKElstknPS34LA1V8Ju4h7uWB101B_7Dn3v17npdsclkOIlil2Uo",
  },
];

const statusStyles = {
  Completed: {
    badge: "bg-neon-green/10 text-neon-green ring-neon-green/20",
    button: "bg-neon-green/20 text-neon-green hover:bg-neon-green/30",
    label: "Review Quest",
  },
  "In Progress": {
    badge: "bg-energetic-purple/10 text-energetic-purple ring-energetic-purple/20",
    button:
      "bg-energetic-purple text-white shadow-md hover:bg-energetic-purple/90",
    label: "Continue Quest",
  },
  Locked: {
    badge: "bg-subtle-gray/10 text-subtle-gray ring-subtle-gray/20",
    button:
      "bg-gray-800 text-gray-500 cursor-not-allowed",
    label: "Locked",
  },
};

const QuestCard = ({ quest }) => {
  const styles = statusStyles[quest.status];

  return (
    <div className="group flex flex-col rounded-xl overflow-hidden bg-[#1e293b] shadow-md hover:shadow-lg transition-all">
      {/* Image */}
      <div className="relative">
        <img
          src={quest.image}
          alt={quest.title}
          className="aspect-video w-full object-cover"
        />
        {/* Badge */}
        <div
          className={`absolute top-2 right-2 flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold ring-1 ring-inset ${styles.badge}`}
        >
          {quest.status}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-sm text-gray-400">Difficulty: {quest.difficulty}</p>
        <h3 className="mt-1 font-bold text-lg text-white flex-1">
          {quest.title}
        </h3>
        <button
          disabled={quest.status === "Locked"}
          className={`mt-4 rounded-md px-4 py-2 text-sm font-bold transition ${styles.button}`}
        >
          {styles.label}
        </button>
      </div>
    </div>
  );
};

const Quests = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h2 className="text-3xl font-bold">Your Learning Journey</h2>
          <p className="mt-2 text-lg text-gray-400">
            Embark on quests to master new skills and level up your career.
          </p>
        </header>

        {/* Quest Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {quests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quests;
