
function Game(element) {
    this.el = document.querySelector(element);
    this.init();
}

Game.prototype = {    
    input: document.querySelector('input[type="text"]'),
    citiesChecked: [],
    playerInput: "",
    start: document.querySelector('button[name="start"]'),
    submit: document.querySelector('button[type="submit"]'),
    AIResponseField: document.querySelector('#AIanswer'),
    AIResponse: "", //AIResponseField.InnerText,
    //gameData: [], //require gamedata
    testGameData: [],
    maps: function () {
        var gameMap, locate;
        
        ymaps.ready(function () {
            gameMap = new ymaps.Map ("map", {
                center: [53.889102, 27.506835],
                zoom: 6
            });
            
            var val = "Минск";
            
            Game.prototype.submit.addEventListener('click', function () {
                var val = Game.prototype.AIResponseField.innerText;
                if (val !== undefined && val !== "") {
                    locate = ymaps.geocode (val);
                    locate.then(
                        function (res) {
                           var coords = res.geoObjects.get(0).geometry.getCoordinates();
                            console.log(coords);
                            gameMap.setCenter(coords, 10);

                        },
                        function (err) {
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
        var dataCities;
        var gameData = Game.prototype.testGameData;
        
        function loadText (url) {
            if (window.XMLHttpRequest) {
                dataCities = new XMLHttpRequest();
            } else if (window.ActiveXObject) {
                dataCities = new ActiveXObject("Microsoft.XMLHTTP");
            }
            
            if (dataCities !== undefined) {
                dataCities.onreadystatechange = function () {
                    loadDone();
                }
                dataCities.open("GET", url, true);
                dataCities.send("");
            } else {
                alert("Can\'t load file")
            }
        }
        
        function loadDone () {
            if (dataCities.readyState === 4) {
                if (dataCities.status === 200) {
                    console.log("Loaded:\n" + dataCities.responseText);
                } else {
                    alert("Error:\n" + dataCities.status + dataCities.statusText);
                }
            }
        }
        
        for (var i = 0; i < 30, i++) {
            gameData.push(new Array)
        }
        
        for (var arr in gameData) {
            var content = loadText('https://github.com')
        }
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
            var val = Game.prototype.input.value;
            var lastLetter = "",
                lastElem = "",
                firstLetter = val[0].toLowerCase();
            
            var citiesChecked = Game.prototype.citiesChecked
            if (Game.prototype.AIResponse === "") {
            if (citiesChecked.length === 0) {
   //             Game.prototype.AIResponseField.innerText = val;
                citiesChecked.push(val);
                AITurn(val);
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


    AITurn: function (city) {
        
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

    speech: document.getElementById('startSpeech'),
    speech.addEventListener('click', () => {
        speechInput(event);
    })


    
}


document.addEventListener('DOMContentLoaded', function() {
    var game = new Game("#game")
});