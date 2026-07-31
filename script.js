let currentQuestion = 0;
let score = 0;
let timeLeft = 20 * 60;
let timer;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("startBtn").addEventListener("click", startTest);
});

function startTest() {
  currentQuestion = 0;
  score = 0;
  timeLeft = 20 * 60;

  showQuestion();
  startTimer();
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

    <h3>Question ${currentQuestion + 1} of ${questions.length}</h3>

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

  document.getElementById("app").innerHTML = `
  <div class="container">

    <h1>🏆 Test Completed</h1>

    <h2>Your Score</h2>

    <h1>${score} / ${questions.length}</h1>

    <button class="next-btn" onclick="location.reload()">
      Restart Test
    </button>

  </div>
  `;
}
