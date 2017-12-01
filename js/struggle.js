//для старта игры вызвать tanks.startGame();

// первая расстановка танков в init (а не в startGame), так как startGame не только стартует игру, но и возобновляет игру (с сохранением времени и положений танков) после  pauseGame()
//не пойму почему bind почему работает в 535


// Должна быть функция которая создаст игру – init(). После вызова игра в приостановленом состоянии, появляется вражеский танк и танк игрока
// При вызове функции startGame() – вражеский танк случайно, каждую секунду выбирает куда двигаться на одну клетку.
//     При вызове pauseGame() – ходить нельзя.
//     При вызове endGame() – показать сколько длилась игра и закончить её.
//     При вызове функции move(String side(left, right, top, bottom)) – танк игрока двигается на одну клетко
// влево или на одну клетку вправо.
//     Должна быть задержка между вызовом не менее 1 секунды.
//     При вызове функции shot() – танк стреляет. Пока без логики. Просто происходит выстрел.

//
// TODO контроллер сверху над моделью и представлением
// TODO не вызываем через название объекта, а bind к  this
// TODO  объекты танков создаем через конструктор
// TODO  стрелочные функции применяем
// TODO  let и const  применяем
// TODO  wrapper объявить и что там еще не  было объявлено
// TODO  все функции как FE
// TODO ! есть препятствие, на котрое танк не может наехать
 //TODO  вверху тексты всех функций объявляем


var tanks = {};

(function () {

    const _CELL_SIZE = 20;
    const CSSCLASSFOR_OUR_TANK = "cellWithOurTank";
    const CSSCLASSFOR_ENEMY_TANK = "cellWithEnemyTank";
    const CSSCLASSFOR_ENEMY_TANK_DAMAGED = "cellWithEnemyTankDamaged";

    var gameState = null;

    var start = null; // тут хранить время начала
    var handle = null; // через эту глобальную переменную будем останавилвать вот так: clearInterval(handle);
    const TIMEOFGAME = 77000000; //сколько будет работать один сеанс игры
    var timePassed = null; //тут будем хранить время, прошедшее ДО паузы, чтоб учитывать в общем времени игру ДО паузы через pauseGame()
    var timeOfWholeGame = 0;// тут хранить длительность всей игры с учетом пауз

    // в массиве _cells  будет модель "чистых" данных о том, что в клетках
    var _cells = [];
    var ourTank = null;
    var enemyTank = null;

    var MakeTank = function (i, j, enemyOrAlly) {
        this.i = i;
        this.j = j;
        this.name = enemyOrAlly;
        this.health = 100;
    };

    MakeTank.prototype.shotByGun = function () {
        console.log(this.name + " have been shotted ")
    };

    //функция представления (отображает в клетке любой танк или иную графику)
    // и контроллер тпросто будет вызывать для добавления класса и для удаления (принимает элемент из модели танка, элемент клетки и название класса)
    var _showTank = function (elementDOM, classOfTank) {
        if (!classOfTank) console.warn("Не передан css-класс танка");
        elementDOM.classList.add(classOfTank);
    };


//функция представления (очищает клетку от любого танка)
    var _deleteTank = function (elementDOMforDeleting, classOfTank) {
        if (!classOfTank) console.warn("Не передан css-класс танка");
        elementDOMforDeleting.classList.remove(classOfTank);
    };


    var controllerFor_showTankFirstTime = function (kindOfTank, classOfTank) {
        //контроллер взял из модели ТАНКОВ данные о местоположении танка:
        var i = kindOfTank.i;
        var j = kindOfTank.j;

        //контроллер  взял DOM-элемент DIV-клетки из модели ПОЛЯ:
        var element = _cells[i][j].dom;

        //отдал для отображения данные двух моделей:
        _showTank(element, classOfTank)

    };


    this.init = function (contianer) {


        if (typeof contianer === 'undefined') {
            var container = document.body;
            console.warn("Обратите внимание вы не передали контейнер и поле будет document.body");
        }

        _renderField(contianer);


        ourTank = new MakeTank(_getRandomIntFromInterval(0, _CELL_SIZE - 1), _getRandomIntFromInterval(0, _CELL_SIZE - 1), "ally");
        enemyTank = new MakeTank(_getRandomIntFromInterval(1, _CELL_SIZE - 1), _getRandomIntFromInterval(1, _CELL_SIZE - 1), "enemy");
        console.log("создали конструктором наш танк:");
        console.dir(ourTank);
        console.log("создали конструктором чужой танк:");
        console.dir(enemyTank);

        controllerFor_showTankFirstTime(ourTank, CSSCLASSFOR_OUR_TANK);
        controllerFor_showTankFirstTime(enemyTank, CSSCLASSFOR_ENEMY_TANK);

    };


    var _renderField = function (contianer) {

        var wrapper = document.getElementById("wrapper");
        if (wrapper) {
            wrapper.innerHTML = "";
            wrapper.parentNode.removeChild(wrapper);
        }

        wrapper = document.createElement("div");
        wrapper.className = "outside-cell";
        wrapper.id = "wrapper";

        var info = document.getElementById("info-cell");
        if (info) {
            info.innerHTML = "";
            info.parentNode.removeChild(info);
        }

        info = document.createElement("div");
        info.className = "info";
        info.id = "info-cell";
        info.innerHTML = "press keys \u2190 \u2191 \u2192 \u2193 for moving to the left, right, top, bottom" + "<br>" +
            "press 'a' for moving to the top-left \u2196" + "<br>"
            + "press 's' for moving to the top-right \u2197" + "<br>"
            + "press 'z' for moving to the bottom-left \u2199" + "<br>"
            + "press 'x' for moving to the bottom-right \u2198" + "<br>"
            + "press 'space' to make a shot";


        contianer.appendChild(wrapper);
        contianer.appendChild(info);

        // тут есть 2 массива: _cells.length и _cells[i], обходим каждый
        for (let i = 0, len = _cells.length; i < len; i++) {
            for (let j = 0, len2 = _cells[i].length; j < len2; j++) {
                wrapper.appendChild(_cells[i][j].dom);

                _cells[i][j].dom.appendChild(_cells[i][j].bullet.domBullet);

                // this._cells[i][j].onclick = function(e) {
                //     game.handleOfCellClick(e.target);
                // };
            }
        }


    };


    var _createElement = function (i, j) {
        var element = document.createElement("div");
        element.className = "inside-cell";

        element.dataset.i = i;
        element.dataset.j = j;

        element.i = i;
        element.j = j;

        if (j === 0) {
            element.className = "clear-both inside-cell";
        }

        element.innerText = "i=" + i + "\r" + "j=" + j;


        return element;

    };


    var _createElementOfBullet = function (i, j) {
        var element = document.createElement("div");
        element.className = "shotMark";
        element.id = "shotMark";

        return element;

    };


    //создаем модель данных о поле (это чисто МОДЕЛЬ, без представления)
    var _createDataModelOfField = function (_rowsNumber, _cellsNumber) {
        var _rowsNumberFinal = _rowsNumber || 20;
        var _cellsNumberFinal = _cellsNumber || 20;


        // let и const заставляют интерпретатор создавать новое лексическое окружение в том блоке, в котором объявлены соответствующие переменные.
        //     К let/const переменным также применяется hoisting (поднятие переменных). Несмотря на hoisting, let/const переменные всё равно станут доступными только после строки с их объявлением.
        //     При использовании let и const в других синтаксических структурах (функции, eval-код, catch) переменные будут просто записываться в уже созданное лексическое окружение, никак не влияя на производительность.
        //     В итоге, каждая итерация цикла -> новый блок -> новое лексическое окружение.
        //     И все функции, созданные внутри этого лексического окружения, теперь будут на него замыкаться. Как видно, на let/const уходит больше процессорного времени, поэтому старайтесь использовать let/const только, когда это действительно нужно.


        for (let i = 0; i < _rowsNumberFinal; i++) {
            _cells[i] = [];
            for (let j = 0; j < _cellsNumberFinal; j++) _cells[i].push({
                value: null,
                dom: _createElement(i, j),
                i: i,
                j: j,
                //есть пуля в модели данных, тут её стартовое положение и DOM-элемент(пока что не отображённый)
                bullet: {
                    domBullet: _createElementOfBullet(i, j),
                    startPosition_I: i,
                    startPosition_J: j,
                    finalPosition_I: null,
                    finalPosition_J: null,
                    inProcess: null
                }
            });
        }

        console.dir(_cells);
    };

    _createDataModelOfField(_CELL_SIZE, _CELL_SIZE);


// контроллер может двигать любой танк, созданный конструктором
    var _controllerFor_showResultOfMoving = function (kindOfTank, newRow, newCell, classOfTank) {
        //контроллер взял из модели ТАНКОВ данные о местоположении танка для удаления:
        var i = kindOfTank.i;
        var j = kindOfTank.j;

        //контроллер  взял DOM-элемент DIV-клетки из модели ПОЛЯ (для удаления из неё танка):
        var elementForDeleting = _cells[i][j].dom;

        _deleteTank(elementForDeleting, classOfTank);

        //контроллер  взял DOM-элемент DIV-клетки из модели ПОЛЯ (для вставки в неё танка):
        var elementForNewShowing = _cells[i + newRow][j + newCell].dom;
        //отдал для отображения данные двух моделей:
        _showTank(elementForNewShowing, classOfTank)

    };


    var moveEnemyTank = function (newRow, newCell) {

        //в 4-х if ниже не даём выехать за пределы поляи "отталкиваем" его от прилипания к краю поля
        if ((enemyTank.i + newRow) > (_CELL_SIZE - 1)) {
            newRow = newRow - 2;
        }
        if ((enemyTank.j + newCell) > (_CELL_SIZE - 1)) {
            newCell = newCell - 2;
        }
        if ((enemyTank.i + newRow) < 0) {
            newRow = newRow + 2;
        }
        if ((enemyTank.j + newCell) < 0) {
            newCell = newCell + 2;
        }


        //осуществляем из модели представление
        //   _showResultOfMoving(enemyTank.i, enemyTank.j, newRow, newCell, "cellWithEnemyTank");

        _controllerFor_showResultOfMoving(enemyTank, newRow, newCell, CSSCLASSFOR_ENEMY_TANK);

        //и после отображения в модели данных указываем новое местоположение
        enemyTank.i = enemyTank.i + newRow;
        enemyTank.j = enemyTank.j + newCell;
    };


    //ВОТ ПРЕДСТАВЛЕНИЕ движения, МЫ ЕГО ОТДЕЛИЛИ от модели
    // функции _showResultOfMoving и _showTank  можно было объединить в 1 функцию, но для нагляности кода не делаю этого
    // var _showResultOfMoving = function (i, j, newRow, newCell, classOfTank) {
    //     if (!classOfTank) console.warn("Не передан css-класс танка");
    //     _cells[i][j].dom.classList.remove(classOfTank);
    //     _cells[i + newRow][j + newCell].dom.classList.add(classOfTank);
    //
    // };


    this.move = function (direction) {

        if (!gameState) return;

        var newRow = 0;
        var newCell = 0;

        var directionOfMove = {
            top: function () {
                newRow = -1;
            },
            bottom: function () {
                newRow = 1;
            },
            left: function () {
                newCell = -1;
            },
            right: function () {
                newCell = 1;
            },
            topleft: function () {
                newRow = -1;
                newCell = -1;
            },
            topright: function () {
                newRow = -1;
                newCell = 1;
            },
            bottomleft: function () {
                newRow = 1;
                newCell = -1;
            },
            bottomright: function () {
                newRow = 1;
                newCell = 1;
            },

        };


        directionOfMove[direction]();


        //не даём выехать за пределы поля
        if ((ourTank.i + newRow) > (_CELL_SIZE - 1)) {
            console.log("край поля!");
            return;
        }
        if ((ourTank.j + newCell) > (_CELL_SIZE - 1)) {
            console.log("край поля!");
            return;
        }
        if ((ourTank.i + newRow) < 0) {
            console.log("край поля!");
            return;
        }
        if ((ourTank.j + newCell) < 0) {
            console.log("край поля!");
            return;
        }


        _controllerFor_showResultOfMoving(ourTank, newRow, newCell, CSSCLASSFOR_OUR_TANK);


        gameState = false;

        setTimeout(function () {
            console.log("setTimeout pause in process");
            gameState = true;
        }, 1000);


        ourTank.i = ourTank.i + newRow;
        ourTank.j = ourTank.j + newCell;


    };


    this.startGame = function () {

        gameState = true;
        start = Date.now();//  взяли время старта функции startGame
        console.log("Игра в конкретном сеансе стартовала в  " + new Date(start).toString().slice(16, -27));

        clearInterval(handle); // на всякий случай отменили этот же setInterval, если запущен уже

        var that = this;

        //setInterval нигде не объявлялся ранее, т.е. он - метод Window и потому по умолчанию у него в скобках вызова this=Window
        handle = setInterval(function () {
            // вычислить сколько времени прошло с начала анимации
            timePassed = Date.now() - start;
            //   console.log("В этом сеансе прошло   " + timePassed / 1000 + "секунд");

            if (timePassed >= TIMEOFGAME) {
                console.log("Истекло максимальное время сеанса, оно составляло " + timeOfGame);
                clearInterval(handle); // конец через столько-то секунд
                that.endGame();
                return;
            }


            _moveToRandomDirection();


        }, 1000);
    };


    this.pauseGame = function () {
        gameState = false;
        timeOfWholeGame = timeOfWholeGame + (timePassed / 1000); // плюсуем время конкрктного сеанса до pauseGame()

        console.log("ПАУЗА. До паузы в этом сеансе игры прошло   " + timePassed / 1000 + " секунд");
        console.log("Сейчас общее время игры   " + timeOfWholeGame + " секунд");
        // добавляем время, которое прошло перед паузой через pauseGame()
        clearInterval(handle);
        timePassed = 0; //обнуляем, чтоб второй раз этот сеанс не был посчитан при вызове   endGame() после  вызова pauseGame()
    };


    this.endGame = function () {
        console.log("gameState = " + gameState);
        gameState = false;
        timeOfWholeGame = timeOfWholeGame + (timePassed / 1000); // плюсуем время конкрктного сеанса до endGame()
        clearInterval(handle);
        if (timeOfWholeGame) console.log("КОНЕЦ ИГРЫ. Игра длилась " + timeOfWholeGame + " сек.");
        else if (!timeOfWholeGame) console.log("нет данных о длительности игры");
        // start = Date.now();
        timeOfWholeGame = 0;
        console.log("конец игры, счетчик времени игры обнулён");
        this.init(document.getElementById("forGameContainer"));
    };


    var _moveToRandomDirection = function () {

        var sides = {
            left: function () {
                moveEnemyTank(0, -1)
            },
            right: function () {
                moveEnemyTank(0, 1)
            },
            top: function () {
                moveEnemyTank(-1, 0)
            },
            bottom: function () {
                moveEnemyTank(1, 0)
            },
            topLeft: function () {
                moveEnemyTank(-1, -1)
            },
            bottomLeft: function () {
                moveEnemyTank(1, -1)
            },
            topRight: function () {
                moveEnemyTank(-1, 1)
            },
            bottomRight: function () {
                moveEnemyTank(1, 1)
            },

        };

        var random = _getRandomIntFromInterval(0, Object.keys(sides).length - 1);

        var arr = Object.keys(sides)[random];

        sides[arr]();


    };


    function _getRandomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };


//     Когда вы назначаете функцию непосредственно обработчикам событий элемента, использование this непосредственно внутри функции обработки событий относится к соответствующему элементу. Такое прямое назначение функций может быть выполнено с использованием метода addeventListener или с помощью традиционных методов регистрации событий, таких как onclick.
//     огда вы используете this непосредственно внутри свойства события (например, <button onclick="...this..." >) элемента, он ссылается на элемент.
//     var el = document.getElementById('idOfEl');
//     el.addEventListener('click', function() { console.log(this) });


    //можно было через bind привязать, а не через стрелочную функцию
    // var handlePressKey = (function (e) {
    //
    //     if (!gameState) return;
    //
    //     if (e.keyCode === 38) {
    //         this.move("top");
    //     } else if (e.keyCode === 37) {
    //         this.move("left");
    //     } else if (e.keyCode === 40) {
    //         this.move("bottom");
    //     } else if (e.keyCode === 39) {
    //         this.move("right");
    //     }
    //     else if (e.keyCode === 65) {
    //         this.move("topleft");
    //     } else if (e.keyCode === 83) {
    //         this.move("topright");
    //     } else if (e.keyCode === 90) {
    //         this.move("bottomleft");
    //     } else if (e.keyCode === 88) {
    //         this.move("bottomright");
    //     } else if (e.keyCode === 32) {
    //         this.shot();
    //     }
    // }).bind(this);
    //
    //
    // document.addEventListener("keydown",  handlePressKey);


    //addEventListener - это метод, при его вызове this должен был бы на объект указывать, которого он методом является


    //
    // document.addEventListener("keydown", (function(e) {
    //
    //     if (!gameState)
    //         return;
    //
    //     if (e.keyCode === 38) {
    //         this.move("top");
    //     } else if (e.keyCode === 37) {
    //         this.move("left");
    //     } else if (e.keyCode === 40) {
    //         this.move("bottom");
    //     } else if (e.keyCode === 39) {
    //         this.move("right");
    //     }
    //     else if (e.keyCode === 65) {
    //         this.move("topleft");
    //     } else if (e.keyCode === 83) {
    //         this.move("topright");
    //     } else if (e.keyCode === 90) {
    //         this.move("bottomleft");
    //     } else if (e.keyCode === 88) {
    //         this.move("bottomright");
    //     } else if (e.keyCode === 32) {
    //         this.shot();
    //     }
    // }).bind(this) )    ;


    document.addEventListener("keydown", ( (e) => {

            if (!gameState)
    return;

    if (e.keyCode === 38) {
        this.move("top");
    } else if (e.keyCode === 37) {
        this.move("left");
    } else if (e.keyCode === 40) {
        this.move("bottom");
    } else if (e.keyCode === 39) {
        this.move("right");
    }
    else if (e.keyCode === 65) {
        this.move("topleft");
    } else if (e.keyCode === 83) {
        this.move("topright");
    } else if (e.keyCode === 90) {
        this.move("bottomleft");
    } else if (e.keyCode === 88) {
        this.move("bottomright");
    } else if (e.keyCode === 32) {
        this.shot();
    }
}) )
    ;

    // это старая констуркция выстрела
    // var deletedBullet;
    //
    // this.shot = function () {
    //
    //     var handleGun;
    //
    //     var drawBulletTrajectory = function () {
    //         start1 = Date.now();
    //
    //
    //         clearInterval(handleGun);
    //         handleGun = setInterval(function () {
    //
    //             var timePassed1 = Date.now() - start1;
    //
    //             drawGun(timePassed1);
    //
    //         }, 20);
    //
    //     };
    //
    //     // в то время как timePassed идёт от 0 до 2000
    //     // left принимает значения от 0 до 400px
    //     var drawGun = function  (timePassed1) {
    //         element.style.left = 20 + (timePassed1) / 5 + 'px';
    //     };
    //
    //
    //
    //
    //
    //     deletedBullet = document.getElementById("shotMark");
    //     if (deletedBullet) {
    //         deletedBullet.innerHTML = "";
    //         deletedBullet.parentNode.removeChild(deletedBullet);
    //     }
    //
    //     console.log("сработал  метод this.shot ");
    //     var element = document.createElement("div");
    //     element.className = "shotMark";
    //     element.id = "shotMark";
    //
    //     element.dataset.i = ourTank.i;
    //     element.dataset.j = ourTank.j;
    //
    //     element.i = ourTank.i;
    //     element.j = ourTank.j;
    //
    //
    //     _cells[ourTank.i][ourTank.j].dom.appendChild(element);
    //
    //     drawBulletTrajectory();
    //
    //
    // };


var that=this;
    var isTargetedWell =  function() {    // если танк-враг на одном ряду с нашим, то пункт поражения
        if (ourTank.i === enemyTank.i) {_cells[ourTank.i][ourTank.j].bullet.finalPosition_J = enemyTank.j;
        console.log("цель захвачена! удар по столбцу:");
        console.log(_cells[ourTank.i][ourTank.j].bullet.finalPosition_J);


            var element = _cells[enemyTank.i][enemyTank.j].dom;

            //cellWithEnemyTankDamaged



            //
            // //функция представления (отображает в клетке любой танк или иную графику)
            // // и контроллер тпросто будет вызывать для добавления класса и для удаления (принимает элемент из модели танка, элемент клетки и название класса)
            // var _showTank = function (elementDOM, classOfTank) {
            //     if (!classOfTank) console.warn("Не передан css-класс танка");
            //     elementDOM.classList.add(classOfTank);
            // };
            //
            // //контроллер  взял DOM-элемент DIV-клетки из модели ПОЛЯ:
            // var element = _cells[i][j].dom;
            //
            // //отдал для отображения данные двух моделей:
              _showTank(element, CSSCLASSFOR_ENEMY_TANK_DAMAGED)



            that.pauseGame();}
    } ;


    var _createModelOfThisShotController = function () {

        //TODO проверяем, поразит ли он вражеский танк и останавливаем его
        //TODO тут определяем направление выстрела, ориентируясь на положение вражеского танка
        // отсюда вызываем уже отрисовку-представление


          //пока только горизонтально он стреляет
        _cells[ourTank.i][ourTank.j].bullet.finalPosition_I = _cells[ourTank.i][ourTank.j].bullet.startPosition_I;

        //по умолчанию он выстрелит до края поля
        _cells[ourTank.i][ourTank.j].bullet.finalPosition_J = _CELL_SIZE - 1;


        //ищем танк врага
        isTargetedWell();


        console.log("наносим удар по клетке с  координатами (i, j):");
        console.log(_cells[ourTank.i][ourTank.j].bullet.finalPosition_I);
        console.log(_cells[ourTank.i][ourTank.j].bullet.finalPosition_J);


        var distanceOfShot = (_cells[ourTank.i][ourTank.j].bullet.finalPosition_J - _cells[ourTank.i][ourTank.j].bullet.startPosition_J) * 20;

        var element1 = _cells[ourTank.i][ourTank.j].bullet.domBullet;

        element1.style.left = 15 + 'px';

        function getCssProperty(elem, property) {
            return parseFloat(window.getComputedStyle(elem, null).getPropertyValue(property));
        }

        var positionFrom = getCssProperty(element1, "left");
        var finalSpot = positionFrom + distanceOfShot;

        drawBulletTrajectory1(distanceOfShot, element1, positionFrom, finalSpot);


    };


    var handleGun1;
    var start1;

    var drawBulletTrajectory1 = function (distanceOfShot, element1, positionFrom, finalSpot) {


        var bulletElement = _cells[ourTank.i][ourTank.j].bullet.domBullet;
        bulletElement.className = "shotMark displayAsBlock";

        start1 = Date.now();

        clearInterval(handleGun1);


        handleGun1 = setInterval(function () {

            var timePassed1 = Date.now() - start1;

            element1.style.left = (timePassed1) / 5 + 'px';

            if (((timePassed1) / 5) >= finalSpot) {
                console.log("долетел!");
                clearInterval(handleGun1); // конец через столько-то секунд
                finalSpot = null;
                positionFrom = null;
                distanceOfShot = null;
                element1.className = "shotMark";
                var targetCell = _cells[_cells[ourTank.i][ourTank.j].bullet.finalPosition_I][_cells[ourTank.i][ourTank.j].bullet.finalPosition_J];
                targetCell.dom.classList.add('red');
                setTimeout(function () {
                    targetCell.dom.classList.remove('red');
                }, 1000);

            }


        }, 20);

    };


    this.shot = function () {

        _createModelOfThisShotController();

    };


}).bind(tanks)();

//вызываем тут, чтоб в консоли не вызывать
tanks.init(document.getElementById("forGameContainer"));
console.dir(tanks);
 tanks.startGame();