import API from "./axios";

export const getCustomers = async () => {
  const res = await API.get("/customers");
  return res.data.customers;
};

export const createCustomer = async (data) => {
  const res = await API.post("/customers", data);
  return res.data.customer;
};

export const updateCustomer = async (id, data) => {
  const res = await API.put(`/customers/${id}`, data);
  return res.data.customer;
};

export const deleteCustomer = async (id) => {
  const res = await API.delete(`/customers/${id}`);
  return res.data;
};

export const getSalesExecutives = async () => {
  const res = await API.get("/users/sales-executives");
  return res.data;
};