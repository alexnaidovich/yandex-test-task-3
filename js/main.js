
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
    map: function () {
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
                            //alert('Координаты объекта :' + res.geoObjects.get(0).geometry.getCoordinates());
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
        this.startGame();
        this.map();
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
    
    listen: function() {
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
//                ymaps.ready(function(){
//                    var myGeocoder = ymaps.geocode(val);
//                    myGeocoder.then(
//                        function (res) {
//                            zoom: 3;
//                            alert('Координаты объекта :' + res.geoObjects.get(0).geometry.getCoordinates());
//                        },
//                        function (err) {
//                            alert('Ошибка');
//                        }
//                    );
//                })
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
                            ymaps.ready(function() {
                                ymaps.geocode(val);
                            });
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