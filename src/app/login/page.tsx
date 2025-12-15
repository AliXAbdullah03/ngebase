"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '@/lib/api';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'failed'>('idle');

  // Test backend connection (useful for Render.com sleeping apps)
  const testConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus('idle');
    setError('');
    
    try {
      const apiUrl = getApiUrl();
      // Try multiple possible health check endpoints
      const healthEndpoints = [
        `${apiUrl}/health`,
        `${apiUrl.replace('/api', '')}/health`,
        `${apiUrl}/auth/health`,
        apiUrl.replace('/api', ''), // Root endpoint
      ];
      
      // Try a simple GET request to wake up the server
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout for Render
      
      let lastError: any = null;
      for (const healthUrl of healthEndpoints) {
        try {
          const response = await fetch(healthUrl, {
            method: 'GET',
            signal: controller.signal,
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          // If we get any response (even 404), the server is awake
          if (response.status >= 200 && response.status < 600) {
            clearTimeout(timeoutId);
            setConnectionStatus('success');
            setError('');
            return;
          }
        } catch (testError: any) {
          lastError = testError;
          // Continue to next endpoint
          continue;
        }
      }
      
      clearTimeout(timeoutId);
      
      // If all endpoints failed, throw the last error
      if (lastError) {
        if (lastError.name === 'AbortError') {
          throw new Error('Connection timeout. The server may be sleeping (Render.com free tier apps sleep after inactivity). Please wait 30-60 seconds and try again.');
        }
        throw lastError;
      } else {
        throw new Error('Could not reach any health check endpoint');
      }
    } catch (err: any) {
      console.error('Connection test error:', err);
      setConnectionStatus('failed');
      const apiUrl = getApiUrl();
      const isRender = apiUrl.includes('render.com');
      
      if (isRender) {
        setError(
          `Cannot connect to Render.com backend. Common causes:\n` +
          `• App is sleeping (free tier apps sleep after 15 min inactivity)\n` +
          `• First request may take 30-60 seconds to wake up the server\n` +
          `• Please wait and try again, or check Render.com dashboard\n\n` +
          `Backend URL: ${apiUrl}`
        );
      } else {
        setError(
          `Cannot connect to backend server at ${apiUrl}. ` +
          `Please ensure the backend is running. Error: ${err.message || 'Network request failed'}`
        );
      }
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiUrl = getApiUrl();
      const loginUrl = `${apiUrl}/auth/login`;
      
      // For Render.com, use a longer timeout (sleeping apps take time to wake up)
      const isRender = apiUrl.includes('render.com');
      const timeout = isRender ? 60000 : 30000; // 60s for Render, 30s for others
      
      let response: Response;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        response = await fetch(loginUrl, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        
        clearTimeout(timeoutId);
      } catch (fetchError: any) {
        // Network error - backend not reachable
        console.error('Network error:', fetchError);
        
        if (fetchError.name === 'AbortError') {
          const isRender = apiUrl.includes('render.com');
          if (isRender) {
            throw new Error(
              `Request timed out. Render.com free tier apps may be sleeping. ` +
              `First request can take 30-60 seconds to wake up. Please try again.`
            );
          } else {
            throw new Error('Request timed out. Please check if the backend server is running.');
          }
        }
        
        if (fetchError.message?.includes('Failed to fetch') || fetchError.name === 'TypeError') {
          const isRender = apiUrl.includes('render.com');
          if (isRender) {
            throw new Error(
              `Cannot connect to Render.com backend. The app may be sleeping (free tier apps sleep after 15 min inactivity). ` +
              `First request can take 30-60 seconds. Please wait and try again.`
            );
          } else {
            throw new Error(
              `Cannot connect to backend server at ${apiUrl}. ` +
              `Please ensure the backend is running. Error: ${fetchError.message || 'Network request failed'}`
            );
          }
        }
        throw fetchError;
      }

      // Check if response is ok before trying to parse JSON
      let result: any;
      try {
        result = await response.json();
      } catch (jsonError) {
        // Response is not valid JSON
        throw new Error(
          `Invalid response from server (Status: ${response.status}). ` +
          `Please check if the backend is running correctly at ${apiUrl}`
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || result.message || 'Login failed');
      }

      // Store token
      if (result.data?.token) {
        localStorage.setItem('authToken', result.data.token);
        
        // Store refresh token if provided
        if (result.data.refreshToken) {
          localStorage.setItem('refreshToken', result.data.refreshToken);
        }

        // Store user info
        if (result.data.user) {
          localStorage.setItem('user', JSON.stringify(result.data.user));
        }

        // Redirect to admin page
        router.push('/admin');
      } else {
        throw new Error('No token received from server');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to log in. Please check your credentials and ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Connection Test Button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={testConnection}
            disabled={testingConnection || loading}
            className="w-full flex items-center justify-center gap-2 rounded-md border border-violet-300 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 hover:bg-violet-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {testingConnection ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Testing connection...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Test Backend Connection
              </>
            )}
          </button>
          {connectionStatus === 'success' && (
            <p className="mt-2 text-xs text-green-600 text-center">✓ Backend is reachable</p>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-red-800 whitespace-pre-line">{error}</p>
                <p className="text-xs text-red-600 mt-2">
                  API URL: <code className="bg-red-100 px-1 rounded">{getApiUrl()}/auth/login</code>
                </p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-violet-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-violet-500 disabled:bg-gray-100"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-gradient-violet py-2 px-4 text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
