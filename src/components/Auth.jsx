import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import axios from 'axios'
import { Moon, Sun, Loader2 } from 'lucide-react'
import { API_URL } from '../config'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = isLogin ? `${API_URL}/api/login` : `${API_URL}/api/register`
      const response = await axios.post(endpoint, { username, password })
      login(response.data.token, response.data.username)
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-3 rounded-lg bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-dark-border">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Concrete Pour Tracker
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isLogin ? 'Welcome back!' : 'Create your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  {isLogin ? 'Logging in...' : 'Creating account...'}
                </>
              ) : (
                <>{isLogin ? 'Login' : 'Register'}</>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
