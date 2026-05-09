const targetElement =
document.getElementById("target-letter");

const levelSelect =
document.getElementById("level-select");


// =========================
// CANVAS
// =========================

const canvas =
document.getElementById("canvas");

const ctx =
canvas.getContext("2d");


// =========================
// DRAW SETTINGS
// =========================

let drawing = false;

ctx.lineWidth = 20;

ctx.lineCap = "round";

ctx.strokeStyle = "white";


// Black background
ctx.fillStyle = "black";

ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
);


// =========================
// LEVELS
// =========================

const letters =
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");

const numbers =
"0123456789".split("");

const symbols =
["@", "#", "$", "%", "&", "*", "!"];


// =========================
// CURRENT TARGET
// =========================

let currentTarget = "";


// =========================
// RANDOM ITEM
// =========================

function getRandomItem(array){

    const randomIndex =
    Math.floor(
        Math.random() * array.length
    );

    return array[randomIndex];
}


// =========================
// UPDATE TARGET
// =========================

function updateTarget(){

    const selectedLevel =
    levelSelect.value;

    if(selectedLevel === "letters"){

        currentTarget =
        getRandomItem(letters);
    }

    else if(selectedLevel === "numbers"){

        currentTarget =
        getRandomItem(numbers);
    }

    else{

        currentTarget =
        getRandomItem(symbols);
    }

    targetElement.innerText =
    `Draw: ${currentTarget}`;
}


// =========================
// DRAWING EVENTS
// =========================

canvas.addEventListener(
    "mousedown",
    (event) => {

        drawing = true;

        const rect =
        canvas.getBoundingClientRect();

        ctx.beginPath();

        ctx.moveTo(
            event.clientX - rect.left,
            event.clientY - rect.top
        );
    }
);


canvas.addEventListener(
    "mouseup",
    () => {

        drawing = false;

        ctx.beginPath();
    }
);


canvas.addEventListener(
    "mousemove",
    draw
);


// =========================
// DRAW FUNCTION
// =========================

function draw(event){

    if(!drawing) return;

    const rect =
    canvas.getBoundingClientRect();

    ctx.lineTo(
        event.clientX - rect.left,
        event.clientY - rect.top
    );

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(
        event.clientX - rect.left,
        event.clientY - rect.top
    );
}


// =========================
// CLEAR BUTTON
// =========================

document.getElementById("clear-btn")
.addEventListener(
    "click",
    () => {

        ctx.fillStyle = "black";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
    }
);


// =========================
// CHANGE LEVEL
// =========================

levelSelect.addEventListener(
    "change",
    updateTarget
);


// =========================
// FIRST TARGET
// =========================

updateTarget();


// =========================
// PREDICT BUTTON
// =========================

document.getElementById("predict-btn")
.addEventListener(
    "click",
    predictLetter
);


// =========================
// PREDICT FUNCTION
// =========================

async function predictLetter(){

    // Temporary canvas
    const tempCanvas =
    document.createElement("canvas");

    tempCanvas.width = 28;

    tempCanvas.height = 28;

    const tempCtx =
    tempCanvas.getContext("2d");


    // Black background
    tempCtx.fillStyle = "black";

    tempCtx.fillRect(
        0,
        0,
        28,
        28
    );


    // Resize drawing
    tempCtx.drawImage(
        canvas,
        0,
        0,
        28,
        28
    );


   

    // =========================
    // IMAGE DATA
    // =========================

    const imageData =
    tempCtx.getImageData(
        0,
        0,
        28,
        28
    ).data;


    // =========================
    // PIXELS ARRAY
    // =========================

    let pixels = [];

    for(
        let i = 0;
        i < imageData.length;
        i += 4
    ){

        pixels.push(
            imageData[i]
        );
    }


    // =========================
    // SEND TO API
    // =========================

    const response =
    await fetch(

        "http://127.0.0.1:8000/predict",

        {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                data:pixels
            })
        }
    );


    // =========================
    // API RESPONSE
    // =========================

    const result =
    await response.json();

    const predictedLetter =
    result.prediction;




    // =========================
    // CHECK RESULT
    // =========================

    if(

        predictedLetter
        .trim()
        .toUpperCase()

        ===

        currentTarget
        .trim()
        .toUpperCase()
    ){

        document.getElementById(
            "result"
        ).innerText =
        "Correct ";

        document.getElementById(
            "result"
        ).style.color =
        "#4CAF50";


        // New target
        setTimeout(() => {

            updateTarget();

            ctx.fillStyle =
            "black";

            ctx.fillRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

        }, 1500);
    }

    else{

        document.getElementById(
            "result"
        ).innerText =
        "Try Again ";

        document.getElementById(
            "result"
        ).style.color =
        "#FF6B6B";
    }
}


// =========================
// CHANGE LETTER BUTTON
// =========================

document.getElementById("change-btn")
.addEventListener(
    "click",
    () => {

        // New random target
        updateTarget();

        // Clear canvas
        ctx.fillStyle = "black";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        // Clear result
        document.getElementById(
            "result"
        ).innerText = "";
    }
);