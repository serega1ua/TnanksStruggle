 

// create two instances


/* 5.For each class, create TWO INSTANCES - fighter and improvedFighter
 */

 
						/* name, health, power */
var fighter = new Fighter("Хрюшик 1", 5340, 2);
console.dir(fighter);
 
 var fighter1 = new Fighter("Хрюшик 1-1",  1100, 30);
 
									/* name, health, power */
var improvedFighter = new ImprovedFighter("Валюшик 2", 1901, 3);
console.dir(improvedFighter);
 var improvedFighter1 = new ImprovedFighter("Валюшик 2-1", 5, 200);



 
 

// call fight function



 //ставим кол-во аргументов побольше, если много здоровья, чтоб было необходимое колиество оборотов для исчерпания здоровья
fight(fighter, improvedFighter,  20, 8, 2, 20, 1, 77,  20, 4, 77,  20, 5, 77,  5, 420, 77,  20, 20, 77,  20, 20, 77,  20, 20, 77,  20, 20, 77,  20, 20, 77).
then(x => console.log(`
==========
выполнен промис из async function fight: ${x} и он обработан через fight().then` )); 
console.log('Эта синхронная строка из stack исполнения вышла раньше, чем  из асинхронной выйдут промис и колбек setTimeOut и говорит: бой вот-вот закончится, ждем промиса async function fight (он идет из из callback-queque), а потом после него выйдет колбек с результатом из setTimeOut'); 
/* 
This function should start the game and may have different number of parameters. 
For example, fight (fighter, improvedFighter, 25, 13, 45), where point = [25, 13, 45]. 
Players hit each other one by one with method “hit” which takes a point as an argument. 
If one of the players has less health then 0, you print to console that user 
in knockout and call “knockout” method. 
You should wait until promise is resolved and print to console the result of the fight.  
 
  */
 