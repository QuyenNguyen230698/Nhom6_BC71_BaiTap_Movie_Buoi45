import axios from "axios";
import { store } from "..";
import { turnOffLoading, turnOnloading } from "../pages/reduxMovie/spinnerSlice";

export let http = axios.create({
    baseURL: "https://movienew.cybersoft.edu.vn",
    headers: {
        TokenCybersoft:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA3MSIsIkhldEhhblN0cmluZyI6IjE0LzAzLzIwMjUiLCJIZXRIYW5UaW1lIjoiMTc0MTkxMDQwMDAwMCIsIm5iZiI6MTcxNDA2NDQwMCwiZXhwIjoxNzQyMDU4MDAwfQ.aL6UU86iw9qfiazPYi9hHV3FjYthitqZbK5pBfChSiU",
    },
})

//#region Interceptors Axios
http.interceptors.request.use(function (config) {
    store.dispatch(turnOnloading())
    return config;
  }, function (error) {
    store.dispatch(turnOffLoading())
    return Promise.reject(error);
  });

http.interceptors.response.use(function (response) {
    store.dispatch(turnOffLoading())
    return response;
  }, function (error) {
    return Promise.reject(error);
  });
//#endregion
