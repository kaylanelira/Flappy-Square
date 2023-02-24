document.addEventListener("DOMContentLoaded", () => {
    // BUTTONS
    const startButton = document.querySelector('#pomo-start');
    const stopButton = document.querySelector('#pomo-stop');
    const pauseButton = document.querySelector('#pomo-pause');

    let isClockRunning = false;
    let isClockStopped = true;

    let type = 'work';

    // SOUND
    let bellSound = new Audio('classic-gong-1066.wav');
    let buttonSound = new Audio('button-sound.wav');

    let currentTaskLabel = document.querySelector('#pomo-clock-work');

    // TIME VARIABLES
    let timeLeftInSession = 1500;       // 25 min
    let workSessionTime = 1500;         
    let breakSessionTime = 300;         // 5 min
    let timeSpentInSession = 0;
    let updatedWorkSessionTime;
    let updatedBreakSessionTime;

    // INPUTS
    let workSessionInput = document.querySelector('#input-work-duration');
    workSessionInput.value = "25";
    let breakSessionInput = document.querySelector('#input-break-duration');
    breakSessionInput.value = "5";

    const progressBar = new ProgressBar.Circle('#pomo-timer', {
        strokeWidth: 3,
        text: {
            autoStyleContainer: false,
            className: 'progressBarText',
            value: '25:00',
        },
        trailColor: '#ffe6a7',
        color: '#9c6644',
    })

    // EVENT LISTENER TO BUTTONS: START, STOP AND PAUSE
    startButton.addEventListener('click', () => {
        toggleClock();
        buttonSound.play();
    });
    stopButton.addEventListener('click', () => {
        toggleClock(true);
        buttonSound.play();
    });
    pauseButton.addEventListener('click', () => {
        buttonSound.play();
        toggleClock();
    });

    // UPDATED WORK TIME
    workSessionInput.addEventListener('input', () => {
        updatedWorkSessionTime = minuteToSeconds(workSessionInput.value);
    });
    // UPDATED BREAK TIME
    breakSessionInput.addEventListener('input', () => {
        updatedBreakSessionTime = minuteToSeconds(breakSessionInput.value);
    });

    function minuteToSeconds(min) {
        return min * 60;
    };

    function calculateTimeProgress() {
        const sessionDuration =
            type === 'work' ? workSessionTime : breakSessionTime;
        return (timeSpentInSession / sessionDuration) * 10;
    };

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
                // decreasing time by every second
                clockTimer =  setInterval(() => {
                    minusTime();
                    displayTimeLeft();
                    progressBar.set(calculateTimeProgress());
                }, 1000);
                // start timer
                isClockRunning = true;
            }
            showStopIcon();
        }
    };

    // FUNCTION TO ADD ZEROES
    function addLeadingZeroes (time) {
        return time < 10 ? `0${time}` : time;
    };

    // DISPLAYS TIME
    function displayTimeLeft() {
        const secondsLeft = timeLeftInSession;
        let result = '';
        const seconds = secondsLeft % 60;
        const minutes = parseInt(secondsLeft/60) % 60 ;
        const hours = parseInt(secondsLeft/3600);

        if (hours > 0) result += `${hours}:`;
        result += `${addLeadingZeroes(minutes)}:${addLeadingZeroes(seconds)}`;
        progressBar.text.innerText = result.toString();
    };

    // STOP AND REDEFINE CLOCK
    function stopClock () {
        isClockStopped = true;
        isClockRunning = false;
        type = 'work';
        timeLeftInSession = workSessionTime;
        timeSpentInSession = 0;

        setUpdatedTimers();
        displaySessionLog(type);
        clearInterval(clockTimer);
        displayTimeLeft();
    };

    // DECREASE SECONDS IN TIME
    function minusTime() {
        if (timeLeftInSession > 0) {
            timeLeftInSession--;
            timeSpentInSession++;
        } else if (timeLeftInSession === 0) {
            timeSpentInSession = 0;
            // play sound
            bellSound.play();
            // Timer is over -> if work switch to break, viceversa
            if (type === 'work') {
                timeLeftInSession = breakSessionTime;
                type = 'break';
                currentTaskLabel.value = 'break';
                currentTaskLabel.disabled = true;
                displaySessionLog('work');
                setUpdatedTimers();
            } else {
                timeLeftInSession = workSessionTime;
                type = 'work';
                setUpdatedTimers();
                if (currentTaskLabel.value === 'break') {
                    currentTaskLabel.value = worksessionLabel;
                }
                currentTaskLabel.disabled = false;
                displaySessionLog('break');
            }
        }
        displayTimeLeft();
    };

    function displaySessionLog(type) {
        const sessionsList = document.querySelector('#pomo-sessions');
        // appending li with time sessions
        const li = document.createElement('li');
        if (type === 'work') {
            sessionLabel = currentTaskLabel.value ? currentTaskLabel.value : 'work';
            worksessionLabel = sessionLabel;
        } else {
            sessionLabel = 'break';
        }

        let elapsedTime = parseInt(timeSpentInSession / 60);
        elapsedTime = elapsedTime > 0 ? elapsedTime : '< 1'

        const text = document.createTextNode(`${sessionLabel} : ${elapsedTime} min`);
        li.appendChild(text);
        sessionsList.appendChild(li);
    };

    function setUpdatedTimers () {
        if (type === 'work') {
            timeLeftInSession = updatedWorkSessionTime
            ? updatedWorkSessionTime
            : workSessionTime;
            workSessionTime = timeLeftInSession;
        } else {
            timeLeftInSession = updatedBreakSessionTime
            ? updatedBreakSessionTime
            : breakSessionTime;
            breakSessionTime = timeLeftInSession;
        }
    };

    function togglePlayPauseIcon(reset) {
        const playIcon = document.querySelector("#play-icon");
        const pauseIcon = document.querySelector("#pause-icon");

        if (reset) {
            if (playIcon.classList.contains('hidden')) {
                playIcon.classList.remove('hidden');
            }
            if (!pauseIcon.classList.contains('hidden')) {
                pauseIcon.classList.add('hidden');
            }
        } else {
            playIcon.classList.toggle('hidden');
            pauseIcon.classList.toggle('hidden');
        }
    };

    function showStopIcon () {
        const stopButton = document.querySelector("#pomo-stop");
        stopButton.classList.remove('hidden');
    };
});