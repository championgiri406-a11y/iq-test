document.addEventListener("DOMContentLoaded", function () {

    const button = document.getElementById("startBtn");

    button.addEventListener("click", function () {

        document.getElementById("app").innerHTML = `
            <div style="
                text-align:center;
                padding:60px 20px;
                font-family:Arial;
            ">
                <h1>🧠 IQ TEST HUB</h1>
                <h2>✅ Button is working!</h2>
                <p>The problem is inside the original JavaScript code.</p>
            </div>
        `;

    });

});
