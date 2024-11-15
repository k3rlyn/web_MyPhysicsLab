const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const auth = require('../middleware/auth');

// Get user's complete progress
router.get('/my-progress', auth, async (req, res) => {
    try {
        const progress = await Progress.findOne({ userId: req.user.id });
        if (!progress) {
            return res.json({
                materialProgress: {},
                materialInteractions: {},
                quizResults: []
            });
        }
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update material progress and save drag & drop answers
router.post('/material/dragdrop', auth, async (req, res) => {
    try {
        const { 
            material, // newton1, newton2, etc.
            questionId,
            userOrder,
            correctOrder
        } = req.body;

        let progress = await Progress.findOne({ userId: req.user.id });
        if (!progress) {
            progress = new Progress({ userId: req.user.id });
        }

        // Check if answer is correct
        const isCorrect = JSON.stringify(userOrder) === JSON.stringify(correctOrder);

        // Add drag & drop answer
        if (!progress.materialInteractions[material]) {
            progress.materialInteractions[material] = {
                dragDropAnswers: [],
                practiceAnswers: []
            };
        }

        progress.materialInteractions[material].dragDropAnswers.push({
            questionId,
            userOrder,
            isCorrect,
            attemptedAt: new Date()
        });

        // Update material progress if answer is correct
        if (isCorrect) {
            progress.materialProgress[material] = Math.min(
                (progress.materialProgress[material] || 0) + 25, 
                100
            );
        }

        await progress.save();
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
/*
// Save practice/exercise answers
router.post('/material/practice', auth, async (req, res) => {
    try {
        const { 
            material,
            questionId,
            userAnswer,
            correctAnswer
        } = req.body;

        let progress = await Progress.findOne({ userId: req.user.id });
        if (!progress) {
            progress = new Progress({ userId: req.user.id });
        }

        // Check if answer is correct
        const isCorrect = userAnswer === correctAnswer;

        // Add practice answer
        if (!progress.materialInteractions[material]) {
            progress.materialInteractions[material] = {
                dragDropAnswers: [],
                practiceAnswers: []
            };
        }

        progress.materialInteractions[material].practiceAnswers.push({
            questionId,
            userAnswer,
            isCorrect,
            attemptedAt: new Date()
        });

        // Update material progress if answer is correct
        if (isCorrect) {
            progress.materialProgress[material] = Math.min(
                (progress.materialProgress[material] || 0) + 25, 
                100
            );
        }

        await progress.save();
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
*/
// Save complete quiz results
router.post('/quiz/complete', auth, async (req, res) => {
    try {
        const {
            quizId,
            score,
            multipleChoiceAnswers,
            dragDropAnswers,
            shortAnswers
        } = req.body;

        let progress = await Progress.findOne({ userId: req.user.id });
        if (!progress) {
            progress = new Progress({ userId: req.user.id });
        }

        // Add quiz result with all answer details
        progress.quizResults.push({
            quizId,
            score,
            completedAt: new Date(),
            multipleChoiceAnswers: multipleChoiceAnswers.map(answer => ({
                questionId: answer.questionId,
                userAnswer: answer.userAnswer,
                correctAnswer: answer.correctAnswer,
                isCorrect: answer.userAnswer === answer.correctAnswer
            })),
            dragDropAnswers: dragDropAnswers.map(answer => ({
                questionId: answer.questionId,
                userOrder: answer.userOrder,
                correctOrder: answer.correctOrder,
                isCorrect: JSON.stringify(answer.userOrder) === JSON.stringify(answer.correctOrder)
            })),
            shortAnswers: shortAnswers.map(answer => ({
                questionId: answer.questionId,
                userAnswer: answer.userAnswer,
                correctAnswer: answer.correctAnswer,
                isCorrect: answer.userAnswer.trim().toLowerCase() === answer.correctAnswer.trim().toLowerCase()
            }))
        });

        await progress.save();
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get quiz history
router.get('/quiz/history', auth, async (req, res) => {
    try {
        const progress = await Progress.findOne({ userId: req.user.id });
        if (!progress) {
            return res.json({ quizResults: [] });
        }
        res.json({ quizResults: progress.quizResults });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get specific material progress
router.get('/material/:materialId', auth, async (req, res) => {
    try {
        const { materialId } = req.params;
        const progress = await Progress.findOne({ userId: req.user.id });
        
        if (!progress) {
            return res.json({
                progress: 0,
                interactions: {
                    dragDropAnswers: [],
                    practiceAnswers: []
                }
            });
        }

        res.json({
            progress: progress.materialProgress[materialId] || 0,
            interactions: progress.materialInteractions[materialId] || {
                dragDropAnswers: [],
                practiceAnswers: []
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update material progress
router.post('/material', auth, async (req, res) => {
    console.log('Request received:', req.body);
    try {
        // Validasi input
        if (!req.body.material || !req.body.progress) {
            return res.status(400).json({
                success: false,
                message: 'Material and progress are required'
            });
        }

        // Validasi nilai material
        const validMaterials = ['newton1', 'newton2', 'newton3', 'ohm'];
        if (!validMaterials.includes(req.body.material)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid material type'
            });
        }

        const { material, progress } = req.body;

        // Cari progress user
        let userProgress = await Progress.findOne({ userId: req.user.id });
        
        // Jika belum ada progress, buat baru
        if (!userProgress) {
            userProgress = new Progress({ 
                userId: req.user.id,
                materialProgress: {
                    newton1: 0,
                    newton2: 0,
                    newton3: 0,
                    ohm: 0
                }
            });
        }

        // Pastikan materialProgress ada
        if (!userProgress.materialProgress) {
            userProgress.materialProgress = {
                newton1: 0,
                newton2: 0,
                newton3: 0,
                ohm: 0
            };
        }

        // Pastikan material yang dimaksud ada
        if (userProgress.materialProgress[material] === undefined) {
            userProgress.materialProgress[material] = 0;
        }

        // Update progress
        const currentProgress = userProgress.materialProgress[material] || 0;
        const newProgress = Math.min(currentProgress + progress, 100);
        userProgress.materialProgress[material] = newProgress;

        // Simpan perubahan
        await userProgress.save();

        // Log untuk debugging
        console.log('Updated progress:', {
            material,
            oldProgress: currentProgress,
            newProgress,
            fullProgress: userProgress.materialProgress
        });

        res.json({
            success: true,
            materialProgress: userProgress.materialProgress,
            message: `Progress updated successfully`
        });

    } catch (error) {
        console.error('Error updating material progress:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update material progress',
            error: error.message
        });
    }
});

// Save practice/exercise answers
router.post('/material/practice', auth, async (req, res) => {
    try {
        const { 
            material,  // newton2, newton3, ohm
            questionId, // newton2_practice_1, newton3_practice_1, ohm_practice_1
            userAnswer, // jawaban user
            correctAnswer // jawaban benar
        } = req.body;

        // Cari progress user
        let userProgress = await Progress.findOne({ userId: req.user.id });
        
        // Jika belum ada progress, buat baru
        if (!userProgress) {
            userProgress = new Progress({ 
                userId: req.user.id,
                materialProgress: {
                    newton1: 0,
                    newton2: 0,
                    newton3: 0,
                    ohm: 0
                },
                materialInteractions: {}
            });
        }

        // Pastikan struktur materialInteractions ada untuk materi tersebut
        
        if (!userProgress.materialInteractions[material]) {
            userProgress.materialInteractions[material] = {
                dragDropAnswers: [],
                practiceAnswers: []
            };
        }

        // Cek apakah jawaban benar
        const isCorrect = typeof userAnswer === 'number' && typeof correctAnswer === 'number'
            ? Math.abs(userAnswer - correctAnswer) < 0.1  // Toleransi untuk jawaban numerik
            : userAnswer === correctAnswer;

        // Tambahkan jawaban ke practiceAnswers
        userProgress.materialInteractions[material].practiceAnswers.push({
            questionId,
            userAnswer,
            correctAnswer,
            isCorrect,
            attemptedAt: new Date()
        });

        // Update progress jika jawaban benar
        if (isCorrect) {
            userProgress.materialProgress[material] = Math.min(
                (userProgress.materialProgress[material] || 0) + 25, // Setiap jawaban benar menambah 25%
                100
            );
        }

        // Simpan perubahan
        await userProgress.save();

        // Kirim response
        res.json({
            success: true,
            materialProgress: userProgress.materialProgress,
            isCorrect,
            message: isCorrect ? 'Jawaban benar!' : 'Jawaban salah'
        });

    } catch (error) {
        console.error('Error in saving practice answer:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to save practice answer',
            error: error.message 
        });
    }
});

module.exports = router;