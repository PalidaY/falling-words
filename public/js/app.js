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





let score = 0;
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

const DICTIONARY = [
  "school",
  "college",
  "btc",
  "elon",
  "musk",
  "courses",
  "internet",
  "patience",
  "argentina",
  "motivation",
  "tech",
  "info",
  "send",
  "mate",
  "reactjs",
  "game",
  "brusca",
  "graphic",
  "copper",
  "boca",
  "lie",
  "case",
  "expand",
  "absence",
  "football",
  "native",
  "demon",
  "thread",
  "award",
  "tycoon",
  "riquelme",
  "still",
  "empirical",
  "doll",
  "java",
  "ackerman",
  "dinner",
  "register",
  "proof",
  "script",
  "wrist",
  "sulphur",
  "selection",
  "slam",
  "grandmother",
  "assertive",
  "eaux",
  "javascript",
  "admiration",
  "recognize",
  "roll",
  "bank",
  "reactor",
  "gradient",
  "ribbon",
  "slayer",
  "pleasant",
  "path",
  "draft",
  "polish",
  "art",
  "hook",
  "messi",
  "flow",
  "operational",
  "transaction",
  "physics",
  "rally",
  "fold",
  "housewife",
  "suspicion",
  "craft",
  "objective",
  "grass",
  "reckless",
  "manual",
  "test",
  "switch",
  "diegote",
  "silver",
  "take",
  "president",
  "constituency",
  "basis",
  "cluster",
  "psychology",
  "cat",
  "minimize",
  "hide",
  "chord",
  "brilliance",
  "official",
  "condition",
  "guideline",
  "apology",
  "general",
  "sock",
  "hunting",
  "kinship",
  "change",
  "departure",
  "mile",
  "ancestor",
  "diego",
  "cheat",
  "taxi",
  "tight",
  "moment",
  "dimension",
  "family",
  "vegan",
  "projection",
  "demonstration",
  "pony",
  "standard",
  "appendix",
  "reluctance",
  "gian",
  "davinci",
  "system",
  "analyst",
  "levi",
];


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
  } else if (LEVEL === "2000") {
    roomName.innerText = 'Room Medium ';
  } else {
    roomName.innerText = 'Room Hard ';
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

  socket.emit('buttonPressed', LEVEL);



});

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
  const word = generateRandomWord(DICTIONARY);
  console.log(word);
  arrWords.push(word);
  let wordDiv = document.createElement("div");

  wordDiv.innerHTML = `<p>${word}</p>`;
  wordDiv.classList.add("word");
  wordDiv.style.top = "-2px";
  wordDiv.style.zIndex = "1";
  wordDiv.style.left = (Math.random() * (gameWidth - 150)).toString() + "px";

  //Push words
  arrWordsDiv.push(wordDiv);
  gameContentClass[0].appendChild(wordDiv);

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
    updateScore();
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
function updateScore() {
  score += 10;
  scoreElementID.innerHTML = `<p>Score ${score}</p>`;
  socket.emit('showscore', { username, LEVEL, score });
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





