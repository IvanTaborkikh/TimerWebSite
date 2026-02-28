class Stopwatch {
    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.elapsed = 0;
        this.running = false;
        this.startTime = 0;
        this.interval = null;

        this.createDOM();
        this.addEvents();
    }

    createDOM() {
        this.container = document.createElement("div");
        this.container.style.width = "300px";
        this.container.style.padding = "15px";
        this.container.style.margin = "10px";
        this.container.style.background = this.color;
        this.container.style.color = "white";
        this.container.style.borderRadius = "10px";

        this.title = document.createElement("h3");
        this.title.innerText = this.name;

        this.timeDisplay = document.createElement("div");
        this.timeDisplay.innerText = "0";

        this.startButton = document.createElement("button");
        this.startButton.innerText = "Start";

        this.resetButton = document.createElement("button");
        this.resetButton.innerText = "Reset";

        this.container.appendChild(this.title);
        this.container.appendChild(this.timeDisplay);
        this.container.appendChild(this.startButton);
        this.container.appendChild(this.resetButton);

        document.getElementById("timersContainer")
                .appendChild(this.container);
    }

    addEvents() {
        this.startButton.addEventListener("click", () => {
            if (!this.running) {
                this.start();
            } else {
                this.pause();
            }
        });

        this.resetButton.addEventListener("click", () => {
            this.reset();
        });
    }

    start() {
        this.running = true;
        this.startTime = Date.now() - this.elapsed;
        this.startButton.innerText = "Pause";

        this.interval = setInterval(() => {
            this.elapsed = Date.now() - this.startTime;
            this.timeDisplay.innerText = Math.floor(this.elapsed / 1000);
        }, 1000);
    }

    pause() {
        this.running = false;
        clearInterval(this.interval);
        this.startButton.innerText = "Start";
    }

    reset() {
        this.running = false;
        clearInterval(this.interval);
        this.elapsed = 0;
        this.timeDisplay.innerText = "0";
        this.startButton.innerText = "Start";
    }
}