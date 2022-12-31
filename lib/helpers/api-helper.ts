import axios, { AxiosInstance } from 'axios';

const responseHandler = (res: ApiResponse) => {
  if (res.statusCode !== 201 && res.statusCode !== 200) return res.statusCode;
  return res.data;
};

interface ApiConfig {
  rootPath: string;
};

export default class API {
  static _instance: API;

  private _axiosInstance: AxiosInstance;
  private static _config: ApiConfig = { rootPath: '' };

  constructor() {
    this._axiosInstance = axios.create();

    this._axiosInstance.interceptors.request.use(
      (config: any) => config,
      (error: any) => Promise.reject(error)
    );

    this._axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error)
    );
  }

  public static configure(config: ApiConfig) {
    this._config = config;
  }

  public static get instance() {
    if (!this._instance) this._instance = new API();
    return this._instance;
  }

  public get axiosInstance() {
    return this._axiosInstance;
  }

  private static getUrl(apiPath: string) {
    return this._config.rootPath + (apiPath.charAt(0) === '/' ? apiPath : `/${apiPath}`);
  }

  private static addGlobalConfig(config: any|undefined) {
    const headers = {
      ...(config?.headers || {}),
      'X-APP-CODE': 'anchors_pm',
    };

    return { ...(config || {}), headers, withCredentials: true };
  }

  public static async get(apiPath: string, config?: any|undefined): Promise<ApiResponse> {
    return API.instance.axiosInstance.get<ApiResponse>(this.getUrl(apiPath), this.addGlobalConfig(config)).then(response => responseHandler(response.data));
  }

  public static async post(apiPath: string, data?: any|undefined, config?: any|undefined): Promise<ApiResponse> {
    return API.instance.axiosInstance.post(this.getUrl(apiPath), data, this.addGlobalConfig(config)).then(response => responseHandler(response.data));
  }

  public static async patch(apiPath: string, data?: any|undefined, config?: any|undefined): Promise<ApiResponse> {
    return API.instance.axiosInstance.post(this.getUrl(apiPath), data, this.addGlobalConfig(config)).then(response => responseHandler(response.data));
  }

  public static async put(apiPath: string, data?: any|undefined, config?: any|undefined): Promise<ApiResponse> {
    return API.instance.axiosInstance.put(this.getUrl(apiPath), data, this.addGlobalConfig(config)).then(response => responseHandler(response.data));
  }

  public static async delete(apiPath: string, config?: any|undefined): Promise<ApiResponse> {
    return API.instance.axiosInstance.delete(this.getUrl(apiPath), this.addGlobalConfig(config)).then(response => responseHandler(response.data));
  }
}

export interface ApiResponse {
  statusCode: number;
  data?: any;
  stack?: string;
}
