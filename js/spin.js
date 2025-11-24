const wheel = document.getElementById("wheelCanvas");
const ctx = wheel.getContext("2d");

const segments = [520000, 13000, 50000, 30000, 5000, 25000, 40000];
const colors = ["#43A047","#4CAF50","#2E7D32","#66BB6A","#1B5E20","#81C784","#4CAF50"];

let startAngle = 0;
let spinTime = 0;
let spinTotalTime = 0;

// 🎯 FORCE WHEEL TO STOP AT THIS VALUE
const forcedWin = 50000;  // ← change to what you want

function drawWheel() {
    const arc = Math.PI / (segments.length / 2);

    for (let i=0; i<segments.length; i++) {
        let angle = startAngle + i * arc;

        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.arc(175, 175, 170, angle, angle + arc);
        ctx.arc(175, 175, 0, angle + arc, angle, true);
        ctx.fill();

        // text
        ctx.save();
        ctx.translate(
            175 + Math.cos(angle + arc / 2) * 100,
            175 + Math.sin(angle + arc / 2) * 100
        );
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.fillText(segments[i], -25, 0);
        ctx.restore();
    }
}

// ⭐ NEW — automatically compute exact stop angle for forced value
function getForcedStopAngle() {
    const index = segments.indexOf(forcedWin);
    const slice = 360 / segments.length;

    // pointer is at 0° (pointing left from right side)
    const pointerAngle = 0;

    return (360 - (index * slice) + pointerAngle) * (Math.PI / 180);
}


function rotateWheel() {
    spinTime += 30;

    if (spinTime >= spinTotalTime) {
        stopRotate();
        return;
    }

    const spinAngle = easeOut(spinTime, 0, 12, spinTotalTime); // slower spin
    startAngle += (spinAngle * Math.PI / 180);

    drawWheel();
    requestAnimationFrame(rotateWheel);
}

function stopRotate() {
    // 🎯 MAKE WHEEL SNAP EXACTLY TO WIN VALUE
    startAngle = getForcedStopAngle();

    drawWheel();

    setTimeout(() => {
        window.location = "win.html?amount=" + forcedWin;
    }, 1200); // smoother delay before next page
}

function easeOut(t, b, c, d) {
    return c * Math.sin((t / d) * (Math.PI / 2)) + b;
}

document.getElementById("spinBtn").onclick = () => {
    spinTime = 0;
    spinTotalTime = 4500; // slower + more realistic
    rotateWheel();
}

drawWheel();
