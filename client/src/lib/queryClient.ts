import { QueryClient } from "@tanstack/react-query";

export const BASE_URL = ""; // Empty string means relative to current domain

type UnauthorizedBehavior = "returnNull" | "throw";

export async function apiRequest(
  method: string,
  path: string,
  body?: any,
  unauthorizedBehavior: UnauthorizedBehavior = "throw"
): Promise<{data: any, response: Response}> {
  try {
    if (path.startsWith("/")) {
      path = `${BASE_URL}${path}`;
    }

    console.log(`Making ${method} request to ${path}`);

    const response = await fetch(path, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include", // Include cookies if any
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    return { data, response };
  } catch (error) {
    console.error(`API request error (${method} ${path}):`, error);
    throw error;
  }
}

export const getQueryFn = ({ on401 }: { on401: UnauthorizedBehavior }) => 
  async ({ queryKey }: { queryKey: readonly unknown[] }) => {
    const response = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (on401 === "returnNull" && response.status === 401) {
      return null;
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    return data;
  };

// Configure QueryClient with more aggressive defaults for data freshness
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      staleTime: 0,
      retry: 3,
    },
  },
});