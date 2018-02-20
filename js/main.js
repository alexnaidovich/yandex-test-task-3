function Game(element) {
    this.el = document.querySelector(element);
    this.init();
}

Game.prototype = {    
    input: document.querySelector('input[type="text"]'),
    citiesChecked: [],
    start: document.querySelector('button[name="start"]'),
    speech: document.getElementById('sp'),
    submit: document.querySelector('button[type="submit"]'),
    AIResponseField: document.querySelector('#AIanswer'),
    currentCity: document.querySelector('#current'),
    check: document.querySelector('#check'),
    //gameData: [], //require gamedata
    testGameData: [],
    humanTurn: true,
    AITurn: false,
    maps: function () {
        var gameMap, locate, humanPlacemark, AIPlacemark;
        var humanTurn = Game.prototype.humanTurn;
        var AITurn = Game.prototype.AITurn;
        
        ymaps.ready(function () {
            gameMap = new ymaps.Map ("map", {
                center: [53.889102, 27.506835],
                zoom: 6
            });
            
            var val = "Минск";
            
            Game.prototype.check.addEventListener('change', function () {
                val = Game.prototype.currentCity.innerText;
                if (val !== undefined && val !== "") {
                    locate = ymaps.geocode (val);
                    locate.then(
                        function (res) {
                           var coords = res.geoObjects.get(0).geometry.getCoordinates();
                            console.log(coords);
                            gameMap.setCenter(coords, 10);
                            if (humanTurn === true) {
                                humanPlacemark = new ymaps.Placemark(coords, {}, {
                                    preset: 'islands#redIcon'
                                });
                                gameMap.geoObjects.add(humanPlacemark);
                            } else if (AITurn === true) {
                                AIPlacemark = new ymaps.Placemark(coords, {}, {
                                    preset: 'islands#oliveIcon'
                                });
                                gameMap.geoObjects.add(AIPlacemark);
                            }

                        },
                        function (err) {
                            throw err;
                            alert('Не могу найти этот город на карте :-(');
                        }
                    );
                }
            });
        });
    },
    
    init: function() {
        this.fillGameData();
        this.startGame();
        this.maps();
        //this.speechAction();
    },
    
    
    /**
      * fillGameData() заполняет базу знаний для бота из текстового файла cities.txt,
      * который лежит в папке data репозитория. Данный путь формирования базы был
      * выбран по причине нехватки времени на освоение принципов работы сборщиков
      * проекта (Gulp/WebPack), хотя это входило в ближайшие планы.
      */
    
    fillGameData: function () {
        var gameData = Game.prototype.testGameData,
            content = "",
            xhr = new XMLHttpRequest();
        var url = "https://alexnaidovich.github.io/yandex-test-task-3/data/cities.txt";
        // Для теста на localhost.
        //var url = "../data/cities.txt";
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                content = xhr.responseText;
                gameData = content.split(' ');
                Game.prototype.testGameData = gameData;
                console.log(Game.prototype.testGameData);
            }
        }
        xhr.send();
        
    },
 
    startGame: function(){
        console.log(this.citiesChecked);
        this.start.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (this.innerText === "СДАТЬСЯ") {
                this.innerText = "РЕСТАРТ";
                alert("Вы сдались... \nНажмите \"РЕСТАРТ\", чтобы попробовать ещё раз!" + Game.prototype.mentioned(Game.prototype.citiesChecked));
                Game.prototype.input.disabled = true;
                Game.prototype.submit.disabled = true;
                Game.prototype.submit.style.backgroundColor = "#ccc";
                console.log(Game.prototype.submit.disabled);
            } else if (this.innerText === "НАЧАТЬ" || this.innerText === "РЕСТАРТ") {
                this.innerText = "СДАТЬСЯ";
                
                if (Game.prototype.input.hasAttribute("disabled") || Game.prototype.input.disabled === true) {
                    Game.prototype.input.disabled = false;
                }
                if (Game.prototype.submit.hasAttribute("disabled") || Game.prototype.submit.disabled === true) {
                    Game.prototype.submit.disabled = false;
                    Game.prototype.submit.style.backgroundColor = "darkseagreen";
                }
                
                // При рестарте очищается массив с названными в предыдущей игре городами
                
                console.log(Game.prototype.citiesChecked);
                if (Game.prototype.citiesChecked.length !== 0) {
                    Game.prototype.citiesChecked.splice(0, Game.prototype.citiesChecked.length);
                    console.log(Game.prototype.citiesChecked);
                }
                Game.prototype.currentCity.innerText = "";
                Game.prototype.AIResponseField.innerText = "";
                Game.prototype.humanTurn = true;
                Game.prototype.listen();
            }
            
        });
    },
    
    listen: function() {
        
        var val = "",
            answer = Game.prototype.AIResponseField;
        
        var citiesChecked = Game.prototype.citiesChecked;
        var currentCity = Game.prototype.currentCity;
        var check = Game.prototype.check;
        var humanTurn = Game.prototype.humanTurn,
            AITurn = Game.prototype.AITurn;
        
        this.submit.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            console.log(this);
            
            humanTurn = true;
            AITurn = false;
            
            val = Game.prototype.input.value;
            var lastLetter = "",
                lastElem = "",
                firstLetter;
            
            if (val !== "") {
                firstLetter = val[0].toLowerCase();                
            } else {
                alert ("Введите город или сдавайтесь!");
                return false;
            }
            
            if (currentCity.innerText === "") {
                
                if (citiesChecked.length === 0) {
                    currentCity.innerText = val;
                    citiesChecked.push(val);
                    check.dispatchEvent(new Event('change'));
                    Game.prototype.AITurnProcess(val);
                    //return true;
                } 
            } else {

                for (var cities in citiesChecked) {
                    lastElem = citiesChecked[citiesChecked.length-1];
                    lastLetter = lastElem[lastElem.length-1];
                    if (lastLetter === "ъ" ||
                        lastLetter === "ь" ||
                        lastLetter === "ы") {
                        lastLetter = lastElem[lastElem.length-2];
                        }
                    }
                for (var c in citiesChecked) {
                    if (citiesChecked[c] === val) {
                        alert('Этот город уже был назван!');
                        return false;
                        }
                    }
                if (firstLetter === lastLetter) {
                        citiesChecked.push(val);
                        currentCity.innerText = val;
                        check.dispatchEvent(new Event('change'));
                        Game.prototype.AITurnProcess(val);                        
                        //return true;
                    } else {
                        alert("Город должен начинаться на последнюю букву предыдущего: " + Game.prototype.AIResponseField.innerText);
                        return false;
                    }
                }

            });
    },

    AITurnProcess: function (input) {
        
        var citiesChecked = Game.prototype.citiesChecked;
        var currentCity = Game.prototype.currentCity;
        var check = Game.prototype.check;
        var answer = Game.prototype.AIResponseField;
        var humanTurn = Game.prototype.humanTurn,
            AITurn = Game.prototype.AITurn;
        
        humanTurn = false;
        AITurn = true;
        
        answer.innerText = "";
        var loading = answer.appendChild(document.createElement('div'));
        loading.classList.add('loading');
        loading.style.transition = 'width 3s linear';     
        loading.style.width = answer.offsetWidth - 6 + 'px';
        
        
        
        var output = "";
        var lastLetter = input[input.length - 1];
        if (lastLetter === "ъ" ||
            lastLetter === "ь" ||
            lastLetter === "ы") {
            lastLetter = input[input.length - 2];
        }
        console.log(lastLetter);                
        var gameData  = Game.prototype.testGameData;

        var currentLetter = [];

        for (var i = 0; i < gameData.length; i++) {
            if (gameData[i][0].toLowerCase() === lastLetter) {
                currentLetter.push(gameData[i]);

            }
        }
        console.log(currentLetter);

        var rand = Math.floor(Math.random() * currentLetter.length);

        console.log(rand);

        var ch = function () {
            for (var cities in citiesChecked) {
                if (currentLetter.length === 0) {
                    break;
                } else {
                    if (currentLetter[rand] === citiesChecked[cities]) {
                        currentLetter.splice(rand, 1);
                        rand = Math.floor(Math.random() * currentLetter.length);
                        ch();                                
                        
                        //return true;
                        }                        
                    }
                }
            }
        ch();
        if (currentLetter.length === 0) {
            Game.prototype.start.innerText = "РЕСТАРТ";
            alert('Поздравляем, Вы выйграли!\nНажмите "\Рестарт"\, чтобы сыграть ещё раз.' + Game.prototype.mentioned(citiesChecked));
            Game.prototype.input.disabled = true;
            Game.prototype.submit.disabled = true;
            return false;
        }

        output = currentLetter[rand];
        console.log(output);

        if (output === undefined || output === "undefined") {
            answer.innerText = "";
            return false;
        }
        
        setTimeout (function() {
            citiesChecked.push(output);
            answer.innerText = output;
            currentCity.innerText = output;
            check.dispatchEvent(new Event('change'));

            Game.prototype.input.value = "";
            console.log(citiesChecked);
        }, 3000);
        //return true;

    },
    
    
    mentioned: function (arr) {
        var str1 = "",
            str2 = "";
        for (var x = 0, y = 1; x < arr.length; x += 2, y += 2) {
            str1 += arr[x] + ", ";
            str2 += arr[y] + ", ";
        }
        
        str1 = "Города, названные Вами: " + str1;
        str1 = str1.substring(0, str1.length - 2) + ".";
        console.log(str1);
        
        str2 = "Города, названные компьютером: " + str2;
        
        if (arr[arr.length - 1] === "undefined" || arr[arr.length - 1] === undefined) {
            str2 = str2.substring(0, str2.length - 11) + ".";
        } else {
            str2 = str2.substring(0, str2.length - 2) + ".";
        }
        console.log(str2);
        
        return "\n" + str1 + "\n" +str2;
    },
    
    speechInput: function(event) {
        if (!window.hasOwnProperty(webkitSpeechRecognition)) {
            alert('Ваш браузер не поддерживает голосовой ввод');
            return 0;
        } else {
            let input = document.querySelector('input[type="text"]');
            let recognizing = false;
            let recognition = new webkitSpeechRecognition();
            recognition.lang = 'ru-RU';
            recognition.continuous = true; // по умолчанию false - взятие одного слова
            recognition.interimResult = true; // возвращать промежуточные результаты? (в данном случае названный город)

            recognition.onerror() = (error) => {
                console.log(event.error);
            }

            recognition.onstart() = () => {
                recognizing = true;
            }

            recognition.onend() = () => {
                recognizing = false;
            }

            recognition.onresult = (event) => {
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i][0] === 'стоп') {
                        return 0;
                    } else {
                        input.innerHTML = event.results[i][0].transcript;
                    }
                }
            }
        }

    }

//   speechAction: function () { 
//       
//        this.speech.addEventListener('click', function(e) {
//            e.preventDefault();
//            Game.prototype.speechInput(e);
//        
//        });
//    }

    
}


document.addEventListener('DOMContentLoaded', function() {
    var game = new Game("#game");
});