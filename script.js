const word = document.querySelector('.word');
let wrongLettersCount = document.querySelector('.word-mistakes');
const correctWords = document.querySelector('.correct-count');
const wrongWords = document.querySelector('.wrong-count');
const timeDisplay = document.querySelector('#timer');
const overlay = document.querySelector('.overlay');
const overlayMessage = document.querySelector('.message');
const restartButton = document.querySelector('.restart-btn');


let currentWord = '';
let currentIndex = 0;
let wrongLetters = 0;
let correctWordsCount = 0;
let wrongWordsCount = 0;
let isActive = false;
let timerId;
let gameOver = false;
let finalTime = '';


async function getRandomWord() {
  try {
    const responce = await fetch('https://random-word-api.vercel.app/api?words=5');
    const data = await responce.json();
    currentWord = data[0].toLowerCase();
    currentIndex = 0;
    word.innerHTML = '';
    currentWord.split('').forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.dataset.index = index;
      word.append(span);
    });
  } catch {
    overlay.style.display = 'flex';
    overlayMessage.textContent = 'Упс. Что-то пошло не так... Попробуй еще раз'
  }
}

function toggleStopwatch() {
  let [minutes, seconds] = timeDisplay.textContent.split(':').map(Number);

  if (!isActive) {
    timerId = setInterval(() => {
      seconds++;
      if (seconds > 59) {
        seconds = 0;
        minutes++;
      }

      const minutesFormated = String(minutes).padStart(2, '0');
      const secondsFormated = String(seconds).padStart(2, '0');
      timeDisplay.textContent = `${minutesFormated}:${secondsFormated}`;
    }, 1000);

    isActive = true;
  } else {
    clearInterval(timerId);
    isActive = false;
  }
}


function handleKeyDown(event) {
  if (gameOver) return;

  if (!isActive) toggleStopwatch();

  const pressedKey = event.key.toLowerCase();
  const pressedLetter = word.children[currentIndex];
  if (pressedKey === currentWord[currentIndex]) {
    pressedLetter.classList.remove('w');
    pressedLetter.classList.add('c');
    currentIndex++;
  } else {
    pressedLetter.classList.add('w');
    wrongLetters++;
    wrongLettersCount.textContent = wrongLetters;
  }

  if (currentIndex === currentWord.length) {
    getRandomWord();
    if (wrongLetters > 0) {
        wrongWordsCount++;
        wrongWords.textContent = wrongWordsCount;
      } else {
    correctWordsCount++;
    correctWords.textContent = correctWordsCount;
      }
      wrongLetters = 0;
      wrongLettersCount.textContent = wrongLetters;
    }
    if (correctWordsCount === 5 || wrongWordsCount === 5) {
      finalTime = timeDisplay.textContent;
      clearInterval(timerId);
      gameOver = true;
      overlay.style.display = 'flex';
      overlayMessage.textContent = `${correctWordsCount === 5 ? 'Победа' : 'Неудача'}! Ваше время - ${finalTime}`;
      document.removeEventListener('keydown', handleKeyDown);
    }
    
  }

  function restartGame() {
    currentIndex = 0;
    wrongLetters = 0;
    correctWordsCount = 0;
    wrongWordsCount = 0;
    isActive = false;
    gameOver = false;
    finalTime = '';
  
    correctWords.textContent = '0';
    wrongWords.textContent = '0';
    wrongLettersCount.textContent = '0';
    timeDisplay.textContent = '00:00';
  
    word.innerHTML = '';
  
    overlay.style.display = 'none';
  
    getRandomWord();

    document.addEventListener('keydown', handleKeyDown);
  }
  

  document.addEventListener('keydown', handleKeyDown)

  restartButton.addEventListener('click', restartGame);



getRandomWord();

