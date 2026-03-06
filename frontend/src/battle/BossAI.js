export function bossAbility() {

const abilities = [

{
  name: "⚔ Slash Attack",
  damage: 12
},

{
  name: "⚡ Syntax Storm",
  damage: 18
},

{
  name: "💀 Infinite Loop",
  damage: 25
}

];

return abilities[Math.floor(Math.random() * abilities.length)];

}