import React, { useEffect, useState } from 'react'
import { getSuggestedReply } from '../utils/gemini'
import { getEmailById } from '../utils/mockData'

export default function SuggestedReplyModal({
  emailId,
  body,
  onClose,
}: {
  emailId: string | undefined
  body: string | undefined
  onClose: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [reply, setReply] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    async function fetchReply() {
      if (!emailId) {
        if (active) setError('No email ID provided')
        return
      }

      // First try to get pre-generated reply from mock data
      const mockEmail = getEmailById(emailId)
      if (mockEmail?.suggestedReply) {
        if (active) setReply(mockEmail.suggestedReply)
        return
      }

      // If no mock reply, use Gemini API
      if (!body) {
        if (active) setError('No email body provided')
        return
      }
      setLoading(true)
      setError(null)
      try {
        // Use Gemini API to get suggested reply
        const suggestedReply = await getSuggestedReply(body)
        if (active) setReply(suggestedReply)
      } catch (err: any) {
        if (active) setError(err.message || String(err))
      } finally {
        if (active) setLoading(false)
      }
    }
    fetchReply()
    return () => { active = false }
  }, [emailId, body])

  if (!emailId) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="bg-white rounded shadow-lg z-10 w-full max-w-2xl p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Suggested Reply</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">Close</button>
        </div>
        <div className="mt-4">
          {loading && (
            <div className="flex items-center text-sm text-gray-600">
              <span
                className="inline-block w-4 h-4 mr-2 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"
                role="status"
                aria-label="Loading"
              />
              <span>Generating reply...</span>
            </div>
          )}
          {error && <div className="text-sm text-red-600">Error: {error}</div>}
          {reply && (
            <div className="space-y-3">
              <div className="whitespace-pre-wrap text-sm text-gray-900 p-3 bg-gray-50 rounded border">
                {reply}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(reply)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  📋 Copy to Clipboard
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
