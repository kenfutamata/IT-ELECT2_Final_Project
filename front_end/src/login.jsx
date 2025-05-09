import React, { useState } from "react";
import './index.css';
import woodworkingImg from './assets/woodworking.png';
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Optional: for loading state
    const [error, setError] = useState(''); // Optional: for displaying errors in UI
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(''); // Clear previous errors

        try {
            const response = await fetch('http://localhost:8000/login', { // Ensure your PHP backend runs on port 8000
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            // Attempt to parse JSON response regardless of HTTP status,
            // as our backend sends JSON for errors too.
            const data = await response.json();
            console.log('Backend response data:', data); // Good for debugging

            if (response.ok) { // HTTP status 200-299
                if (data.status === 'success' && data.user) {


                    if (data.user.role === 'admin') {
                      navigate('/employee');
                        // navigate('/admin-dashboard'); // Or wherever admins should go
                    } else if (data.user.role === 'employee') {
                        alert('Employee login successful!'); // Alert can be removed for better UX

                    } else {
                        setError(`Login successful, but role "${data.user.role}" is not recognized.`);
                        alert(`Login successful, but role "${data.user.role}" is not recognized.`);
                    }
                } else {
                    // This case might happen if response.ok is true, but backend sends unexpected success format
                    const message = data.message || 'Login succeeded but data format is unexpected.';
                    setError(message);
                    alert(message);
                }
            } else {
                // Handle HTTP errors (4xx, 5xx)
                // The backend sends { status: 'error', message: '...' }
                const message = data.message || `Login failed with status: ${response.status}`;
                setError(message);
                alert(message);
            }

        } catch (err) {
            console.error('Error during login:', err);
            const message = 'Login failed: Network error or server is not responding. Please check console.';
            setError(message);
            alert(message + (err.message ? ` (${err.message})` : ''));
        } finally {
            setIsLoading(false);
        }
    };

    return (
      <>
       <title>Login</title>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              alt="Your Company"
              src={woodworkingImg}
              className="mx-auto h-10 w-auto"
            />
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            {/* Optional: Display error message in the UI */}
            {error && <div className="mb-4 p-3 text-red-700 bg-red-100 border border-red-400 rounded">{error}</div>}

            <form onSubmit={handleLogin} className="space-y-6"> {/* Removed method="POST" as fetch handles it */}
              <div>
                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-black placeholder:text-gray-400 focus:border-black focus:ring-0 sm:text-sm/6"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                    Password
                  </label>
                  <div className="text-sm">
                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-black placeholder:text-gray-400 focus:border-black focus:ring-0 sm:text-sm/6"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
}