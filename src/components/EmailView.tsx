import React, { useState } from 'react'
import CategoryBadge, { Category } from './CategoryBadge'
import { classifyEmailWithGemini, EmailClassification } from '../utils/gemini'

type Email = {
  id?: string
  from?: string
  to?: string
  subject?: string
  body?: string
  date?: string
  category?: Category | string | null
  confidence?: number
  reasoning?: string
}

export default function EmailView({ email, onSuggest, onUpdate }: { email?: Email | null, onSuggest?: () => void, onUpdate?: (email: Email) => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [autoClassifying, setAutoClassifying] = useState(false)

  if (!email) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">📧</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Email Selected</h3>
          <p className="text-gray-500">Select an email from the list to view details</p>
        </div>
      </div>
    )
  }

  const categories: Category[] = ['Interested', 'Not Interested', 'Unknown', 'Spam', 'Meeting Booked']

  // Auto-classify with Gemini
  async function autoClassify() {
    if (!email?.body) return
    setAutoClassifying(true)
    setError(null)
    try {
      const classification: EmailClassification = await classifyEmailWithGemini(
        email.body,
        email.date
      )
      
      const updated: Email = {
        ...email,
        category: classification.category,
        confidence: classification.confidence,
        reasoning: classification.reasoning
      }
      
      onUpdate?.(updated)
    } catch (err: any) {
      setError(err.message || String(err))
    } finally {
      setAutoClassifying(false)
    }
  }

  // Manual categorization - just update local state, no backend call
  function categorize(cat: Category) {
    if (!email) return
    const updated: Email = { ...email, category: cat }
    onUpdate?.(updated)
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Email Header */}
      <div className="border-b bg-white p-6 shadow-sm">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{email.subject}</h2>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700 w-16">From:</span>
                <span className="text-gray-600">{email.from}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700 w-16">To:</span>
                <span className="text-gray-600">{email.to}</span>
              </div>
              {email.date && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700 w-16">Date:</span>
                  <span className="text-gray-600">
                    {new Date(email.date).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
            
            <div className="mt-4 flex items-center gap-3 flex-wrap">
              <CategoryBadge category={email.category as string} />
              {email.confidence !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">Confidence:</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {(email.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              )}
            </div>
            
            {email.reasoning && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-semibold text-xs mt-0.5">💡</span>
                  <p className="text-xs text-blue-900 italic flex-1">{email.reasoning}</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <button 
              onClick={autoClassify} 
              disabled={autoClassifying}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed text-sm font-medium shadow-sm transition-colors whitespace-nowrap"
            >
              {autoClassifying ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Classifying...
                </span>
              ) : (
                '✨ Auto Classify'
              )}
            </button>
            
            <button 
              onClick={onSuggest} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm transition-colors whitespace-nowrap"
            >
              💬 Suggest Reply
            </button>
            
            <div className="mt-2">
              <select
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                onChange={(e) => categorize(e.target.value as Category)}
                value={(email.category as string) || ''}
              >
                <option value="">Manual category...</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">⚠️ {error}</p>
          </div>
        )}
      </div>

      {/* Email Body */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl">
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {email.body}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
