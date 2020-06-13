const doorImage1 = document.querySelector('#door1');
const doorImage2 = document.getElementById('door2');
const doorImage3 = document.getElementById('door3');
const current_streak_ele = document.getElementById('current-streak');
const best_streak_ele = document.getElementById('best-streak');

var current_streak = 0;
var best_streak = 0;

const botDoorPath = 'https://s3.amazonaws.com/codecademy-content/projects/chore-door/images/robot.svg';
const beachDoorPath = 'https://s3.amazonaws.com/codecademy-content/projects/chore-door/images/beach.svg';
const spaceDoorPath = 'https://s3.amazonaws.com/codecademy-content/projects/chore-door/images/space.svg';

var numClosedDoors = 3;
//a counter, if all 3 door player opened are save, they will win 
var numOpenedSaveDoors = 0;
var closedDoorPath = 'https://s3.amazonaws.com/codecademy-content/projects/chore-door/images/closed_door.svg';

//when the game end, currentlyPlaying will be set to false, so that the player cannot open the door anymore
var currentlyPlaying = true;

//check if a door has the game-ending ChoreBot.
function isBot(door) {
    if(door.src === botDoorPath)
        return true;
    return false;
}

//check if the door is clicked, prevent cheating by open one door many times
function isClicked(door) {
    if (door.src === closedDoorPath)
        return false;
    return true;
}

//the main play door function
function playDoor(door) {
    if(isBot(door)) {
        gameOver('lose');
        return 0;
    }
    //decrease the doorImage left
    if(numOpenedSaveDoors === 3) {
        gameOver('win');
        return 1;
    } 
};

//get a random doorImage when player click to open the door
function randomChoreDoorGenerator(door) {
    const choreDoor = Math.floor(Math.random() * numClosedDoors);
    if(choreDoor === 2) {
        door.src = botDoorPath;
    } else if(choreDoor === 1) {
        door.src = spaceDoorPath;
    } else
        door.src = beachDoorPath;
    numOpenedSaveDoors++;
}

//event click on Door1,2,3
doorImage1.onclick = () => {
    if (!isClicked(doorImage1) && currentlyPlaying) {
        randomChoreDoorGenerator(doorImage1);
        playDoor(doorImage1);
    }
};

doorImage2.onclick = () => {  
    if (!isClicked(doorImage2) && currentlyPlaying) {
        randomChoreDoorGenerator(doorImage2);
        playDoor(doorImage2);
    }
};

doorImage3.onclick = () => {
    if (!isClicked(doorImage3) && currentlyPlaying) {
        randomChoreDoorGenerator(doorImage3);
        playDoor(doorImage3);
    }
};

//reset the game, ready to restart
function startRound() {
    doorImage1.src = closedDoorPath;
    doorImage2.src = closedDoorPath;
    doorImage3.src = closedDoorPath;
    numClosedDoors = 3;
    startButton.innerHTML = 'Good luck!';
    currentlyPlaying = true;
    numOpenedSaveDoors = 0;
}

//get into the button
const startButton = document.getElementById('start');

var isLose = false;

//print game result to the start button
function gameOver(status) {
    if (status === 'win') {
        startButton.innerHTML = 'You win! Play again?';
        current_streak++;
        if (current_streak > best_streak)
            best_streak = current_streak;
    }
    if (status === 'lose') {
        startButton.innerHTML = 'Sorry! You lose :( Play again?';
        isLose = true;
    }

    current_streak_ele.innerHTML = current_streak;
    best_streak_ele.innerHTML = best_streak;

    currentlyPlaying = false;
}

//restart new game when the game end
startButton.onclick = () => {
    if (!currentlyPlaying) {
        startRound();
    }
    if (isLose) {
        current_streak = 0;
        current_streak_ele.innerHTML = current_streak;
        isLose = false;
    }
};
