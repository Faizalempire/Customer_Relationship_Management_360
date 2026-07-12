import API from "./axios";

// Get all leads
export const getLeads = async () => {
  const res = await API.get("/leads");
  return res.data;
};

// Create lead
export const createLead = async (leadData) => {
  const res = await API.post("/leads", leadData);
  return res.data;
};

// Update lead
export const updateLead = async (id, leadData) => {
  const res = await API.put(`/leads/${id}`, leadData);
  return res.data;
};

// Delete lead
export const deleteLead = async (id) => {
  const res = await API.delete(`/leads/${id}`);
  return res.data;
};