const word = document.querySelector('.word');
const wrongLettersCount = document.querySelector('.word-mistakes');
const correctWords = document.querySelector('.correct-count');
const wrongWords = document.querySelector('.wrong-count');
const timeDisplay = document.querySelector('#timer');


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
    const response = await fetch('https://random-word-api.vercel.app/api?words=1');
    const data = await response.json();
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
    alert('Упс. Что-то пошло не так... Попробуй еще раз');
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

function checkGameEnd() {
  if (correctWordsCount === 5 || wrongWordsCount === 5) {
    finalTime = timeDisplay.textContent;
    clearInterval(timerId);
    gameOver = true;
    alert(`${correctWordsCount === 5 ? 'Победа' : 'Неудача'}! Ваше время ${finalTime}`);
    document.removeEventListener('keydown', handleKeyDown);
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
  setTimeout(checkGameEnd, 0);
}



document.addEventListener('keydown', handleKeyDown)



getRandomWord();

