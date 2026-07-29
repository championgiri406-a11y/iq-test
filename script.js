document.addEventListener("DOMContentLoaded", () => {

const startBtn = document.getElementById("startBtn");

if (startBtn) {
  startBtn.addEventListener("click", startTest);
}

});

function startTest() {

document.getElementById("app").innerHTML = `

<div class="test-screen">

<h2>Question 1 of 20</h2>

<div class="progress">
<div class="progress-fill" style="width:5%"></div>
</div>

<div class="timer-box">
⏱️ 20:00
</div>

<div class="question-card">

<h1>
What number comes next?
</h1>

<h2>
2, 4, 8, 16, ?
</h2>

<div class="answers">

<button class="answer">18</button>

<button class="answer">24</button>

<button class="answer">32</button>

<button class="answer">34</button>

</div>

<br>

<button class="next-btn">
Next →
</button>

</div>

</div>

`;

}
