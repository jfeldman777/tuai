const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// Создание новой задачи
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, map } = req.body;
    const task = new Task({
      name,
      description,
      map,
      owner: req.user.userId
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получение всех задач пользователя
router.get('/my-tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user.userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получение всех активных задач (для клиентов)
router.get('/active', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ status: 'active' })
      .populate('owner', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получение задачи по ID
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('owner', 'name email');
    if (!task) {
      return res.status(404).json({ message: 'Задача не найдена' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновление задачи
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Задача не найдена' });
    }
    if (task.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Нет доступа' });
    }
    
    const { name, description, map, status } = req.body;
    task.name = name || task.name;
    task.description = description || task.description;
    task.map = map || task.map;
    task.status = status || task.status;
    
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удаление задачи
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Задача не найдена' });
    }
    if (task.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Нет доступа' });
    }
    
    await task.remove();
    res.json({ message: 'Задача удалена' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router; 