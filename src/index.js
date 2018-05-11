 import "babel-polyfill"; 

 

/* 1. Create class “Fighter” with such properties as name, health and power. 
These parameters should be set in constructor. */
 
 //  define a class involves the class keyword (ES-2015)
 class Fighter {
  constructor(name, health, power) {
    this.name = name; 
	this.health = health; 
	this.power = power;
	/* this.testMethod = function (){console.log("test")}; */
  }
  
/* 2.Method setDamage has parameter “damage” and this method 
sets damage to fighter via changing health property (health = health - damage) 
and print value health to console. */

   setDamage(damage) {
			   
			   //устанавливаем фильтр условия для первого ввода на случай, если передан нецелый или нецифровой аргумент
			/*  if (Math.floor(Number(damage)) !== damage)  {
			 console.log ("передано не числовое значение damage,  пытаемся его преобразовать");
			 damage = Math.floor(Math.abs(parseFloat(Number(damage))));	  }   
			 if (typeof damage != "number" || isNaN(damage)) {console.log ("введите цифровое значение  damage");return}  */
			 
			  var tempor = this.health;  
			 this.health = this.health - damage;
	 
	 
	 
	 //сообщение в консоль расширенного содержания
     console.log(
	`========
    ${this.name} 	
	нанесен ущерб ${damage},
	до удара здоровье health  = ${tempor} 
	новое здоровье health  = ${this.health} 
========`);
  } /* конец метода setDamage(damage) */
  
  /* 3.Method “hit” has parameters “enemy“, “point” and calls the method of the “enemy.setDamage(damage)”.
 "damage” calculates as point * power, 
  where point is a parameter from function “ fight ” and power is a property of the fighter who makes damage.

   */
  
	hit(enemy, point) {
		let damage_ = point * this.power;  
		console.log(`${this.name} ударил ${enemy.name} на damage ${damage_}`);
		 
		enemy.setDamage(damage_);
		}
   
  
}

  /* Method “ knockout ” returns promise that has been resolved after half second (use setTimeout function inside promise) 
  and prints to console the message “time is over” before promise had been resolved.

   

  */

//добавляю промис в конструктор "старым"  синтаксисом JS 
Fighter.prototype.knockout  = new Promise((resolve, reject) => {

  setTimeout(() => {
    // переведёт промис в состояние fulfilled с результатом "result"
    console.log("time is over"); resolve("!ВЫПОЛНЕН ПРОМИС KNOCKOUT C ЗАДЕРЖКОЙ .5 СЕК.!");
  }, 500);

});

// promise.then навешивает обработчики на успешный результат или ошибку (его не просили навешивать, но делаем для наглядности)
	/* 			Fighter.prototype.knockout.then(
					result => {
					  // первая функция-обработчик - запустится при вызове resolve
					  console.log("Fulfilled: " + result); // result - аргумент resolve
					},
					error => {
					  // вторая функция - запустится при вызове reject
					  console.log("Rejected: " + error); // error - аргумент reject
					}
				  ); */

 

 /* 4.Create class ImprovedFighter that inherits methods and properties from class Fighter. */
class ImprovedFighter extends Fighter {
	
	  constructor(name, health, power) {
      super(name, health, power);}
 
	   doubleHit(enemy, point) {super.hit(enemy, point * 2); }
	   
}


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

 
 /* 
Create async function ”fight” with such parameters as fighter, improvedFighter and points.*/
async function fight (fighter, improvedFighter, ...points) {
	
	 
  console.log(`=========
  Поединок:
  ${fighter.name} с здоровьем ${fighter.health}  
  против 
  ${improvedFighter.name} с здоровьем ${improvedFighter.health}  
==========`);
 
  for (let i = 0; i < points.length; i++) {
 
 	 if (fighter.health < 0) {

	 /* зачем ставим setTimeout: "You should wait until promise is resolved and print to console the result of the fight". */
   setTimeout(function(){

   	 console.log(`==========
	  ${fighter.name} проиграл!
==========`); 
   },1000)

      return fighter.knockout;
	   
       
    }
    fighter.hit(improvedFighter, points[i]);
  if (fighter.health < 0) {
	  
	    setTimeout(function(){
      console.log(`==========
	  ${fighter.name} проиграл!
==========`); 
   
   },1000)
	  
  

 return fighter.knockout;
       
    }
	
	 if (improvedFighter.health < 0) {
		 
		   setTimeout(function(){
    console.log(`========
	  ${improvedFighter.name} проиграл!
=========`);
   
   },1000)
		 
      

 return improvedFighter.knockout;
      
    }
    improvedFighter.doubleHit(fighter, points[i]);    
     	 if (improvedFighter.health < 0) {
			 
			   setTimeout(function(){

       console.log(`========
	  ${improvedFighter.name} проиграл!
=========`);  

   },1000)
			 
     
 return improvedFighter.knockout;
      
    }
     
    
 
  }
  
  return `========
	  не хватило патронов для поединка, сделай в fight аргументов побольше!
	  =========`;
	  /* и это тоже промис будет возвращен, он автоматически оберенётся в промис */
  
  
};
 
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