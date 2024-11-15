// js/quizInit.js

const quizManager = new QuizManager();

// Fungsi untuk mendapatkan jawaban pilihan ganda
function getMultipleChoiceAnswers() {
    return answers.map((answer, index) => ({
        questionId: `mc-${index + 1}`,
        selected: answer,
        correct: quizData[index].correct,
        questionText: quizData[index].question
    }));
}

// Fungsi untuk mendapatkan jawaban drag & drop
function getDragDropAnswers() {
    return dragDropAnswers.map((answer, index) => ({
        questionId: `dd-${index + 1}`,
        userOrder: answer,
        correctOrder: dragDropData[index].correctOrder,
        questionText: dragDropData[index].question
    }));
}

// Fungsi untuk mendapatkan jawaban isian singkat
function getShortAnswers() {
    return shortAnswerAnswers.map((answer, index) => ({
        questionId: `sa-${index + 1}`,
        userAnswer: answer,
        correctAnswer: shortAnswerData[index].correctAnswer,
        questionText: shortAnswerData[index].question
    }));
}

// Fungsi untuk menyelesaikan quiz
async function finishQuiz() {
    const quizData = {
        score: calculateScore(),
        mcAnswers: getMultipleChoiceAnswers(),
        ddAnswers: getDragDropAnswers(),
        shortAnswers: getShortAnswers()
    };

    try {
        await quizManager.saveQuizResults(quizData);
        quizManager.displayQuizResults();
        showResults(); // Menampilkan hasil akhir
    } catch (error) {
        console.error('Error finishing quiz:', error);
        alert('Failed to save quiz results');
    }
}

// Event listener saat halaman dimuat
document.addEventListener('DOMContentLoaded', async () => {
    if (window.location.pathname.includes('quiz.html')) {
        try {
            // Load hasil quiz sebelumnya
            await quizManager.loadQuizResults();
            quizManager.displayQuizResults();

            // Override fungsi submitQuiz yang ada
            window.submitQuiz = async () => {
                // Konfirmasi sebelum submit
                if (confirm('Apakah Anda yakin ingin mengakhiri kuis?')) {
                    await finishQuiz();
                }
            };

            // Setup event listeners untuk tombol-tombol quiz
            document.getElementById('startQuiz')?.addEventListener('click', () => {
                document.getElementById('startScreen').classList.add('hidden');
                document.getElementById('questionScreen').classList.remove('hidden');
                showQuestion(0);
                startTimer();
            });

            // Event listeners untuk tombol review dan retake
            document.getElementById('reviewAnswers')?.addEventListener('click', () => {
                quizManager.displayQuizResults();
                const reviewContainer = document.getElementById('reviewContainer');
                if (reviewContainer) {
                    reviewContainer.scrollIntoView({ behavior: 'smooth' });
                }
            });

            document.getElementById('retakeQuiz')?.addEventListener('click', () => {
                if (confirm('Apakah Anda yakin ingin mengulang kuis? Semua jawaban akan dihapus.')) {
                    resetQuiz();
                }
            });

        } catch (error) {
            console.error('Error initializing quiz:', error);
        }
    }
});

// Tambahkan event listener untuk time-up
function onTimeUp() {
    alert('Waktu habis! Quiz akan diakhiri.');
    finishQuiz();
}