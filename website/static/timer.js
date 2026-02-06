
const time = document.getElementById("time");
const startB = document.getElementById("start")
const pauseB = document.getElementById("pause")
const resetB = document.getElementById("reset")

let start;
let elapsed = 0;
let running = false;

if (localStorage.getItem("time") == null) {
    start = Date.now();
    localStorage.setItem("time", start);
} else {
    start = parseInt(localStorage.getItem("time"));
}

if (localStorage.getItem("elapsed") == null) {
    elapsed = 0;
    localStorage.setItem("elapsed", elapsed);
} else {
    elapsed = parseInt(localStorage.getItem("elapsed"));
}

if (localStorage.getItem("running") == null) {
    running = false;
    localStorage.setItem("running", running);
} else {
    running = parseBoolean(localStorage.getItem("running"));
}

function showtime(){
    if (running == true){
        elapsed = Date.now() - start;
    }
    else {
        start = Date.now() - elapsed;
    }
    time.innerText = Math.round(elapsed / 1000);
};

function parseBoolean(val)
{
    if (val == "true")
    {
        return true;
    } else
    {
        return false
    }
}

setInterval(showtime, 1000);

startB.addEventListener("click", function(){
    running = true;
});

pauseB.addEventListener("click", function(){
    running = false;
});

resetB.addEventListener("click", function(){
    elapsed = 0;
    running = false
    localStorage.setItem("elapsed", elapsed);
});
