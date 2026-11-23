import { ApiResponse, RequestOptions } from './api.types';

class ApiGatewayClient {
  private baseUrl: string = 'http://localhost:8000';
  private authToken: string | null = null;
  private isMockMode: boolean = true; // Frontend-first mode active until backend deployed

  public setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  public setAuthToken(token: string | null) {
    this.authToken = token;
  }

  public setMockMode(enabled: boolean) {
    this.isMockMode = enabled;
  }

  public getMockMode(): boolean {
    return this.isMockMode;
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(`${this.baseUrl}${cleanEndpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          url.searchParams.append(key, String(val));
        }
      });
    }

    return url.toString();
  }

  private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...customHeaders,
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  public async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options?.params);
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(options?.headers),
    });

    return this.handleResponse<T>(response);
  }

  public async post<T, B = unknown>(endpoint: string, body?: B, options?: RequestOptions): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options?.params);
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(options?.headers),
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  public async put<T, B = unknown>(endpoint: string, body?: B, options?: RequestOptions): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options?.params);
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(options?.headers),
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  public async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options?.params);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(options?.headers),
    });

    return this.handleResponse<T>(response);
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      throw {
        status: response.status,
        message: data?.message || response.statusText || 'API request failed',
        data,
      };
    }

    return {
      success: true,
      status: response.status,
      data: (data?.data !== undefined ? data.data : data) as T,
      message: data?.message,
    };
  }
}

export const apiClient = new ApiGatewayClient();
