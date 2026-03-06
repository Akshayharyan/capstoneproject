import { useEffect, useState } from "react";

export default function BossIntro({ bossName, onFinish }) {

const [phase, setPhase] = useState(0);

useEffect(() => {

const delay = (ms) => new Promise(res => setTimeout(res, ms));

const sequence = async () => {

  await delay(1000);
  setPhase(1);

  await delay(1500);
  setPhase(2);

  await delay(1500);
  onFinish();

};

sequence();

}, [onFinish]);

return (

<div className="fixed inset-0 bg-black flex items-center justify-center z-50">

  {phase === 0 && (
    <h1 className="text-red-600 text-4xl font-bold animate-pulse">
      ⚡ WARNING ⚡
    </h1>
  )}

  {phase === 1 && (
    <h1 className="text-white text-5xl font-bold">
      A Powerful Enemy Appears...
    </h1>
  )}

  {phase === 2 && (
    <div className="text-center">
      <h1 className="text-red-500 text-6xl font-extrabold animate-bounce">
        {bossName}
      </h1>

      <p className="text-gray-300 text-xl mt-4">
        THE CODE GUARDIAN
      </p>
    </div>
  )}

</div>

);

}