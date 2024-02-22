import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { error } from "console";
import * as jose from "jose";

const axiosInstance = axios.create();

type IConfig = InternalAxiosRequestConfig;

axiosInstance.interceptors.request.use(
  async (config: IConfig) => {
    try {
      const token = localStorage.getItem("token")?.replace('"', "");
      const refreshToken = localStorage
        .getItem("refreshToken")
        ?.replace('"', "");
      const decoded = jose.decodeJwt(token ?? "") as any;

      const secret = new TextEncoder().encode(
        process.env.REACT_APP_JWT_SECRET,
      )

      const valid = await jose.jwtVerify(token ?? "", secret)
      .then((res) => {
        return true
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

        const restoken = response.data.token;
        const resRefreshToken = response.data.refreshToken;

        localStorage.setItem("token", JSON.stringify(restoken));
        localStorage.setItem("refreshToken", JSON.stringify(resRefreshToken));
        config.headers["Authorization"] = "Bearer " + restoken;
      }
    } catch (error) {
      console.log(error);
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
