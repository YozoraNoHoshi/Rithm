window.onload = function() {
  // document.getElementById('dl-target-stam').onchange = dlCalculateStamina;
  // document.getElementById('dl-current-wings').onchange = dlCalculateStamina;
  // document.getElementById('target-gold').onchange = dlCalculateGold;
  // document.getElementById('f-difficulty').onchange = dlCalculateGold;
  // document.getElementById('tt-difficulty').onchange = fehCalculateTT;
  // document.getElementById('tt-target-score').onchange = fehCalculateTT;
  // document.getElementById('tt-current-score').onchange = fehCalculateTT;
  let calcBanner = document.getElementById('drag-feh-banner');
  // let dragStamFormElements = document.querySelectorAll('.dl-stam');
  let dragGoldFormElements = document.querySelectorAll('.dl-gold');
  let fehTTFormElements = document.querySelectorAll('.feh-tt');

  calcBanner.onclick = switchBanner;

  // for (let elements of dragStamFormElements) {
  //   elements.addEventListener('change', event => {
  //     event.preventDefault();
  //     dlCalculateStamina();
  //   });
  // }
  for (let elements of dragGoldFormElements) {
    elements.addEventListener('change', event => {
      event.preventDefault();
      dlCalculateGold();
    });
  }
  for (let elements of fehTTFormElements) {
    elements.addEventListener('change', event => {
      event.preventDefault();
      fehCalculateTT();
    });
  }

  function switchBanner() {
    let banner = document.querySelectorAll('.calc-tab');
    let bannerText = document.querySelectorAll('.article-text-border');
    let calcBox = document.querySelectorAll('.calculator-mark');
    for (let elements of banner) {
      elements.classList.toggle('active-tab');
      elements.classList.toggle('article-hover');
    }
    for (let elements of bannerText) {
      elements.classList.toggle('underline');
    }
    for (let elements of calcBox) {
      elements.classList.toggle('off-display');
    }
  }
  function dlCalculateStamina() {
    let currentStam = document.getElementById('dl-current-stam');
    let targetStam = document.getElementById('dl-target-stam');
    let currentWings = document.getElementById('dl-current-wings');
    let output = document.getElementById('dl-stam-output');

    let stamRegenTime = targetStam.value - currentStam.value;
    let stamRegen = convertDuration(stamRegenTime * 6);
    let wingRegenTime = 6 - currentWings.value;

    output.innerHTML = '';

    stamRegenTime <= 0
      ? createOutput(output, 'Your stamina is higher than your target!')
      : createOutput(
          output,
          `${stamRegenTime} stamina restored in ${stamRegen[0]} hours and ${
            stamRegen[1]
          } minutes.`
        );
    wingRegenTime <= 0
      ? createOutput(output, 'You are past the soft regen cap of 6 on wings!')
      : createOutput(
          output,
          `${wingRegenTime} getherwings restored in ${wingRegenTime} hours.`
        );
    return;
  }
  function dlCalculateGold() {
    let difficulty = document.getElementById('f-difficulty');
    let goal = document.getElementById('target-gold');
    let runEarnings = []; // Gold, stamCost, wingsCost per run
    let output = document.getElementById('dl-gold-output');
    let ratio = [];

    output.innerHTML = '';

    if (difficulty.value === 'f-expert') {
      runEarnings = [7000, 15, 2, 'Expert'];
      ratio = [0, 90, 120, 180, 240, 270, 360];
    } else if (difficulty.value === 'f-standard') {
      runEarnings = [4000, 10, 2, 'Standard'];
      ratio = [0, 60, 120];
    } else {
      runEarnings = [2000, 5, 1, 'Beginner'];
      ratio = [0, 30, 60];
    }

    let numRuns = Math.ceil(goal.value / runEarnings[0]);
    // Time Efficiency
    // let fastRuns =
    //   Math.floor(numRuns / ratio[0]) + ratio[Math.floor(numRuns % ratio[0])];
    let fastRuns =
      Math.floor(numRuns / ratio.length) * ratio[ratio.length - 1] +
      ratio[numRuns % ratio.length];
    let hours = convertDuration(fastRuns);
    createOutput(
      output,
      `Earning ${goal.value} gold will require ${numRuns} runs of ${
        runEarnings[3]
      } difficulty.`,
      'left-margin'
    );
    createOutput(
      output,
      `Each run costs ${runEarnings[1]} stamina or ${
        runEarnings[2]
      } getherwings.`,
      'left-margin'
    );
    createOutput(
      output,
      `Shortest time: ${hours[0]} hours and ${hours[1]} minutes.`,
      'left-margin'
    );
    return;
  }
  function fehCalculateTT() {
    let currentScore = document.getElementById('tt-current-score');
    let targetScore = document.getElementById('tt-target-score');
    let difficulty = document.getElementById('tt-difficulty');
    let output = document.getElementById('feh-tt-output');
    let basePoint = [];

    output.innerHTML = '';

    if (difficulty.value === 'Hard 5') {
      basePoint = [35, 5];
    } else if (difficulty.value === 'Lunatic 5') {
      basePoint = [40, 5];
    } else {
      basePoint = [40, 7];
    }

    //Calculate points per run, assuming 40% bonus + A speed and A teams
    let pointsPerRun = Math.ceil(basePoint[0] * 1.5 * 1.2 * 1.4 * basePoint[1]);
    //Target - current / points per run to get total runs required. Ceil it
    let runs = Math.ceil(
      (targetScore.value - currentScore.value) / pointsPerRun
    );
    createOutput(
      output,
      `Each run of ${difficulty.value} will earn ${pointsPerRun} points.`
    );
    createOutput(
      output,
      `Reaching ${targetScore.value} on ${
        difficulty.value
      } will take ${runs} runs.`
    );
    createOutput(output, `Uses a total of ${runs * 15} stamina.`);
    return;
  }
};

function createOutput(outputParent, message, className = '') {
  let newDiv = document.createElement('div');
  newDiv.innerText = message;
  newDiv.className = className;
  outputParent.appendChild(newDiv);
}

function convertDuration(minutes) {
  let hours = Math.floor(minutes / 60);
  let minuto = minutes % 60;
  return [hours, minuto];
}
