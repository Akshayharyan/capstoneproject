import React, { useEffect, useMemo, useState } from "react";
import { Trophy, Users, Target, Medal, Search, Filter, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const accentFont = { fontFamily: "'Space Grotesk','Clash Display','Segoe UI',sans-serif" };

const podiumGradients = [
  "from-amber-100 via-white to-yellow-50",
  "from-slate-50 via-white to-indigo-50",
  "from-rose-100 via-white to-orange-50",
];

const filterOptions = [
  { id: "all", label: "All Players" },
  { id: "active", label: "Active this week" },
  { id: "veterans", label: "Level 10+" },
];

const getAvatarUrl = (player) => {
  if (player?.avatar) return player.avatar;
  const initials = encodeURIComponent(player?.name || "Player");
  return `https://ui-avatars.com/api/?background=E0E7FF&color=312E81&name=${initials}`;
};

const formatRelativeTime = (value) => {
  if (!value) return "No recent activity";
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "No recent activity";

  const diff = Date.now() - timestamp;
  if (diff < 0) return "Just now";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} mo ago`;
  const years = Math.floor(months / 12);
  return `${years} yr${years > 1 ? "s" : ""} ago`;
};

const StatTile = ({ icon, label, value, detail }) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="rounded-2xl bg-slate-50 p-3 text-indigo-600">{icon}</div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-black text-slate-900" style={accentFont}>{value}</p>
        <p className="text-xs text-emerald-600 font-medium">{detail}</p>
      </div>
    </div>
  </div>
);

const PodiumCard = ({ player, tone }) => {
  const joinedLabel = player.joinedAt
    ? new Date(player.joinedAt).toLocaleDateString()
    : "—";

  return (
    <div className={`relative rounded-3xl border border-white/70 bg-gradient-to-br ${tone} p-[1px] shadow-lg`}>
    <div className="rounded-[calc(1.5rem-2px)] bg-white/80 backdrop-blur px-6 py-6 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
        <span>Rank #{player.rank}</span>
        <span>Lvl {player.level}</span>
      </div>
      <div className="flex items-center gap-4">
        <img
          src={getAvatarUrl(player)}
          alt={player.name}
          className="h-16 w-16 rounded-2xl object-cover border border-white"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = getAvatarUrl({});
          }}
        />
        <div>
          <p className="text-xl font-black text-slate-900" style={accentFont}>{player.name}</p>
          <p className="text-sm text-slate-500">Joined {joinedLabel}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">XP</p>
          <p className="text-3xl font-black text-slate-900" style={accentFont}>{(player.xp || 0).toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Badges</p>
          <p className="text-2xl font-black text-slate-900">{player.badges}</p>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-600">
        <span className="rounded-xl bg-white px-3 py-1 font-semibold text-slate-700">{player.modulesCompleted} modules</span>
        <span>Last active {formatRelativeTime(player.lastActive)}</span>
      </div>
    </div>
  </div>
  );
};

const LeaderboardRow = ({ player, maxXP }) => {
  const rank = player.rank ?? 0;
  const xp = player.xp || 0;
  const progressWidth = Math.max(8, Math.round((xp / maxXP) * 100));

  return (
    <div className="grid grid-cols-[auto,1fr,auto] items-center gap-6 rounded-2xl border border-slate-100 bg-white px-6 py-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="text-2xl font-black text-slate-300" style={accentFont}>{String(rank).padStart(2, "0")}</div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={getAvatarUrl(player)}
            alt={player.name}
            className="h-14 w-14 rounded-2xl object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = getAvatarUrl({});
            }}
          />
          <span className="absolute -bottom-1 -right-1 rounded-full bg-indigo-600 px-2 py-[2px] text-[10px] font-semibold text-white">
            {player.badges}★
          </span>
        </div>
        <div className="flex-1">
          <p className="text-lg font-semibold text-slate-900" style={accentFont}>{player.name}</p>
          <p className="text-sm text-slate-500">Lvl {player.level} • {player.modulesCompleted} modules</p>
          <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">XP</p>
        <p className="text-2xl font-bold text-slate-900" style={accentFont}>{xp.toLocaleString()}</p>
        <p className="text-xs text-slate-500">Last active {formatRelativeTime(player.lastActive)}</p>
      </div>
    </div>
  );
};

const LoadingState = () => (
  <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center text-slate-500 shadow-sm">
    Loading leaderboard…
  </div>
);

const EmptyState = () => (
  <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-slate-500">
    No competitors yet. Invite your team to start earning XP!
  </div>
);

const ErrorState = ({ message }) => (
  <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
    {message}
  </div>
);

const FilterPill = ({ active, label, onClick }) => (
  <button
    onClick={onClick}
    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
      active
        ? "border-indigo-500 bg-indigo-600 text-white shadow"
        : "border-slate-200 text-slate-600 hover:border-slate-400"
    }`}
  >
    {label}
  </button>
);

const Leaderboard = () => {
  const { token } = useAuth();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    let ignore = false;

    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/leaderboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Unable to load leaderboard");
        if (!ignore) {
          setPlayers(Array.isArray(data.leaderboard) ? data.leaderboard : []);
          setError("");
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Unable to load leaderboard");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    if (token) {
      loadLeaderboard();
    } else {
      setPlayers([]);
      setLoading(false);
    }

    return () => {
      ignore = true;
    };
  }, [token]);

  const filteredPlayers = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    return players.filter((player) => {
      const matchesSearch = player?.name?.toLowerCase().includes(normalizedSearch);
      if (!matchesSearch) return false;

      if (selectedFilter === "active") {
        const last = player.lastActive ? new Date(player.lastActive).getTime() : 0;
        if (!last) return false;
        return now - last <= sevenDays;
      }

      if (selectedFilter === "veterans") {
        return (player.level || 0) >= 10;
      }

      return true;
    });
  }, [players, searchTerm, selectedFilter]);

  const summary = useMemo(() => {
    if (!players.length) {
      return { totalXP: 0, averageXP: 0, modulesCompleted: 0, badgeCount: 0 };
    }

    const totalXP = players.reduce((sum, player) => sum + (player.xp || 0), 0);
    const modulesCompleted = players.reduce(
      (sum, player) => sum + (player.modulesCompleted || 0),
      0
    );
    const badgeCount = players.reduce((sum, player) => sum + (player.badges || 0), 0);
    const averageXP = Math.round(totalXP / players.length);

    return { totalXP, averageXP, modulesCompleted, badgeCount };
  }, [players]);

  const maxXP = useMemo(() => {
    const source = filteredPlayers.length ? filteredPlayers : players;
    return source.reduce((max, player) => Math.max(max, player.xp || 0), 1);
  }, [filteredPlayers, players]);

  const leaderboardSet = filteredPlayers.length ? filteredPlayers : players;
  const topThree = leaderboardSet.slice(0, 3);
  const challengers = leaderboardSet.slice(3);
  const resultCount = leaderboardSet.length;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -top-16 left-10 h-40 w-40 rounded-full bg-indigo-100 blur-[90px]" />
        <div className="absolute bottom-10 right-5 h-48 w-48 rounded-full bg-amber-100 blur-[110px]" />
      </div>
      <main className="relative mx-auto max-w-6xl px-6 py-12">
        <section className="rounded-3xl border border-slate-100 bg-white shadow-xl p-8 relative overflow-hidden">
          <div className="absolute inset-y-0 right-0 w-1/2 opacity-40 pointer-events-none">
            <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.15),transparent_60%)]" />
          </div>
          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.5em] text-indigo-500">
                <Sparkles className="h-4 w-4" /> Live Standings
              </p>
              <h1 className="mt-3 text-4xl font-black text-slate-900" style={accentFont}>
                Employee Leaderboard
              </h1>
              <p className="mt-2 max-w-xl text-slate-600">
                Compare real XP, badge count, and module completions across all employees. The board refreshes automatically whenever someone levels up.
              </p>
              <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-700 shadow-inner focus:border-indigo-400 focus:outline-none"
                    placeholder="Search teammates or rivals"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  {filterOptions.map((option) => (
                    <FilterPill
                      key={option.id}
                      label={option.label}
                      active={selectedFilter === option.id}
                      onClick={() => setSelectedFilter(option.id)}
                    />
                  ))}
                  <span className="rounded-full border border-dashed border-slate-200 px-4 py-2 text-sm font-semibold text-slate-400">
                    {resultCount} showing
                  </span>
                </div>
              </div>
            </div>
            <div className="grid w-full max-w-md grid-cols-2 gap-4">
              <StatTile icon={<Trophy className="h-5 w-5" />} label="Total XP" value={summary.totalXP.toLocaleString()} detail="All players" />
              <StatTile icon={<Target className="h-5 w-5" />} label="Average XP" value={summary.averageXP.toLocaleString()} detail="Per player" />
              <StatTile icon={<Users className="h-5 w-5" />} label="Modules" value={summary.modulesCompleted} detail="Completed" />
              <StatTile icon={<Medal className="h-5 w-5" />} label="Badges" value={summary.badgeCount} detail="Unlocked" />
            </div>
          </div>
          {error && <div className="mt-6"><ErrorState message={error} /></div>}
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-black text-slate-900" style={accentFont}>Top performers</h2>
          <p className="text-sm text-slate-500">Celebrating the current podium</p>

          {loading ? (
            <div className="mt-6"><LoadingState /></div>
          ) : !leaderboardSet.length ? (
            <div className="mt-6"><EmptyState /></div>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {topThree.map((player, idx) => (
                <PodiumCard key={player.id || player.rank} player={player} tone={podiumGradients[idx] || podiumGradients[0]} />
              ))}
            </div>
          )}
        </section>

        {leaderboardSet.length > 3 && (
          <section className="mt-10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.5em] text-slate-500">Challengers</p>
                <h3 className="text-2xl font-black text-slate-900" style={accentFont}>Ranks 04 — {leaderboardSet.length.toString().padStart(2, "0")}</h3>
              </div>
              <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 hover:border-slate-300">
                <Filter className="h-4 w-4" /> Export Standings
              </button>
            </div>

            <div className="space-y-4">
              {challengers.map((player) => (
                <LeaderboardRow key={player.id || player.rank} player={player} maxXP={maxXP} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Leaderboard;
