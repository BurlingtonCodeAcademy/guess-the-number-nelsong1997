const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

start();

async function start() {
  console.log('Salutations, honored guest! Please think of an integer between 1 and 100, inclusive.\nI will now attempt to guess your number.')
    let guess = 50;
    let cutMeInHalf = 50;
    let tries = 1;
    let i = 0;
    let cheat = 0;
    while (i===0) {
       let response = await ask('Is your number... ' + guess + '? (Y=Yes; L=No, my number is lower; H=No, my number is higher)\n');
       if (response=='y' || response=='Y') {
            if (tries===1) {
                console.log('Wow! I guessed your number in just one try. See ya! B^)');
            } else if (cheat===1) {
                console.log('Hmmm... I guessed your number in ' + tries + ' tries. It would\'ve taken me less tries if you hadn\'t cheated!!');
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
            if (guess > 100) {
                console.log('Hey! Your number can\'t be more than 100! Next time, play without cheating!!!!');
                process.exit();
            }
        } else {
            console.log('ERROR: Bad input. It\'s okay, just try again!')
        }
        if (tries===8) {
            console.log('Mathematically speaking, one or more of your answers so far has been incorrect. Continue if you wish...');
            cheat = 1;
    }
  }
  process.exit();
}
