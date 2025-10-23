import React, { useState } from 'react'
import { folders, accounts } from '../utils/mockData'

export default function SearchBar({ onSearch, onChange, onFilter }: { onSearch: (q: string) => void, onChange?: (q: string) => void, onFilter?: (filters: { folder?: string, account?: string }) => void }) {
  const [q, setQ] = useState('')
  const [folder, setFolder] = useState('')
  const [account, setAccount] = useState('')

  function submit(e?: React.FormEvent) {
    e?.preventDefault()
    onSearch(q)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQ(e.target.value)
    onChange?.(e.target.value)
  }

  function handleFilterChange(newFolder?: string, newAccount?: string) {
    const f = { folder: (newFolder ?? folder) || undefined, account: (newAccount ?? account) || undefined }
    setFolder(f.folder || '')
    setAccount(f.account || '')
    onFilter?.(f)
    // trigger immediate search when filter changes
    onSearch(q)
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex space-x-2">
        <input
          value={q}
          onChange={handleChange}
          className="border p-2 flex-1 rounded"
          placeholder="Search emails..."
        />
        <select value={folder} onChange={(e) => handleFilterChange(e.target.value, undefined)} className="border p-2 rounded">
          <option value="">All folders</option>
          {folders.map(f => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
        <select value={account} onChange={(e) => handleFilterChange(undefined, e.target.value)} className="border p-2 rounded">
          <option value="">All accounts</option>
          {accounts.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        <button type="submit" className="px-4 bg-blue-600 text-white rounded hover:bg-blue-700">Search</button>
      </div>
    </form>
  )
}
