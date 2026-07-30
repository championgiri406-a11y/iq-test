let currentQuestion = 0;

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("startBtn")
    .addEventListener("click", startTest);
});

function startTest() {
  showQuestion();
}

function showQuestion() {
  const q = questions[currentQuestion];

  document.getElementById("app").innerHTML = `
  <div class="container">

    <div class="header">
      <div class="logo">🧠 IQ TEST HUB</div>
      <div class="timer">20:00</div>
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

    <button class="next-btn" onclick="nextQuestion()">
      Next →
    </button>

  </div>
  `;
}

function selectAnswer(index){
  console.log("Selected:", index);
}

function nextQuestion(){

  if(currentQuestion < questions.length-1){
      currentQuestion++;
      showQuestion();
  }else{
      alert("🎉 Test completed!");
  }

}
