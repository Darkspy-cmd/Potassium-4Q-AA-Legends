var currentLevel = "";
var correctWord = "";
var score = 0;
var username = "";

window.onload = function () {
    let savedUser = localStorage.getItem("username");

    if (savedUser) {
        document.getElementById("username").value = savedUser;
    }

    displayLeaderboard();
    displayLastScore();
};

function saveUsername() {
    var input = document.getElementById("username").value.trim();
    var msg = document.getElementById("saveMsg");

    var valid = /^[A-Za-z0-9_]+$/;

    if (input === "") {
        msg.style.color = "red";
        msg.innerHTML = "Enter a username first.";
        return;
    }

    if (!valid.test(input)) {
        msg.style.color = "red";
        msg.innerHTML = "Only letters, numbers, and underscores allowed.";
        return;
    }

    localStorage.setItem("username", input);

    msg.style.color = "green";
    msg.innerHTML = "Username saved!";
}


function startGame() {
    var input = document.getElementById("username").value.trim();
    var error = document.getElementById("errorMsg");

    var valid = /^[A-Za-z0-9_]+$/;

    if (input === "") {
        error.innerHTML = "Username is required.";
        return;
    }

    if (!valid.test(input)) {
        error.innerHTML = "Only letters, numbers, and underscores are allowed.";
        return;
    }

    username = input;
    error.innerHTML = "";

    document.getElementById("home").classList.add("hidden");
    document.getElementById("menu").classList.remove("hidden");

    displayLeaderboard();
    displayLastScore();
}

function startLevel(level) {
    currentLevel = level;

    document.getElementById("menu").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");

    var title = document.getElementById("levelTitle");
    var story = document.getElementById("storyText");

    var pic1 = document.getElementById("pic1");
    var pic2 = document.getElementById("pic2");
    var pic3 = document.getElementById("pic3");
    var pic4 = document.getElementById("pic4");

    if (level == "easy") {
        title.innerHTML = "Easy - The Three Little Pigs";
        story.innerHTML =
            "The three little pigs built houses. One used straw, one used sticks, and one used ______.";
        correctWord = "bricks";

        pic1.src = "images/easy1.jpg";
        pic2.src = "images/easy2.jpg";
        pic3.src = "images/easy3.jpg";
        pic4.src = "images/easy4.jpg";
    }

    if (level == "medium") {
        title.innerHTML = "Medium - Hansel and Gretel";
        story.innerHTML =
            "Hansel and Gretel found a house made of ______ in the forest.";
        correctWord = "candy";

        pic1.src = "images/medium1.jpg";
        pic2.src = "images/medium2.jpg";
        pic3.src = "images/medium3.jpg";
        pic4.src = "images/medium4.jpg";
    }

    if (level == "hard") {
        title.innerHTML = "Hard - Goldilocks";
        story.innerHTML =
            "Goldilocks entered the house of the three ______.";
        correctWord = "bears";

        pic1.src = "images/hard1.jpg";
        pic2.src = "images/hard2.jpg";
        pic3.src = "images/hard3.jpg";
        pic4.src = "images/hard4.jpg";
    }

    document.getElementById("message").innerHTML = "";
    document.getElementById("userAnswer").value = "";
    document.getElementById("nextBtn").classList.add("hidden");
}


function checkAnswer() {
    var input = document.getElementById("userAnswer").value.toLowerCase().trim();
    var message = document.getElementById("message");

    if (input === "") {
        message.innerHTML = "Please enter an answer.";
        message.style.color = "orange";
        return;
    }

    if (input == correctWord) {
        score += 10;
        document.getElementById("topBar").innerHTML = "Score: " + score;

        message.innerHTML = "Correct! Good job, " + username + " 🎉";
        message.style.color = "green";

        var nextBtn = document.getElementById("nextBtn");

        if (currentLevel == "easy") {
            document.getElementById("mediumBtn").disabled = false;
            document.getElementById("mediumBtn").classList.remove("locked");
            nextBtn.classList.remove("hidden");
        }
        else if (currentLevel == "medium") {
            document.getElementById("hardBtn").disabled = false;
            document.getElementById("hardBtn").classList.remove("locked");
            nextBtn.classList.remove("hidden");
        }
        else {
            nextBtn.classList.add("hidden");
            message.innerHTML += "<br>🎉 You finished all levels!";

            saveScore();
            displayLeaderboard();
            displayLastScore();
        }

    } else {
        message.innerHTML = "Wrong answer. Try again.";
        message.style.color = "red";
    }
}


function nextLevel() {
    if (currentLevel == "easy") {
        startLevel("medium");
    }
    else if (currentLevel == "medium") {
        startLevel("hard");
    }
}


function goBack() {
    document.getElementById("game").classList.add("hidden");
    document.getElementById("menu").classList.remove("hidden");

    displayLeaderboard();
    displayLastScore();
}


function saveScore() {
    localStorage.setItem("lastScore", score);

    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

    leaderboard.push({
        name: username,
        score: score
    });

    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 5);

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

function displayLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    let board = document.getElementById("leaderboard");

    if (!board) return;

    board.innerHTML = "<h3>🏆 Leaderboard</h3>";

    if (leaderboard.length === 0) {
        board.innerHTML += "No scores yet.";
        return;
    }

    leaderboard.forEach((player, index) => {
        let medal = "";

        if (index === 0) medal = "🥇 ";
        else if (index === 1) medal = "🥈 ";
        else if (index === 2) medal = "🥉 ";

        board.innerHTML +=
            medal + (index + 1) + ". " + player.name + " - " + player.score + "<br>";
    });
}


function displayLastScore() {
    let last = localStorage.getItem("lastScore");
    let box = document.getElementById("lastScore");

    if (!box) return;

    if (last) {
        box.innerHTML = "Last Score: " + last;
    } else {
        box.innerHTML = "No previous score.";
    }
}


function resetLeaderboard() {
    localStorage.removeItem("leaderboard");
    localStorage.removeItem("lastScore");
    displayLeaderboard();
    displayLastScore();
}