export function playerAttack(bossHp){

const damage = Math.floor(Math.random()*30)+20

return {
damage,
newHp: Math.max(bossHp-damage,0)
}

}