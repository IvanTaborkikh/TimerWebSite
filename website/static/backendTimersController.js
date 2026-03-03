document.addEventListener("DOMContentLoaded", loadTimers);

async function loadTimers() {
    const response = await fetch("/api/timers");
    const timers = await response.json();

    timers.forEach(timer => {
        createTimerFromServer(timer);
    });
}

function createTimerFromServer(timer) {

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

    startButton.addEventListener("click", () => {
        if (timer.is_running) {
            pauseTimer(timer.id);
        } else {
            startTimer(timer.id);
        }
    });

    deleteButton.addEventListener("click", () => {
        deleteTimer(timer.id);
    });

    container.appendChild(title);
    container.appendChild(timeDisplay);
    container.appendChild(startButton);
    container.appendChild(deleteButton);

    if (timer.is_running) {
        const startTime = new Date(timer.start_time).getTime();
        const baseElapsed = timer.elapsed_time * 1000;

        setInterval(() => {
            const now = Date.now();
            const total = baseElapsed + (now - startTime);
            timeDisplay.innerText = Math.floor(total / 1000);
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

    if (response.ok) {
        loadTimersAgain();
    }
}

async function loadTimersAgain() {
    document.getElementById("timersContainer").innerHTML = "";
    await loadTimers();
}

async function startTimer(id) {
    await fetch(`/api/timers/${id}/start`, {
        method: "POST"
    });

    loadTimersAgain();
}

async function pauseTimer(id) {
    await fetch(`/api/timers/${id}/pause`, {
        method: "POST"
    });

    loadTimersAgain();
}

async function deleteTimer(id) {
    await fetch(`/api/timers/${id}`, {
        method: "DELETE"
    });

    loadTimersAgain();
}