import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { error } from "console";
import * as jose from "jose";
import { useNavigate } from "react-router-dom";

const axiosInstance = axios.create();

type IConfig = InternalAxiosRequestConfig;

axiosInstance.interceptors.request.use(
  async (config: IConfig) => {
    try {
      const token = localStorage.getItem("token")?.replaceAll('"', "");
      const refreshToken = localStorage
        .getItem("refreshToken")
        ?.replaceAll('"', "");
      const decoded = jose.decodeJwt(token ?? "") as any;

      const secret = new TextEncoder().encode(process.env.REACT_APP_JWT_SECRET);

      const valid = await jose
        .jwtVerify(token ?? "", secret)
        .then((res) => {
          return true;
        })
        .catch((error) => {
          return false;
        });
      if (!valid) {
        const response = await axios.post("/api/v1/auth/refreshToken", {
          username: decoded.username,
          password: "",
          refreshToken: refreshToken,
        });

        console.log(response.status);

        const restoken = response.data.token;
        const resRefreshToken = response.data.refreshToken;

        localStorage.setItem("token", JSON.stringify(restoken));
        localStorage.setItem("refreshToken", JSON.stringify(resRefreshToken));
        config.headers["Authorization"] = "Bearer " + restoken;
      }
    } catch (error) {
      console.log(error);
      localStorage.setItem("token", "");
      localStorage.setItem("refreshToken", "");
      window.location.href = '/sign-in';
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
