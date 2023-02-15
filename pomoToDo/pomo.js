const pomoTimer = document.querySelector('.pomo-container');

const startButton = document.querySelector('#pomo-start');
const pauseButton = document.querySelector('#pomo-pause');
const stopButton = document.querySelector('#pomo-stop');

let isClockRunning = false;

// time constants
let workSessionSeconds = 1500;  // 25 min
let timeLeftInSession = 1500;
let breakSessionSeconds = 300;   // 5 min

// Event listener to buttons
startButton.addEventListener('click', () => {
    toggleClock()
});
pauseButton.addEventListener('click', () => {
    toggleClock()
});
stopButton.addEventListener('click', () => {
    toggleClock()
});

function toggleClock(reset) {
    if (reset) {
        // stop timer
    } else {
        if (isClockRunning === true) {
            // pause timer
            clearInterval(clockTimer);
            isClockRunning = false;
        } else {
            // start timer
            isClockRunning = true;
            // decreasing time by every second
            clockTimer = setInterval(() => {
                timeLeftInSession--;
                displayTimeLeft();
            }, 1000);
        }
    }
}

// function to add zeros
function addLeadingZeroes (time) {
    return time < 10 ? `0${time}` : time;
}

// Display time
function displayTimeLeft() {
    const secondsLeft = timeLeftInSession;
    let result = '';
    const seconds = secondsLeft % 60;
    const minutes = parseInt(secondsLeft/60) % 60 ;
    const hours = parseInt(secondsLeft/3600);

    if (hours > 0) result += `${hours}:`;
    result += `${addLeadingZeroes(minutes)}:${addLeadingZeroes(seconds)}`;
    pomoTimer.innerText = result.toString();
}
