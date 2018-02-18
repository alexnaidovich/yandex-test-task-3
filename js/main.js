function Game(element) {
    this.el = document.querySelector(element);
    this.init();
}

Game.prototype = {    
    input: document.querySelector('input[type="text"]'),
    citiesChecked: [],
    playerInput: "",
    start: document.querySelector('button[name="start"]'),
    speech: document.getElementById('sp'),
    submit: document.querySelector('button[type="submit"]'),
    AIResponseField: document.querySelector('#AIanswer'),
    AIResponse: "", //AIResponseField.InnerText,
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
                            if (humanTurn) {
                                humanPlacemark = new ymaps.Placemark(coords, {}, {
                                    preset: 'islands#redicon'
                                });
                            } else if (AITurn) {
                                AIPlacemark = new ymaps.Placemark(coords, {}, {
                                    preset: 'islands#blueicon'
                                });
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
    },
    
    fillGameData: function () {
        var gameData = Game.prototype.testGameData,
            content = "",
            xhr = new XMLHttpRequest();
        var url = "https://alexnaidovich.github.io/yandex-test-task-3/data/cities.txt";
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
            console.log(this);
            if (Game.prototype.citiesChecked.length !== 0) {
                Game.prototype.citiesChecked = [];
            }
            this.innerText = "РЕСТАРТ";
        });
        console.log(this.citiesChecked);
        this.listen();
    },
    
    
 // Test - no AI   
 /*   listen: function() {
        console.log(this);
        console.log(this.citiesChecked);
        console.log(this.submit);
        this.submit.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(this);
            var val = Game.prototype.input.value;
            var lastLetter = "",
                lastElem = "",
                firstLetter = val[0].toLowerCase();
            
            var citiesChecked = Game.prototype.citiesChecked
            if (Game.prototype.AIResponse === "") {
            if (citiesChecked.length === 0) {
                Game.prototype.AIResponseField.innerText = val;
                citiesChecked.push(val);
                Game.prototype.input.value = "";
                return true;
            } else {
                for (var cities in citiesChecked) {
                    lastElem = citiesChecked[citiesChecked.length-1];
                    lastLetter = lastElem[lastElem.length-1];
                    if (lastLetter === "ъ" ||
                        lastLetter === "ь" ||
                        lastLetter === "ы") {
                        lastLetter = lastElem[lastElem.length-2];
                    }
                    for (var c in citiesChecked) {
                        if (citiesChecked[c] === val) {
                            alert('Этот город уже был назван!');
                            return false;
                            }
                        }
                    if (firstLetter === lastLetter) {
                            citiesChecked.push(val);
                            Game.prototype.AIResponseField.innerText = val;
                            Game.prototype.input.value = "";
                            return true;
                        } else {
                            alert("Город должен начинаться на последнюю букву предыдущего: " + Game.prototype.AIResponseField.innerText)
                        }
                    }
                }
            }
        });
    },

*/

    listen: function() {
        
        this.submit.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(this);
            var val = Game.prototype.input.value,
                answer = Game.prototype.AIResponseField;
            var lastLetter = "",
                lastElem = "",
                firstLetter = val[0].toLowerCase();
            
            var citiesChecked = Game.prototype.citiesChecked;
            var currentCity = Game.prototype.currentCity;
            var check = Game.prototype.check;
            var humanTurn = Game.prototype.humanTurn,
                AITurn = Game.prototype.AITurn;
            
            function AITurnProcess (input) {
                humanTurn = false;
                AITurn = true;
                var output = "";
                lastLetter = val[val.length - 1];
                if (lastLetter === "ъ" ||
                    lastLetter === "ь" ||
                    lastLetter === "ы") {
                    lastLetter = val[val.length - 2];
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

                output = currentLetter[rand];

                console.log(output);

                for (var cities in citiesChecked) {
                    if (output === citiesChecked[cities]) {
                        output = currentLetter[rand];

                        console.log(output);
                    }
                }
                
                setTimeout (function() {
                    citiesChecked.push(output);
                    answer.innerText = output;
                    currentCity.innerText = output;
                    check.dispatchEvent(new Event('change'));
                    //check.checked = false;

                    Game.prototype.input.value = "";
                    console.log(citiesChecked);
                }, 5000);
                

                return true;
                
            } // end AI Turn Process
            
            
            if (answer.innerText === "") {
                
                humanTurn = true;
                AITurn = false;
                
                if (citiesChecked.length === 0) {
                    citiesChecked.push(val);
                    currentCity.innerText = val;
                    check.dispatchEvent(new Event('change'));
                    //check.checked = true;
                    AITurnProcess(val);
                    return true;
                } 
            } else {
            
                humanTurn = true;
                AITurn = false;
                
                for (var cities in citiesChecked) {
                    lastElem = citiesChecked[citiesChecked.length-1];
                    lastLetter = lastElem[lastElem.length-1];
                    if (lastLetter === "ъ" ||
                        lastLetter === "ь" ||
                        lastLetter === "ы") {
                        lastLetter = lastElem[lastElem.length-2];
                    }
                for (var c in citiesChecked) {
                    if (citiesChecked[c] === val) {
                        alert('Этот город уже был назван!');
                        return false;
                        }
                    }
                if (firstLetter === lastLetter) {
                        citiesChecked.push(val);
                        check.dispatchEvent(new Event('change'));
                        //check.checked = true;
                        AITurnProcess(val);                        
                        return true;
                    } else {
                        alert("Город должен начинаться на последнюю букву предыдущего: " + Game.prototype.AIResponseField.innerText)
                    }
                }
            }
        });
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

    },

    speechAction: function () {
        
        this.speech.addEventListener('click', function(e) {
            e.preventDefault();
            Game.prototype.speechInput(e);
        
        });
    }

    
}


document.addEventListener('DOMContentLoaded', function() {
    var game = new Game("#game");
});