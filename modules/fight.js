// create async function fight


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

 


      return Fighter.prototype.knockout;
	   
       
    }
    fighter.hit(improvedFighter, points[i]);
  if (fighter.health < 0) {
	  
	    setTimeout(function(){
      console.log(`==========
	  ${fighter.name} проиграл!
==========`); 
   
   },1000)
	  
  

 return Fighter.prototype.knockout;
       
    }
	
	 if (improvedFighter.health < 0) {
		 
		   setTimeout(function(){
    console.log(`========
	  ${improvedFighter.name} проиграл!
=========`);
   
   },1000)
		 
      

 return Fighter.prototype.knockout;
      
    }
    improvedFighter.doubleHit(fighter, points[i]);    
     	 if (improvedFighter.health < 0) {
			 
			   setTimeout(function(){

       console.log(`========
	  ${improvedFighter.name} проиграл!
=========`);  

   },1000)
			 
     
 return Fighter.prototype.knockout;
      
    }
     
    
 
  }
  
  return `========
	  не хватило патронов для поединка, сделай в fight аргументов побольше!
	  =========`;
	  /* и это тоже промис будет возвращен, он автоматически оберенётся в промис */
  
  
};
  
 
