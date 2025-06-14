const express = require('express');
const router = express.Router();
const Comparison = require('../models/Comparison');
const Task = require('../models/Task');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Создание нового сравнения
router.post('/', auth, async (req, res) => {
  try {
    const { taskId, results } = req.body;
    
    // Проверяем существование задачи
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Задача не найдена' });
    }

    // Создаем новое сравнение
    const comparison = new Comparison({
      task: taskId,
      user: req.user.userId,
      results
    });

    await comparison.save();
    res.status(201).json(comparison);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получение всех сравнений для задачи (для отправителя)
router.get('/task/:taskId', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Задача не найдена' });
    }
    if (task.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Нет доступа' });
    }

    const comparisons = await Comparison.find({ task: req.params.taskId })
      .populate('user', 'name email')
      .populate('task', 'name');
    
    res.json(comparisons);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получение всех сравнений пользователя
router.get('/my-comparisons', auth, async (req, res) => {
  try {
    const comparisons = await Comparison.find({ user: req.user.userId })
      .populate('task', 'name')
      .populate('user', 'name email');
    
    res.json(comparisons);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновление статуса сравнения
router.put('/:id/status', auth, async (req, res) => {
  try {
    const comparison = await Comparison.findById(req.params.id);
    if (!comparison) {
      return res.status(404).json({ message: 'Сравнение не найдено' });
    }

    const task = await Task.findById(comparison.task);
    if (task.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Нет доступа' });
    }

    comparison.status = req.body.status;
    await comparison.save();
    
    res.json(comparison);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router; 