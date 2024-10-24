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

// Quiz Data
const quizData = [
    {
        question: "Ketika sebuah bus berhenti mendadak, penumpang akan terdorong ke depan. Hal ini merupakan contoh dari...",
        options: [
            "Hukum Newton I",
            "Hukum Newton II",
            "Hukum Newton III",
            "Hukum Ohm"
        ],
        correct: 0,
        explanation: "Ini adalah contoh Hukum Newton I (Hukum Kelembaman), di mana benda cenderung mempertahankan keadaan geraknya."
    },
    {
        question: "Sebuah balok kayu bermassa 5 kg diam di atas lantai yang licin. Lalu, balok kayu tersebut diberi gaya mendatar 10 N hingga bergerak. Berapa besar kecepatan balok kayu setelah 2 detik?",
        options: [
            "2 m/s²",
            "5 m/s²",
            "4 m/s²",
            "0.5 m/s²"
        ],
        correct: 2,
        explanation: "Berdasarkan Hukum Newton II, F = m × a, maka a = F/m = 10/5 = 2 m/s², lalu v' = v + (a × t) = 0 + (2 × 2) = 4 m/s"
    },
    {
        question: "Pada Hukum Newton III, jika benda A memberikan gaya sebesar 20 N pada benda B, maka...",
        options: [
            "Benda B memberikan gaya 10 N pada benda A",
            "Benda B memberikan gaya 20 N pada benda A",
            "Benda B memberikan gaya 30 N pada benda A",
            "Benda B tidak memberikan gaya pada benda A"
        ],
        correct: 1,
        explanation: "Sesuai Hukum Newton III, gaya aksi sama dengan gaya reaksi dengan arah yang berlawanan."
    },
    {
        question: "Dalam Hukum Ohm, jika tegangan 12 V dan hambatan 4 Ω, berapa arus listriknya?",
        options: [
            "1.3 A",
            "2 A",
            "0 A",
            "3 A"
        ],
        correct: 3,
        explanation: "Menggunakan rumus I = V/R = 12/4 = 3 A"
    },
    {
        question: "Manakah dari pernyataan berikut yang BUKAN merupakan contoh Hukum Newton I?",
        options: [
            "Kertas tetap diam di atas meja",
            "Penumpang terdorong saat bus direm",
            "Mobil bergerak lebih cepat saat gas diinjak",
            "Buku jatuh saat meja digeser cepat"
        ],
        correct: 2,
        explanation: "Mobil bergerak lebih cepat saat gas diinjak merupakan contoh Hukum Newton II, karena ada hubungan antara gaya dan percepatan."
    }
];

// Drag & Drop Data
const dragDropData = [
    {
        question: "Susun penjelasan tentang bagaimana Hukum Newton II berlaku pada benda yang jatuh bebas di bawah pengaruh gravitasi",
        items: [
            "Saat benda jatuh bebas",
            "Gaya gravitasi menyebabkan percepatan konstan",
            "Yang dikenal sebagai percepatan gravitasi",
            "Percepatan ini tidak bergantung pada massa benda"
        ],
        correctOrder: [0, 1, 3, 2],
        explanation: "Hukum Newton II menyatakan bahwa gaya gravitasi menyebabkan benda jatuh bebas dengan percepatan konstan yang disebut percepatan gravitasi, yang tidak bergantung pada massa benda."
    },

    {
        question: "Susun rumus perhitungan percepatan dalam Hukum Newton II",
        items: [
            "Percepatan (a)",
            "Sama dengan",
            "Gaya (F)",
            "Dibagi",
            "Massa (m)"
        ],
        correctOrder: [0, 1, 2, 3, 4],
        explanation: "Rumus a = F/m dalam bentuk kalimat"
    },
    {
        question: "Susun langkah-langkah untuk menghitung gaya (F) jika diketahui massa (m) = 10kg dan percepatan (a) = 2m/s²",
        items: [
        "Massa (m) = 10kg",
        "Percepatan (a) = 2m/s²",
        "Gaya (F) = 10kg × 2m/s²",
        "Gaya (F) = ?",
        "Gunakan rumus F = m × a",
        "Gaya (F) = ?",
        "Hasil gaya (F) = 20N"
    ],
    correctOrder: [0, 1, 3, 4, 2, 5],
    explanation: "Langkah-langkah untuk menghitung gaya adalah memasukkan nilai massa dan percepatan ke dalam rumus F = m × a, menghasilkan F = 20N."
    },

    {
        question: "Susun langkah-langkah untuk menghitung arus listrik (I) jika diketahui tegangan (V) = 12V dan hambatan (R) = 4Ω",
        items:[ 
        "Gunakan rumus I = V / R",
        "Hambatan (R) = 4Ω",
        "Arus (I) = ?",
        "Tegangan (V) = 12V",
        "Hasil arus (I) = 3A",
        "Arus (I) = 12V / 4Ω"
       
    ],
    "correctOrder": [3, 1, 2, 0, 5, 4],
    "explanation": "Langkah-langkah untuk menghitung arus adalah memasukkan nilai tegangan dan hambatan ke dalam rumus I = V / R, menghasilkan I = 3A."
    },

    {
        question: "Susun langkah-langkah untuk menghitung percepatan (a) dari gaya listrik yang dihasilkan oleh arus. Jika diketahui arus (I) = 4A, tegangan (V) = 12V, dan massa (m) = 3kg.",
        items: [
        "Arus (I) = 4A",
        "Tegangan (V) = 12V",
        "Massa (m) = 3kg",
        "Gunakan rumus gaya listrik F = I × V",
        "Gaya (F) = 4A × 12V = 48N",
        "Percepatan (a) = 48N / 3kg",
        "Hasil percepatan (a) = 16m/s²",
        "Gunakan rumus a = F / m" 
        ],
    correctOrder: [0, 1, 2, 3, 4, 7, 5, 6],
    explanation: "Langkah-langkah untuk menghitung percepatan dimulai dengan menghitung gaya listrik menggunakan I × V, lalu memasukkan hasilnya ke dalam rumus percepatan a = F / m."
    }
];

// Quiz State
let currentQuestion = 0;
let currentDragDropQuestion = 0;
let score = 0;
let timer;
let timeLeft = 1800; // 30 menit = 1800 detik
let answers = new Array(quizData.length).fill(null);
let dragDropAnswers = new Array(dragDropData.length).fill(null);
let quizStarted = false;

// DOM Elements
const startScreen = document.getElementById('startScreen');
const questionScreen = document.getElementById('questionScreen');
const resultScreen = document.getElementById('resultScreen');
const questionText = document.getElementById('questionText');
const optionsForm = document.getElementById('optionsForm');
const currentNumberSpan = document.getElementById('currentNumber');
const scoreSpan = document.getElementById('score');
const timerSpan = document.getElementById('timer');
const quizProgress = document.getElementById('quizProgress');
const confirmationModal = document.getElementById('confirmationModal');
const dragDropScreen = document.getElementById('dragDropScreen');

// Initialize Quiz
function initQuiz() {
    document.getElementById('startQuiz').addEventListener('click', startQuiz);
    document.getElementById('nextQuestion').addEventListener('click', nextQuestion);
    document.getElementById('prevQuestion').addEventListener('click', prevQuestion);
    document.getElementById('reviewAnswers').addEventListener('click', showReview);
    document.getElementById('retakeQuiz').addEventListener('click', resetQuiz);
    document.getElementById('confirmSubmit').addEventListener('click', submitQuiz);
    document.getElementById('cancelSubmit').addEventListener('click', () => {
        confirmationModal.classList.add('hidden');
    });
}

// Initialize Drag & Drop
function initDragDrop() {
    document.getElementById('nextQuestion').addEventListener('click', () => {
        if (currentQuestion === quizData.length - 1) {
            startDragDrop();
        }
    });

    document.getElementById('prevDragDrop').addEventListener('click', prevDragDropQuestion);
    document.getElementById('nextDragDrop').addEventListener('click', nextDragDropQuestion);
}

// Start Quiz
function startQuiz() {
    quizStarted = true;
    startScreen.classList.add('hidden');
    questionScreen.classList.remove('hidden');
    startTimer();
    showQuestion(0);
}

// Start Drag & Drop Section
function startDragDrop() {
    questionScreen.classList.add('hidden');
    dragDropScreen.classList.remove('hidden');
    showDragDropQuestion(0);
}

// Show Question
function showQuestion(index) {
    const question = quizData[index];
    currentQuestion = index;
    
    currentNumberSpan.textContent = index + 1;
    quizProgress.style.width = `${((index + 1) / quizData.length) * 100}%`;
    questionText.textContent = question.question;
    
    optionsForm.innerHTML = '';
    question.options.forEach((option, i) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option-item';
        
        const input = document.createElement('input');
        input.type = 'radio';
        input.id = `option${i}`;
        input.name = 'answer';
        input.value = i;
        if (answers[currentQuestion] === i) {
            input.checked = true;
        }
        
        const label = document.createElement('label');
        label.htmlFor = `option${i}`;
        label.textContent = option;
        
        optionDiv.appendChild(input);
        optionDiv.appendChild(label);
        optionsForm.appendChild(optionDiv);
        
        input.addEventListener('change', () => {
            answers[currentQuestion] = i;
            updateNavigation();
        });
    });
    
    updateNavigation();
}

// Show Drag & Drop Question
function showDragDropQuestion(index) {
    currentDragDropQuestion = index;
    const question = dragDropData[index];
    
    document.getElementById('currentDragDrop').textContent = index + 1;
    document.getElementById('dragDropProgress').style.width = `${((index + 1) / dragDropData.length) * 100}%`;
    document.getElementById('dragDropQuestion').textContent = question.question;
    
    const dragItems = document.getElementById('dragItems');
    const dropZones = document.getElementById('dropZones');
    dragItems.innerHTML = '';
    dropZones.innerHTML = '';
    
    question.items.forEach((item, i) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'draggable-item';
        itemElement.draggable = true;
        itemElement.textContent = item;
        itemElement.dataset.index = i;
        
        itemElement.addEventListener('dragstart', handleDragStart);
        itemElement.addEventListener('dragend', handleDragEnd);
        
        dragItems.appendChild(itemElement);
    });
    
    question.correctOrder.forEach((_, i) => {
        const dropZone = document.createElement('div');
        dropZone.className = 'drop-zone';
        dropZone.innerHTML = `
            
            <span>Letakkan item di sini</span>
        `;
        
        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('drop', handleDrop);
        dropZone.addEventListener('dragenter', handleDragEnter);
        dropZone.addEventListener('dragleave', handleDragLeave);
        
        dropZones.appendChild(dropZone);
    });
    
    document.getElementById('dragDropExplanation').classList.add('hidden');
    updateDragDropNavigation();
}

// Drag & Drop Event Handlers
function handleDragStart(e) {
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text/plain', e.target.dataset.index);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    e.preventDefault();
    if (e.target.classList.contains('drop-zone')) {
        e.target.classList.add('dragover');
    }
}

function handleDragLeave(e) {
    if (e.target.classList.contains('drop-zone')) {
        e.target.classList.remove('dragover');
    }
}

function handleDrop(e) {
    e.preventDefault();
    const dropZone = e.target.closest('.drop-zone');
    if (!dropZone) return;
    
    dropZone.classList.remove('dragover');
    const itemIndex = e.dataTransfer.getData('text/plain');
    const draggedItem = document.querySelector(`[data-index="${itemIndex}"]`);
    
    if (!draggedItem) return;
    
    // Cek apakah dropZone sudah berisi item
    const existingItem = dropZone.querySelector('.draggable-item');
    if (existingItem) {
        // Kembalikan item yang ada sebelumnya ke container asal
        const clonedExisting = existingItem.cloneNode(true);
        clonedExisting.classList.remove('dropped');
        document.getElementById('dragItems').appendChild(clonedExisting);
        
        // Tambahkan kembali event listeners
        clonedExisting.addEventListener('dragstart', handleDragStart);
        clonedExisting.addEventListener('dragend', handleDragEnd);
    }
    
    // Bersihkan dropZone dan tambahkan item baru
    dropZone.innerHTML = '';
    const clonedItem = draggedItem.cloneNode(true);
    clonedItem.classList.add('dropped');
    dropZone.appendChild(clonedItem);
    dropZone.classList.add('filled');
    
    // Hapus item yang di-drag dari container asalnya
    draggedItem.remove();
    
    checkDragDropAnswer();
}

// Check Drag & Drop Answer
function checkDragDropAnswer() {
    const dropZones = document.querySelectorAll('.drop-zone');
    const currentQuestion = dragDropData[currentDragDropQuestion];
    
    const currentOrder = Array.from(dropZones).map(zone => {
        const item = zone.querySelector('.draggable-item');
        return item ? parseInt(item.dataset.index) : null;
    });
    
    if (!currentOrder.includes(null)) {
        const isCorrect = currentOrder.every(
            (index, i) => index === currentQuestion.correctOrder[i]
        );
        
        const explanation = document.getElementById('dragDropExplanation');
        explanation.classList.remove('hidden');
        explanation.innerHTML = `
            <p class="explanation">${currentQuestion.explanation}</p>
        `;
        
        dragDropAnswers[currentDragDropQuestion] = isCorrect;

        // Langsung lanjut ke soal berikutnya setelah menjawab
        if (currentDragDropQuestion < dragDropData.length - 1) {
            setTimeout(() => {
                showDragDropQuestion(currentDragDropQuestion + 1);
            }, 1000); // Tunggu 1 detik sebelum lanjut ke soal berikutnya
        } else {
            setTimeout(submitQuiz, 1000); // Jika sudah soal terakhir, submit quiz
        }
    }
}
// Navigation Functions
function nextQuestion() {
    if (currentQuestion < quizData.length - 1) {
        showQuestion(currentQuestion + 1);
    } else {
        confirmSubmit();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        showQuestion(currentQuestion - 1);
    }
}

function prevDragDropQuestion() {
    if (currentDragDropQuestion > 0) {
        showDragDropQuestion(currentDragDropQuestion - 1);
    } else {
        dragDropScreen.classList.add('hidden');
        questionScreen.classList.remove('hidden');
        showQuestion(quizData.length - 1);
    }
}

function nextDragDropQuestion() {
    if (currentDragDropQuestion < dragDropData.length - 1) {
        showDragDropQuestion(currentDragDropQuestion + 1);
    } else {
        submitQuiz();
    }
}

function updateNavigation() {
    const prevButton = document.getElementById('prevQuestion');
    const nextButton = document.getElementById('nextQuestion');
    
    prevButton.disabled = currentQuestion === 0;
    nextButton.textContent = currentQuestion === quizData.length - 1 ? 'Selesai' : 'Selanjutnya';
}

function updateDragDropNavigation() {
    const prevButton = document.getElementById('prevDragDrop');
    const nextButton = document.getElementById('nextDragDrop');
    prevButton.disabled = false;
    nextButton.textContent = currentDragDropQuestion === dragDropData.length - 1 ? 'Selesai' : 'Selanjutnya';
}

// Timer Functions
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timer);
            submitQuiz();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerSpan.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Submit and Results
function confirmSubmit() {
    confirmationModal.classList.remove('hidden');
}

function submitQuiz() {
    clearInterval(timer);
    // Tutup WebSocket
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
    }
    calculateScore();
    showResults();
    confirmationModal.classList.add('hidden');
}

function calculateScore() {
    // Skor pilihan ganda
    const mcScore = answers.reduce((total, answer, index) => {
        return total + (answer === quizData[index].correct ? 1 : 0);
    }, 0);
    
    // Skor drag & drop
    const ddScore = dragDropAnswers.reduce((total, isCorrect) => {
        return total + (isCorrect ? 1 : 0);
    }, 0);
    
    // Total skor
    const totalQuestions = quizData.length + dragDropData.length;
    const totalScore = mcScore + ddScore;
    const percentage = (totalScore / totalQuestions) * 100;
    
    document.getElementById('finalScore').textContent = `${percentage.toFixed(0)}%`;
    return percentage;
}

function showResults() {
    questionScreen.classList.add('hidden');
    dragDropScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    
    // Draw score circle on canvas
    const canvas = document.getElementById('scoreCanvas');
    const ctx = canvas.getContext('2d');
    const percentage = calculateScore();
    
    drawScoreCircle(ctx, percentage);
}

function drawScoreCircle(ctx, percentage) {
    const centerX = 100;
    const centerY = 100;
    const radius = 80;
    
    // Clear canvas
    ctx.clearRect(0, 0, 200, 200);
    
    // Draw background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 15;
    ctx.stroke();
    
    // Draw score arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI/2, (-Math.PI/2) + (percentage/100) * 2 * Math.PI);
    ctx.strokeStyle = percentage >= 60 ? '#4CAF50' : '#f44336';
    ctx.lineWidth = 15;
    ctx.stroke();
    
    // Draw percentage text
    ctx.font = 'bold 30px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${percentage.toFixed(0)}%`, centerX, centerY);
}

function showReview() {
    const reviewContainer = document.getElementById('reviewContainer');
    reviewContainer.innerHTML = '';
    
    // Review pilihan ganda
    answers.forEach((answer, index) => {
        const question = quizData[index];
        const reviewItem = document.createElement('div');
        reviewItem.className = `review-item ${answer === question.correct ? 'correct' : 'incorrect'}`;
        
        reviewItem.innerHTML = `
            <h4>Soal Pilihan Ganda ${index + 1}</h4>
            <p>${question.question}</p>
            <p>Jawaban Anda: ${answer !== null ? question.options[answer] : 'Tidak dijawab'}</p>
            <p>Jawaban Benar: ${question.options[question.correct]}</p>
            <p class="explanation">${question.explanation}</p>
        `;
        
        reviewContainer.appendChild(reviewItem);
    });

    // Review drag & drop
    dragDropAnswers.forEach((isCorrect, index) => {
        const question = dragDropData[index];
        const reviewItem = document.createElement('div');
        reviewItem.className = `review-item ${isCorrect ? 'correct' : 'incorrect'}`;
        
        reviewItem.innerHTML = `
            <h4>Soal Menyusun ${index + 1}</h4>
            <p>${question.question}</p>
            <p>Status: ${isCorrect ? 'Benar' : 'Salah'}</p>
            <p>Urutan yang Benar:</p>
            <ol>
                ${question.correctOrder.map(idx => `<li>${question.items[idx]}</li>`).join('')}
            </ol>
            <p class="explanation">${question.explanation}</p>
        `;
        
        reviewContainer.appendChild(reviewItem);
    });
}

function resetQuiz() {
    currentQuestion = 0;
    currentDragDropQuestion = 0;
    score = 0;
    timeLeft = 1800;
    answers = new Array(quizData.length).fill(null);
    dragDropAnswers = new Array(dragDropData.length).fill(null);
    
    resultScreen.classList.add('hidden');
    dragDropScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    updateTimerDisplay();
}

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', () => {
    initQuiz();
    initDragDrop();

});