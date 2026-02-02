const AchievementCard = ({ achievement }) => {
  return (
    <div className="rounded-2xl p-5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
      <div className="text-4xl mb-2">{achievement.icon}</div>
      <h3 className="font-bold text-lg">{achievement.title}</h3>
      <p className="text-sm opacity-90">{achievement.description}</p>
    </div>
  );
};

export default AchievementCard;
