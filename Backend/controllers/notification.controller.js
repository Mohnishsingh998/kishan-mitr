const notificationService = require('../services/notification.service');

const getAll = async (req, res, next) => {
  try {
    const result = await notificationService.getAll(req.farmer.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const markRead = async (req, res, next) => {
  try {
    const notif = await notificationService.markRead(req.params.id, req.farmer.id);
    res.json(notif);
  } catch (err) {
    next(err);
  }
};

const markAllRead = async (req, res, next) => {
  try {
    const result = await notificationService.markAllRead(req.farmer.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const updatePreferences = async (req, res, next) => {
  try {
    const result = await notificationService.updatePreferences(req.farmer.id, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, markRead, markAllRead, updatePreferences };
