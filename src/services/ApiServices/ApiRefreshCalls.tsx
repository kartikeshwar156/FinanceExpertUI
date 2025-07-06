import { useAuth } from "../../store/store";

class ApiRefreshCalls {
  private async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch("http://localhost:8080/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const { setToken } = useAuth.getState();
        setToken(data.jwt);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  }

  async makeApiCall(url: string, options: RequestInit = {}): Promise<Response> {
    const token = useAuth.getState().token;
    
    let response = await fetch(url, {
      ...options,
    });

    // Handle token expiration
    if (response.status === 401) {
      const refreshSuccess = await this.refreshToken();
      
      if (refreshSuccess) {
        // Retry with new token
        const newToken = useAuth.getState().token;
        response = await fetch(url, {
          ...options,
        });
      } else {
        // Refresh failed, logout
        const { setToken } = useAuth.getState();
        setToken("");
        throw new Error("Authentication failed");
      }
    }

    return response;
  }
}

//   // Convenience methods
//   async get(url: string, options?: RequestInit): Promise<Response> {
//     return this.makeApiCall(url, { ...options, method: "GET" });
//   }

//   async post(url: string, body?: any, options?: RequestInit): Promise<Response> {
//     return this.makeApiCall(url, {
//       ...options,
//       method: "POST",
//       body: body ? JSON.stringify(body) : undefined,
//     });
//   }

//   async put(url: string, body?: any, options?: RequestInit): Promise<Response> {
//     return this.makeApiCall(url, {
//       ...options,
//       method: "PUT",
//       body: body ? JSON.stringify(body) : undefined,
//     });
//   }

//   async delete(url: string, options?: RequestInit): Promise<Response> {
//     return this.makeApiCall(url, { ...options, method: "DELETE" });
//   }
// }

export const apiRefreshCalls = new ApiRefreshCalls();