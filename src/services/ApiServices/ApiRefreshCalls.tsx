import { useAuth } from "../../store/store";

class ApiRefreshCalls {
  private async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch("http://localhost:8080/api/auth/refresh", {
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
    
    try {
      const response = await fetch(url, { ...options });
      console.log("✅ Got response:", response.status);
      
      if (response.status === 401) {
        console.log("🔐 Handling 401...");
        const refreshSuccess = await this.refreshToken();
        
        if (refreshSuccess) {
          console.log("🔄 Retrying with new token...");
          return await fetch(url, { ...options });
        } else {
          const { setToken } = useAuth.getState();
          setToken("");
          throw new Error("Authentication failed");
        }
      }
      
      return response;
      
    } catch (error) {
      console.error("❌ Fetch error:", error);
      
      // Check if it's a CORS error (likely due to expired JWT)
      console.log("🌐 Detected CORS error - likely expired JWT");
      console.log("🔄 Attempting token refresh...");
        
        const refreshSuccess = await this.refreshToken();
        
        if (refreshSuccess) {
          console.log("✅ Token refreshed, retrying request...");

          const newHeaders = {
            ...(options.headers || {}),
            Authorization: `Bearer ${useAuth.getState().token}`,
          };

          try {
            return await fetch(url, {
               ...options ,
               headers: newHeaders,
              }
            );
          } catch (retryError) {
            console.error("❌ Retry also failed:", retryError);
            throw retryError;
          }
        } else {
          console.log("❌ Token refresh failed");
          const { setToken } = useAuth.getState();
          setToken("");
          throw new Error("Authentication failed - token refresh unsuccessful");
        }
      
      // If it's not a CORS error, re-throw
      throw error;
    }
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