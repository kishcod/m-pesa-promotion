const wheel = document.getElementById("wheelCanvas");
const ctx = wheel.getContext("2d");

const segments = [52000,13000,50000,30000,50000,25000,40000];
const colors   = ["#43A047","#4CAF50","#2E7D32","#66BB6A","#1B5E20","#81C784","#4CAF50"];

let startAngle = 0, spinTime = 0, spinTotalTime = 0;

function drawWheel(){
    const arc = Math.PI / (segments.length / 2);

    for(let i = 0; i < segments.length; i++){
        let angle = startAngle + i * arc;

        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.arc(175, 175, 170, angle, angle + arc);
        ctx.arc(175, 175, 0, angle + arc, angle, true);
        ctx.fill();

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

function rotateWheel(){
    spinTime += 50;

    if(spinTime >= spinTotalTime){
        stopRotate();
        return;
    }

    // Slower speed (80 → 40 degrees/frame)
    const spinAngle = easeOut(spinTime, 0, 50, spinTotalTime);

    startAngle += spinAngle * Math.PI / 180;

    drawWheel();
    requestAnimationFrame(rotateWheel);
}

function stopRotate(){
    const degrees = (startAngle * 180 / Math.PI + 90) % 360;
    const arcd = 360 / segments.length;

    const index = Math.floor((360 - degrees) / arcd) % segments.length;
    const amount = segments[index];

    // SHOW THE RESULT FIRST
    // You can customize this
    alert("🎉 You won: KES " + amount);

    // WAIT 2 SECONDS BEFORE REDIRECTING
    setTimeout(() => {
        window.location = "win.html?amount=" + amount;
    }, 2000); // 2000 ms = 2 seconds
}


function easeOut(t, b, c, d){
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
}

document.getElementById("spinBtn").onclick = () => {
    spinTime = 10;

    // Slower spin: 20s – 25.5s
    spinTotalTime = 8000 + Math.random() * 1800;

    rotateWheel();
};

drawWheel();
