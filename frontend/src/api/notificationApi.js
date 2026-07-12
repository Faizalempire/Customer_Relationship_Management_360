import API from "./axios";

// Get notifications
export const getNotifications = async () => {
  const res = await API.get("/notifications");
  return res.data;
};

// Mark one notification as read
export const markNotificationRead = async (id) => {
  const res = await API.put(`/notifications/${id}/read`);
  return res.data;
};

// Mark all notifications as read
export const markAllNotificationsRead = async () => {
  const res = await API.put("/notifications/read-all");
  return res.data;
};