const create = document.getElementById("createStopwatch");
console.log("Script loaded");
create.addEventListener("click", function(){
    console.log("Button clicked");
    let color = prompt("Please enter color", "red");
    let name = prompt("Please enter name of the stopwatch", "Hui");
    new Stopwatch(name, color);
});




