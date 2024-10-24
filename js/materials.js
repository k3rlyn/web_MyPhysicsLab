// Inisialisasi WebSocket
const ws = new WebSocket('wss://echo.websocket.org');

ws.onopen = () => {
    document.getElementById('connectionStatus').textContent = 'Terhubung';
    document.getElementById('connectionStatus').style.color = '#4CAF50';
};

ws.onclose = () => {
    document.getElementById('connectionStatus').textContent = 'Terputus';
    document.getElementById('connectionStatus').style.color = '#f44336';
};

// Navigasi Materi
document.querySelectorAll('.material-list li').forEach(item => {
    item.addEventListener('click', () => {
        // Update active state pada sidebar
        document.querySelectorAll('.material-list li').forEach(li => li.classList.remove('active'));
        item.classList.add('active');

        // Update konten yang ditampilkan
        const targetSection = item.dataset.section;
        document.querySelectorAll('.material-section').forEach(section => {
            section.classList.remove('active');
            if (section.id === targetSection) {
                section.classList.add('active');
                updateProgress(targetSection);
            }
        });
    });
});

// Progress Tracking
let progress = {
    newton1: 0,
    newton2: 0,
    newton3: 0,
    ohm: 0
};

function updateProgress(section) {
    // Tandai bagian yang sudah dibaca
    progress[section] = 100;
    
    // Hitung total progress
    const totalProgress = Object.values(progress).reduce((a, b) => a + b, 0) / Object.keys(progress).length;
    
    // Update progress bar
    const progressBar = document.getElementById('learningProgress');
    const progressText = document.getElementById('progressText');
    
    progressBar.style.width = `${totalProgress}%`;
    progressText.textContent = `${Math.round(totalProgress)}%`;
    
    // Simpan progress di localStorage
    localStorage.setItem('learningProgress', JSON.stringify(progress));
}

// Load saved progress
function loadProgress() {
    const savedProgress = localStorage.getItem('learningProgress');
    if (savedProgress) {
        progress = JSON.parse(savedProgress);
        updateProgressDisplay();
    } else {
        // Set initial progress to 0
        localStorage.setItem('learningProgress', JSON.stringify(progress));
        updateProgressDisplay();
    }
}
function updateProgressDisplay() {
    const totalProgress = Object.values(progress).reduce((a, b) => a + b, 0) / Object.keys(progress).length;
    const progressBar = document.getElementById('learningProgress');
    const progressText = document.getElementById('progressText');
    
    if (progressBar && progressText) {
        progressBar.style.width = `${totalProgress}%`;
        progressText.textContent = `${Math.round(totalProgress)}%`;
    }
}

// Update progress when a section is viewed
document.querySelectorAll('.material-list li').forEach(item => {
    item.addEventListener('click', () => {
        const targetSection = item.dataset.section;
        if (targetSection) {
            progress[targetSection] = 100;
            localStorage.setItem('learningProgress', JSON.stringify(progress));
            updateProgressDisplay();
        }
    });
});

// Simulasi Hukum Newton I
const newton1Canvas = document.getElementById('newton1Canvas');
const n1ctx = newton1Canvas.getContext('2d');
let cartX = 50;
let isSimulating = false;
let newton1Force = 0;
let newton1Mass = 1;

function initNewton1(){
    // Inisialisasi nilai awal
    const forceInput = document.getElementById('newton1Force');
    const forceValue = document.getElementById('newton1ForceValue');

    if (forceInput && forceValue) {
        forceInput.value = "0";
        forceValue.textContent = `"0 N"`;
        newton1Force = 0;
    }
    
    // Event listener untuk input gaya
    forceInput.addEventListener('input', function() {
        newton1Force = parseFloat(this.value);
        forceValue.textContent = `${newton1Force} N`;
        drawNewton1Simulation();
    });

    // Event listeners untuk tombol
    document.getElementById('startDemo').addEventListener('click', () => {
        isSimulating = true;
    });

    document.getElementById('resetDemo').addEventListener('click', () => {  
        isSimulating = false;
        cartX = 50;
        forceInput.value = "0";
        forceValue.textContent = `"0 N"`;
    });
}

/*function Newton1Values() {
    // Menggunakan nilai force dari input
    newton1Force = parseFloat(document.getElementById('newton1Force').value);
    newton1Mass = 1;
    drawNewton1Simulation();
}
*/

function drawForceArrows(){
    // Gambar panah gaya ke kanan (aksi)
    n1ctx.beginPath();
    n1ctx.moveTo(cartX + 80, newton1Canvas.height - 75);
    n1ctx.lineTo(cartX + 120, newton1Canvas.height - 75);
    n1ctx.strokeStyle = '#f44336';
    n1ctx.lineWidth = 2;
    n1ctx.stroke();

    // Gambar kepala panah kanan
    n1ctx.beginPath();
    n1ctx.moveTo(cartX + 120, newton1Canvas.height - 75);
    n1ctx.lineTo(cartX + 110, newton1Canvas.height - 80);
    n1ctx.lineTo(cartX + 110, newton1Canvas.height - 70);
    n1ctx.fillStyle = '#f44336';
    n1ctx.fill();

    // Gambar panah gaya ke kiri (reaksi)
    n1ctx.beginPath();
    n1ctx.moveTo(cartX, newton1Canvas.height - 75);
    n1ctx.lineTo(cartX - 40, newton1Canvas.height - 75);
    n1ctx.strokeStyle = '#f44336';
    n1ctx.lineWidth = 2;
    n1ctx.stroke();

    // Gambar kepala panah kiri
    n1ctx.beginPath();
    n1ctx.moveTo(cartX - 40, newton1Canvas.height - 75);
    n1ctx.lineTo(cartX - 30, newton1Canvas.height - 80);
    n1ctx.lineTo(cartX - 30, newton1Canvas.height - 70);
    n1ctx.fillStyle = '#f44336';
    n1ctx.fill();

    // Teks utk F (gaya)
    n1ctx.fillStyle = '#333';
    n1ctx.font = '14px Arial';
    n1ctx.fillText('F₁', cartX + 90, newton1Canvas.height - 85);
    n1ctx.fillText('F₂', cartX - 30, newton1Canvas.height - 85);
}

function drawNewton1Simulation() {
    n1ctx.clearRect(0, 0, newton1Canvas.width, newton1Canvas.height);
    
    // Gambar landasan
    n1ctx.fillStyle = '#ddd';
    n1ctx.fillRect(0, newton1Canvas.height - 50, newton1Canvas.width, 50);
    
    // Gambar benda (kotak)
    n1ctx.fillStyle = '#1e3c72';
    n1ctx.fillRect(cartX, newton1Canvas.height - 100, 80, 50);

    // Tampilkan nilai F, m, dan a
    n1ctx.font = '16px Arial';
    n1ctx.fillStyle = '#333';
    n1ctx.fillText(`F = ${newton1Force} N`, 10, 30);
    n1ctx.fillText(`m = ${newton1Mass} kg`, 10, 50);
    n1ctx.fillText(`a = 0 m/s²`, 10, 70);

    if (isSimulating) {
        // Teks penjelasan selalu muncul saat simulasi berjalan
        n1ctx.fillText('Hukum I Newton: Benda tetap diam karena resultan gaya = 0', 10, 100);
        n1ctx.fillText('Dalam hal ini, karena benda sedang diam, percepatan yang dialami', 10, 120);
        n1ctx.fillText('benda adalah percepatan awal (a) = 0', 10, 140);
        
        // Visualisasi gaya seimbang
        drawForceArrows();
    }
    
    requestAnimationFrame(drawNewton1Simulation);
}
document.addEventListener('DOMContentLoaded', initNewton1);
/*
// Event listeners
document.getElementById('startDemo').addEventListener('click', () => {
    isSimulating = true;
    //updateNewton1Values();
});

document.getElementById('resetDemo').addEventListener('click', () => {
    isSimulating = false;
    cartX = 50;
   // updateNewton1Values();
});

// Mulai simulasi
//updateNewton1Values();
*/
// Simulasi Hukum Newton II
const newton2Canvas = document.getElementById('newton2Canvas');
const n2ctx = newton2Canvas.getContext('2d');
let boxPosition = { x: 50, y: newton2Canvas.height - 100 };
let acceleration = 0;
let velocity = 0;

function Newton2Simulation() {
    const mass = parseFloat(document.getElementById('massInput').value);
    const force = parseFloat(document.getElementById('forceInput').value);
    
    // a = F/m
    acceleration = mass !== 0 ? force / mass : 0;

    // Update nilai yang ditampilkan
    document.getElementById('massValue').textContent = `${mass} kg`;
    document.getElementById('forceValue').textContent = `${force} N`;

    // Update atau buat elemen untuk menampilkan percepatan
    let accelerationDisplay = document.getElementById('accelerationDisplay');
    if (!accelerationDisplay) {
        accelerationDisplay = document.createElement('div');
        accelerationDisplay.id = 'accelerationDisplay';
        accelerationDisplay.style.marginTop = '10px';
        accelerationDisplay.style.fontWeight = 'bold';
        const controlsDiv = document.querySelector('.controls');
        controlsDiv.appendChild(accelerationDisplay);
    }
    //accelerationDisplay.textContent = `Percepatan (a) = ${acceleration.toFixed(2)} m/s²`;

    //drawNewton2Simulation();
}

function drawNewton2Simulation() {
    n2ctx.clearRect(0, 0, newton2Canvas.width, newton2Canvas.height);
    
    // Gambar landasan
    n2ctx.fillStyle = '#ddd';
    n2ctx.fillRect(0, newton2Canvas.height - 50, newton2Canvas.width, 50);
    
    // Gambar kotak
    n2ctx.fillStyle = '#1e3c72';
    n2ctx.fillRect(boxPosition.x, boxPosition.y, 50, 50);
    
    // Gambar vektor gaya
    const force = parseFloat(document.getElementById('forceInput').value);
    if (force !== 0) {
        // Gambar garis gaya
        n2ctx.beginPath();
        n2ctx.moveTo(boxPosition.x + 25, boxPosition.y + 25);
        n2ctx.lineTo(boxPosition.x + 25 + force * 3, boxPosition.y + 25);
        n2ctx.strokeStyle = '#f44336';
        n2ctx.lineWidth = 3;
        n2ctx.stroke();
        
        // Gambar ujung panah
        n2ctx.beginPath();
        n2ctx.moveTo(boxPosition.x + 25 + force * 3, boxPosition.y + 25);
        n2ctx.lineTo(boxPosition.x + 25 + force * 3 - 10, boxPosition.y + 25 - 5);
        n2ctx.lineTo(boxPosition.x + 25 + force * 3 - 10, boxPosition.y + 25 + 5);
        n2ctx.fillStyle = '#f44336';
        n2ctx.fill();
    }
    
    // Update posisi dan kecepatan berdasarkan percepatan
    velocity += acceleration * 0.05;
    boxPosition.x += velocity;
    if (boxPosition.x > newton2Canvas.width - 60) {
        boxPosition.x = 50; 
        velocity = 0;
    }

    // Reset posisi jika keluar dr canvas
    if (boxPosition.x > Newton2Simulation.width - 60) {
        boxPosition.x = 50;
        velocity = 0;
    } else if (boxPosition.x < 10) {
        boxPosition.x = 50;
        velocity = 0;
    }

    // Tambahkan rumus di canvas
    n2ctx.font = '16px Arial';
    n2ctx.fillStyle = '#333';
    const mass = parseFloat(document.getElementById('massInput').value);
    n2ctx.fillText(`F = ${force} N`, 10, 30);
    n2ctx.fillText(`m = ${mass} kg`, 10, 50);
    n2ctx.fillText(`v = ${velocity.toFixed(2)} m/s`, 10, 90);
    n2ctx.fillText(`a = ${acceleration.toFixed(2)} m/s²`, 10, 70);
    
    requestAnimationFrame(drawNewton2Simulation);
}

// Event listeners untuk input
document.getElementById('massInput').addEventListener('input', Newton2Simulation);
document.getElementById('forceInput').addEventListener('input', Newton2Simulation);

// Inisialisasi simulasi
Newton2Simulation();
drawNewton2Simulation();

// Simulasi Hukum Newton III
const newton3Canvas = document.getElementById('newton3Canvas');
const n3ctx = newton3Canvas.getContext('2d');
let rocketPosition = newton3Canvas.width / 2;
let rocketVelocity = 0;
let isRocketLaunched = false;

function drawNewton3Simulation() {
    n3ctx.clearRect(0, 0, newton3Canvas.width, newton3Canvas.height);
    
    // Gambar roket
    n3ctx.save();
    n3ctx.translate(rocketPosition, newton3Canvas.height / 2);
    n3ctx.beginPath();
    n3ctx.moveTo(-25, -15);
    n3ctx.lineTo(25, 0);
    n3ctx.lineTo(-25, 15);
    n3ctx.closePath();
    n3ctx.fillStyle = '#1e3c72';
    n3ctx.fill();
    
    // Gambar api roket jika diluncurkan
    if (isRocketLaunched) {
        n3ctx.beginPath();
        n3ctx.moveTo(-25, -10);
        n3ctx.lineTo(-45, 0);
        n3ctx.lineTo(-25, 10);
        n3ctx.fillStyle = '#f44336';
        n3ctx.fill();
    }
    n3ctx.restore();
    
    // Update posisi roket
    if (isRocketLaunched) {
        rocketVelocity += 0.2;
        rocketPosition += rocketVelocity;
        
        if (rocketPosition > newton3Canvas.width + 50) {
            resetRocket();
        }
    }
    
    requestAnimationFrame(drawNewton3Simulation);
}

document.getElementById('startRocket').addEventListener('click', () => {
    isRocketLaunched = true;
});

function resetRocket() {
    isRocketLaunched = false;
    rocketPosition = newton3Canvas.width / 2;
    rocketVelocity = 0;
}

document.getElementById('resetRocket').addEventListener('click', resetRocket);

// Simulasi Hukum Ohm
const ohmCanvas = document.getElementById('ohmCanvas');
const ohctx = ohmCanvas.getContext('2d');
let electrons = [];
let circuitAnimation;

class Electron {
    constructor() {
        this.angle = Math.random() * Math.PI * 2;
        this.radius = 100;
        this.speed = 0.02;
        this.size = 3;
    }
    
    update() {
        this.angle += this.speed;
    }
    
    draw() {
        const x = ohmCanvas.width/2 + Math.cos(this.angle) * this.radius;
        const y = ohmCanvas.height/2 + Math.sin(this.angle) * this.radius;
        
        ohctx.beginPath();
        ohctx.arc(x, y, this.size, 0, Math.PI * 2);
        ohctx.fillStyle = '#f44336';
        ohctx.fill();
    }
}

function updateOhmSimulation() {
    const voltage = parseFloat(document.getElementById('voltageInput').value);
    const resistance = parseFloat(document.getElementById('resistanceInput').value);
    const current = voltage / resistance;
    
    // Update nilai yang ditampilkan
    document.getElementById('voltageValue').textContent = `${voltage} V`;
    document.getElementById('resistanceValue').textContent = `${resistance} Ω`;

    // Update atau buat elemen untuk menampilkan arus
    let currentDisplay = document.getElementById('currentDisplay');
    if (!currentDisplay) {
        currentDisplay = document.createElement('div');
        currentDisplay.id = 'currentDisplay';
        currentDisplay.style.marginTop = '10px';
        currentDisplay.style.fontWeight = 'bold';
        const controlsDiv = document.querySelector('#ohm .controls');
        controlsDiv.appendChild(currentDisplay);
    }
    currentDisplay.textContent = `Arus (I) = ${current.toFixed(3)} A`;
    
    // Update kecepatan elektron berdasarkan arus
    electrons.forEach(electron => {
        electron.speed = 0.02 * current;
    });

    // Gambar formula di canvas
    ohctx.clearRect(0, 0, ohmCanvas.width, ohmCanvas.height);
    
    // Draw circuit
    ohctx.beginPath();
    ohctx.arc(ohmCanvas.width/2, ohmCanvas.height/2, 100, 0, Math.PI * 2);
    ohctx.strokeStyle = '#1e3c72';
    ohctx.lineWidth = 3;
    ohctx.stroke();
    
    // Gambar formula
    ohctx.font = '16px Arial';
    ohctx.fillStyle = '#333';
    ohctx.fillText(`V = ${voltage} V`, 10, 30);
    ohctx.fillText(`R = ${resistance} Ω`, 10, 50);
    ohctx.fillText(`I = V/R = ${current.toFixed(3)} A`, 10, 70);
    
    // Draw electrons
    electrons.forEach(electron => {
        electron.update();
        electron.draw();
    });
}

function drawOhmSimulation() {
    ohctx.clearRect(0, 0, ohmCanvas.width, ohmCanvas.height);
    
    // Draw circuit
    ohctx.beginPath();
    ohctx.arc(ohmCanvas.width/2, ohmCanvas.height/2, 100, 0, Math.PI * 2);
    ohctx.strokeStyle = '#1e3c72';
    ohctx.lineWidth = 3;
    ohctx.stroke();
    
    // Draw electrons
    electrons.forEach(electron => {
        electron.update();
        electron.draw();
    });
    
    // Gambar formula
    const voltage = parseFloat(document.getElementById('voltageInput').value);
    const resistance = parseFloat(document.getElementById('resistanceInput').value);
    const current = voltage / resistance;
    
    ohctx.font = '16px Arial';
    ohctx.fillStyle = '#333';
    ohctx.fillText(`V = ${voltage} V`, 10, 30);
    ohctx.fillText(`R = ${resistance} Ω`, 10, 50);
    ohctx.fillText(`I = V/R = ${current.toFixed(3)} A`, 10, 70);
    
    circuitAnimation = requestAnimationFrame(drawOhmSimulation);
}

// Initialize electrons
for (let i = 0; i < 10; i++) {
    electrons.push(new Electron());
}

// Event listeners untuk input Hukum Ohm
document.getElementById('voltageInput').addEventListener('input', updateOhmSimulation);
document.getElementById('resistanceInput').addEventListener('input', updateOhmSimulation);

// Start all simulations
drawNewton1Simulation();
drawNewton2Simulation();
drawNewton3Simulation();
drawOhmSimulation();

// Drag and Drop Exercise
const draggables = document.querySelectorAll('.draggable');
const dropZones = document.querySelectorAll('.drop-zone');

function initDragAndDrop() {
    draggables.forEach(draggable => {
        draggable.setAttribute('draggable', 'true'); // Pastikan elemen bisa di-drag
        
        draggable.addEventListener('dragstart', (e) => {
            draggable.classList.add('dragging');
            e.dataTransfer.setData('text/plain', draggable.dataset.order); // Simpan data order
        });
        
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
            checkOrder();
        });
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('dragover');
        });
        
        zone.addEventListener('dragleave', () => {
            zone.classList.remove('dragover');
        });
        
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('dragover');
            
            const draggedElement = document.querySelector('.dragging');
            if (draggedElement && !zone.firstChild) {
                zone.appendChild(draggedElement);
            } else if (draggedElement && zone.firstChild) {
                // Swap elements if dropping on an occupied zone
                const existingElement = zone.firstChild;
                const draggedParent = draggedElement.parentNode;
                
                if (draggedParent.classList.contains('drop-zone')) {
                    draggedParent.appendChild(existingElement);
                } else {
                    document.querySelector('.drag-container').appendChild(existingElement);
                }
                zone.appendChild(draggedElement);
            }
            checkOrder();
        });
    });
}

function resetDragDrop() {
    const dragContainer = document.querySelector('.drag-container');
    const items = Array.from(document.querySelectorAll('.draggable'));
    
    // Sort items by original order before resetting
    items.sort((a, b) => {
        return parseInt(a.dataset.order) - parseInt(b.dataset.order);
    });
    
    // Move all items back to drag container
    items.forEach(item => {
        dragContainer.appendChild(item);
    });

    // Clear drop zones
    dropZones.forEach(zone => {
        while (zone.firstChild) {
            zone.removeChild(zone.firstChild);
        }
    });

    // Reset feedback
    const feedbackDiv = document.getElementById('dragDropFeedback');
    if (feedbackDiv) {
        feedbackDiv.remove();
    }
}

function checkOrder() {
    let isCorrect = true;
    let allZonesFilled = true;
    
    dropZones.forEach((zone, index) => {
        if (!zone.firstChild) {
            allZonesFilled = false;
            return;
        }
        
        const orderValue = parseInt(zone.firstChild.dataset.order);
        if (orderValue !== index + 1) {
            isCorrect = false;
        }
    });

    // Only show feedback if all zones are filled
    if (allZonesFilled) {
        let feedbackDiv = document.getElementById('dragDropFeedback');
        if (!feedbackDiv) {
            feedbackDiv = document.createElement('div');
            feedbackDiv.id = 'dragDropFeedback';
            document.querySelector('.drag-drop-exercise').appendChild(feedbackDiv);
        }

        if (isCorrect) {
            feedbackDiv.textContent = 'BENAR!';
            feedbackDiv.className = 'feedback feedback-correct';
        } else {
            feedbackDiv.textContent = 'Urutan Anda masih salah!';
            feedbackDiv.className = 'feedback feedback-incorrect';
        }
    }
}

// Initialize drag and drop functionality
initDragAndDrop();

// Add event listener for reset button
document.getElementById('resetDragDrop').addEventListener('click', resetDragDrop);

// Interactive Problem
document.getElementById('checkAnswer').addEventListener('click', () => {
    const answer = parseFloat(document.getElementById('problemAnswer').value);
    const feedback = document.getElementById('answerFeedback');
    
    // F = ma -> a = F/m
    // m = 5 kg, F = 20 N
    const correctAnswer = 20 / 5; // = 4 m/s²
    
    if (Math.abs(answer - correctAnswer) < 0.1) {
        feedback.textContent = 'Benar! Percepatan benda adalah 4 m/s²';
        feedback.className = 'correct';
    } else {
        feedback.textContent = 'Jawaban kurang tepat. Coba lagi!';
        feedback.className = 'incorrect';
    }
    // Toggle Sidebar
    document.addEventListener('DOMContentLoaded', function() {
        const sidebar = document.querySelector('.material-sidebar');
        const content = document.querySelector('.material-content');
        const sidebarToggle = document.createElement('button');
        
        sidebarToggle.className = 'sidebar-toggle';
        sidebarToggle.innerHTML = '←';
        document.body.appendChild(sidebarToggle);
        
        let isCollapsed = false;
        
        function toggleSidebar() {
            isCollapsed = !isCollapsed;
            sidebar.classList.toggle('collapsed');
            content.classList.toggle('expanded');
            sidebarToggle.innerHTML = isCollapsed ? '→' : '←';
            
            if (isCollapsed) {
                sidebar.style.transform = 'translateX(-100%)';
                content.style.marginLeft = '0';
                sidebarToggle.style.left = '10px';
            } else {
                sidebar.style.transform = 'translateX(0)';
                content.style.marginLeft = 'var(--sidebar-width)';
                sidebarToggle.style.left = 'calc(var(--sidebar-width) - 15px)';
            }
        }
        
        sidebarToggle.addEventListener('click', toggleSidebar);
        
        // Initialize progress
        loadProgress();
    });

// Fix Video Size
document.querySelectorAll('.video-container video').forEach(video => {
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'contain';
});

// Fix Button Styles
document.querySelectorAll('button').forEach(button => {
    button.classList.add('btn');
});
document.addEventListener('DOMContentLoaded', function() {
    // Create sidebar toggle button
    const sidebarToggle = document.createElement('button');
    sidebarToggle.className = 'sidebar-toggle';
    sidebarToggle.innerHTML = '←';
    document.body.appendChild(sidebarToggle);

    const sidebar = document.querySelector('.material-sidebar');
    const content = document.querySelector('.material-content');
    let isCollapsed = false;

    sidebarToggle.addEventListener('click', function() {
        isCollapsed = !isCollapsed;
        sidebar.classList.toggle('collapsed');
        content.classList.toggle('expanded');
        sidebarToggle.innerHTML = isCollapsed ? '→' : '←';
        sidebarToggle.style.left = isCollapsed ? '20px' : 'calc(var(--sidebar-width) - 15px)';
    });

    // Fix progress text
    const progressText = document.getElementById('progressText');
    if (progressText && progressText.textContent === 'NaN%') {
        progressText.textContent = '0%';
    }
});
});