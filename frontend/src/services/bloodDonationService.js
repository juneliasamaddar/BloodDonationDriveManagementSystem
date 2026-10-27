import axios from "axios";

const API_URL = "http://localhost:8081/blooddonationdrive";

export const getAllDrives = async () => {
  const response = await axios.get(`${API_URL}/displayAll`);
  return response.data;
};

export const getDriveById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const addDrive = async (drive) => {
  const response = await axios.post(`${API_URL}/add`, drive);
  return response.data;
};

export const updateDrive = async (id, drive) => {
  const response = await axios.put(`${API_URL}/update/${id}`, drive);
  return response.data;
};

export const deleteDrive = async (id) => {
  const response = await axios.delete(`${API_URL}/delete/${id}`);
  return response.data;
};