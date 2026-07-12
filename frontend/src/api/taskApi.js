import API from "./axios";

// Get all tasks
export const getTasks = async () => {
  const res = await API.get("/tasks");
  return res.data;
};

// Create task
export const createTask = async (taskData) => {
  const res = await API.post("/tasks", taskData);
  return res.data;
};

// Update task
export const updateTask = async (id, taskData) => {
  const res = await API.put(`/tasks/${id}`, taskData);
  return res.data;
};

// Delete task
export const deleteTask = async (id) => {
  const res = await API.delete(`/tasks/${id}`);
  return res.data;
};