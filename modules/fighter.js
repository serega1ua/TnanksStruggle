// Create class Fighter


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

 
