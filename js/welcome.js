// WebSocket Connection
const ws = new WebSocket('wss://echo.websocket.org');

ws.onopen = () => {
    document.getElementById('connectionStatus').textContent = 'Terhubung';
    document.getElementById('connectionStatus').style.color = '#4CAF50';
};

ws.onclose = () => {
    document.getElementById('connectionStatus').textContent = 'Terputus';
    document.getElementById('connectionStatus').style.color = '#f44336';
};
ws.onerror = (error) => {
    console.error('WebSocket Error:', error);
    document.getElementById('connectionStatus').textContent = 'Error';
    document.getElementById('connectionStatus').style.color = '#f44336';
};

// Drag and Drop Functionality
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', card.dataset.href);
        card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
    });

    card.addEventListener('click', () => {
        window.location.href = card.dataset.href;
    });
});

// Canvas Animation
const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
            this.color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// Inisialisasi partikel
function initParticles() {
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
}

// Animasi partikel
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let particle of particles) {
        particle.update();
        particle.draw();
    }
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// Progress Bar Animation
const progressBar = document.getElementById('learningProgress');
let progress = 0;
let progressInterval;
let isAnimating = false;
function updateProgress() {
    if (isAnimating){
        clearInterval(progressInterval);
    }
    isAnimating = true;
    progress = 0;
    progressInterval = setInterval(() => {
        if (progress >= 100) {
            clearInterval(progressInterval);
            isAnimating = false;
            localStorage.setItem('learningProgress', '100');
            setTimeout(() => {
                window.location.href = 'pages/materials.html';
            }, 5000);
        } else{
            progress++;
            progressBar.style.width = progress + '%';
            progressBar.textContent = progress + '%';
            progressBar.setAttribute('aria-valuenow', progress);
        }
    }, 30);
}

// Server-Sent Events untuk update real-time
const evtSource = new EventSource("/api/updates");
const updatesContainer = document.getElementById('updates-content');

evtSource.onmessage = function(event) {
    const newElement = document.createElement("div");
    newElement.className = 'update-item';
    const data = JSON.parse(event.data);
    newElement.innerHTML = `
        <p class="update-time">${new Date(data.timestamp).toLocaleTimeString()}</p>
        <p class="update-text">${data.message}</p>
    `;
    updatesContainer.prepend(newElement);
    
    // Batasi jumlah update yang ditampilkan
    if (updatesContainer.children.length > 5) {
        updatesContainer.removeChild(updatesContainer.lastChild);
    }
};

evtSource.onerror = function() {
    console.log("EventSource failed");
};

// Event handler untuk tombol Start Learning
document.getElementById('startLearning').addEventListener('click', function() {
    updateProgress();
    // Simpan status progress di localStorage
    localStorage.setItem('learningProgress', progress);
    
    // Redirect ke halaman materi setelah animasi selesai
    setTimeout(() => {
        window.location.href = 'pages/materials.html';
    }, 5000);
});

// Load saved progress
window.addEventListener('load', function() {
    const savedProgress = localStorage.getItem('learningProgress');
    if (savedProgress) {
        progress = parseInt(savedProgress);
        progressBar.style.width = progress + '%';
        progressBar.textContent = progress + '%';
        progressBar.setAttribute('aria-valuenow', progress);
    }
    
    // Inisialisasi video demo dengan opsi muting default
    const demoVideo = document.getElementById('demoVideo');
    if (demoVideo) {
        demoVideo.muted = true;
        
        // Tambahkan kontrol volume custom
        const volumeControl = document.createElement('input');
        volumeControl.type = 'range';
        volumeControl.min = 0;
        volumeControl.max = 1;
        volumeControl.step = 0.1;
        volumeControl.value = 0;
        volumeControl.className = 'volume-control';
        
        volumeControl.addEventListener('input', function() {
            demoVideo.muted = false;
            demoVideo.volume = this.value;
        });
        
        demoVideo.parentElement.appendChild(volumeControl);
    }
});

// Interaksi card dengan efek hover
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseover', function() {
        this.style.transform = 'scale(1.05)';
        createParticlesBurst(this);
    });
    
    card.addEventListener('mouseout', function() {
        this.style.transform = 'scale(1)';
    });
});

// Efek partikel saat hover pada card
function createParticlesBurst(element) {
    const rect = element.getBoundingClientRect();
    const burstX = rect.left + rect.width / 2;
    const burstY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'burst-particle';
        particle.style.left = burstX + 'px';
        particle.style.top = burstY + 'px';
        
        const angle = (i / 10) * Math.PI * 2;
        const velocity = 5;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        document.body.appendChild(particle);
        
        let posX = burstX;
        let posY = burstY;
        
        function animateParticle() {
            posX += vx;
            posY += vy;
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            
            if (posY < window.innerHeight) {
                requestAnimationFrame(animateParticle);
            } else {
                particle.remove();
            }
        }
        
        requestAnimationFrame(animateParticle);
    }
}

// Tambahkan event listener untuk keyboard navigation
document.addEventListener('keydown', function(e) {
    const cards = document.querySelectorAll('.card');
    let currentFocus = document.activeElement;
    let currentIndex = Array.from(cards).indexOf(currentFocus);
    
    switch(e.key) {
        case 'ArrowRight':
            if (currentIndex < cards.length - 1) {
                cards[currentIndex + 1].focus();
            }
            break;
        case 'ArrowLeft':
            if (currentIndex > 0) {
                cards[currentIndex - 1].focus();
            }
            break;
        case 'Enter':
            if (currentFocus.classList.contains('card')) {
                window.location.href = currentFocus.dataset.href;
            }
            break;
    }
});

// Handling offline/online status
window.addEventListener('online', function() {
    const status = document.getElementById('connectionStatus');
    status.textContent = 'Terhubung';
    status.style.color = '#4CAF50';
});

window.addEventListener('offline', function() {
    const status = document.getElementById('connectionStatus');
    status.textContent = 'Terputus';
    status.style.color = '#f44336';
});

// Simpan data terakhir dikunjungi
function saveLastVisit() {
    const lastVisit = {
        timestamp: new Date().toISOString(),
        page: 'welcome'
    };
    localStorage.setItem('lastVisit', JSON.stringify(lastVisit));
}

window.addEventListener('beforeunload', saveLastVisit);