import React, { useState, useEffect, useRef } from 'react'
import EmailList from './components/EmailList'
import EmailView from './components/EmailView'
import SearchBar from './components/SearchBar'
import SuggestedReplyModal from './components/SuggestedReplyModal'
import { accounts, folders } from './utils/mockData'

export default function App() {
  const [inputQ, setInputQ] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filters, setFilters] = useState<{ folder?: string, account?: string }>({})
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // debounce inputQ -> searchQuery
  useEffect(() => {
    const id = setTimeout(() => setSearchQuery(inputQ), 400)
    return () => clearTimeout(id)
  }, [inputQ])

  return (
    <div className="h-screen flex flex-col">
      {/* Header with Search */}
      <div className="border-b bg-white shadow-sm">
        <div className="p-4">
          <SearchBar 
            onSearch={(q) => setSearchQuery(q)} 
            onChange={(q) => setInputQ(q)} 
            onFilter={(f) => setFilters(f)} 
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Accounts & Folders */}
        <div className="w-64 border-r bg-gray-50 overflow-y-auto">
          <div className="p-4">
            <h2 className="font-bold text-lg mb-3">Accounts</h2>
            <div className="space-y-1 mb-6">
              {accounts.map(account => (
                <div 
                  key={account.id} 
                  className={`px-3 py-2 rounded cursor-pointer transition-colors ${
                    filters.account === account.id 
                      ? 'bg-blue-100 text-blue-900 font-medium' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setFilters({ ...filters, account: account.id })}
                >
                  <div className="text-sm font-medium">{account.name}</div>
                  <div className="text-xs text-gray-500 truncate">{account.email}</div>
                </div>
              ))}
              {filters.account && (
                <button 
                  className="w-full text-left px-3 py-2 text-blue-600 hover:bg-blue-50 rounded text-sm"
                  onClick={() => setFilters({ ...filters, account: undefined })}
                >
                  ✕ Clear account filter
                </button>
              )}
            </div>

            <h2 className="font-bold text-lg mb-3">Folders</h2>
            <div className="space-y-1">
              {folders.map(folder => (
                <div 
                  key={folder.id} 
                  className={`px-3 py-2 rounded cursor-pointer transition-colors text-sm ${
                    filters.folder === folder.id 
                      ? 'bg-blue-100 text-blue-900 font-medium' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setFilters({ ...filters, folder: folder.id })}
                >
                  {folder.name}
                </div>
              ))}
              {filters.folder && (
                <button 
                  className="w-full text-left px-3 py-2 text-blue-600 hover:bg-blue-50 rounded text-sm"
                  onClick={() => setFilters({ ...filters, folder: undefined })}
                >
                  ✕ Clear folder filter
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Email List */}
        <div className="w-96 border-r bg-gray-50 overflow-hidden flex flex-col">
          <EmailList 
            searchQuery={searchQuery} 
            onSelect={(e) => setSelectedEmail(e)} 
            filters={filters} 
          />
        </div>

        {/* Email View */}
        <div className="flex-1 bg-white overflow-y-auto">
          <EmailView
            email={selectedEmail}
            onSuggest={() => setModalOpen(true)}
            onUpdate={(updated) => setSelectedEmail(updated)}
          />
        </div>
      </div>

      {/* Suggested Reply Modal */}
      {modalOpen && (
        <SuggestedReplyModal
          emailId={selectedEmail?.id}
          body={selectedEmail?.body}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
