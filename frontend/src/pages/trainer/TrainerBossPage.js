import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const defaultBoss = {
  name: "",
  theme: "shadow",
  image: "",
  maxHp: 300,
  baseAttackPower: 25,
  xpReward: 300,
  phaseConfig: {
    phase2Threshold: 70,
    phase3Threshold: 30
  },
  signatureChallenges: []
};

export default function TrainerBossPage() {
  const { moduleId } = useParams();
  const { token } = useAuth();

  const [boss, setBoss] = useState(defaultBoss);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ================= LOAD BOSS ================= */

  useEffect(() => {
    const loadBoss = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/trainer/boss/module/${moduleId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!res.ok) {
          setLoading(false);
          return;
        }

        const data = await res.json();
        console.log("Load response:", data);

        if (data.success && data.boss) {
          setBoss({
            ...defaultBoss,
            ...data.boss,
            phaseConfig: {
              ...defaultBoss.phaseConfig,
              ...(data.boss.phaseConfig || {})
            }
          });
        }
      } catch (err) {
        console.error("Load boss error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBoss();
  }, [moduleId, token]);

  /* ================= SAVE BOSS ================= */

  const saveBoss = async () => {
    setSaving(true);

    try {
      let res;

      if (boss._id) {
        res = await fetch(
          `http://localhost:5000/api/trainer/boss/${boss._id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(boss)
          }
        );
      } else {
        res = await fetch(
          `http://localhost:5000/api/trainer/boss`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              ...boss,
              moduleId
            })
          }
        );
      }

      const data = await res.json();
      console.log("Save response:", data);

      if (res.ok && data.success) {
        setBoss({
          ...defaultBoss,
          ...data.boss,
          phaseConfig: {
            ...defaultBoss.phaseConfig,
            ...(data.boss.phaseConfig || {})
          }
        });

        alert("Boss saved successfully ⚔");
      } else {
        alert(data.message || "Save failed");
      }

    } catch (err) {
      console.error("Save error:", err);
      alert("Server error");
    }

    setSaving(false);
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-lg">
        Loading Boss...
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black text-white px-8 py-16">

      <div className="max-w-6xl mx-auto space-y-12">

        {/* HEADER */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-extrabold tracking-wide">
            ⚔ Boss Command Center
          </h1>
          <p className="text-gray-400">
            Design the final boss encounter for this module.
          </p>
        </div>

        {/* BOSS PREVIEW */}
        <div className="bg-gradient-to-br from-indigo-600/30 to-purple-700/20 p-8 rounded-3xl border border-indigo-500/30 shadow-xl backdrop-blur">

          <div className="flex items-center gap-10">

            <div className="w-40 h-40 rounded-2xl bg-black/40 flex items-center justify-center text-5xl border border-indigo-500">
              👹
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold">
                {boss.name || "Unnamed Boss"}
              </h2>

              <p className="text-indigo-300 capitalize">
                Theme: {boss.theme}
              </p>

              <p className="text-gray-400">
                HP: {boss.maxHp} | Attack: {boss.baseAttackPower}
              </p>

            </div>

          </div>
        </div>

        {/* CONFIG PANELS */}
        <div className="grid md:grid-cols-2 gap-10">

          {/* BASIC CONFIG */}
          <div className="bg-black/40 p-8 rounded-2xl border border-gray-700 space-y-5">

            <h3 className="text-xl font-semibold text-indigo-400">
              Basic Configuration
            </h3>

            <input
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl"
              placeholder="Boss Name"
              value={boss.name}
              onChange={(e) =>
                setBoss({ ...boss, name: e.target.value })
              }
            />

            <input
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl"
              placeholder="Theme"
              value={boss.theme}
              onChange={(e) =>
                setBoss({ ...boss, theme: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-4">

              <input
                type="number"
                className="p-3 bg-gray-800 border border-gray-600 rounded-xl"
                placeholder="Max HP"
                value={boss.maxHp}
                onChange={(e) =>
                  setBoss({ ...boss, maxHp: Number(e.target.value) })
                }
              />

              <input
                type="number"
                className="p-3 bg-gray-800 border border-gray-600 rounded-xl"
                placeholder="Attack Power"
                value={boss.baseAttackPower}
                onChange={(e) =>
                  setBoss({
                    ...boss,
                    baseAttackPower: Number(e.target.value)
                  })
                }
              />

            </div>

          </div>

          {/* PHASE CONFIG */}
          <div className="bg-black/40 p-8 rounded-2xl border border-gray-700 space-y-5">

            <h3 className="text-xl font-semibold text-purple-400">
              Phase Mechanics
            </h3>

            <div className="grid grid-cols-2 gap-4">

              <input
                type="number"
                className="p-3 bg-gray-800 border border-gray-600 rounded-xl"
                placeholder="Phase 2 Threshold (%)"
                value={boss.phaseConfig?.phase2Threshold || 70}
                onChange={(e) =>
                  setBoss({
                    ...boss,
                    phaseConfig: {
                      ...boss.phaseConfig,
                      phase2Threshold: Number(e.target.value)
                    }
                  })
                }
              />

              <input
                type="number"
                className="p-3 bg-gray-800 border border-gray-600 rounded-xl"
                placeholder="Phase 3 Threshold (%)"
                value={boss.phaseConfig?.phase3Threshold || 30}
                onChange={(e) =>
                  setBoss({
                    ...boss,
                    phaseConfig: {
                      ...boss.phaseConfig,
                      phase3Threshold: Number(e.target.value)
                    }
                  })
                }
              />

            </div>

          </div>

        </div>

        {/* SAVE BUTTON */}
        <div className="text-center pt-8">
          <button
            onClick={saveBoss}
            disabled={saving}
            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-700 hover:scale-105 transition-transform font-bold text-lg shadow-lg disabled:opacity-50"
          >
            {saving ? "Saving..." : "💾 Save Boss Configuration"}
          </button>
        </div>

      </div>

    </div>
  );
}