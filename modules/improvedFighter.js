// Create class ImprovedFighter
 
 /* 4.Create class ImprovedFighter that inherits methods and properties from class Fighter. */
class ImprovedFighter extends Fighter {
	
	  constructor(name, health, power) {
      super(name, health, power);}
 
	   doubleHit(enemy, point) {super.hit(enemy, point * 2); }
	   
}
  