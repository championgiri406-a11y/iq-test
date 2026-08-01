let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let categoryScores = {};
let timeLeft = 20 * 60;
let timer;

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("startBtn").addEventListener("click", startTest);

    document.getElementById("bestIQ").textContent =
        localStorage.getItem("bestIQ") || "--";

    document.getElementById("bestScore").textContent =
        localStorage.getItem("bestScore") || "--";
});

function showLoading() {
  document.getElementById("app").innerHTML = `
    <div class="loading-screen">
      <div class="brain">🧠</div>
      <h1>IQ TEST HUB</h1>
      <p>Preparing your personalized IQ test...</p>
      <div class="loader"></div>
    </div>
  `;

  setTimeout(() => {
    showQuestion();
    startTimer();

    const btn = document.getElementById("startBtn");
    if (btn) btn.disabled = false;
}, 2500);
}

function startTest() {
document.getElementById("startBtn").disabled = true;
  currentQuestion = 0;
  score = 0;
  userAnswers = [];
  categoryScores = {};
  timeLeft = 20 * 60;

  questions.sort(() => Math.random() - 0.5);

  showLoading();
}

function startTimer() {
  clearInterval(timer);

  timer = setInterval(() => {
    timeLeft--;

    const timerEl = document.querySelector(".timer");
    if (timerEl) {
      const min = String(Math.floor(timeLeft / 60)).padStart(2, "0");
      const sec = String(timeLeft % 60).padStart(2, "0");
      timerEl.textContent = `${min}:${sec}`;
    }

    if (timeLeft <= 0) {
      clearInterval(timer);
      finishTest();
    }
  }, 1000);
}

function showQuestion() {
  const q = questions[currentQuestion];

  document.getElementById("app").innerHTML = `
  <div class="container">

    <div class="header">
      <div class="logo">🧠 IQ TEST HUB</div>
      <div class="timer">${String(Math.floor(timeLeft / 60)).padStart(2,"0")}:${String(timeLeft % 60).padStart(2,"0")}</div>
    </div>

    <div class="question-header">
    <div class="question-badge">
        Question ${currentQuestion + 1} / ${questions.length}
    </div>
</div>

    <div class="progress">
      <div class="progress-fill" style="width:${((currentQuestion + 1) / questions.length) * 100}%"></div>
    </div>

    <div class="question">
      ${q.question.replace(/\n/g,"<br>")}
    </div>

    <div class="answers">
      ${q.options.map((option,index)=>
      `<button onclick="selectAnswer(${index})">${option}</button>`
      ).join("")}
    </div>

    <button id="nextBtn" class="next-btn" onclick="nextQuestion()" style="display:none;">
      Next →
    </button>

  </div>
  `;
}

function selectAnswer(index) {

  const buttons = document.querySelectorAll(".answers button");

  buttons.forEach((btn, i) => {
    btn.disabled = true;

    if (i === questions[currentQuestion].answer) {
      btn.style.background = "#22c55e";
      btn.style.color = "#fff";
    }

    if (i === index && i !== questions[currentQuestion].answer) {
      btn.style.background = "#ef4444";
      btn.style.color = "#fff";
    }
  });

  userAnswers[currentQuestion] = index;

if (index === questions[currentQuestion].answer) {
    score++;

    const category = questions[currentQuestion].category;

    categoryScores[category] =
        (categoryScores[category] || 0) + 1;
}

  document.getElementById("nextBtn").style.display = "inline-block";
}

function nextQuestion() {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    showQuestion();
  } else {
    finishTest();
  }
}

function finishTest() {
  clearInterval(timer);

  let iq;

  if (score <= 4) iq = 80;
  else if (score <= 8) iq = 95;
  else if (score <= 12) iq = 110;
  else if (score <= 16) iq = 125;
  else if (score <= 19) iq = 140;
  else iq = 155;

let rank = "";
let percentile = "";

if (iq >= 140) {
    rank = "#1";
    percentile = "Top 1%";
} else if (iq >= 125) {
    rank = "#2";
    percentile = "Top 5%";
} else if (iq >= 110) {
    rank = "#3";
    percentile = "Top 15%";
} else if (iq >= 95) {
    rank = "#4";
    percentile = "Top 50%";
} else {
    rank = "#5";
    percentile = "Keep Improving";
}

const accuracy = Math.round((score / questions.length) * 100);

const timeUsed = (20 * 60) - timeLeft;

const minutes = Math.floor(timeUsed / 60);

const seconds = String(timeUsed % 60).padStart(2, "0");

let achievement = "";
let medal = "";

if (iq >= 140) {
    medal = "🥇";
    achievement = "GENIUS";
} else if (iq >= 125) {
    medal = "🥈";
    achievement = "GIFTED";
} else if (iq >= 110) {
    medal = "🥉";
    achievement = "ABOVE AVERAGE";
} else if (iq >= 95) {
    medal = "⭐";
    achievement = "AVERAGE";
} else {
    medal = "📘";
    achievement = "KEEP PRACTICING";
}

let description = "";

if (iq >= 140)
    description = "Exceptional intelligence. Your reasoning and analytical abilities are outstanding.";
else if (iq >= 125)
    description = "Excellent cognitive ability. You solve complex problems with ease.";
else if (iq >= 110)
    description = "Above-average intelligence. You demonstrate strong logical thinking.";
else if (iq >= 95)
    description = "Average intelligence. You have solid reasoning and problem-solving skills.";
else
    description = "Keep practicing. Regular brain training can improve your logical thinking.";

    localStorage.setItem("bestIQ", iq);

if (score > (Number(localStorage.getItem("bestScore")) || 0)) {
    localStorage.setItem("bestScore", score);
}
    
  let bestIQ = localStorage.getItem("bestIQ") || 0;
let bestScore = localStorage.getItem("bestScore") || 0;

if (iq > bestIQ) {
    localStorage.setItem("bestIQ", iq);
    bestIQ = iq;
}

if (score > bestScore) {
    localStorage.setItem("bestScore", score);
    bestScore = score;
}
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

<div class="iq-circle" style="--deg:${iq*2.3}deg;">
    <div class="iq-inner">
        <div class="iq-number">${iq}</div>
        <div class="iq-label">IQ</div>
    </div>
</div>

<div class="achievement-card">
    <div class="medal">${medal}</div>
    <div class="achievement-title">${achievement}</div>
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
    <div class="score-number">${bestScore} / ${questions.length}</div>
<div class="analytics-card">
    <h3>📊 Performance Report</h3>

    <p><strong>Accuracy:</strong> ${accuracy}%</p>
    <p><strong>Time Used:</strong> ${minutes}:${seconds}</p>
    <p><strong>Questions Correct:</strong> ${score} / ${questions.length}</p>
</div>
<div class="rank-card">
    <h3>🌍 Performance Rank</h3>

    <div class="rank-number">${rank}</div>

    <div class="rank-text">${percentile}</div>
</div>
</div>
<button class="certificate-btn" onclick="downloadCertificate()">
🎓 Download Certificate
</button>

<button class="certificate-btn" onclick="reviewAnswers()">
📖 Review Answers
</button>

<button class="next-btn" onclick="location.reload()">
🔄 Restart Test
</button>

</div>
`;
}

function downloadCertificate() {

    document.getElementById("certIQ").textContent =
        "IQ " + localStorage.getItem("bestIQ");

    document.getElementById("certAchievement").textContent =
        document.querySelector(".achievement-title").textContent;

    document.getElementById("certDate").textContent =
        "Date: " + new Date().toLocaleDateString();

    const certificate = document.getElementById("certificate");

    certificate.style.display = "block";

    html2canvas(certificate, {
        scale: 2
    }).then(canvas => {

        certificate.style.display = "none";

        const link = document.createElement("a");
        link.download = "IQ_Test_Hub_Certificate.png";
        link.href = canvas.toDataURL("image/png");
        link.click();

    });
}
function reviewAnswers() {

    let html = `
    <div class="container">
        <h1>📖 Review Answers</h1>
    `;

    questions.forEach((q, i) => {

        const correct = userAnswers[i] === q.answer;

        html += `
        <div class="analytics-card">

            <h3>Question ${i + 1}</h3>

            <p>${q.question.replace(/\n/g,"<br>")}</p>

            <p style="color:${correct ? "#22c55e" : "#ef4444"};">
                ${correct ? "✅ Correct" : "❌ Incorrect"}
            </p>

            <p>
                <strong>Your Answer:</strong>
                ${q.options[userAnswers[i]] ?? "No Answer"}
            </p>

            <p>
                <strong>Correct Answer:</strong>
                ${q.options[q.answer]}
            </p>
${q.explanation ? `
<p style="margin-top:12px;padding:12px;background:#f8fafc;border-left:4px solid #4f46e5;border-radius:8px;">
    <strong>💡 Explanation:</strong><br>
    ${q.explanation}
</p>
` : ""}

        </div>
        `;
    });

    html += `
        <button class="next-btn" onclick="location.reload()">
            🔄 Back to Home
        </button>
    </div>`;

    document.getElementById("app").innerHTML = html;
}