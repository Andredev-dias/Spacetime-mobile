import axios from "axios";

export const api = axios.create({
  baseURL: "http://<caminho-back-end>:3333",
});
