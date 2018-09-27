window.onload = function() {
  let newGame = document.getElementById('concentration-settings');
  let currentScore = document.getElementById('current-score');
  let cardsLeft = document.getElementById('cards-left');
  let highScore = document.getElementById('high-score');
  let board = document.getElementById('board');
  let flipping = false;

  try {
    let savedStorage = localStorage.getItem('record') || '0';
    highScore.innerText = savedStorage;
  } catch (e) {
    console.log(
      'Your high score could not be loaded from local storage. Check to see if cookies/localstorage is enabled.'
    );
  }

  newGame.addEventListener('submit', function(event) {
    event.preventDefault();
    board.innerHTML = '';
    // GENERATE RANDOM DECK
    let pairCount = document.getElementById('pair-count').value;
    let suiteCount = document.getElementById('suite-count').value;
    currentScore.innerText = '0';
    cardsLeft.innerText = pairCount * 2;
    let deck = generateCards(parseInt(pairCount), parseInt(suiteCount));
    shuffle(deck);
    // GENERATE PAGE ELEMENTS
    for (let cards of deck) {
      let kadoSlot = document.createElement('div');
      kadoSlot.className = 'card-slot';
      let kado = document.createElement('div');
      kado.className = 'card';
      let kadoFront = document.createElement('div');
      kadoFront.className = 'card-front';
      let kadoBack = document.createElement('div');
      let kadoBackText = document.createElement('div');
      kadoBackText.innerText = cards['number'];
      kadoBackText.className = 'kado-text';
      let kadoBRText = document.createElement('div');
      kadoBRText.innerText = cards['number'];
      kadoBRText.className = 'kado-br-text';
      cards['suite'] === 'black'
        ? (kadoBack.className = 'card-back-black')
        : (kadoBack.className = 'card-back-red');

      kadoBack.appendChild(kadoBackText);
      kadoBack.appendChild(kadoBRText);
      kado.appendChild(kadoFront);
      kado.appendChild(kadoBack);
      kadoSlot.appendChild(kado);
      board.appendChild(kadoSlot);
    }
  }); //newGame.addEventListener

  board.addEventListener('click', function(event) {
    if (
      event.target.className.toLowerCase() === 'card-front' &&
      flipping === false
    ) {
      event.target.parentNode.parentNode.classList.toggle('flip');
      let flipBack = document.querySelectorAll('.flip');
      // IF TWO CARDS FLIPPED OVER
      if (flipBack.length > 1) {
        flipping = true;
        setTimeout(function() {
          currentScore.innerText = parseInt(currentScore.innerText) + 1;
          // MATCH
          if (flipBack[0].innerHTML === flipBack[1].innerHTML) {
            for (let match of flipBack) {
              match.classList.toggle('flip');
              match.classList.toggle('matched');
            }
            cardsLeft.innerText = parseInt(cardsLeft.innerText) - 2;
          }
          // NO MATCH
          else {
            for (let noMatch of flipBack) {
              noMatch.classList.toggle('flip');
            }
          }
          flipping = false;

          // WIN CONDITION
          if (cardsLeft.innerText === '0') {
            let wonGame = document.createElement('div');
            wonGame.className = 'victory-text';
            if (
              parseInt(currentScore.innerText) > parseInt(highScore.innerText)
            ) {
              highScore.innerText = currentScore.innerText;
              wonGame.innerText = `A new record: ${
                currentScore.innerText
              } moves!!!`;
              try {
                localStorage.setItem('record', highScore.innerText);
              } catch (e) {
                alert(
                  `Your high score of ${
                    currentScore.innerText
                  } could not be saved.`
                );
              }
            } else {
              wonGame.innerText = `You won in ${currentScore.innerText} moves!`;
            }
            board.appendChild(wonGame);
          }
        }, 1250);
      }
    }
  }); //board.addEventListener
};

function generateCards(pairs, suites) {
  let suite = 1;
  let numberRange = [
    'A',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
    'W'
  ];
  let deckofCards = [];
  for (let i = 0, num = 0; i < pairs; i++) {
    let card = {};
    card['number'] = numberRange[num];
    suite % 2 === 1 ? (card['suite'] = 'black') : (card['suite'] = 'red');
    deckofCards.push(card, card);
    num++;
    if (num >= numberRange.length) {
      num -= numberRange.length;
      suite += 1;
      if (suite > suites) suite = 1;
    }
  }
  return deckofCards;
}

function shuffle(array) {
  let counter = array.length;

  //Fisher-Yates Shuffle
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    array[counter] = [array[index], (array[index] = array[counter])][0];
  }
  return array;
}
