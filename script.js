let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let categoryScores = {};
let timeLeft = 20 * 60;
let timer = null;

document.addEventListener("DOMContentLoaded", function () {
    const startBtn = document.getElementById("startBtn");

    if (startBtn) {
        startBtn.addEventListener("click", startTest);
    }

    const bestIQ = document.getElementById("bestIQ");
    const bestScore = document.getElementById("bestScore");

    if (bestIQ) {
        bestIQ.textContent = localStorage.getItem("bestIQ") || "--";
    }

    if (bestScore) {
        bestScore.textContent = localStorage.getItem("bestScore") || "--";
    }
});

function startTest() {
    currentQuestion = 0;
    score = 0;
    userAnswers = [];
    categoryScores = {};
    timeLeft = 20 * 60;

    clearInterval(timer);

    if (typeof questions === "undefined" || !Array.isArray(questions)) {
        document.getElementById("app").innerHTML = `
            <div class="container">
                <h2>⚠️ Questions could not be loaded</h2>
                <p>Please check that <b>questions.js</b> exists in the same folder.</p>
            </div>
        `;
        return;
    }

    questions.sort(() => Math.random() - 0.5);

    showLoading();
}

function showLoading() {
    document.getElementById("app").innerHTML = `
        <div class="loading-screen">
            <div class="brain">🧠</div>
            <h1>IQ TEST HUB</h1>
            <p>Preparing your personalized IQ test...</p>
            <div class="loader"></div>
        </div>
    `;

    setTimeout(function () {
        showQuestion();
        startTimer();
    }, 1500);
}

function startTimer() {
    clearInterval(timer);

    timer = setInterval(function () {
        timeLeft--;

        updateTimer();

        if (timeLeft <= 0) {
            clearInterval(timer);
            finishTest();
        }
    }, 1000);
}

function updateTimer() {
    const timerElement = document.querySelector(".timer");

    if (!timerElement) return;

    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const seconds = String(timeLeft % 60).padStart(2, "0");

    timerElement.textContent = `${minutes}:${seconds}`;
}

function showQuestion() {
    const q = questions[currentQuestion];

    if (!q) {
        finishTest();
        return;
    }

    document.getElementById("app").innerHTML = `
        <div class="container">

            <div class="header">
                <div class="logo">🧠 IQ TEST HUB</div>
                <div class="timer">
                    ${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(timeLeft % 60).padStart(2, "0")}
                </div>
            </div>

            <div class="question-header">
                <div class="question-badge">
                    Question ${currentQuestion + 1} / ${questions.length}
                </div>
            </div>

            <div class="progress">
                <div class="progress-fill"
                     style="width:${((currentQuestion + 1) / questions.length) * 100}%">
                </div>
            </div>

            <div class="question">
                ${q.question.replace(/\n/g, "<br>")}
            </div>

            <div class="answers">
                ${q.options.map(function (option, index) {
                    return `
                        <button onclick="selectAnswer(${index})">
                            ${option}
                        </button>
                    `;
                }).join("")}
            </div>

            <button id="nextBtn"
                    class="next-btn"
                    onclick="nextQuestion()"
                    style="display:none;">
                Next →
            </button>

        </div>
    `;
}

function selectAnswer(index) {
    const q = questions[currentQuestion];
    const buttons = document.querySelectorAll(".answers button");

    buttons.forEach(function (button, i) {
        button.disabled = true;

        if (i === q.answer) {
            button.style.background = "#22c55e";
            button.style.color = "#ffffff";
        }

        if (i === index && i !== q.answer) {
            button.style.background = "#ef4444";
            button.style.color = "#ffffff";
        }
    });

    userAnswers[currentQuestion] = index;

    if (index === q.answer) {
        score++;

        const category = q.category || "General";

        categoryScores[category] =
            (categoryScores[category] || 0) + 1;
    }

    const nextBtn = document.getElementById("nextBtn");

    if (nextBtn) {
        nextBtn.style.display = "inline-block";
    }
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        finishTest();
    }
}

function calculateIQ() {
    if (score <= 4) return 80;
    if (score <= 8) return 95;
    if (score <= 12) return 110;
    if (score <= 16) return 125;
    if (score <= 19) return 140;
    return 155;
}

function finishTest() {
    clearInterval(timer);

    const iq = calculateIQ();

    const accuracy = Math.round(
        (score / questions.length) * 100
    );

    const timeUsed = (20 * 60) - timeLeft;
    const minutes = Math.floor(timeUsed / 60);
    const seconds = String(timeUsed % 60).padStart(2, "0");

    let medal;
    let achievement;
    let description;
    let rank;
    let percentile;

    if (iq >= 140) {
        medal = "🥇";
        achievement = "GENIUS";
        description =
            "Exceptional intelligence. Your reasoning and analytical abilities are outstanding.";
        rank = "#1";
        percentile = "Top 1%";
    } else if (iq >= 125) {
        medal = "🥈";
        achievement = "GIFTED";
        description =
            "Excellent cognitive ability. You solve complex problems with ease.";
        rank = "#2";
        percentile = "Top 5%";
    } else if (iq >= 110) {
        medal = "🥉";
        achievement = "ABOVE AVERAGE";
        description =
            "Above-average intelligence. You demonstrate strong logical thinking.";
        rank = "#3";
        percentile = "Top 15%";
    } else if (iq >= 95) {
        medal = "⭐";
        achievement = "AVERAGE";
        description =
            "Average intelligence. You have solid reasoning and problem-solving skills.";
        rank = "#4";
        percentile = "Top 50%";
    } else {
        medal = "📘";
        achievement = "KEEP PRACTICING";
        description =
            "Keep practicing. Regular brain training can improve your logical thinking.";
        rank = "#5";
        percentile = "Keep Improving";
    }

    const oldBestIQ = Number(localStorage.getItem("bestIQ")) || 0;
    const oldBestScore = Number(localStorage.getItem("bestScore")) || 0;

    const bestIQ = Math.max(iq, oldBestIQ);
    const bestScore = Math.max(score, oldBestScore);

    localStorage.setItem("bestIQ", bestIQ);
    localStorage.setItem("bestScore", bestScore);

    document.getElementById("app").innerHTML = `
        <div class="container">

            <h1>🧠 IQ TEST HUB</h1>

            <h2>🎉 Assessment Completed Successfully</h2>

            <p class="result-subtitle">
                Your intelligence profile has been analyzed successfully.
            </p>

            <div class="iq-description">
                ${description}
            </div>

            <div class="iq-circle" style="--deg:${iq * 2.3}deg;">
                <div class="iq-inner">
                    <div class="iq-number">${iq}</div>
                    <div class="iq-label">IQ</div>
                </div>
            </div>

            <div class="achievement-card">
                <div class="medal">${medal}</div>
                <div class="achievement-title">
                    ${achievement}
                </div>
            </div>

            <div class="score-box">
                <h3>Your Score</h3>
                <div class="score-number">
                    ${score} / ${questions.length}
                </div>
            </div>

            <div class="score-box">
                <h3>🏆 Best IQ</h3>
                <div class="score-number">${bestIQ}</div>
            </div>

            <div class="score-box">
                <h3>⭐ Best Score</h3>
                <div class="score-number">
                    ${bestScore} / ${questions.length}
                </div>
            </div>

            <div class="analytics-card">
                <h3>📊 Performance Report</h3>

                <p><strong>Accuracy:</strong> ${accuracy}%</p>

                <p>
                    <strong>Time Used:</strong>
                    ${minutes}:${seconds}
                </p>

                <p>
                    <strong>Questions Correct:</strong>
                    ${score} / ${questions.length}
                </p>
            </div>

            <div class="analytics-card">
                <h3>🧠 Category Performance</h3>

                ${createCategoryReport()}
            </div>

            <div class="rank-card">
                <h3>🌍 Performance Rank</h3>

                <div class="rank-number">${rank}</div>

                <div class="rank-text">${percentile}</div>
            </div>

            <button class="certificate-btn"
                    onclick="downloadCertificate()">
                🎓 Download Certificate
            </button>

            <button class="certificate-btn"
                    onclick="reviewAnswers()">
                📖 Review Answers
            </button>

            <button class="next-btn"
                    onclick="location.reload()">
                🔄 Restart Test
            </button>

        </div>
    `;
}

function createCategoryReport() {
    const categories = [
        "Numerical Ability",
        "Logical Reasoning",
        "Pattern Recognition",
        "Verbal Reasoning"
    ];

    return categories.map(function (category) {
        return `
            <p>
                <strong>${category}:</strong>
                ${categoryScores[category] || 0}
            </p>
        `;
    }).join("");
}

function downloadCertificate() {
    const certificate = document.getElementById("certificate");

    if (!certificate) {
        alert("Certificate area could not be found.");
        return;
    }

    const iq = localStorage.getItem("bestIQ") || "0";

    document.getElementById("certIQ").textContent =
        "IQ " + iq;

    const achievementElement =
        document.querySelector(".achievement-title");

    document.getElementById("certAchievement").textContent =
        achievementElement
            ? achievementElement.textContent
            : "Achievement";

    document.getElementById("certDate").textContent =
        "Date: " + new Date().toLocaleDateString();

    certificate.style.display = "block";

    if (typeof html2canvas === "undefined") {
        alert("Certificate generator is still loading. Please try again.");
        certificate.style.display = "none";
        return;
    }

    html2canvas(certificate, {
        scale: 2
    }).then(function (canvas) {

        certificate.style.display = "none";

        const link = document.createElement("a");

        link.download =
            "IQ_Test_Hub_Certificate.png";

        link.href =
            canvas.toDataURL("image/png");

        link.click();

    }).catch(function () {

        certificate.style.display = "none";

        alert("Could not create the certificate.");
    });
}

function reviewAnswers() {
    let html = `
        <div class="container">

            <h1>📖 Review Answers</h1>
    `;

    questions.forEach(function (q, i) {

        const selected = userAnswers[i];
        const correct = selected === q.answer;

        html += `
            <div class="analytics-card">

                <h3>Question ${i + 1}</h3>

                <p>
                    ${q.question.replace(/\n/g, "<br>")}
                </p>

                <p style="color:${correct ? "#22c55e" : "#ef4444"};">
                    ${correct ? "✅ Correct" : "❌ Incorrect"}
                </p>

                <p>
                    <strong>Your Answer:</strong>
                    ${selected !== undefined
                        ? q.options[selected]
                        : "No Answer"}
                </p>

                <p>
                    <strong>Correct Answer:</strong>
                    ${q.options[q.answer]}
                </p>

                ${
                    q.explanation
                        ? `
                            <p style="
                                margin-top:12px;
                                padding:12px;
                                background:#f8fafc;
                                border-left:4px solid #4f46e5;
                                border-radius:8px;
                            ">
                                <strong>💡 Explanation:</strong><br>
                                ${q.explanation}
                            </p>
                        `
                        : ""
                }

            </div>
        `;
    });

    html += `
            <button class="next-btn"
                    onclick="location.reload()">
                🔄 Back to Home
            </button>

        </div>
    `;

    document.getElementById("app").innerHTML = html;
}
