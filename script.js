// Konstanta dan Variabel Global
const FPS = 60;
const INTERVAL = 1000 / FPS;
let lastTime = 0;
let deltaTime = 0;

// Koneksi WebSocket
const ws = new WebSocket('wss://echo.websocket.org');

ws.onopen = () => {
    document.getElementById('connectionStatus').textContent = 'Terhubung';
    document.getElementById('connectionStatus').style.color = '#4CAF50';
};

ws.onclose = () => {
    document.getElementById('connectionStatus').textContent = 'Terputus';
    document.getElementById('connectionStatus').style.color = '#f44336';
};

// Navigasi Tab
document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Update tombol aktif
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Update bagian aktif
        document.querySelectorAll('.lab-section').forEach(section => section.classList.remove('active'));
        document.getElementById(button.dataset.tab).classList.add('active');

        // Reset simulasi
        if (button.dataset.tab === 'newton') {
            resetNewtonSimulation();
        } else {
            resetOhmSimulation();
        }
    });
});

// Simulasi Hukum Newton
const newtonCanvas = document.getElementById('newtonCanvas');
const newtonCtx = newtonCanvas.getContext('2d');
let boxX = 50;
let boxVelocity = 0;

// Event Listeners untuk input Hukum Newton
document.getElementById('mass').addEventListener('input', function() {
    document.getElementById('massValue').textContent = this.value + ' kg';
    updateNewtonSimulation();
});

document.getElementById('force').addEventListener('input', function() {
    document.getElementById('forceValue').textContent = this.value + ' N';
    updateNewtonSimulation();
});

document.getElementById('friction').addEventListener('input', function() {
    document.getElementById('frictionValue').textContent = this.value;
    updateNewtonSimulation();
});

function resetNewtonSimulation() {
    boxX = 50;
    boxVelocity = 0;
    updateNewtonDisplay();
}

function updateNewtonSimulation() {
    const mass = parseFloat(document.getElementById('mass').value);
    const force = parseFloat(document.getElementById('force').value);
    const friction = parseFloat(document.getElementById('friction').value);

    // Hitung gaya netto (F = ma)
    const frictionForce = friction * mass * 9.81 * Math.sign(-boxVelocity);
    const netForce = force + frictionForce;
    const acceleration = netForce / mass;

    // Update kecepatan dan posisi
    boxVelocity += acceleration * deltaTime;
    boxX += boxVelocity * deltaTime;

    // Cek batas
    if (boxX < 50) {
        boxX = 50;
        boxVelocity = 0;
    } else if (boxX > newtonCanvas.width - 100) {
        boxX = newtonCanvas.width - 100;
        boxVelocity = 0;
    }
    // Update tampilan
    updateNewtonDisplay(acceleration);
}

function drawNewtonSimulation() {
    newtonCtx.clearRect(0, 0, newtonCanvas.width, newtonCanvas.height);

    // Gambar lantai
    newtonCtx.fillStyle = '#ddd';
    newtonCtx.fillRect(0, newtonCanvas.height - 50, newtonCanvas.width, 50);

    // Gambar kotak
    newtonCtx.fillStyle = '#1e3c72';
    newtonCtx.fillRect(boxX, newtonCanvas.height - 100, 50, 50);

    // Gambar panah gaya
    const force = parseFloat(document.getElementById('force').value);
    if (force > 0) {
         newtonCtx.beginPath();
         newtonCtx.moveTo(boxX + 25, newtonCanvas.height - 75);
         newtonCtx.lineTo(boxX + 25 + force * 2, newtonCanvas.height - 75);
         newtonCtx.strokeStyle = '#f44336';
         newtonCtx.lineWidth = 3;
         newtonCtx.stroke();

        // Gambar kepala panah
        const arrowSize = 10;
        newtonCtx.beginPath();
        newtonCtx.moveTo(boxX + 25 + force * 2, newtonCanvas.height - 75);
        newtonCtx.lineTo(boxX + 25 + force * 2 - arrowSize, newtonCanvas.height - 75 - arrowSize/2);
        newtonCtx.lineTo(boxX + 25 + force * 2 - arrowSize, newtonCanvas.height - 75 + arrowSize/2);
        newtonCtx.closePath();
        newtonCtx.fillStyle = '#f44336';
        newtonCtx.fill();
    }
}

function updateNewtonDisplay(acceleration = 0) {
    document.getElementById('acceleration').textContent = acceleration.toFixed(2);
    document.getElementById('velocity').textContent = boxVelocity.toFixed(2);
    document.getElementById('position').textContent = (boxX - 50).toFixed(2);
}

// Simulasi Hukum Ohm
const ohmCanvas = document.getElementById('ohmCanvas');
const ohmCtx = ohmCanvas.getContext('2d');
let currentPhase = 0;

// Event Listeners untuk input Hukum Ohm
document.getElementById('voltage').addEventListener('input', function() {
    document.getElementById('voltageValue').textContent = this.value + ' V';
    updateOhmSimulation();
});

document.getElementById('resistance').addEventListener('input', function() {
    document.getElementById('resistanceValue').textContent = this.value + ' Ω';
    updateOhmSimulation();
});

function resetOhmSimulation() {
    currentPhase = 0;
    updateOhmSimulation();
}

function updateOhmSimulation() {
    const voltage = parseFloat(document.getElementById('voltage').value);
    const resistance = parseFloat(document.getElementById('resistance').value);
    
    // Hitung arus menggunakan Hukum Ohm (I = V/R)
    const current = voltage / resistance;
    
    // Hitung daya (P = VI)
    const power = voltage * current;

    // Update tampilan
    document.getElementById('current').textContent = current.toFixed(3);
    document.getElementById('power').textContent = power.toFixed(2);

    drawOhmSimulation(voltage, current);
}

function drawOhmSimulation(voltage, current) {
    ohmCtx.clearRect(0, 0, ohmCanvas.width, ohmCanvas.height);

    // Gambar rangkaian
    ohmCtx.strokeStyle = '#333';
    ohmCtx.lineWidth = 3;
    ohmCtx.beginPath();
    
    // Baterai
    drawBattery();
    
    // Resistor
    drawResistor();
    
    // Lengkapi rangkaian
    drawCircuitPath();
    
    // Gambar animasi aliran arus
    if (current > 0) {
        drawCurrentFlow(current);
    }
}

function drawBattery() {
    ohmCtx.beginPath();
    ohmCtx.moveTo(100, 200);
    ohmCtx.lineTo(150, 200);
    // Simbol baterai positif
    ohmCtx.moveTo(170, 180);
    ohmCtx.lineTo(170, 220);
    // Simbol baterai negatif
    ohmCtx.moveTo(150, 180);
    ohmCtx.lineTo(150, 220);
    ohmCtx.stroke();
}

function drawResistor() {
    ohmCtx.beginPath();
    ohmCtx.moveTo(250, 200);
    
    // Gambar simbol resistor zigzag
    let x = 250;
    const zigzagWidth = 10;
    const zigzagHeight = 15;
    
    for (let i = 0; i < 8; i++) {
        if (i % 2 === 0) {
            ohmCtx.lineTo(x + zigzagWidth, 200 - zigzagHeight);
        } else {
            ohmCtx.lineTo(x + zigzagWidth, 200 + zigzagHeight);
        }
        x += zigzagWidth;
    }
    
    ohmCtx.lineTo(350, 200);
    ohmCtx.stroke();
}

function drawCircuitPath() {
    ohmCtx.beginPath();
    ohmCtx.moveTo(350, 200);
    ohmCtx.lineTo(400, 200);
    ohmCtx.lineTo(400, 100);
    ohmCtx.lineTo(100, 100);
    ohmCtx.lineTo(100, 200);
    ohmCtx.stroke();
}

function drawCurrentFlow(current) {
    currentPhase += current * 0.1;
    const dotCount = 20;
    const pathPoints = [
        {x: 100, y: 200}, {x: 400, y: 200},
        {x: 400, y: 100}, {x: 100, y: 100},
        {x: 100, y: 200}
    ];
    
    // Gambar titik-titik yang bergerak sepanjang rangkaian
    ohmCtx.fillStyle = '#f44336';
    for (let i = 0; i < dotCount; i++) {
        const phase = (currentPhase + i * (2 * Math.PI / dotCount)) % (2 * Math.PI);
        const pos = getPositionOnPath(phase, pathPoints);
        ohmCtx.beginPath();
        ohmCtx.arc(pos.x, pos.y, 3, 0, 2 * Math.PI);
        ohmCtx.fill();
    }
}

function getPositionOnPath(phase, points) {
    const totalLength = calculatePathLength(points);
    let distance = (phase / (2 * Math.PI)) * totalLength;
    
    for (let i = 0; i < points.length - 1; i++) {
        const segmentLength = Math.hypot(
            points[i + 1].x - points[i].x,
            points[i + 1].y - points[i].y
        );
        
        if (distance <= segmentLength) {
            const ratio = distance / segmentLength;
            return {
                x: points[i].x + (points[i + 1].x - points[i].x) * ratio,
                y: points[i].y + (points[i + 1].y - points[i].y) * ratio
            };
        }
        
        distance -= segmentLength;
    }
    
    return points[0];
}

function calculatePathLength(points) {
    let length = 0;
    for (let i = 0; i < points.length - 1; i++) {
        length += Math.hypot(
            points[i + 1].x - points[i].x,
            points[i + 1].y - points[i].y
        );
    }
    return length;
}

// Loop animasi utama
function animate(currentTime) {
    if (!lastTime) lastTime = currentTime;
    deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    if (document.getElementById('newton').classList.contains('active')) {
        updateNewtonSimulation();
        drawNewtonSimulation();
    } else {
        updateOhmSimulation();
    }

    requestAnimationFrame(animate);
}

// Mulai animasi
requestAnimationFrame(animate);