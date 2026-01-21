const btn = document.getElementById("menu_btn");
const sidebar = document.getElementById("sidebar");

btn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
});
// Freedom container hide
var freedomWall = document.querySelector(".freedom_wall");
//Modal for policy
var modalPolicy = document.getElementById("modalPolicy");
var openPolicy = document.getElementById("openPolicy");
var closePolicy = document.getElementById("closePolicy");

openPolicy.onclick = function () {
    modalPolicy.style.display = "block";
    freedomWall.style.display = "none";
};

closePolicy.onclick = function () {
    modalPolicy.style.display = "none";
    freedomWall.style.display = "block";
};

window.onclick = function (event) {
    if (event.target == modalPolicy) {
        modalPolicy.style.display = "none";
    }
};

//Modal for Write Anonymously
var modalWrite = document.getElementById("modalWrite");
var openWrite = document.getElementById("openWrite");
var closeWrite = document.getElementById("closeWrite");

openWrite.onclick = function () {
    modalWrite.style.display = "block";
    freedomWall.style.display = "none";
};

closeWrite.onclick = function () {
    modalWrite.style.display = "none";
    freedomWall.style.display = "block";
};

window.onclick = function (event) {
    if (event.target == modalWrite) {
        modalWrite.style.display = "none";
        freedomWall.style.display = "block";
    }
};

// report
document.querySelectorAll(".reportBtn").forEach((button) => {
    button.addEventListener("click", function () {
        // Find the closest .report element and then toggle the .report_modal inside it
        const reportModal =
            this.closest(".report").querySelector(".report_modal");
        reportModal.classList.toggle("show");
    });
});

// text to speech
document.querySelectorAll(".tts").forEach((ttsButton) => {
    let isSpeaking = false;
    let utterance;

    ttsButton.addEventListener("click", () => {
        const content = ttsButton.previousElementSibling.textContent;

        if (!isSpeaking) {
            utterance = new SpeechSynthesisUtterance(content);
            speechSynthesis.speak(utterance);
            isSpeaking = true;
        } else {
            if (speechSynthesis.speaking) {
                speechSynthesis.pause();
            } else {
                speechSynthesis.resume();
            }
            isSpeaking = false;
        }
    });
});
