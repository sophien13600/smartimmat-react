import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use((request) => {
    if(request.url.includes('connexion')) {
        const email = localStorage.getItem('email')
        // const password = localStorage.getItem('password')
        const token =btoa(`${email}`)
        request.headers['Authorization'] = `Basic ${token}`
      }
      return request
    })
export default api;