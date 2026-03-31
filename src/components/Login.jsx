import React, { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Login = ({ setToken }) => {
  const [step, setStep] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userId, setUserId] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const ADMIN_OTP_PURPOSE = 'admin_login'

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await axios.post(backendUrl + '/api/user/admin', {
        email,
        password,
      })
      
      if (response.data.success) {
        if (response.data.mustResetPassword) {
          setUserId(response.data.userId)
          setStep('reset')
          toast.info(response.data.message)
        } else if (response.data.requiresOTP) {
          setUserId(response.data.userId)
          setOtp('')
          setStep('otp')
          toast.success(response.data.message)
        } else if (response.data.token) {
          setToken(response.data.token)
        }
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const onResetPasswordHandler = async (e) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await axios.post(backendUrl + '/api/user/admin/reset-password', {
        userId,
        newPassword,
      })
      
      if (response.data.success) {
        if (response.data.requiresOTP) {
          setOtp('')
          setStep('otp')
          toast.success(response.data.message)
        }
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const onVerifyOTPHandler = async (e) => {
    e.preventDefault()
    
    if (isLoading) return
    
    if (!email || email.trim() === '') {
      toast.error('Session error: Email missing. Please login again.')
      setStep('login')
      return
    }
    
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit code')
      return
    }
    
    setIsLoading(true)
    
    try {
      const payload = {
        email: email,
        otpCode: String(otp),
        purpose: ADMIN_OTP_PURPOSE
      }
      
      if (payload.purpose !== 'admin_login') {
        toast.error('Security error: Invalid request format')
        return
      }
      
      const response = await axios.post(
        backendUrl + '/api/user/verify-otp',
        {
          email: payload.email,
          otpCode: payload.otpCode,
          purpose: payload.purpose
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      
      if (response.data.success) {
        if (response.data.token) {
          setToken(response.data.token)
          localStorage.setItem('adminRole', response.data.role)
          toast.success('Login successful!')
        }
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-1/2 bg-green-600 text-white flex-col justify-between p-10">
        <div>
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-lg text-2xl">☀️</div>
            <div>
              <h1 className="font-bold text-lg">Sun Mega Limited</h1>
              <p className="text-sm">Solar Energy Solutions</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-3">
            Powering a Sustainable Future
          </h2>
          <p className="text-sm mb-6">
            Admin Dashboard for managing solar products, orders, and customer relationships.
          </p>

          <div className="flex gap-4">
            <div className="bg-white/15 rounded-lg p-4 text-center w-28">
              <p className="text-xl font-bold">500+</p>
              <p className="text-xs">Products</p>
            </div>
            <div className="bg-white/15 rounded-lg p-4 text-center w-28">
              <p className="text-xl font-bold">10K+</p>
              <p className="text-xs">Orders</p>
            </div>
            <div className="bg-white/15 rounded-lg p-4 text-center w-28">
              <p className="text-xl font-bold">5K+</p>
              <p className="text-xs">Customers</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-white/70">
          &copy; {new Date().getFullYear()} Sun Mega Limited. All rights reserved.
        </p>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-[#f3f7f2]">
        <div className="w-full max-w-md px-6">
          {step === 'login' && (
            <>
              <h1 className="text-2xl font-bold mb-1 text-center">
                Welcome Back
              </h1>
              <p className="text-sm text-gray-600 mb-6 text-center">
                Sign in to your admin account
              </p>

              <form onSubmit={onSubmitHandler} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@sunmega.com"
                    required
                    disabled={isLoading}
                    className="w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    className="w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:border-green-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              <p className="text-xs text-center mt-6 text-gray-600">
                Need help? Contact{' '}
                <span className="text-green-600">quote@sunmega.co.ke</span>
              </p>
            </>
          )}

          {step === 'reset' && (
            <>
              <h1 className="text-2xl font-bold mb-1 text-center">
                Reset Password
              </h1>
              <p className="text-sm text-gray-600 mb-6 text-center">
                Please set a new password for your account
              </p>

              <form onSubmit={onResetPasswordHandler} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    disabled={isLoading}
                    className="w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    disabled={isLoading}
                    className="w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:border-green-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </>
          )}

          {step === 'otp' && (
            <>
              <h1 className="text-2xl font-bold mb-1 text-center">
                Verify OTP
              </h1>
              <p className="text-sm text-gray-600 mb-6 text-center">
                Enter the 6-digit code sent to {email}
              </p>

              <form onSubmit={onVerifyOTPHandler} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      const sanitized = e.target.value.replace(/\D/g, '').slice(0, 6)
                      setOtp(sanitized)
                    }}
                    placeholder="000000"
                    required
                    disabled={isLoading}
                    maxLength={6}
                    className="w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:border-green-500 text-center text-2xl tracking-widest"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verifying...' : 'Verify & Login'}
                </button>
              </form>

              <p className="text-xs text-center mt-4 text-gray-600">
                Didn't receive code?{' '}
                <span className="text-green-600 cursor-pointer" onClick={() => setStep('login')}>
                  Back to login
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login
