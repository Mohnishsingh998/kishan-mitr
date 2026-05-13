const { Notification } = require('../models');

const getAll = async (farmerId) => {
  const notifications = await Notification.findAll({
    where: { farmerId },
    order: [['createdAt', 'DESC']],
    limit: 50,
  });
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  return { unreadCount, notifications };
};

const markRead = async (id, farmerId) => {
  const notif = await Notification.findOne({ where: { id, farmerId } });
  if (!notif) throw { status: 404, message: 'Notification not found.' };
  await notif.update({ isRead: true, readAt: new Date() });
  return notif;
};

const markAllRead = async (farmerId) => {
  await Notification.update(
    { isRead: true, readAt: new Date() },
    { where: { farmerId, isRead: false } }
  );
  return { message: 'All notifications marked as read.' };
};

const updatePreferences = async (farmerId, preferences) => {
  // Stored on the farmer profile (extend model if needed) — stub here
  return { farmerId, preferences, message: 'Notification preferences updated.' };
};

// Internal helper used by other services to create notifications
const create = async ({ farmerId, type, severity, title, titleHindi, message, messageHindi, metadata }) => {
  return Notification.create({ farmerId, type, severity, title, titleHindi, message, messageHindi, metadata });
};

module.exports = { getAll, markRead, markAllRead, updatePreferences, create };
