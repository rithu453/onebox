import React, { useEffect, useState } from 'react'
import { mockEmails, filterEmails, delay } from '../utils/mockData'

type Email = {
  id?: string
  accountId?: string
  folder?: string
  from?: string
  to?: string
  subject?: string
  body?: string
  date?: string
  category?: string | null
  confidence?: number
  reasoning?: string
}

export default function EmailList({ searchQuery, onSelect, filters }: { searchQuery?: string, onSelect?: (email: Email) => void, filters?: { folder?: string, account?: string } }) {
  const [emails, setEmails] = useState<Email[]>([])
  const [totalHits, setTotalHits] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Email | null>(null)

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError(null)
      try {
        // Simulate network delay
        await delay(300)

        // Use mock data instead of API call
        const filtered = filterEmails(mockEmails, searchQuery, filters)
        
        if (active) {
          setEmails(filtered)
          setTotalHits(filtered.length)
        }
      } catch (err: any) {
        setError(err.message || String(err))
        setEmails([])
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [searchQuery, filters])

  function handleSelect(email: Email) {
    setSelected(email)
    onSelect?.(email)
  }

  return (
    <div className="h-full">
      <div className="bg-white p-3 border-b sticky top-0">
        <h3 className="font-bold text-lg">Inbox</h3>
        {totalHits !== null && (
          <div className="text-sm text-gray-600 mt-1">{totalHits} email{totalHits === 1 ? '' : 's'}</div>
        )}
      </div>

      <div className="p-3">
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-3 bg-gray-100 rounded animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-100 text-red-800 rounded text-sm">
            Error: {error}
          </div>
        )}

        {!loading && emails.length === 0 && !error && (
          <div className="p-6 text-center bg-gray-50 rounded">
            <p className="text-gray-500">No emails found</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
          </div>
        )}

        <div className="space-y-2">
          {emails.map((email) => (
            <div 
              key={email.id} 
              className={`p-3 rounded-lg border cursor-pointer transition-all flex gap-3 ${
                selected?.id === email.id 
                  ? 'bg-blue-50 border-blue-400 shadow-md' 
                  : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'
              }`} 
              onClick={() => handleSelect(email)}
            >
              {/* Bullet Point */}
              <div className="flex-shrink-0 mt-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  email.category 
                    ? 'bg-green-500' 
                    : 'bg-gray-400'
                }`} />
              </div>

              {/* Email Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-semibold text-gray-900 truncate flex-1">
                    {email.from}
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap">
                    {email.date ? new Date(email.date).toLocaleDateString() : ''}
                  </div>
                </div>
                
                <div className="font-medium text-gray-800 mt-1 truncate text-sm">
                  {email.subject || '(no subject)'}
                </div>
                
                <div className="text-xs text-gray-500 mt-1">
                  {email.date ? new Date(email.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </div>
                
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  {email.category ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      {email.category}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                      Uncategorized
                    </span>
                  )}
                  {email.confidence !== undefined && (
                    <span className="text-xs text-gray-500 font-medium">
                      {(email.confidence * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
