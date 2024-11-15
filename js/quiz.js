//const API_URL = 'http://localhost:5000/api';  // sesuai dengan server yang sudah running
const API_URL = 'https://myphysicslab.vercel.app/api';
class QuizManager {
    constructor() {
        this.token = localStorage.getItem('token');
        this.quizResults = [];
    }

    async loadQuizResults() {
        try {
            const response = await fetch(`${API_URL}/progress/my-progress`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) throw new Error('Failed to load quiz results');
            const data = await response.json();
            this.quizResults = data.quizResults || [];
            return this.quizResults;
        } catch (error) {
            console.error('Error loading quiz results:', error);
            throw error;
        }
    }

    async saveQuizResults(quizData) {
        try {
            const response = await fetch(`${API_URL}/progress/quiz/complete`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`, // Gunakan this.token yang sudah ada
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    quizId: 'physics-quiz-1',
                    score: quizData.score,
                    multipleChoiceAnswers: quizData.mcAnswers.map(answer => ({
                        questionId: answer.questionId,
                        userAnswer: answer.selected,
                        correctAnswer: answer.correct,
                        isCorrect: answer.selected === answer.correct
                    })),
                    dragDropAnswers: quizData.ddAnswers.map(answer => ({
                        questionId: answer.questionId,
                        userOrder: answer.userOrder,
                        correctOrder: answer.correctOrder,
                        isCorrect: JSON.stringify(answer.userOrder) === JSON.stringify(answer.correctOrder)
                    })),
                    shortAnswers: quizData.shortAnswers.map(answer => ({
                        questionId: answer.questionId,
                        userAnswer: answer.userAnswer,
                        correctAnswer: answer.correctAnswer,
                        isCorrect: answer.userAnswer.trim().toLowerCase() === answer.correctAnswer.trim().toLowerCase()
                    }))
                })
            });
            
            if (!response.ok) throw new Error('Failed to save quiz results');
            const result = await response.json();
            this.quizResults = result.quizResults; // Update local quizResults
            return result;
        } catch (error) {
            console.error('Error saving quiz results:', error);
            throw error;
        }
    }

    displayQuizResults() {
        const container = document.getElementById('quizResults');
        if (container && this.quizResults.length > 0) {
            container.innerHTML = this.quizResults
                .map(result => `
                    <div class="quiz-result">
                        <p class="quiz-name">Quiz: ${result.quizId}</p>
                        <p class="quiz-score">Score: ${result.score}%</p>
                        <p class="quiz-date">Completed: ${new Date(result.completedAt).toLocaleDateString()}</p>
                        
                        <div class="quiz-details">
                            <h4>Multiple Choice Questions</h4>
                            ${result.multipleChoiceAnswers.map((answer, index) => `
                                <div class="answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}">
                                    <p>Question ${index + 1}: ${answer.isCorrect ? '✓' : '✗'}</p>
                                    <p>Your answer: ${answer.userAnswer}</p>
                                    <p>Correct answer: ${answer.correctAnswer}</p>
                                </div>
                            `).join('')}

                            <h4>Drag & Drop Questions</h4>
                            ${result.dragDropAnswers.map((answer, index) => `
                                <div class="answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}">
                                    <p>Question ${index + 1}: ${answer.isCorrect ? '✓' : '✗'}</p>
                                    <p>Your order: ${answer.userOrder.join(', ')}</p>
                                    <p>Correct order: ${answer.correctOrder.join(', ')}</p>
                                </div>
                            `).join('')}

                            <h4>Short Answer Questions</h4>
                            ${result.shortAnswers.map((answer, index) => `
                                <div class="answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}">
                                    <p>Question ${index + 1}: ${answer.isCorrect ? '✓' : '✗'}</p>
                                    <p>Your answer: ${answer.userAnswer}</p>
                                    <p>Correct answer: ${answer.correctAnswer}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('');

            // Add CSS classes
            container.classList.add('quiz-results-container');
        }
    }
    // Helper method to get latest quiz score
    getLatestScore() {
        if (this.quizResults.length === 0) return null;
        return this.quizResults[this.quizResults.length - 1].score;
    }

    // Helper method to get quiz history
    getQuizHistory() {
        return this.quizResults.map(result => ({
            quizId: result.quizId,
            score: result.score,
            date: new Date(result.completedAt)
        }));
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Cek autentikasi
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../pages/auth/login.html';
        return;
    }

    // Tampilkan nama user
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.name) {
        document.getElementById('userName').textContent = user.name;
    }

    // Inisialisasi quiz
    initQuiz();
});

// Fungsi logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../pages/auth/login.html';
}

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
// isian singkat
const shortAnswerData = [
    {
        question: "Sebuah benda memiliki massa 2 kg dan diberi gaya 10 N. Berapakah percepatannya? (Jawab dalam m/s² dengan angka saja)",
        correctAnswer: "5",
        explanation: "Menggunakan rumus F = m × a, maka a = F/m = 10/2 = 5 m/s²"
    },
    {
        question: "Jika tegangan listrik 9V dan hambatan 3Ω, berapakah arus listriknya? (Jawab dalam Ampere dengan angka saja)",
        correctAnswer: "3",
        explanation: "Menggunakan Hukum Ohm: I = V/R = 9/3 = 3 A"
    },
    {
        question: "Sebuah mobil bermassa 1000 kg mengalami percepatan 2 m/s². Berapakah gaya total yang bekerja padanya? (Jawab dalam Newton dengan angka saja)",
        correctAnswer: "2000",
        explanation: "Menggunakan Hukum Newton II: F = m × a = 1000 × 2 = 2000 N"
    },
    {
        question: "Jika gaya aksi sebesar 50 N, berapakah gaya reaksi yang terjadi? (Jawab dalam Newton dengan angka saja)",
        correctAnswer: "50",
        explanation: "Menurut Hukum Newton III, gaya aksi = gaya reaksi"
    },
    {
        question: "Sebuah rangkaian memiliki arus 2A dan hambatan 6Ω. Berapakah tegangannya? (Jawab dalam Volt dengan angka saja)",
        correctAnswer: "12",
        explanation: "Menggunakan Hukum Ohm: V = I × R = 2 × 6 = 12 V"
    }
];


// Quiz State
let currentQuestion = 0;
let currentDragDropQuestion = 0;
let currentShortAnswer = 0;
let score = 0;
let timer;
let timeLeft = 1800;
let answers = new Array(quizData.length).fill(null);
let dragDropAnswers = new Array(dragDropData.length).fill(null);
let shortAnswerAnswers = new Array(shortAnswerData.length).fill('');

// Tambahkan referensi DOM untuk short answer screen
const shortAnswerScreen = document.getElementById('shortAnswerScreen');

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
    // Reset state
    currentQuestion = 0;
    currentDragDropQuestion = 0;
    currentShortAnswer = 0;
    answers = new Array(quizData.length).fill(null);
    dragDropAnswers = new Array(dragDropData.length).fill(null);
    shortAnswerAnswers = new Array(shortAnswerData.length).fill('');
    
    // Reset form
    const optionsForm = document.getElementById('optionsForm');
    if (optionsForm) optionsForm.innerHTML = '';

     // Start Quiz Button
     const startButton = document.getElementById('startQuiz');
     if (startButton) {
         // Remove existing event listeners
         startButton.replaceWith(startButton.cloneNode(true));
         
         // Add new event listener
         document.getElementById('startQuiz').addEventListener('click', () => {
             document.getElementById('startScreen').classList.add('hidden');
             document.getElementById('questionScreen').classList.remove('hidden');
             showQuestion(0);
             startTimer();
         });
     }

    // Remove and re-add event listeners for navigation buttons
    ['nextQuestion', 'prevQuestion', 'nextDragDrop', 'prevDragDrop', 'nextShortAnswer', 'prevShortAnswer'].forEach(id => {
        const button = document.getElementById(id);
        if (button) {
            button.replaceWith(button.cloneNode(true));
        }
    });

    // Navigation Buttons
    document.getElementById('nextQuestion').addEventListener('click', nextQuestion);
    document.getElementById('prevQuestion').addEventListener('click', prevQuestion);
    
    // Drag & Drop Navigation
    document.getElementById('nextDragDrop').addEventListener('click', nextDragDropQuestion);
    document.getElementById('prevDragDrop').addEventListener('click', prevDragDropQuestion);
    
    // Short Answer Navigation
    document.getElementById('nextShortAnswer').addEventListener('click', nextShortAnswer);
    document.getElementById('prevShortAnswer').addEventListener('click', prevShortAnswer);
    


    // Show Drag & Drop Question
    function showDragDropQuestion(index) {
        currentDragDropQuestion = index;
        const question = dragDropData[index];
    
    // Update nomor soal dan progress
    document.getElementById('currentDragDrop').textContent = `${index + 1}/5`;
    document.getElementById('dragDropProgress').style.width = 
        `${((index + 1) / dragDropData.length) * 100}%`;
    
    // Update teks pertanyaan
    document.getElementById('dragDropQuestion').textContent = question.question;
    
    // Setup drag items dan drop zones
    const dragItems = document.getElementById('dragItems');
    const dropZones = document.getElementById('dropZones');
    dragItems.innerHTML = '';
    dropZones.innerHTML = '';
    
    // Buat drag items
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
    
    // Buat drop zones
    for (let i = 0; i < question.correctOrder.length; i++) {
        const dropZone = document.createElement('div');
        dropZone.className = 'drop-zone';
        dropZone.dataset.position = i;
        dropZone.innerHTML = '<span>Letakkan item di sini</span>';
        
        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('drop', handleDrop);
        dropZone.addEventListener('dragenter', handleDragEnter);
        dropZone.addEventListener('dragleave', handleDragLeave);
        
        dropZones.appendChild(dropZone);
    }
    
    // Sembunyikan penjelasan
    document.getElementById('dragDropExplanation').classList.add('hidden');
    updateDragDropNavigation();

    
    }

function showShortAnswerQuestion(index) {
    currentShortAnswer = index;
    const question = shortAnswerData[index];
    
    // Update nomor soal dan progress
    const currentNumberElement = document.getElementById('currentShortAnswer');
    const progressElement = document.getElementById('shortAnswerProgress');
    
    if (currentNumberElement) {
        currentNumberElement.textContent = `${index + 1}/5`;
    }
    
    if (progressElement) {
        progressElement.style.width = `${((index + 1) / shortAnswerData.length) * 100}%`;
    }
    
    // Update teks pertanyaan
    const questionElement = document.getElementById('shortAnswerQuestion');
    if (questionElement) {
        questionElement.textContent = question.question;
    }
    
    // Reset atau isi input jawaban
    const input = document.getElementById('shortAnswerInput');
    if (input) {
        input.value = shortAnswerAnswers[index] || '';
    }
    
    // Sembunyikan penjelasan
    const explanation = document.getElementById('shortAnswerExplanation');
    if (explanation) {
        explanation.classList.add('hidden');
    }
    
    // Update navigasi
    updateShortAnswerNavigation();
}

// Fungsi Navigasi dan State
function updateNavigation() {
    const prevButton = document.getElementById('prevQuestion');
    const nextButton = document.getElementById('nextQuestion');
    
    prevButton.disabled = currentQuestion === 0;
    if (currentQuestion === quizData.length - 1) {
        nextButton.textContent = 'Selesai';
    } else {
        nextButton.textContent = 'Selanjutnya';
    }
}

function updateDragDropNavigation() {
    const prevButton = document.getElementById('prevDragDrop');
    const nextButton = document.getElementById('nextDragDrop');
    
    prevButton.disabled = false;
    nextButton.textContent = currentDragDropQuestion === dragDropData.length - 1 ? 'Selesai' : 'Selanjutnya';
}

function updateShortAnswerNavigation() {
    const prevButton = document.getElementById('prevShortAnswer');
    const nextButton = document.getElementById('nextShortAnswer');
    
    if (prevButton && nextButton) {
        // Atur status tombol Previous
        if (currentShortAnswer === 0) {
            prevButton.classList.add('disabled');
            prevButton.setAttribute('disabled', true);
        } else {
            prevButton.classList.remove('disabled');
            prevButton.removeAttribute('disabled');
        }

        // Atur teks tombol Next
        nextButton.textContent = currentShortAnswer === shortAnswerData.length - 1 ? 'Selesai' : 'Selanjutnya';
    }
}

// Utk navigasi short answer
function prevShortAnswer() {
    const prevButton = document.getElementById('prevShortAnswer');
    
    if (currentShortAnswer > 0) {
        currentShortAnswer--;
        showShortAnswerQuestion(currentShortAnswer);
    } else if (prevButton && !prevButton.disabled) {
        // Kembali ke bagian drag & drop
        document.getElementById('shortAnswerScreen').classList.add('hidden');
        document.getElementById('dragDropScreen').classList.remove('hidden');
        showDragDropQuestion(dragDropData.length - 1);
    }
}


function nextShortAnswer() {
    const input = document.getElementById('shortAnswerInput');
    if (input.value.trim()) {
        shortAnswerAnswers[currentShortAnswer] = input.value.trim();
        if (currentShortAnswer < shortAnswerData.length - 1) {
            showShortAnswerQuestion(currentShortAnswer + 1);
        } else {
            // Langsung ke hasil tanpa konfirmasi
            submitQuiz();
        }
    } else {
        alert('Silakan masukkan jawaban Anda');
    }
}

function startDragDrop() {
    questionScreen.classList.add('hidden');
    dragDropScreen.classList.remove('hidden');
    currentDragDropQuestion = 0;
    showDragDropQuestion(0);
}

function startShortAnswer() {
    dragDropScreen.classList.add('hidden');
    shortAnswerScreen.classList.remove('hidden');
    currentShortAnswer = 0;
    showShortAnswerQuestion(0);
}

// Fungsi Transisi
function nextSection() {
    if (currentQuestion === quizData.length - 1) {
        startDragDrop();
    } else if (currentDragDropQuestion === dragDropData.length - 1) {
        startShortAnswer();
    } else if (currentShortAnswer === shortAnswerData.length - 1) {
        submitQuiz();
    }
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
    
    // Handle existing item in drop zone
    const existingItem = dropZone.querySelector('.draggable-item');
    if (existingItem) {
        const clonedExisting = existingItem.cloneNode(true);
        clonedExisting.classList.remove('dropped');
        document.getElementById('dragItems').appendChild(clonedExisting);
        clonedExisting.addEventListener('dragstart', handleDragStart);
        clonedExisting.addEventListener('dragend', handleDragEnd);
    }
    
    // Place new item
    dropZone.innerHTML = '';
    const clonedItem = draggedItem.cloneNode(true);
    clonedItem.classList.add('dropped');
    dropZone.appendChild(clonedItem);
    draggedItem.remove();
    
    dropZone.classList.add('filled');
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
        
        dragDropAnswers[currentDragDropQuestion] = isCorrect;
        showDragDropExplanation(isCorrect, currentQuestion.explanation);
    }
}
function showDragDropExplanation(isCorrect, explanation) {
    const explanationDiv = document.getElementById('dragDropExplanation');
    explanationDiv.classList.remove('hidden');
    explanationDiv.innerHTML = `
        <div class="explanation ${isCorrect ? 'correct' : 'incorrect'}">
            <p><strong>${isCorrect ? 'Benar!' : 'Kurang tepat.'}</strong></p>
            <p>${explanation}</p>
        </div>
    `;
}
function calculateScore() {
    // Multiple choice score
    const mcScore = answers.reduce((total, answer, index) => {
        return total + (answer === quizData[index].correct ? 1 : 0);
    }, 0);
    
    // Drag & drop score
    const ddScore = dragDropAnswers.reduce((total, isCorrect) => {
        return total + (isCorrect ? 1 : 0);
    }, 0);
    
    // Short answer score
    const saScore = shortAnswerAnswers.reduce((total, answer, index) => {
        return total + (answer === shortAnswerData[index].correctAnswer ? 1 : 0);
    }, 0);
    
    const totalQuestions = quizData.length + dragDropData.length + shortAnswerData.length;
    const totalScore = mcScore + ddScore + saScore;
    
    return (totalScore / totalQuestions) * 100;
}

function showResults() {
    clearInterval(timer);
    
    // Hide all sections
    questionScreen.classList.add('hidden');
    dragDropScreen.classList.add('hidden');
    shortAnswerScreen.classList.add('hidden');
    
    // Show results
    resultScreen.classList.remove('hidden');
    
    const percentage = calculateScore();
    document.getElementById('finalScore').textContent = `${Math.round(percentage)}%`;
    
    // Draw score circle
    const canvas = document.getElementById('scoreCanvas');
    const ctx = canvas.getContext('2d');
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
    ctx.fillText(`${Math.round(percentage)}%`, centerX, centerY);
}
// Fungsi untuk memastikan jawaban terpilih
function saveCurrentAnswer() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (selectedAnswer) {
        answers[currentQuestion] = parseInt(selectedAnswer.value);
        return true;
    }
    return false;
}

// Fungsi navigasi yang diperbaiki
function nextQuestion() {
    if (saveCurrentAnswer()) {
        currentQuestion++;
        if (currentQuestion < quizData.length) {
            showQuestion(currentQuestion);
        } else {
            startDragDrop();
        }
    } else {
        alert('Silakan pilih jawaban terlebih dahulu');
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion(currentQuestion);
    }
}

// Fungsi untuk menampilkan soal
function showQuestion(index) {
    currentQuestion = index;
    const question = quizData[index];
    
    document.getElementById('currentNumber').textContent = `${index + 1}/5`;
    document.getElementById('questionText').textContent = question.question;
    
    const optionsForm = document.getElementById('optionsForm');
    optionsForm.innerHTML = '';
    
    question.options.forEach((option, i) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option-item';
        
        const input = document.createElement('input');
        input.type = 'radio';
        input.id = `option${i}`;
        input.name = 'answer';
        input.value = i;
        
        const label = document.createElement('label');
        label.htmlFor = `option${i}`;
        label.textContent = option;
        
        if (answers[currentQuestion] === i) {
            input.checked = true;
        }
        
        optionDiv.appendChild(input);
        optionDiv.appendChild(label);
        optionsForm.appendChild(optionDiv);
    });
    
    // Update progress bar
    const progress = ((index + 1) / quizData.length) * 100;
    document.getElementById('quizProgress').style.width = `${progress}%`;
    
    updateNavigation();

    
}

// Navigation Functions
function nextQuestion() {
    if (saveCurrentAnswer()) {
        currentQuestion++;
        if (currentQuestion < quizData.length) {
            showQuestion(currentQuestion);
        } else {
            startDragDrop();
        }
    } else {
        alert('Silakan pilih jawaban terlebih dahulu');
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion(currentQuestion);
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
        dragDropScreen.classList.add('hidden');
        shortAnswerScreen.classList.remove('hidden');
        showShortAnswerQuestion(0); // Mulai bagian isian singkat
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
    timeLeft = 1800; // 30 menit
    clearInterval(timer);
    
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timer);
            submitQuiz();
        }
    }, 1000); // Interval diatur ke 1000ms (1 detik)

    updateTimerDisplay(); // Update display awal
}

    // Add prevShortAnswer handler
    const prevShortAnswerBtn = document.getElementById('prevShortAnswer');
    if (prevShortAnswerBtn) {
        prevShortAnswerBtn.replaceWith(prevShortAnswerBtn.cloneNode(true));
        const newPrevButton = document.getElementById('prevShortAnswer');
        if (newPrevButton) {
            newPrevButton.addEventListener('click', prevShortAnswer);
        }
    }

} // Init Quiz sampe sini

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timerDisplay = document.getElementById('timer');
    if (timerDisplay) {
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

function submitQuiz() {
    clearInterval(timer);
    // Hide all sections
    questionScreen.classList.add('hidden');
    dragDropScreen.classList.add('hidden');
    shortAnswerScreen.classList.add('hidden');
    // Show results directly
    resultScreen.classList.remove('hidden');
    showResults();
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

    // Review short answer
    shortAnswerAnswers.forEach((answer, index) => {
        const question = shortAnswerData[index];
        const isCorrect = answer === question.correctAnswer;
        const reviewItem = document.createElement('div');
        reviewItem.className = `review-item ${isCorrect ? 'correct' : 'incorrect'}`;
        
        reviewItem.innerHTML = `
            <h4>Soal Isian Singkat ${index + 1}</h4>
            <p>${question.question}</p>
            <p>Jawaban Anda: ${answer || 'Tidak dijawab'}</p>
            <p>Jawaban Benar: ${question.correctAnswer}</p>
            <p class="explanation">${question.explanation}</p>
        `;
        
        reviewContainer.appendChild(reviewItem);
    });

    reviewContainer.classList.remove('hidden');
}

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', () => {
    initQuiz();
  

}

);

// WebSocket Connection for Quiz Page
const quizWs = new WebSocket('wss://echo.websocket.org');

// When the WebSocket connection is opened
quizWs.onopen = () => {
    document.getElementById('quizConnectionStatus').textContent = 'Terhubung';
    document.getElementById('quizConnectionStatus').style.color = '#4CAF50';
};

// When the WebSocket connection is closed
quizWs.onclose = () => {
    document.getElementById('quizConnectionStatus').textContent = 'Terputus';
    document.getElementById('quizConnectionStatus').style.color = '#f44336';
};

// When there is an error with the WebSocket connection
quizWs.onerror = (error) => {
    console.error('WebSocket Error:', error);
    document.getElementById('quizConnectionStatus').textContent = 'Error';
    document.getElementById('quizConnectionStatus').style.color = '#f44336';
};

function checkShortAnswer() {
    const input = document.getElementById('shortAnswerInput');
    const answer = input.value.trim();
    
    if (!answer) {
        alert('Silakan masukkan jawaban Anda');
        return false;
    }

    // Simpan jawaban user
    shortAnswerAnswers[currentShortAnswer] = answer;
    
    const currentQuestion = shortAnswerData[currentShortAnswer];
    const isCorrect = answer === currentQuestion.correctAnswer;
    const feedback = document.getElementById('shortAnswerFeedback');
    const nextButton = document.getElementById('nextShortAnswer');
    
    // Tampilkan penjelasan
    const explanation = document.getElementById('shortAnswerExplanation');
    explanation.classList.remove('hidden');
    explanation.innerHTML = `
        <div class="explanation ${isCorrect ? 'correct' : 'incorrect'}">
            <p class="result-text"><strong>${isCorrect ? 'Benar!' : 'Kurang tepat.'}</strong></p>
            <p class="user-answer">Jawaban Anda: ${answer}</p>
            <p class="correct-answer">Jawaban yang benar: ${currentQuestion.correctAnswer}</p>
            <p class="explanation-text">${currentQuestion.explanation}</p>
        </div>
    `;
    
    return true;


}

// Update fungsi nextShortAnswer
function nextShortAnswer() {
    const input = document.getElementById('shortAnswerInput');
    if (input.value.trim()) {
        if (checkShortAnswer()) {
            setTimeout(() => {
                if (currentShortAnswer < shortAnswerData.length - 1) {
                    currentShortAnswer++;
                    showShortAnswerQuestion(currentShortAnswer);
                } else {
                    submitQuiz();
                }
            }, 2000); // Tunggu 2 detik agar user bisa membaca penjelasan
        }
    } else {
        alert('Silakan masukkan jawaban Anda');
    }

    // Event listener untuk tombol next pada isian singkat
document.getElementById('nextShortAnswer').addEventListener('click', () => {
    if (document.getElementById('shortAnswerFeedback').classList.contains('hidden')) {
        // Jika feedback belum ditampilkan, periksa jawaban
        checkShortAnswer();
    } else {
        // Jika feedback sudah ditampilkan, pindah ke soal berikutnya
        if (currentShortAnswer < shortAnswerData.length - 1) {
            currentShortAnswer++;
            showShortAnswerQuestion(currentShortAnswer);
        } else {
            submitQuiz();
        }
    }
});
}
function resetQuiz() {
    // Reset semua state
    currentQuestion = 0;
    currentDragDropQuestion = 0;
    currentShortAnswer = 0;
    score = 0;
    timeLeft = 1800;
    answers = new Array(quizData.length).fill(null);
    dragDropAnswers = new Array(dragDropData.length).fill(null);
    shortAnswerAnswers = new Array(shortAnswerData.length).fill('');

    // Reset timer
    if (timer) {
        clearInterval(timer);
        timer = null;
    }

    // Sembunyikan semua screen
    document.getElementById('questionScreen').classList.add('hidden');
    document.getElementById('dragDropScreen').classList.add('hidden');
    document.getElementById('shortAnswerScreen').classList.add('hidden');
    document.getElementById('resultScreen').classList.add('hidden');

    // Tampilkan start screen
    document.getElementById('startScreen').classList.remove('hidden');

    // Reset progress bars
    document.getElementById('quizProgress').style.width = '0%';
    document.getElementById('dragDropProgress').style.width = '0%';
    document.getElementById('shortAnswerProgress').style.width = '0%';

    // Reset review container
    const reviewContainer = document.getElementById('reviewContainer');
    if (reviewContainer) {
        reviewContainer.innerHTML = '';
        reviewContainer.classList.add('hidden');
    }

    //reset penjelasan
    const dragDropExplanation = document.getElementById('dragDropExplanation');
    const shortAnswerExplanation = document.getElementById('shortAnswerExplanation');
    if (dragDropExplanation) dragDropExplanation.classList.add('hidden');
    if (shortAnswerExplanation) shortAnswerExplanation.classList.add('hidden');

    // reset status kuis (Quiz State)
    const timerDisplay = document.getElementById('timer');
    if (timerDisplay) {
        timerDisplay.textContent = '30:00';
    }

    // reset current number displays
    const currentNumber = document.getElementById('currentNumber');
    if (currentNumber) currentNumber.textContent = '1/5';

    // Tampilkan ulang start screen dengan kondisi awal
    initQuiz();

    // Reset timer display
    updateTimerDisplay();

    // Scroll ke atas
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Reset forms dan pilihan
    const optionsForm = document.getElementById('optionsForm');
    if (optionsForm) {
        optionsForm.innerHTML = ''; // Kosongkan form pilihan ganda
    }

    // Reset drag & drop
    const dragItems = document.getElementById('dragItems');
    const dropZones = document.getElementById('dropZones');
    if (dragItems) dragItems.innerHTML = '';
    if (dropZones) dropZones.innerHTML = '';

    // Reset short answer
    const shortAnswerInput = document.getElementById('shortAnswerInput');
    if (shortAnswerInput) {
        shortAnswerInput.value = '';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const reviewButton = document.getElementById('reviewAnswers');
    const retakeButton = document.getElementById('retakeQuiz');
    const reviewContainer = document.getElementById('reviewContainer');
    const startScreen = document.getElementById('startScreen');
    const questionScreen = document.getElementById('questionScreen');
    const resultScreen = document.getElementById('resultScreen');
    const dragDropScreen = document.getElementById('dragDropScreen');
    const shortAnswerScreen = document.getElementById('shortAnswerScreen');

    // Event listener untuk tombol Lihat Pembahasan
    reviewButton.addEventListener('click', () => {
        showReview();
        // Scroll ke bagian review
        reviewContainer.scrollIntoView({ behavior: 'smooth' });
    });

    // Event listener untuk tombol Ulangi Kuis
    retakeButton.addEventListener('click', () => {
        if (confirm('Anda yakin ingin mengulang kuis? Semua jawaban akan dihapus.')) {
            resetQuiz();
        }
    });
    
});