import axios from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const baseURL = "http://127.0.0.1:8000/api";

const useAxios = () => {
  const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);

  const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `Bearer ${authTokens?.access}` }
  });

  axiosInstance.interceptors.request.use(async req => {
    if (!authTokens || !authTokens.access) {
      req.headers.Authorization = "";
      return req;
    }
  
    const user = jwt_decode(authTokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
  
    if (!isExpired) {
      return req;
    }
  
    try {
      const response = await axios.post(`${baseURL}/token/refresh/`, {
        refresh: authTokens.refresh
      });
  
      localStorage.setItem("authTokens", JSON.stringify(response.data));
      setAuthTokens(response.data);
      setUser(jwt_decode(response.data.access));
  
      req.headers.Authorization = `Bearer ${response.data.access}`;
    } catch (error) {
      console.error("⚠️ فشل تحديث التوكن:", error);
  
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        console.warn("🔴 التوكن في القائمة السوداء أو منتهي الصلاحية. تسجيل الخروج...");
        localStorage.removeItem("authTokens");
        setAuthTokens(null);
        setUser(null);
      }
  
      req.headers.Authorization = "";
    }
  
    return req;
  });
  
  return axiosInstance;
};

export default useAxios;