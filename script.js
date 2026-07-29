document.addEventListener("DOMContentLoaded", () => {

const startBtn = document.getElementById("startBtn");

if (startBtn) {
  startBtn.addEventListener("click", startTest);
}

});

function startTest() {

document.getElementById("app").innerHTML = `

<div class="container">

<div class="header">
<div class="logo">🧠 IQ TEST HUB</div>
<div class="timer">20:00</div>
</div>

<h3>Question 1 of 20</h3>

<div class="progress">
<div class="progress-fill"></div>
</div>

<div class="question">
What number comes next?
<br><br>
2, 4, 8, 16, ?
</div>

<div class="answers">
<button>18</button>
<button>24</button>
<button>32</button>
<button>34</button>
</div>

<button class="next-btn">Next →</button>

</div>

`;
