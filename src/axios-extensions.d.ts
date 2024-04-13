// axios-extensions.d.ts
import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    customData?: { startTime?: number; duration?: number };
  }
  export interface AxiosResponse {
    customData?: { startTime?: number; duration?: number };
  }
}
