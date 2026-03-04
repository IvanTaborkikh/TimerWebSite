let activeIntervals = [];

document.addEventListener("DOMContentLoaded", loadTimers);

async function loadTimers() {
    const response = await fetch("/api/timers");

    if (!response.ok) {
        console.error("Failed to load timers");
        return;
    }

    const timers = await response.json();

    timers.forEach(timer => {
        createTimerFromServer(timer);
    });
}

function createTimerFromServer(timer) {

    let intervalId = null;
    let seconds = timer.elapsed_time;
    const container = document.createElement("div");
    container.style.width = "300px";
    container.style.padding = "15px";
    container.style.margin = "10px";
    container.style.background = timer.color;
    container.style.color = "white";
    container.style.borderRadius = "10px";

    const title = document.createElement("h3");
    title.innerText = timer.name;

    const timeDisplay = document.createElement("div");
    timeDisplay.innerText = timer.elapsed_time;

    const startButton = document.createElement("button");
    startButton.innerText = timer.is_running ? "Pause" : "Start";

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";

    startButton.addEventListener("click", async () => {

        if (timer.is_running) {

            await pauseTimer(timer.id);

            timer.is_running = false;
            startButton.innerText = "Start";

            if (intervalId) {
                clearInterval(intervalId);
            }

        } else {

            await startTimer(timer.id);

            timer.is_running = true;
            startButton.innerText = "Pause";

            intervalId = setInterval(() => {
                seconds++;
                timeDisplay.innerText = seconds;
            }, 1000);

        }

    });

    deleteButton.addEventListener("click", async () => {
        await deleteTimer(timer.id);
    });

    container.appendChild(title);
    container.appendChild(timeDisplay);
    container.appendChild(startButton);
    container.appendChild(deleteButton);

    // Якщо таймер працює — запускаємо локальний інтервал
    if (timer.is_running) {

        intervalId = setInterval(() => {
            seconds++;
            timeDisplay.innerText = seconds;
        }, 1000);

    }

    document.getElementById("timersContainer").appendChild(container);
}

async function createTimer(name, color) {
    const response = await fetch("/api/timers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, color })
    });

    if (!response.ok) {
        console.error("Failed to create timer");
        return;
    }

    await loadTimersAgain();
}

async function loadTimersAgain() {

    // очищаємо всі активні інтервали
    activeIntervals.forEach(id => clearInterval(id));
    activeIntervals = [];

    document.getElementById("timersContainer").innerHTML = "";

    await loadTimers();
}

async function startTimer(id) {
    const response = await fetch(`/api/timers/${id}/start`, {
        method: "POST"
    });

    if (!response.ok) {
        console.error("Failed to start timer");
        return;
    }

}

async function pauseTimer(id) {
    const response = await fetch(`/api/timers/${id}/pause`, {
        method: "POST"
    });

    if (!response.ok) {
        console.error("Failed to pause timer");
        return;
    }
}

async function deleteTimer(id) {
    const response = await fetch(`/api/timers/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        console.error("Failed to delete timer");
        return;
    }

    await loadTimersAgain();
}

const createBtn = document.getElementById("createStopwatch");
const modal = document.getElementById("modalOverlay");
const cancelBtn = document.getElementById("cancelCreate");
const confirmBtn = document.getElementById("confirmCreate");
const nameInput = document.getElementById("timerNameInput");
const presetContainer = document.getElementById("presetColors");
const customColorPicker = document.getElementById("customColorPicker");

let selectedColor = "#3498db";

const presetColors = [
    "#e74c3c",
    "#3498db",
    "#2ecc71",
    "#f1c40f",
    "#9b59b6",
    "#1abc9c"
];

// відкриття модалки
createBtn.addEventListener("click", () => {
    modal.style.display = "flex";
});

// закриття
cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
    nameInput.value = "";
});

// створюємо кольорові кружечки
presetColors.forEach(color => {

    const circle = document.createElement("div");
    circle.style.width = "25px";
    circle.style.height = "25px";
    circle.style.borderRadius = "50%";
    circle.style.background = color;
    circle.style.cursor = "pointer";
    circle.style.border = "2px solid transparent";

    circle.addEventListener("click", () => {
        selectedColor = color;
        customColorPicker.value = color;

        document.querySelectorAll("#presetColors div")
            .forEach(el => el.style.border = "2px solid transparent");

        circle.style.border = "2px solid black";
    });

    presetContainer.appendChild(circle);
});

// якщо вибрали кастомний
customColorPicker.addEventListener("input", () => {
    selectedColor = customColorPicker.value;
});

// підтвердження створення
confirmBtn.addEventListener("click", async () => {

    const name = nameInput.value.trim();

    if (!name) {
        alert("Enter timer name");
        return;
    }

    await createTimer(name, selectedColor);

    modal.style.display = "none";
    nameInput.value = "";
});