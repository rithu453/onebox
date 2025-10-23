import React, { useState, useEffect } from 'react'

/**
 * Settings component for configuring Gemini API key
 * This is an optional feature for easier configuration
 */
export default function GeminiSettings({ onClose }: { onClose?: () => void }) {
  const [apiKey, setApiKey] = useState<string>('')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load saved API key from localStorage
    const savedKey = localStorage.getItem('GEMINI_API_KEY')
    if (savedKey) {
      setApiKey(savedKey)
    }
  }, [])

  const handleSave = () => {
    try {
      if (!apiKey || apiKey.trim() === '') {
        setError('Please enter a valid API key')
        return
      }

      // Save to localStorage (Note: This is for development only)
      // In production, API key should be on backend
      localStorage.setItem('GEMINI_API_KEY', apiKey.trim())
      
      setSaved(true)
      setError(null)
      
      // Show success message for 2 seconds
      setTimeout(() => {
        setSaved(false)
        onClose?.()
      }, 2000)

    } catch (err: any) {
      setError(err.message || 'Failed to save API key')
    }
  }

  const handleClear = () => {
    localStorage.removeItem('GEMINI_API_KEY')
    setApiKey('')
    setSaved(false)
    setError(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="bg-white rounded shadow-lg z-10 w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Gemini API Settings</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-xl">×</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-2 text-xs text-gray-500">
              Get your API key from{' '}
              <a
                href="https://makersuite.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          {saved && (
            <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
              ✅ API key saved successfully! Please reload the page.
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <p className="text-xs text-yellow-800">
              <strong>⚠️ Development Only:</strong> Storing API keys in localStorage is only suitable for
              development. In production, use environment variables and backend API calls.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save API Key
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Clear
            </button>
          </div>

          <div className="text-xs text-gray-600">
            <p className="font-medium mb-1">Features:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Auto-classify emails into 5 categories</li>
              <li>Generate suggested replies</li>
              <li>Confidence scoring (0-100%)</li>
              <li>AI-powered reasoning</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Get API key from localStorage or environment
 */
export function getGeminiApiKey(): string {
  // First try localStorage (for UI-configured key)
  const localKey = localStorage.getItem('GEMINI_API_KEY')
  if (localKey) {
    return localKey
  }

  // Fall back to environment variable
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || ''
  return envKey
}
