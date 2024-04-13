import axios from 'axios';

const axiosInstance = axios.create({});

axiosInstance.interceptors.request.use(
  config => {
    config.customData = { startTime: new Date().getTime() };
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => {
    const endTime = new Date().getTime();
    response.customData = response.customData || {};
    response.customData.duration =
      endTime - response.config.customData?.startTime!;
    return response;
  },
  error => {
    const endTime = new Date().getTime();
    error.config.customData = error.config.customData || {};
    error.config.customData.duration =
      endTime - error.config.customData.startTime;
    return Promise.reject(error);
  }
);

export default axiosInstance;
