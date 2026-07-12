const Notification = require("../models/Notification");

const createNotification = async ({
  title,
  message,
 type = "general",
  userId,
}) => {
  try {
    await Notification.create({
      title,
      message,
      type,
      userId,
    });
  } catch (err) {
    console.error("Notification Error:", err.message);
  }
};

module.exports = createNotification;