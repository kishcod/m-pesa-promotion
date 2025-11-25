const wheel = document.getElementById("wheelCanvas");
const ctx = wheel.getContext("2d");

// Your prize segments
const segments = [520000, 13000, 50000, 30000, 5000, 25000, 40000];

// Safaricom color theme
const colors = ["#43A047", "#4CAF50", "#2E7D32", "#66BB6A", "#1B5E20", "#81C784", "#4CAF50"];

// Rotation variables
let startAngle = 0;
let spinTime = 0;
let spinTotalTime = 0;

// Sounds
const spinSound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-fast-energy-whoosh-1325.mp3");
const winSound  = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3");

function drawWheel() {
    const arc = Math.PI / (segments.length / 2);

    for (let i = 0; i < segments.length; i++) {
        let angle = startAngle + i * arc;

        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.arc(175, 175, 170, angle, angle + arc);
        ctx.arc(175, 175, 0, angle + arc, angle, true);
        ctx.fill();

        // Label
        ctx.save();
        ctx.translate(
            175 + Math.cos(angle + arc / 2) * 100,
            175 + Math.sin(angle + arc / 2) * 100
        );
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.fillText(segments[i], -20, 0);
        ctx.restore();
    }
}

function easeOut(t, b, c, d) {
    return c * Math.sin((t / d) * (Math.PI / 2)) + b;
}

function rotateWheel() {
    spinTime += 20;

    if (spinTime >= spinTotalTime) {
        stopRotate();
        return;
    }

    const spinAngle = easeOut(spinTime, 0, 20, spinTotalTime);
    startAngle += (spinAngle * Math.PI) / 180;

    drawWheel();
    requestAnimationFrame(rotateWheel);
}

function stopRotate() {
    const degrees = (startAngle * 180) / Math.PI + 90;
    const arcDeg = 360 / segments.length;
    const index = Math.floor((360 - (degrees % 360)) / arcDeg);

    winSound.play();

    // Go to win page
    window.location = "win.html?amount=" + segments[index];
}

// Spin button
document.getElementById("spinBtn").onclick = () => {
    spinSound.play();
    spinTime = 0;

    // slowed down
    spinTotalTime = 4500 + Math.random() * 2000;

    rotateWheel();
};

// Initial draw
drawWheel();
