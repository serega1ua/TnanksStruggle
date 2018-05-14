/*  import "babel-polyfill";  */
  
 class Fighter {
	constructor(name, health, power) {
    this.name = name; 
	this.health = health; 
	this.power = power;
	  }
 

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
  }  
    
	hit(enemy, point) {
		let damage_ = point * this.power;  
		console.log(`${this.name} ударил ${enemy.name} на damage ${damage_}`);
		enemy.setDamage(damage_);
		}
   }
 

//добавляю промис в конструктор "старым"  синтаксисом JS 
	Fighter.prototype.knockout  = new Promise(function (resolve, reject) {
	  setTimeout(function()  {
		console.log("time is over"); resolve("выполнен Promise из Fighter.prototype.knockout");
	  }, 500);

	});
 
 
class ImprovedFighter extends Fighter {
	  constructor(name, health, power) {
      super(name, health, power);}
      doubleHit(enemy, point) {super.hit(enemy, point * 2); }
	 }

						/* name, health, power */
var fighter = new Fighter("Хрюшик 1", 7340, 2);
console.dir(fighter);
 
var fighter1 = new Fighter("Хрюшик 1-1",  2100, 30);
 
									/* name, health, power */
var improvedFighter = new ImprovedFighter("Валюшик 2", 2901, 3);
console.dir(improvedFighter);
var improvedFighter1 = new ImprovedFighter("Валюшик 2-1", 5, 200);

 
 /* Create async function ”fight” with such parameters as fighter, improvedFighter and points.*/
		async function fight (fighter, improvedFighter, ...points) {
				 
		  console.log(
`=========
Поединок:
${fighter.name} с здоровьем ${fighter.health}  
против 
${improvedFighter.name} с здоровьем ${improvedFighter.health}.
Итак, хроника боя такова:  
==========`);
		 
		 
		 
		 for (let i = 0; i < points.length; i++) {
							 if (fighter.health < 0) {
							 /* зачем ставим setTimeout: "You should wait until promise is resolved and print to console the result of the fight". */
										   setTimeout(function(){
											 console.log(`${fighter.name} проиграл! Он был смелым парнем.`); 
										   },1000)
											return fighter.knockout;
																}
			fighter.hit(improvedFighter, points[i]);
		 
			
							 if (improvedFighter.health < 0) {
								   setTimeout(function(){
											console.log(`${improvedFighter.name} проиграл! Но сражался достойно!`);
										   },1000)
								 return improvedFighter.knockout;
							  
							}
			improvedFighter.doubleHit(fighter, points[i]);    
												}
		  
		  return `========
			  не хватило патронов для поединка, сделай в fight аргументов побольше!
			  =========`;
			  /* и это тоже промис будет возвращен, он автоматически оберенётся в промис */
		  		};
 
fight(fighter, improvedFighter,  20, 8, 2, 20, 1, 77,  20, 4, 77,  20, 5, 77,  5, 420, 77,  20, 20, 77,  20, 20, 77,  20, 20, 77,  20, 20, 77,  20, 20, 77).
then(x => console.log(`
==========
выполнен промис из async function fight: ${x} и он обработан через fight().then` ));
 
console.log('Доп.информация: эта синхронная строка из stack исполнения вышла раньше, чем  из асинхронной выйдут промис и колбек setTimeOut и говорит: бой вот-вот закончится, ждем промиса async function fight (он идет из из callback-queque), а потом после него выйдет колбек с результатом из setTimeOut'); 
 