//alert("test");

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
    map: document.querySelectorAll('.map')[0],
    init: function() {
        this.startGame();
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
        this.listen(this.playerInput);
    },
    
    listen: function(val) {
        console.log(this);
        console.log(this.citiesChecked);
        console.log(this.submit);
        this.submit.addEventListener('click', function(e) {
            e.preventDefault();
            if (Game.citiesChecked.length === 0) {
                Game.citiesChecked.push(val);
                return true;
            } else {
                for (var cities in Game.citiesChecked) {
                    if (Game.citiesChecked[cities] === val) {
                        alert('Этот город уже был назван!');
                        return false;
                    }
                    
                    
                }
                
                var lastLetter = "";
                if (Game.AIResponse === "" && 
                    Game.AIResponse === undefined &&
                    Game.AIResponse === null) {
                    Game.AIResponse.innerText = val;
                    
                    
//                    for (var city in Game.citiesChecked) {
//                        for (var l = 0; l < Game.citiesChecked[city].length; l++) {
//                            if (l === (Game.citiesChecked[city].length - 1)) {
//                                lastLetter = Game.citiesChecked[city][l];
//                            }
//                        }
//                    }
                    
                    if (val[0] === lastLetter) {
                        Game.citiesChecked.push(val);
                        return true;
                    }
                }
            }
        })
    }
    
}

document.addEventListener('DOMContentLoaded', function() {
    var game = new Game("#game")
});