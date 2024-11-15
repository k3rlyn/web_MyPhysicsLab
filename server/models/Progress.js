const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    materialProgress: {
        newton1: { type: Number, default: 0 },
        newton2: { type: Number, default: 0 },
        newton3: { type: Number, default: 0 },
        ohm: { type: Number, default: 0 }
    },
    // Jawaban dan interaksi pengguna pada materi
    materialInteractions: {
        newton1: {
            dragDropAnswers: [{
                questionId: String,
                userOrder: [Number],
                isCorrect: Boolean,
                attemptedAt: { type: Date, default: Date.now }
            }]
        },
        newton2: {
            shortAnswer: [{
                questionId: String,
                userOrder: Number,
                isCorrect: Boolean,
                attemptedAt: { type: Date, default: Date.now }
            }]
        },
        newton3: {
            shortAnswer: [{
                questionId: String,
                userOrder: Number,
                isCorrect: Boolean,
                attemptedAt: { type: Date, default: Date.now }
            }]
        },
        ohm: {
            shortAnswer: [{
                questionId: String,
                userOrder: Number,
                isCorrect: Boolean,
                attemptedAt: { type: Date, default: Date.now }
            }]
        }
    },

    quizResults: [{
        quizId: String,
        score: Number,
        completedAt: { type: Date, default: Date.now },
        // Jawaban untuk soal pilihan ganda
        multipleChoiceAnswers: [{
            questionId: String,
            userAnswer: Number,
            correctAnswer: Number,
            isCorrect: Boolean
        }],
        // Jawaban untuk soal drag & drop
        dragDropAnswers: [{
            questionId: String,
            userOrder: [Number],
            correctOrder: [Number],
            isCorrect: Boolean
        }],
        // Jawaban untuk soal isian singkat
        shortAnswers: [{
            questionId: String,
            userAnswer: String,
            correctAnswer: String,
            isCorrect: Boolean
        }]
    }],
    lastAccessed: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index untuk meningkatkan performa query
progressSchema.index({ userId: 1 });
progressSchema.index({ 'quizResults.completedAt': -1 });
module.exports = mongoose.model('Progress', progressSchema);