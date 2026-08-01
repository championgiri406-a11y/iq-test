let currentQuestion = 0;
let score = 0;
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

  if (index === questions[currentQuestion].answer) {
    score++;
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
</div>
<button class="certificate-btn" onclick="downloadCertificate()">
🎓 Download Certificate
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