import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { login as loginApi } from '../../api/auth/login';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBagIcon } from '../../components/icons/ShoppingBagIcon';
import { CustomButton } from '../../components/common/CustomButton';
import { AxiosError } from 'axios';

import type { LoginResponse } from '../../types/login';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login: loginContext } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await loginApi({ email, password });
      
      // Extract the data from the standard API response structure
      const userData = response.data;
      const token = userData.access_token;
      
      if (token) {
        // Prepare User object for Context
        const userForContext = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          full_name: userData.full_name,
          roles: userData.roles,
        };
        
        // Use AuthContext to set global state
        loginContext(token, userForContext);
      }
      
      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-slate-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg border border-slate-100">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 text-slate-800 rounded-2xl shadow-sm border border-slate-100">
              <ShoppingBagIcon size={44} />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Chào mừng trở lại
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Vui lòng đăng nhập vào tài khoản của bạn
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700" htmlFor="email">
                Địa chỉ Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-4 py-3 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700" htmlFor="password">
                Mật khẩu
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-3 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="w-4 h-4 text-slate-800 border-slate-300 rounded focus:ring-slate-500 cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 cursor-pointer">
                Ghi nhớ đăng nhập
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-slate-800 hover:text-slate-600 transition-colors">
                Quên mật khẩu?
              </a>
            </div>
          </div>

          <div>
            <CustomButton 
              type="submit" 
              disabled={isLoading} 
              className="w-full flex justify-center items-center group relative px-4 py-3 text-sm font-medium transition-all duration-200 !bg-slate-800 hover:!bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 rounded-xl"
            >
              {isLoading ? (
                <svg className="w-5 h-5 mr-3 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
}
