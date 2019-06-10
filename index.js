const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

start();

async function start() {
  let j = 0; //j is a switch variable. it changes based off of different responses so that the next block of code knows the implication of the previous response.
  let min = 0; //the rest of these variables are pre-defined up here because they are used in both "game modes," to avoid using two "let"s.
  let max = 0;
  let tries = 0;
  let guessMin = 0;
  let guessMax = 0;

  console.log(
    "Salutations, honored guest! Let's play a number guessing game. One of us will think of a number, and the other will try to guess it."
  );
  let response = await ask(
    'Type "my number" if you want me to guess, or type "your number" if you want to guess.\n'
  );
  while (true) {
    if (response.toLowerCase() === "my number" || response.toLowerCase() === '"my number"') { //I forced the response to be lowercase and with or without quotes to accept different interpretations by the user
      response = await ask(
        "Game on! First, let's decide on a range of numbers. What is the lowest number I should be guessing?\n"
      );
      if (Number(response).toString() !== "NaN" && Number(response) % 1 === 0) { //since NaN===NaN returns false, I had to turn it back into a string
        min = Number(response);
      } else if (
        Number(response).toString() !== "NaN" &&
        Number(response) % 1 !== 0
      ) {
        j = 1; //here's our first example of j; we set it to 1 to let the next block know the input wasn't an integer.
      } else {
        j = 2;
      }
      while (j > 0) { //everything is running smoothly if j is 0. otherwise, we'll go through this loop to let the user know what went wrong.
        if (j === 1) {
          response = await ask(
            "Whoops! That's not an integer. No decimals or fractions please! Enter a new minimum.\n"
          );
        } else if (j === 2) {
          response = await ask(
            "Whoops! That's not a number that I can recognize. Please enter a number as a minimum!\n"
          );
        } else {
          console.log("Fatal error: unhandled exception :(");
          process.exit();
        }
        if (
          Number(response).toString() !== "NaN" &&
          Number(response) % 1 === 0
        ) {
          min = Number(response);
          j = 0;
        } else if (
          Number(response).toString() !== "NaN" &&
          Number(response) % 1 !== 0
        ) {
          j = 1;
        } else {
          j = 2;
        }
      }
      j = 0;
      response = await ask(
        "Okay, got it! What is the highest number I should be guessing?\n"
      );
      if (
        Number(response).toString() !== "NaN" &&
        Number(response) % 1 === 0 &&
        response >= min
      ) {
        max = Number(response);
      } else if (
        Number(response).toString() !== "NaN" &&
        Number(response) % 1 !== 0
      ) {
        j = 1;
      } else if (response < min) {
        j = 2;
      } else {
        j = 3;
      }
      while (j > 0) {
        if (j === 1) {
          response = await ask(
            "Whoops! That's not an integer. No decimals or fractions please! Enter a new maximum.\n"
          );
        } else if (j === 2) {
          response = await ask(
            "Whoops! The maximum you just chose is less than the minimum you chose. Please enter a new maximum.\n"
          );
        } else if (j === 3) {
          response = await ask(
            "Whoops! That's not a number that I can recognize. Please enter a number as a maximum!\n"
          );
        } else {
          console.log("Fatal error: unhandled exception :(");
          process.exit();
        }
        if (
          Number(response).toString() !== "NaN" &&
          Number(response) % 1 === 0 &&
          response >= min
        ) {
          max = Number(response);
          j = 0;
        } else if (
          Number(response).toString() !== "NaN" &&
          Number(response) % 1 !== 0
        ) {
          j = 1;
        } else if (response < min) {
          j = 2;
        } else {
          j = 3;
        }
      }

      console.log(
        "Awesome! I will now attempt to guess your number, which is between " + min + " and " + max + "."
      );
      let cutMeInHalf = (max - min) / 2; //I wanted a mathematically "pure" decimal value that would perfectly divide itself in half every iteration without rounding.
      let guess = Math.round(cutMeInHalf) + min; //of course, the guess has to be an integer, hence "round"
      let addMe = 0; //we'll add a rounded value of cutMeInHalf every iteration to get right in the center of the possible values to guess with optimum efficiency.
      tries = 1;
      guessMax = max + 1; //guessMax and guessMin are values that are "out of bounds; the user has already been told that the value is less/greater than these values. 1 is added/subtracted because max and min themselves are still in play
      guessMin = min - 1;
      while (true) {
        response = await ask(
          "Is your number... " + guess + "? (Y=Yes; L=No, my number is lower; H=No, my number is higher)\n"
        );
        if (response.toLowerCase() == "y") { 
          if (tries === 1) {
            console.log(
              "Wow! I guessed your number in just one try. See ya! B^)"
            );
          } else {
            console.log(
              "Yay! I guessed your number in " + tries + " tries. Bye!"
            );
          }
          process.exit();
        } else if (response.toLowerCase() == "l") {
          if (guessMin === guess - 1) { //based off of the way the code works mathematically, for the user to break the rules the current guess and the disallowed guess will always be 1 apart
            console.log(
              "Wait, but you said your number was greater than " + guessMin + "! Next time, play without cheating!!!! >:("
            );
            process.exit();
          }
          guessMax = guess;
          if (addMe < 1) {
            addMe = 1;
          }
          cutMeInHalf = cutMeInHalf/2;
          addMe = Math.round(cutMeInHalf);
          guess = guess - addMe;
        } else if (response.toLowerCase() == "h") {
          if (guessMax === guess + 1) {
            console.log(
              "Wait, but you said your number was less than " + guessMax + "! Next time, play without cheating!!!! >:("
            );
            process.exit();
          }
          guessMin = guess;
          if (addMe < 1) {
            addMe = 1;
          }
          cutMeInHalf = cutMeInHalf/2;
          addMe = Math.round(cutMeInHalf);
          guess = guess + addMe;
        } else {
          console.log("ERROR: Bad input. It's okay, just try again!");
          tries = tries - 1; //this doesn't count as a try, but we're going to add a try just below, so we'll have to subtract one here
        }
        tries = tries + 1;
      }
    } else if (response.toLowerCase() === "your number" || response.toLowerCase() === '"your number"') { //the computer guesses!
      response = await ask(
        "Game on! First, let's decide on a range of numbers. What is the lowest number I should pick?\n"
      );
      if (Number(response).toString() !== "NaN" && Number(response) % 1 === 0) { //the same code as above for choosing min and max
        min = Number(response);
      } else if (
        Number(response).toString() !== "NaN" &&
        Number(response) % 1 !== 0
      ) {
        j = 1;
      } else {
        j = 2;
      }
      while (j > 0) {
        if (j === 1) {
          response = await ask(
            "Whoops! That's not an integer. No decimals or fractions please! Enter a new minimum.\n"
          );
        } else if (j === 2) {
          response = await ask(
            "Whoops! That's not a number that I can recognize. Please enter a number as a minimum!\n"
          );
        } else {
          console.log("Fatal error: unhandled exception :(");
          process.exit();
        }
        if (
          Number(response).toString() !== "NaN" &&
          Number(response) % 1 === 0
        ) {
          min = Number(response);
          j = 0;
        } else if (
          Number(response).toString() !== "NaN" &&
          Number(response) % 1 !== 0
        ) {
          j = 1;
        } else {
          j = 2;
        }
      }
      j = 0;
      response = await ask(
        "Okay, got it! What is the highest number I should pick?\n"
      );
      if (
        Number(response).toString() !== "NaN" &&
        Number(response) % 1 === 0 &&
        response >= min
      ) {
        max = Number(response);
      } else if (
        Number(response).toString() !== "NaN" &&
        Number(response) % 1 !== 0
      ) {
        j = 1;
      } else if (response < min) {
        j = 2;
      } else {
        j = 3;
      }
      while (j > 0) {
        if (j === 1) {
          response = await ask(
            "Whoops! That's not an integer. No decimals or fractions please! Enter a new maximum.\n"
          );
        } else if (j === 2) {
          response = await ask(
            "Whoops! The maximum you just chose is less than the minimum you chose. Please enter a new maximum.\n"
          );
        } else if (j === 3) {
          response = await ask(
            "Whoops! That's not a number that I can recognize. Please enter a number as a maximum!\n"
          );
        } else {
          console.log("Fatal error: unhandled exception :(");
          process.exit();
        }
        if (
          Number(response).toString() !== "NaN" &&
          Number(response) % 1 === 0 &&
          response >= min
        ) {
          max = Number(response);
          j = 0;
        } else if (
          Number(response).toString() !== "NaN" &&
          Number(response) % 1 !== 0
        ) {
          j = 1;
        } else if (response < min) {
          j = 2;
        } else {
          j = 3;
        }
      }

      function randomInteger(rmin, rmax) {
        let range = (rmax - rmin) + 1; 
        return rmin + Math.floor(Math.random() * range);
      }
      let randomNumber = randomInteger(min, max);
      guessMax = max + 1;
      guessMin = min - 1;
      tries = 1;

      response = await ask('Okay, I\'m thinking of an integer number between ' + min + ' and ' + max + ' (inclusive). Try to guess my number!\n');
      while(true) {
        if (response === randomNumber.toString()) {
          if (tries === 1) {
            console.log('YES! Wow! You guessed my number in just one try. Nice job!! Bye! :)')
          } else {
            console.log('Yup! That\'s my number! You guessed it in ' + tries + ' tries. Nice job. Bye!');
          }
          process.exit();
        } else if (Number(response).toString() === 'NaN') {
          response = await ask('Nope! My number is... Well, a number! Guess again!\n');
        } else if (Number(response)%1 !== 0) {
          response = await ask('My number is an integer! No decimals necessary. Guess again!\n');
        } else if (Number(response) >= guessMax) {
          response = await ask('Nope! I already said my number is LOWER than ' + guessMax + '. Guess again!\n');
        } else if (Number(response) <= guessMin) {
          response = await ask('Nope! I already said my number is HIGHER than ' + guessMin + '. Guess again!\n');
        } else if (Number(response) > randomNumber) {
          guessMax = response;
          response = await ask('Nope! My number is LOWER than ' + response + '. Guess again!\n');
        } else if (Number(response) < randomNumber) {
          guessMin = response;
          response = await ask('Nope! My number is HIGHER than ' + response + '. Guess again!\n');
        } else {
          console.log('Fatal error: unhandled exception :(');
          process.exit();
        }
        tries = tries + 1;
      }

    } else {
      response = await ask(
        'Sorry, I didn\'t understand your answer. Was that "my number" or "your number"?\n'
      );
    }
  }
}
