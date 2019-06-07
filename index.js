const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

start();

async function start() {
  let j = 0;
  let min = 0;
  let max = 0;
  console.log('Salutations, honored guest! Let\'s play a game; you\'ll think of an integer number, and I\'ll try to guess it.');
  let response = await ask('First, let\'s decide on a range of numbers. What is the lowest number I should be guessing?\n');
  if (Number(response).toString()!=='NaN' && (Number(response))%1===0) {
    min = Number(response);
  } else if (Number(response).toString()!=='NaN' && (Number(response))%1!==0) {
    j = 1;
  } else {
    j = 2;
  }
  while (j > 0) {
    if (j===1) {
      response = await ask('Whoops! That\'s not an integer. No decimals or fractions please! Enter a new minimum.\n');
    } else if (j===2) {
      response = await ask('Whoops! That\'s not a number that I can recognize. Please enter a number as a minimum!\n');
    } else {
      console.log('Fatal error: unhandled exception :(');
      process.exit();
    }
    if (Number(response).toString()!=='NaN' && (Number(response))%1===0) {
      min = Number(response);
      j = 0;
    } else if (Number(response).toString()!=='NaN' && (Number(response))%1!==0) {
      j = 1;
    } else {
      j = 2;
    }
  }
  j = 0;
  response = await ask('Okay, got it! What is the highest number I should be guessing?\n');
  if (Number(response).toString()!=='NaN' && (Number(response))%1===0 && response >= min) {
    max = Number(response);
  } else if (Number(response).toString()!=='NaN' && (Number(response))%1!==0) {
    j = 1;
  } else if (response < min) {
    j = 2;
  } else {
    j = 3;
  }
  while (j > 0) {
    if (j===1) {
      response = await ask('Whoops! That\'s not an integer. No decimals or fractions please! Enter a new maximum.\n');
    } else if (j===2) {
      response = await ask('Whoops! The maximum you just chose is less than the minimum you chose. Please enter a new maximum.\n')
    } else if (j===3) {
      response = await ask('Whoops! That\'s not a number that I can recognize. Please enter a number as a maximum!\n');
    } else {
      console.log('Fatal error: unhandled exception :(');
      process.exit();
    }
    if (Number(response).toString()!=='NaN' && (Number(response))%1===0 && response >= min) {
      max = Number(response);
      j = 0;
    } else if (Number(response).toString()!=='NaN' && (Number(response))%1!==0) {
      j = 1;
    } else if (response < min) {
      j = 2;
    } else {
      j = 3;
    }
  }
  console.log('Awesome! I will now attempt to guess your number, which is between ' + min + ' and ' + max + '.');
  let cutMeInHalf = (max - min)/2;
  let guess = Math.round(cutMeInHalf) + min;
  let tries = 1;
  let i = 0;
    while (i===0) {
       response = await ask('Is your number... ' + guess + '? (Y=Yes; L=No, my number is lower; H=No, my number is higher)\n');
       if (response=='y' || response=='Y') {
            if (tries===1) {
                console.log('Wow! I guessed your number in just one try. See ya! B^)');
            } else {
                console.log('Yay! I guessed your number in ' + tries + ' tries. Bye!');
            }
            i = 1;
            process.exit();
        } else if (response=='L' || response=='l') {
            tries = tries + 1;
            cutMeInHalf = cutMeInHalf/2;
            addMe = Math.round(cutMeInHalf);
            if (addMe < 1) {
                addMe = 1;
            }
            guess = guess - addMe;
            if (guess < 1) {
                console.log('Hey! Your number can\'t be less than 1! Next time, play without cheating!!!!');
                process.exit();
            }
        } else if (response=='H' || response=='h')  {
            tries = tries + 1;
            cutMeInHalf = cutMeInHalf/2;
            addMe = Math.round(cutMeInHalf);
            if (addMe < 1) {
                addMe = 1;
            }
            guess = guess + addMe;
        } else {
            console.log('ERROR: Bad input. It\'s okay, just try again!')
            }
  }
  process.exit();
}