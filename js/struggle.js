// Должна быть функция которая создаст игру – init(). После вызова игра в приостановленом состоянии, появляется вражеский танк и танк игрока
// При вызове функции startGame() – вражеский танк случайно, каждую секунду выбирает куда двигаться на одну клетку.
//     При вызове pauseGame() – ходить нельзя.
//     При вызове endGame() – показать сколько длилась игра и закончить её.
//     При вызове функции move(String side(left, right, top, bottom)) – танк игрока двигается на одну клетко
// влево или на одну клетку вправо.
//     Должна быть задержка между вызовом не менее 1 секунды.
//     При вызове функции shot() – танк стреляет. Пока без логики. Просто происходит выстрел.


var tanks = {};

(function () {

    var _createDataModelOfField;
    var _CELL_SIZE = 20;
    var _showTankFirstTime;
    var _moveToRandomDirection;
    var _showResultOfMovingOurTank;
    var gameState;
    //эти 2 объекта - это модель данных о танках (только модель, без представления)
    var ourTank = {i: _getRandomIntFromInterval(0, _CELL_SIZE - 1), j: _getRandomIntFromInterval(0, _CELL_SIZE - 1)};
    var enemyTank = {i: _getRandomIntFromInterval(1, _CELL_SIZE - 1), j: _getRandomIntFromInterval(1, _CELL_SIZE - 1)};

    //хочу реализовать подход "разделить модель и представление",
    // в массиве _cells  будет модель "чистых" данных о том, что в клетках
    var _cells = [];

    //создаем модель данных о поле (это чисто МОДЕЛЬ, без представления)
    _createDataModelOfField = function (_rowsNumber, _cellsNumber) {
        var _rowsNumberFinal = _rowsNumber || 20;
        var _cellsNumberFinal = _cellsNumber || 20;

        for (var i = 0; i < _rowsNumberFinal; i++) {
            _cells[i] = [];
            for (var j = 0; j < _cellsNumberFinal; j++) _cells[i].push({
                value: null,
                dom: _createElement(i, j),
                i: i,
                j: j
            });
        }
    };

    _createDataModelOfField(_CELL_SIZE, _CELL_SIZE);


    function _createElement(i, j) {
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


//функция может отобразить что угодно (получает номер ячейки и css-класс для background клетки)
    _showTankFirstTime = function (i, j, classOfTank) {
        _cells[i][j].dom.classList.add(classOfTank);
    };
    _showTankFirstTime(ourTank.i, ourTank.j, "cellWithOurTank");
    _showTankFirstTime(enemyTank.i, enemyTank.j, "cellWithEnemyTank");


    //ВОТ МОДЕЛЬ данных координат передвижения, МЫ ЕЁ ОТДЕЛИЛИ ОТ ПРЕДСТАВЛЕНИЯ
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
        _showResultOfMoving(enemyTank.i, enemyTank.j, newRow, newCell, "cellWithEnemyTank");

        //и после отображения в модели данных указываем новое местоположение
        enemyTank.i = enemyTank.i + newRow;
        enemyTank.j = enemyTank.j + newCell;
    };


    //ВОТ ПРЕДСТАВЛЕНИЕ движения, МЫ ЕГО ОТДЕЛИЛИ от модели
    // функции _showResultOfMoving и _showTankFirstTime можно было объединить в 1 функцию, но для нагляности кода не делаю этого
    var _showResultOfMoving = function (i, j, newRow, newCell, classOfTank) {
        if (!classOfTank) console.warn("Не передан css-класс танка");
        _cells[i][j].dom.classList.remove(classOfTank);
        _cells[i + newRow][j + newCell].dom.classList.add(classOfTank);

    };


    //ВОТ МОДЕЛЬ данных движения нашего танка , МЫ ЕЁ ОТДЕЛИЛИ ОТ ПРЕДСТАВЛЕНИЯ
    this.move = function (direction) {

        if (!gameState) return;

        var newRow = 0;
        var newCell = 0;

        if (direction === "top") {
            newRow = -1;
        }
        if (direction === "bottom") {
            newRow = 1;
        }
        if (direction === "left") {
            newCell = -1;
        }
        if (direction === "right") {
            newCell = 1;
        }

        if (direction === "topleft") {
            newRow = -1;
            newCell = -1;
        }

        if (direction === "topright") {
            newRow = -1;
            newCell = 1;
        }
        if (direction === "bottomleft") {
            newRow = 1;
            newCell = -1;
        }
        if (direction === "bottomright") {
            newRow = 1;
            newCell = 1;
        }


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

        _showResultOfMoving(ourTank.i, ourTank.j, newRow, newCell, "cellWithOurTank");

        gameState = false;

        setTimeout(function () {
            console.log("setTimeout pause in process");
            gameState = true;
        }, 1000);


        ourTank.i = ourTank.i + newRow;
        ourTank.j = ourTank.j + newCell;


    };


    var start; // тут хранить время начала
    var handle; // через эту глобальную переменную будем останавилвать вот так: clearInterval(handle);
    var timeOfGame = 717000; //сколько будет работать один сеанс игры
    var timePassed; //тут будем хранить время, прошедшее ДО паузы, чтоб учитывать в общем времени игру ДО паузы через pauseGame()
    var timeOfWholeGame = 0;// тут хранить длительность всей игры с учетом пауз

    this.startGame = function () {
        gameState = true;
        start = Date.now();//  взяли время старта функции startGame
        console.log("Игра в конкретном сеансе стартовала в  " + new Date(start).toString().slice(16, -27));

        clearInterval(handle); // на всякий случай отменили этот же setInterval, если запущен уже
        handle = setInterval(function () {
            // вычислить сколько времени прошло с начала анимации
            timePassed = Date.now() - start;
            console.log("В этом сеансе прошло   " + timePassed / 1000 + "секунд");

            if (timePassed >= timeOfGame) {
                console.log("Истекло максимальное время сеанса, оно составляло " + timeOfGame);
                clearInterval(handle); // конец через столько-то секунд
                tanks.endGame();
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


    this.init = function (contianer) {
        if (typeof contianer === 'undefined') {
            var container = document.body;
            console.warn("Обратите внимание вы не передали контейнер и поле будет document.body");
        }

        _renderField(contianer);

    };


    var _renderField = function (contianer) {

        var deleted = document.getElementById("wrapper");
        if (window.wrapper) {
            deleted.innerHTML = "";
            deleted.parentNode.removeChild(deleted);
        }

        wrapper = document.createElement("div");
        wrapper.className = "outside-cell";
        wrapper.id = "wrapper";

        var info = document.createElement("div");
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

        // Кешируем длину массивов при итерации с помощью цикла for
        // свойство length у массива считается динамически (т.е. при каждом обращении к нему),
        // что может сказаться на производительности цикла при больших размерах массива.
        // for (var i = 0, len = array.length; i < len; i++) {
        //     console.log("цвет", i + 1, "—", arr[i]);
        // }


        // тут есть 2 массива: _cells.length и _cells[i], обходим каждый
        for (var i = 0, len = _cells.length; i < len; i++) {
            for (var j = 0, len2 = _cells[i].length; j < len2; j++) {
                wrapper.appendChild(_cells[i][j].dom);
                // this._cells[i][j].onclick = function(e) {
                //     game.handleOfCellClick(e.target);
                // };
            }
        }


    };


    _moveToRandomDirection = function () {

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
// // the function called by addEventListener contains this as the reference to the element
// // so clicking on our element would log that element itself

    window.addEventListener("keydown", function (e) {

        if (!gameState) return;

        if (e.keyCode === 38) {
            tanks.move("top");
        } else if (e.keyCode === 37) {
            tanks.move("left");
        } else if (e.keyCode === 40) {
            tanks.move("bottom");
        } else if (e.keyCode === 39) {
            tanks.move("right");
        }
        else if (e.keyCode === 65) {
            tanks.move("topleft");
        } else if (e.keyCode === 83) {
            tanks.move("topright");
        } else if (e.keyCode === 90) {
            tanks.move("bottomleft");
        } else if (e.keyCode === 88) {
            tanks.move("bottomright");
        } else if (e.keyCode === 32) {
            tanks.shot();
        }
    });


    var deletedBullet;

    this.shot = function () {

        deletedBullet = document.getElementById("shotMark");
        if (deletedBullet) {
            deletedBullet.innerHTML = "";
            deletedBullet.parentNode.removeChild(deletedBullet);
        }

        console.log("сработал  метод this.shot ");
        var element = document.createElement("div");
        element.className = "shotMark";
        element.id = "shotMark";

        element.dataset.i = ourTank.i;
        element.dataset.j = ourTank.j;

        element.i = ourTank.i;
        element.j = ourTank.j;


        _cells[ourTank.i][ourTank.j].dom.appendChild(element);

        drawBulletTrajectory();

        var handleGun;

        function drawBulletTrajectory() {
            start1 = Date.now();

            clearInterval(handleGun);
            handleGun = setInterval(function () {

                var timePassed1 = Date.now() - start1;

                drawGun(timePassed1);

            }, 20);

        }

        // в то время как timePassed идёт от 0 до 2000
        // left принимает значения от 0 до 400px
        function drawGun(timePassed1) {
            element.style.left = 20 + (timePassed1) / 5 + 'px';
        }

    };


}).bind(tanks)();

//вызываем тут, чтоб в консоли не вызывать
tanks.init(document.getElementById("forGameContainer"));
console.dir(tanks);
tanks.startGame();