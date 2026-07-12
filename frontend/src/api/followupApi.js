import API from "./axios";

// Get all follow-ups
export const getFollowUps = async () => {
  const res = await API.get("/followups");
  return res.data;
};

// Create follow-up
export const createFollowUp = async (data) => {
  const res = await API.post("/followups", data);
  return res.data.followUp;
};

// Update follow-up
export const updateFollowUp = async (id, data) => {
  const res = await API.put(`/followups/${id}`, data);
  return res.data.followUp;
};

// Delete follow-up
export const deleteFollowUp = async (id) => {
  const res = await API.delete(`/followups/${id}`);
  return res.data;
};