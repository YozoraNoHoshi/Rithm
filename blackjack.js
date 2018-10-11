window.onload = function() {
  let board = document.getElementById('blackjack-board');
  let dealerHand = document.getElementById('dealer-hand');
  let playerHand = document.getElementById('player-hand');
  let newGameNewLife = document.getElementById('blackjack-settings');
  let bankRoll = document.getElementById('bankroll');
  let hit = document.getElementById('hit-me');
  let stay = document.getElementById('hit-me-not');
  let bet = 0;
  let bonusBet = 0;
  let deck = [];
  let dealerTotal = {};
  let playerTotal = {};

  hit.disabled = true;
  stay.disabled = true;

  function drawCard(parent, hand, faceUp = false) {
    // Parent should be the container element for player/dealer
    // Card is drawn facedown by default
    let drawn = deck[deck.length - 1];

    let kadoSlot = document.createElement('div');
    kadoSlot.className = 'card-slot';
    let kado = document.createElement('div');
    kado.className = 'card';
    let kadoFront = document.createElement('div');
    kadoFront.className = 'card-front';
    let kadoBack = document.createElement('div');
    drawn['suite'] === 'black'
      ? (kadoBack.className = 'card-back-black')
      : (kadoBack.className = 'card-back-red');
    let kadoBackText = document.createElement('div');
    kadoBackText.innerText = drawn['number'];
    kadoBackText.className = 'kado-text';
    let kadoBRText = document.createElement('div');
    kadoBRText.innerText = drawn['number'];
    kadoBRText.className = 'kado-br-text';

    kadoBack.appendChild(kadoBackText);
    kadoBack.appendChild(kadoBRText);
    kado.appendChild(kadoFront);
    kado.appendChild(kadoBack);
    kadoSlot.appendChild(kado);
    parent.appendChild(kadoSlot);

    kadoSlot.classList.add('card-draw');
    if (faceUp === true) kadoSlot.classList.toggle('flip');
    deck.pop();
    hand[drawn['number']] = hand[drawn['number']] + 1 || 1;

    // Keeps a sum of all the cards in the hand.
    if (
      drawn['number'] === 'K' ||
      drawn['number'] === 'Q' ||
      drawn['number'] === 'J'
    ) {
      hand['sum'] = hand['sum'] + 10 || 10;
    } else if (drawn['number'] === 'A') {
      hand['sum'] = hand['sum'] + 11 || 11;
      hand['ace'] = hand['ace'] + 1 || 1;
    } else {
      let drawnCard = parseInt(drawn['number']);
      hand['sum'] = hand['sum'] + drawnCard || drawnCard;
    }
    if (hand['sum'] > 21 && hand['ace'] > 0) {
      hand['sum'] -= 10;
      hand['ace'] -= 1;
    }

    if (hand === playerTotal && playerTotal['sum'] > 21) {
      setTimeout(() => {
        bustText(playerHand, 'BUST');
      }, 1000);
    }
    if (hand === dealerTotal && dealerTotal['sum'] > 21) {
      setTimeout(() => {
        bustText(dealerHand, 'BUST');
      }, 1000);
    }

    return;
  }

  function bustText(parentElement, dispText) {
    let text = document.createElement('div');
    text.className = 'victory-text';
    text.innerText = dispText;

    parentElement.appendChild(text);
  }

  function dealerTurn(minHand = 17) {
    hit.disabled = true;
    stay.disabled = true;
    dealerHand.firstChild.classList.toggle('flip');
    if (dealerTotal['sum'] <= minHand) {
      let delay = setInterval(() => {
        drawCard(dealerHand, dealerTotal, true);
        if (dealerTotal['sum'] > minHand - 1) {
          dealerEnd();
          clearInterval(delay);
        }
      }, 1000);
    } else {
      dealerEnd();
    }
  }

  function dealerEnd() {
    setTimeout(() => {
      if (
        playerTotal['sum'] <= 21 &&
        (dealerTotal['sum'] > 21 || dealerTotal['sum'] <= playerTotal['sum'])
      ) {
        bustText(board, `You won ${bet} dollars!`);
        bankRoll.innerText = parseInt(bankRoll.innerText) + parseInt(bet);
      }
      if (
        playerTotal['sum'] > 21 ||
        (dealerTotal['sum'] > playerTotal['sum'] && dealerTotal['sum'] <= 21)
      ) {
        bustText(board, 'Dealer wins!');
        bankRoll.innerText = parseInt(bankRoll.innerText) - parseInt(bet);
      }
    }, 2000);
    return;
  }

  newGameNewLife.addEventListener('submit', function(event) {
    event.preventDefault();
    bet = document.getElementById('bet-amount').value;
    bonusBet = document.getElementById('bonus-amount').value;
    dealerHand.innerHTML = '';
    playerHand.innerHTML = '';
    dealerTotal = {};
    playerTotal = {};
    hit.disabled = false;
    stay.disabled = false;
    let erase = document.querySelectorAll('.victory-text');
    for (let del of erase) {
      board.removeChild(del);
    }

    // If deck length < 10 cards, recreate and shuffle
    if (deck.length < 10) {
      deck = generateCards(26, 1);
      shuffle(deck);
    }
    bankRoll.innerText = parseInt(bankRoll.innerText) - bonusBet;
    // One facedown card for dealer, one faceup
    drawCard(dealerHand, dealerTotal);
    drawCard(dealerHand, dealerTotal, true);
    // Player Hand both cards faceup
    drawCard(playerHand, playerTotal, true);
    drawCard(playerHand, playerTotal, true);
    // Check bonus bet condition
    if (bonusBet > 0) {
      let bonusMultiplier = 0;
      if (playerTotal['Q'] === 2) bonusMultiplier += 3;
      if (playerTotal['sum'] === 20) bonusMultiplier += 3;
      bankRoll.innerText =
        parseInt(bankRoll.innerText) + bonusBet * bonusMultiplier;
    }
    // If player hand === 21 disable hit, proceed to dealer turn
    if (playerTotal['sum'] === 21) {
      hit.disabled = true;
      stay.disabled = true;
      setTimeout(dealerTurn(), 3000);
    }
  });
  // Hit button
  hit.addEventListener('click', function(event) {
    drawCard(playerHand, playerTotal, true);
    if (playerTotal['sum'] >= 21) {
      setTimeout(dealerTurn(), 3000);
    }
  });
  // Stay button
  stay.addEventListener('click', function(event) {
    dealerTurn();
  });
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
    'K'
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

// LOOK INTO USING setInterval with a conditional to continue the loop!
