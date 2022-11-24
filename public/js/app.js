// Frontend Client
//game.html

// HTTP GET LEVEL FROM index.html


const socket = io();
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const welcome = document.getElementById('welcome');
const playbutton = document.getElementById('playgame');
const buttonSectionID = document.getElementById("buttonsection");


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
console.log(queryString);
const LEVEL = urlParams.get('level')
const username = urlParams.get('username')
console.log(LEVEL);

const buttonElementID = document.getElementById("StartButton");
const gameContentID = document.getElementById("GameContent");
const gameContentClass = document.getElementsByClassName("game-content");
const inputElementID = document.getElementById("InputWord");
const scoreElementID = document.getElementById("Score");
const scoreElementClass = document.getElementsByClassName("score");
const levelElementID = document.getElementById("Level");



// VARIABLES
const currentLevel = LEVEL;
const gameWidth = gameContentID.clientWidth;
const gameHeight = gameContentID.clientHeight;



//Initial Score
let score;
if(currentLevel==2600){
 score = 500;
 scoreElementID.innerHTML = `<p>Score ${score}</p>`;
}else{
  score = 0;
  scoreElementID.innerHTML = `<p>Score ${score}</p>`;
}

let gameOver = false;
let arrWords = [];
let arrWordsDiv = [];
let topVal = 0;

// SOUNDS
const startGameSound = document.getElementById("StartGameSound");
const gameoverSound = document.getElementById("GameoverSound");
const pointSound = document.getElementById("PointSound");
const notPointSound = document.getElementById("NotPointSound");

// DEFAULT VOLUME (was too high)
startGameSound.style.zIndex = 1;
startGameSound.volume = 0.5;
gameoverSound.volume = 0.5;
pointSound.volume = 0.2;

// DICTIONARY
 //1
 let GENERALDICTIONARY = [ "chest", "whip", "bank", "jaw", "other", "adult", "wild", "mind", "fate", "rib", "boot", "weak", "term", "cafe", "heavy", "sheep", "fly", "paper", "right", "area", "color", "clay", "role", "low", "chain", "coup", "fuss", "shock", "show", "white", "knife", "net", "rain", "space", "track", "solid", "red", "safe", "mug", "egg", "add", "slime", "mess", "liver", "attic", "sweat", "oak", "rich", "soup", "edge", "money", "lost", "club", "thaw", "valid", "bless", "fare", "no", "unity", "Mars", "linen", "brand", "sink", "pride", "range", "is", "shave", "test", "mile", "stop", "dish", "quote", "weak", "grain", "crown", "proof", "urine", "pray", "hand", "basis", "abbey", "graze", "TRUE", "loud", "grind", "dough", "lift", "fat", "horn", "glove", "twin", "bait", "lion", "young", "think", "act", "sale", "high", "ear", "build", "new", "say", "salt", "rare", "wall", "lung", "sun", "death", "bride", "snarl", "trial", "miner", "axis", "tear", "tick", "rugby", "tube", "chain", "cry", "loop", "fear", "swim", "help", "means", "pack", "story", "knife", "shine", "poem", "heart", "lead", "flock", "root", "grass", "arise", "crop", "mole", "lack", "north", "model", "shelf", "tease", "half", "good", "funny", "prey", "jaw", "cycle", "host", "far", "total", "lamb", "us", "rung", "move", "trend", "red", "pawn", "route", "pen", "peace", "tense", "ally", "mug", "sign", "liver", "bean", "back", "stuff", "essay", "stake", "cell", "rate", "fur", "chin", "arrow", "ample", "cruel", "pick", "sweet", "novel", "snarl", "talk", "smile", "burn", "chief", "reach", "flood", "money", "warn", "work", "hand", "yearn", "stay", "snack", "color", "horn", "know", "prove", 
 "solid" ];
 GENERALDICTIONARY = GENERALDICTIONARY.map(element => {
 
   return element.toLowerCase();
 });
 
 //2
 let LONGWORDDICTIONARY =["Antidisestablishmentarianism",
  "Floccinaucinihilipilification",
  "Pneumonoultramicroscopicsilicovolcanoconiosis",
  "Pseudopseudohypoparathyroidism",
  "Psychoneuroendocrinological",
  "Sesquipedalian",
  "Hippopotomonstrosesquippedaliophobia",
  "Incomprehensibilities",
  "Uncopyrightable",
  "Dermatoglyphics",
 "Psychophysicotherapeutics",
 "Otorhinolaryngological",
 "Juxtaposition",
 "Onomatopoeia",
 "Ablutophobia",
 "Absorbefacient",
 "Adiathermancy",
 "Agglutination",
 "Arachibutyrophobia",
 "Aurantiaceous",
 "Automatonophobia",
 "Autothaumaturgist",
 "Autotonsorialist",
 "Automysophobia",
 "Ballistocardiograph",
 "Bathythermograph", 
 "Batrachomyomachy",
 "Batrachophagous", 
 "Bicrescentic",
 "Blandiloquence",
 "Brachydactylous",
 "Brobdingnagian",
 "Bouleversement",
 "Boustrophedon",
 "Cacodemomania",
 "Caesaropapism", 
 "Catapedamania",
 "Cephalonomancy", 
 "Ceruminiferous",
 "Chaetophorous",
 "Cheiloproclitic",
 "Cholangiocholecystocholedochectomy",
 "Chronosynchronicity",
 "Cycloganoidei",
 "Dactylopterous",
 "Defecaloesiophobia",
 "Dendrochronology",
 "Deorsumversion",
 "Dermatoglyphics",
 "Dermatopathophobia",
 "Didaskaleinophobia",
 "Dishabiliophobia",
 "Dysmorphophobia",
 "Ecclesiasticus",
 "Edriophthalmous",
 "Electroencephalograph",
 "Electrodynamometer",
 "Eleutherophobia", 
 "Epiphenomenalism",
 "Ephemeromorph",
 "Epistaxiophobia",
 "Ethnomethodology",
 "Extemporaneousness",
 "Febrifacient",
 "Ferriprussiate", 
 "Flagelliferous",
 "Flibbertigibbet",
 "Fibriophobia",
 "Fibrochondrosteal",
 "Fissigemmation",
 "Forisfamiliation",
 "Frankalmoigne",
 "Frumentaceous",
 "Galactodensimeter",
 "Gastroduodenitis",
 "Gastrohysterotomy",
 "Generalissimo",
 "Gephydrophobia",
 "Germanophilia", 
 "Gluconeogenesis",
 "Graminivorous",
 "Grammaticaster", 
 "Gynotikolobomassophile",
 "Haematogenesis", 
 "Haematodynamometer",
 "Haussmannize",
 "Hellenologophobia", 
 "Helioseismology", 
 "Hexakosioihexekontahexaphobia",
 "Honorificabilitudinitatibus",
 "Honorificabilitudinity", 
 "Hydrometeorology",
 "Hypercatalectic"];
 LONGWORDDICTIONARY = LONGWORDDICTIONARY.map(element => {
   return element.toLowerCase();
 });
 
 //3
 let ANGELWORDDICTIONARY =
 ["Stunning",
 "Charming",
 "Enticing",
 "Best",
 "Breathtaking",
 "Fetching",
 "Intriguing",
 "Unique",
 "Generous",
 "Wondrous",
 "Elegant",
 "Lovely",
 "Wonderful",
 "Talented",
 "Brilliant",
 "Incredible",
 "Amazing",
 "Spectacular",
 "Marvelous",
 "Captivating",
 "Appealing",
 "Enchanting",
 "Admirable",
 "Adorable",
 "Awesome",
 "Beautiful",
 "Fantastic",
 "Gorgeous",
 "Kindness",
 "Perfect"] ;
 ANGELWORDDICTIONARY  = ANGELWORDDICTIONARY.map(element => {
   return element.toLowerCase();
 });
 
 //4
 let FORBIDDENWORDDICTIONARY =
 ["Asshole",
 "Bastard",
 "Bugger",
 "Bloody hell",
 "Damn",
 "Holy cow",
 "Drat",
 "Judas Priest",
 "Barnacles",
 "Cumbubble",
 "fuck off",
 "Shitbag",
 "Shit",
 "fuck",
 "Corn Nuts",
 "Piss off",
 "Dagnabbit",
 "Crikey",
 "Bollocks",
 "Twat",
 "Knobhead",
 "Rubbish",
 "Cack",
 "Wanker",
 "nonce",
 "wazzock",
 "Jizzstain",
 "shitpouch",
 "arsebadger",
 "Bawbag",
 "Dang it",
 "Damn it",
 "Noob",
 "douche nozzle",
 "Fuckwit"] ;
 FORBIDDENWORDDICTIONARY = FORBIDDENWORDDICTIONARY.map(element => {
   return element.toLowerCase();
 });
 
 //5
 let WEAPONWORDDICTIONARY =
 [ "Nuclear",  
 "Bomb",
 "Snipers",
 "Gun",
 "Sword",
 "Knife",
 "Missile",
 "Rifle",
 "Pistols",
 "Shotgun",
 "Handguns",
 "Nuclear",  
 "Bomb",
 "Snipers",
 "Gun",
 "Sword",
 "Knife",
 "Missile",
 "Rifle",
 "Pistols",
 "Shotgun",
 "Handguns",
 "Nuclear",  
 "Bomb",
 "Snipers",
 "Gun",
 "Sword",
 "Knife",
 "Missile",
 "Rifle",
 "Pistols",
 "Shotgun",
 "Handguns",
 "Nuclear",  
 "Bomb",
 "Snipers",
 "Gun",
 "Sword",
 "Knife",
 "Missile",
 "Rifle",
 "Pistols",
 "Shotgun",
 "Handguns",
 "Nuclear",  
 "Bomb",
 "Snipers",
 "Gun",
 "Sword",
 "Knife",
 "Missile",
 "Rifle",
 "Pistols",
 "Shotgun",
 "Handguns",
 "Nuclear",  
 "Bomb",
 "Snipers",
 "Gun",
 "Sword",
 "Knife",
 "Missile",
 "Rifle",
 "Pistols",
 "Shotgun",
 "Handguns"] ;
 WEAPONWORDDICTIONARY = WEAPONWORDDICTIONARY.map(element => {
   return element.toLowerCase();
 });
 
 //6
 let OUTWORDDICTIONARY =
 ["United Nations",
 "asean",
 "Los Angeles",
 "Chicago",
 "San Diego",
 "Columbus",
 "Washington",
 "Boston",
 "Las Vegas",
 "Miami",
 "York",
 "Wells",
 "London",
 "APEC",
 "Peterborough",
 "Portsmouth",
 "Biden",
 "Trump",
 "Bangkok",
 "Pattaya",
 "Chiang Mai",
 "Hat Yai",
 "Phuket",
 "Ko Samui",
 "Yala",
 "Taipei",
 "Hong Kong",
 "Macau",
 "Beijing",
 "Shanghai",
 "Toronto",
 "Mumbai",
 "Delhi",
 "Kolkata"] ;
 OUTWORDDICTIONARY = OUTWORDDICTIONARY.map(element => {
   return element.toLowerCase();
 });
 
 //7
 let INCATEGORYDICTIONARY =[ "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Rep", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea North", "Korea South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russian Federation", "Rwanda", "St Lucia", "Samoa", "San Marino", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe" ];
 INCATEGORYDICTIONARY = INCATEGORYDICTIONARY.map(element => {
   return element.toLowerCase();
 });
 
 
 // Concat DICTIONARY
 // EASY MEDIUM HARD SUPERHARD
 let DICTIONARY = GENERALDICTIONARY.concat(LONGWORDDICTIONARY); 
 // WAR
 let WARDICTIONARY = GENERALDICTIONARY.concat(LONGWORDDICTIONARY,ANGELWORDDICTIONARY,FORBIDDENWORDDICTIONARY,WEAPONWORDDICTIONARY,WEAPONWORDDICTIONARY,WEAPONWORDDICTIONARY)
 //WORD TRAP
 let CATDICTIONARY =INCATEGORYDICTIONARY.concat(OUTWORDDICTIONARY,FORBIDDENWORDDICTIONARY);


// Join Game
socket.emit('joinRoom', { username, LEVEL });

//Welcome msg
socket.on('welcomemessage', welcomemessage => {
  console.log(welcomemessage);
  welcome.innerHTML = welcomemessage;

});

socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);


});

function outputRoomName(room) {

  if (room === "3000") {
    roomName.innerText = 'Room Easy ';
  } else if (room=== "2000") {
    roomName.innerText = 'Room Medium ';
  } else if (room=== "1200") {
    roomName.innerText = 'Room Hard ';
  }else if (room=== "1000") {
    roomName.innerText = 'Room Super Hard ';
  }else if (room=== "3500") {
    roomName.innerText = 'Room Word Trap ';
  }else if (room=== "2600") {
    roomName.innerText = 'Room War';
  }

}


function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username + ' score: ' + user.score;
    userList.appendChild(li);
  });

}

// start button after clicked
playbutton.addEventListener("click", () => {
  console.log("botton clicked");
  socket.emit("shuffleDictionary",{DICTIONARY,WARDICTIONARY,CATDICTIONARY});
  socket.emit('buttonPressed', LEVEL);



});

socket.on("sendDictoroom", ({newDICTIONARY,newWARDICTIONARY,newCATDICTIONARY}) =>{
  DICTIONARY = newDICTIONARY;
  WARDICTIONARY = newWARDICTIONARY;
  CATDICTIONARY= newCATDICTIONARY;

})

socket.on('startplayfromserver', () => {
  playbutton.style.display = 'none';
  showRestartButton();
  init();
});



function showRestartButton() {
  const reset = `<p><button onclick="Resetscore()" type="submit" id = "restartgame" class="col-12 btn-index">
      <h6>Restart</h6></button></p>`;
  document.getElementById("buttonsection1").innerHTML = reset;


}

function Resetscore() {
  socket.emit("ReStart");
}
socket.on("Restartfromserver", () => {
  window.location.reload();
});

// iT IS NOT AUTOMATICALLY SHIP TO READ SOCKET.ON WHEN YOU DO SOCKET.EMIT
// 


// GAME START
function init() {
  console.log('1');
  timedCount();
  showLevel();

  setInterval(() => {
    if (!gameOver) {
      console.log('2: REQUEST WORD');

      drawWord();


    }
  }, currentLevel);

  console.log('3');


  updateWordPosition();


}




const maxtime = 30000;
let counter = maxtime / 1000; // seconds
document.getElementById("Time").innerHTML = counter;

//show countdown
function timedCount() {
  counter--;
  document.getElementById("Time").innerHTML = counter;
  if (counter != 0 && !gameOver) {
    timeout = setTimeout(timedCount, 1000); //loop
  }
  if (counter == 0) {
    // gameover when counter=0
    socket.emit('Gameover', LEVEL);
    gameOver = true;
  }
}


// CREATE WORD, STORES IT IN AN ARRAY & GET POSITION WHERE IT STARTS TO FALLLS
function drawWord() {
  let word;
  let wordDiv;
  // EASY MEDIUM HARD 
  if(currentLevel=="3000" || currentLevel=="2000"||currentLevel=="1200"){ 
    word = generateRandomWord(DICTIONARY);
    console.log("EASY " +word);
    wordDiv = document.createElement("div");
    wordDiv.innerHTML = `<p>${word}</p>`;

    if(GENERALDICTIONARY.includes(word)){
      wordDiv.classList.add("word");
      wordDiv.setAttribute("id", "general");

    }else{
      wordDiv.classList.add("word");
      wordDiv.setAttribute("id", "long");
    }
   
    // SUPER HARD 
  }else if(currentLevel=="1000"){
   
    word = generateRandomWord(DICTIONARY);
    console.log("SH " +word);
    wordDiv = document.createElement("div");
    wordDiv.innerHTML = `<p>${word}</p>`;

    if(GENERALDICTIONARY.includes(word)){
      wordDiv.classList.add("word");
      wordDiv.setAttribute("id", "generalsp");
    }else{
      wordDiv.classList.add("word");
      wordDiv.setAttribute("id", "longsp");
    }
    //WAR
  }else if(currentLevel=="2600"){
    word = generateRandomWord(WARDICTIONARY);
    console.log("War " +word);
    wordDiv = document.createElement("div");
    wordDiv.innerHTML = `<p>${word}</p>`;

    if(GENERALDICTIONARY.includes(word) || FORBIDDENWORDDICTIONARY.includes(word)){
      wordDiv.classList.add("word");
      wordDiv.setAttribute("id", "general");
    }else if(LONGWORDDICTIONARY.includes(word)){
      wordDiv.classList.add("word");
      wordDiv.setAttribute("id", "long");
    }else if(WEAPONWORDDICTIONARY.includes(word)){
      wordDiv.classList.add("word");
      wordDiv.setAttribute("id", "weapon");
    }else if(ANGELWORDDICTIONARY.includes(word)){
      wordDiv.classList.add("word");
      wordDiv.setAttribute("id", "angel");
    }
      // Word Trap
  }else{ 
    word = generateRandomWord(CATDICTIONARY);
    console.log("Trap " +word);
    wordDiv = document.createElement("div");
    wordDiv.innerHTML = `<p>${word}</p>`;
    if(INCATEGORYDICTIONARY.includes(word) || FORBIDDENWORDDICTIONARY.includes(word) || OUTWORDDICTIONARY.includes(word)){
      wordDiv.classList.add("word");
      wordDiv.setAttribute("id", "general");
    }
   
  }
  //console.log(word);
  arrWords.push(word);
  wordDiv.style.top = "-2px";
  wordDiv.style.zIndex = "1";
  wordDiv.style.left = (Math.random() * (gameWidth - 150)).toString() + "px";

//Push words
  arrWordsDiv.push(wordDiv);
  gameContentClass[0].appendChild(wordDiv);
  //console.log(arrWords);
  //console.log(arrWordsDiv);


}

// GET RANDOM WORD FROM DICTIONARY
let i = -1;
function generateRandomWord(words) {
  i++;
  if (i >= words.length) {
    i = 0;
  }
  return words[i];
}


// GET VALUE FROM INPUT and check whether it is right or not
function getWord() { // call
  let inputValue = inputElementID.value.toLowerCase();
  inputElementID.value = "";
  if (arrWords.includes(inputValue)) {
    updateScore(inputValue);
    playSound(pointSound, 0, notPointSound);
    socket.emit("Deleteword", inputValue);

  } else {
    playSound(notPointSound, 0, pointSound);
  }
}

socket.on("startdeletefromserver", inputValue => {
  //console.log(inputValue);
  let indexWord = arrWords.indexOf(inputValue); // index of inputword in arrWords  
  let wordDivIndex = arrWordsDiv[indexWord];    // inputword in div
  arrWords.splice(indexWord, 1);    // remove inputword from arrWords
  arrWordsDiv.splice(indexWord, 1); // remove inputword from arrWordsDiv
  wordDivIndex.parentNode.removeChild(wordDivIndex); // (parent node of inputword) remove that word
});



// FALLING WORD LOGIC 
function updateWordPosition() {
  setInterval(() => {
    if (!gameOver) {
      let wordText = document.getElementsByClassName("word");

      for (let i = 0; i < arrWords.length; i++) {

        // update topval
        topVal = wordText[i].style.top;
        topVal.replace("px", "");
        //console.log(wordText[i]);
        wordText[i].style.top = (parseInt(topVal) + 1).toString() + "px";
        //console.log(wordText[i]); 
        if (parseInt(topVal) > gameHeight) {
          wordText[i].innerText = "";
        }


      }
    }
  }, 20);
}

// UPDATE SCORE
function updateScore(inputValue) {
  /*
  console.log("inputvalue is "+ inputValue);
  score += 10;
  scoreElementID.innerHTML = `<p>Score ${score}</p>`;
  socket.emit('showscore', { username, LEVEL, score });
  */
  if(GENERALDICTIONARY.includes(inputValue)){
    console.log("general "+ inputValue);
    score += 10;

    scoreElementID.innerHTML = `<p>Score ${score}</p>`;
    socket.emit('showscore', { username, LEVEL, score });
  }else if(LONGWORDDICTIONARY.includes(inputValue)){
    console.log("long "+ inputValue);
    score += 50;

    scoreElementID.innerHTML = `<p>Score ${score}</p>`;
    socket.emit('showscore', { username, LEVEL, score });

    // WAR
  }else if(inputValue == "nuclear"){
    console.log("nuclear "+ inputValue);
     score = 0;

     scoreElementID.innerHTML = `<p>Score ${score}</p>`;
     socket.emit("nuclear",score);
     socket.emit('Gameover');
     gameOver = true;
  }else if(inputValue == "missile"){
    scoreElementID.innerHTML = `<p>Score ${score}</p>`;
    socket.emit("missile",score);
    
  }else if(inputValue == "bomb"){
    scoreElementID.innerHTML = `<p>Score ${score}</p>`;
    socket.emit("bomb",score);

  }else if((["snipers","rifle",
  "pistols",
  "gun",
  "shotgun",
  "handguns"]).includes(inputValue)){
    scoreElementID.innerHTML = `<p>Score ${score}</p>`;
    socket.emit("gun",score);

  }else if((["sword","knife"]).includes(inputValue)){
    scoreElementID.innerHTML = `<p>Score ${score}</p>`;
    socket.emit("knife",score);

  }else if(ANGELWORDDICTIONARY.includes(inputValue)){
    scoreElementID.innerHTML = `<p>Score ${score}</p>`;
    socket.emit("angel",score);
  }else if(FORBIDDENWORDDICTIONARY.includes(inputValue)){
    console.log("forbidden "+ inputValue);
    score = 0;
    scoreElementID.innerHTML = `<p>Score ${score}</p>`;
    socket.emit('showscore', { username, LEVEL, score });

  }else if(INCATEGORYDICTIONARY.includes(inputValue)){
    score += 10;
    scoreElementID.innerHTML = `<p>Score ${score}</p>`;
    socket.emit('showscore', { username, LEVEL, score });

  }else if(OUTWORDDICTIONARY.includes(inputValue)){
    score -= 10;
    scoreElementID.innerHTML = `<p>Score ${score}</p>`;
    socket.emit('showscore', { username, LEVEL, score });
  } 
}



// HELPERS
// PLAY SOUND
function playSound(sound, time, stopSound) {
  let playPromise = sound.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        stopSound.pause();
        sound.pause();
        stopSound.currentTime = 0;
      })
      .then(() => {
        sound.currentTime = time;
      })
      .then(() => {
        sound.play();
      });
  }
}

// SHOWS CURRENT PLAYING LEVEL
function showLevel() {
  if (LEVEL === "3000") {
    levelElementID.innerHTML = `<p>Level: EASY</p>`;
  } else if (LEVEL === "2000") {
    levelElementID.innerHTML = `<p>Level: MEDIUM</p>`;
  } else {
    levelElementID.innerHTML = `<p>Level: HARD</p>`;
  }
}
//gameover when time is out



socket.on("FinalUsers", ({ users }) => {
  let maxvalue = parseInt(score);
  users.forEach((user) => {
    if (maxvalue <= parseInt(user.score)) {
      maxvalue = parseInt(user.score);
    }
  });
  socket.emit('showWinners', maxvalue);
});

let winner = '';
socket.on('Winners', ({ users }) => {

  users.forEach((user) => {
    winner += user.username + `<br>`;
  });
  console.log(socket.id + " " + winner);
  gameContentID.innerHTML = modalGameOver();
  playSound(gameoverSound, 8, startGameSound);
  gameoverSound.style.zIndex = 1;
  inputElementID.setAttribute("disabled", true);


});



function modalGameOver() {
  return `
      <div class="modal-gameover col-8">
      <h1> Game Over </h2>
      <h2> The winner is ${winner} <h2>
      <h2> Your Score: ${score} </h2>
      <ul id="users"></ul>
      <button id="Restart" class="my-2 btn-modal">
        <a href="game.html?username=${username}&level=${currentLevel}">
          <h6>Restart</h6>
        </a>
      </button>
      <button id="Menu" class="my-2 btn-modal">
        <a href="index.html">
          <h6>Back to menu</h6>
        </a>
      </button>
    </div>
  `;
}





