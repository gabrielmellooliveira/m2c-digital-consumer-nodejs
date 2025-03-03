import axios, { Axios } from "axios";

export default class AxiosAdapter {
  axiosInstance: Axios;

  constructor(url: string) {
    this.axiosInstance = new Axios({ baseURL: url });
  }
  
  async get(url: string, configs: any) {
    return await this.axiosInstance.get(url, configs);
  }

  async post(url: string, data: any, configs: any) {
    return await this.axiosInstance.post(url, data, configs);
  }

  async put(url: string, data?: any, configs?: any) {
    return await this.axiosInstance.put(url, data, configs);
  }

  async delete(url: string, configs: any) {
    return await this.axiosInstance.delete(url, configs);
  }
}