const pomoTimer = document.querySelector('.pomo-container');

const startButton = document.querySelector('.pomo-play-pause');
const stopButton = document.querySelector('#pomo-stop');

let isClockRunning = false;
let isClockStopped = true;

let type = 'work';

let timeSpent = 0;

let currentTaskLabel = document.querySelector('#pomo-clock-work');

// time constants=
let timeLeftInSession = 1500;

let updatedWorkSessionSec;
let updatedBreakSessionSec;

let workSessionSec = document.querySelector('#input-work-duration');
workSessionSec.value = '25';
let breakSessionSec = document.querySelector('#input-break-duration');
breakSessionSec.value = '5';

// Event listener to buttons
startButton.addEventListener('click', () => {
    toggleClock()
});
stopButton.addEventListener('click', () => {
    toggleClock()
});

workSessionSec.addEventListener('input', () => {
    updatedWorkSessionSec = minuteToSeconds(workSessionSec.value);
});

breakSessionSec.addEventListener('input', () => {
    updatedBreakSessionSec = minuteToSeconds(breakSessionSec.value);
});

function minuteToSeconds(min) {
    return min * 60;
}

function toggleClock(reset) {
    togglePlayPauseIcon(reset);
    if (reset) {
        // stop timer
        stopClock();
    } else {
        if (isClockStopped) {
            setUpdatedTimers();
            isClockStopped = false;
        }
        if (isClockRunning === true) {
            // pause timer
            clearInterval(clockTimer);
            isClockRunning = false;
        } else {
            // start timer
            isClockRunning = true;
            // decreasing time by every second
            clockTimer = setInterval(() => {
                minusTime();
                displayTimeLeft();
            }, 1000);
        }
        showStopIcon();
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

// stop and redefine clock
function stopClock () {
    isClockStopped = true;
    isClockRunning = false;
    type = 'work';
    timeLeftInSession = workSessionSec;
    timeSpent = 0;

    setUpdatedTimers();
    displaySessionLog(type);
    clearInterval(clockTimer);
    displayTimeLeft();
}

function minusTime() {
    if (timeLeftInSession > 0) {
        timeLeftInSession--;
        timeSpent++;
    } else if (timeLeftInSession === 0) {
        timeSpent = 0;
        // Timer is over -> if work switch to break, viceversa
        if (type === 'work') {
            timeLeftInSession = breakSessionSec;
            displaySessionLog('work');
            displayTimeLeft();
            type = 'break';
            currentTaskLabel.value = 'break';
            currentTaskLabel.disabled = true;
        } else {
            timeLeftInSession = workSessionSec;
            displaySessionLog('break');
            displayTimeLeft();
            type = 'work';
            if (currentTaskLabel.value === 'break') {
                currentTaskLabel.value = workSessionSec;
            }
            currentTaskLabel.disabled = false;
            displaySessionLog('break');
        }
    }
    displayTimeLeft();
}

function displaySessionLog(type) {
    const sessionsList = document.querySelector('#pomo-sessions');
    const li = document.createElement('li');
    if (type === 'work') {
        sessionLabel = currentTaskLabel.value ? currentTaskLabel.value : 'work';
        workSessionSec = sessionLabel;
    } else {
        sessionLabel = 'break';
    }

    let elapsedTime = parseInt(timeSpent / 60);
    elapsedTime = elapsedTime > 0 ? elapsedTime : '< 1'

    const text = document.createTextNode(`${sessionLabel} : ${elapsedTime} min`);
    li.appendChild(text);
    sessionsList.appendChild(li);
}

function setUpdatedTimers () {
    if (type === 'work') {
        timeLeftInSession = updatedWorkSessionSec
        ? updatedWorkSessionSec
        : workSessionSec
        workSessionSec = timeLeftInSession
    } else {
        timeLeftInSession = updatedBreakSessionSec
        ? updatedBreakSessionSec
        : breakSessionSec
        breakSessionSec = timeLeftInSession
    }
}

function togglePlayPauseIcon(reset) {
    const playIcon = document.querySelector('#play-icon');
    const pauseIcon = document.querySelector('#pause-icon');

    if (reset) {
        if (playIcon.classList.contains('hidden')) {
            playIcon.classList.remove('hidden');
        }
        if (!pauseIcon.classList.contains('hidden')) {
            pauseIcon.classList.add('hidden');
        }
    } else {
        playIcon.classList.toggle('hidden');
        pauseIcon.classList.remove('hidden');
    }
}

function showStopIcon () {
    const stopButton = document.querySelector('#pomo-stop');
    stopButton.classList.remove('hidden');
}