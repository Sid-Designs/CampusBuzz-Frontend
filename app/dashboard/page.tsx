"use client"

import React, { useState, useEffect } from 'react'
import {
  PlusCircle,
  Search,
  Bell,
  Calendar,
  FileText,
  Info,
  Upload,
  Save,
  Send,
  Eye,
  Edit,
  Trash2,
  Filter,
  ChevronDown,
  X,
  Check,
  Loader,
  ClipboardCheck,
  Megaphone,
  FileCheck,
  Globe,
  Download
} from 'lucide-react'

const API_BASE_URL = 'http://localhost:5000/api'

// Enum categories from backend
const CATEGORY_ENUM = ["Exam", "Events", "Circulars", "General"]

const Dashboard = () => {
  // State for notices
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  // Form state
  const [isEditing, setIsEditing] = useState(false)
  const [currentNotice, setCurrentNotice] = useState({
    title: '',
    description: '',
    categories: []
  })
  const [selectedCategories, setSelectedCategories] = useState([])

  // Category icons mapping
  const categoryIcons = {
    'Exam': <ClipboardCheck className="h-4 w-4" />,
    'Events': <Calendar className="h-4 w-4" />,
    'Circulars': <FileCheck className="h-4 w-4" />,
    'General': <Globe className="h-4 w-4" />
  }

  // Stats calculation
  const totalNotices = notices.length
  const thisMonthNotices = notices.filter(n => {
    const noticeDate = new Date(n.createdAt || n.date)
    const now = new Date()
    return noticeDate.getMonth() === now.getMonth() &&
      noticeDate.getFullYear() === now.getFullYear()
  }).length

  // Calculate category counts
  const categoryStats = CATEGORY_ENUM.map(category => ({
    name: category,
    count: notices.filter(n => n.categories?.includes(category)).length,
    icon: categoryIcons[category]
  }))

  const stats = [
    { label: 'Total Notices', value: totalNotices, icon: <FileText className="h-5 w-5" />, color: 'blue' },
    { label: 'This Month', value: thisMonthNotices, icon: <Calendar className="h-5 w-5" />, color: 'green' },
    { label: 'Active', value: notices.filter(n => n.status !== 'archived').length, icon: <Bell className="h-5 w-5" />, color: 'yellow' },
    { label: 'Archived', value: notices.filter(n => n.status === 'archived').length, icon: <Save className="h-5 w-5" />, color: 'purple' },
  ]

  // Fetch notices from API
  const fetchNotices = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/notices`)
      if (!response.ok) throw new Error('Failed to fetch notices')
      const data = await response.json()
      setNotices(data)
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching notices:', err)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchNotices()
  }, [])

  // Handle category selection
  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category)
      } else {
        return [...prev, category]
      }
    })
  }

  // Reset form
  const resetForm = () => {
    setCurrentNotice({
      title: '',
      description: '',
      categories: []
    })
    setSelectedCategories([])
    setIsEditing(false)
  }

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentNotice(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate categories (must be from enum)
    const validCategories = selectedCategories.filter(cat =>
      CATEGORY_ENUM.includes(cat)
    )

    const noticeData = {
      ...currentNotice,
      categories: validCategories
    }

    try {
      if (isEditing && currentNotice._id) {
        // Update existing notice
        const response = await fetch(`${API_BASE_URL}/notices/${currentNotice._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(noticeData)
        })

        if (!response.ok) throw new Error('Failed to update notice')

        const updatedNotice = await response.json()
        setNotices(prev => prev.map(notice =>
          notice._id === updatedNotice._id ? updatedNotice : notice
        ))
      } else {
        // Create new notice
        const response = await fetch(`${API_BASE_URL}/notices`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(noticeData)
        })

        if (!response.ok) throw new Error('Failed to create notice')

        const newNotice = await response.json()
        setNotices(prev => [newNotice, ...prev])
      }

      resetForm()
      alert(`Notice ${isEditing ? 'updated' : 'created'} successfully!`)
    } catch (err) {
      setError(err.message)
      alert(`Error: ${err.message}`)
    }
  }

  // Handle delete notice
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return

    try {
      const response = await fetch(`${API_BASE_URL}/notices/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete notice')

      setNotices(prev => prev.filter(notice => notice._id !== id))
      alert('Notice deleted successfully!')
    } catch (err) {
      setError(err.message)
      alert(`Error: ${err.message}`)
    }
  }

  // Handle edit notice
  const handleEdit = (notice) => {
    setIsEditing(true)
    setCurrentNotice({
      _id: notice._id,
      title: notice.title,
      description: notice.description,
      categories: notice.categories || []
    })
    setSelectedCategories(notice.categories || [])

    // Scroll to form
    document.getElementById('notice-form').scrollIntoView({ behavior: 'smooth' })
  }

  // Export notices to CSV
  const exportToCSV = () => {
    if (notices.length === 0) {
      alert('No notices to export!')
      return
    }

    // Define CSV headers
    const headers = ['Title', 'Description', 'Categories', 'Created Date', 'Status']
    
    // Convert data to CSV format
    const csvData = [
      headers.join(','),
      ...notices.map(notice => {
        const row = [
          `"${notice.title.replace(/"/g, '""')}"`,
          `"${notice.description.replace(/"/g, '""')}"`,
          `"${(notice.categories || []).join(', ')}"`,
          `"${formatDate(notice.createdAt || notice.date)}"`,
          `"${notice.status || 'active'}"`
        ]
        return row.join(',')
      })
    ].join('\n')

    // Create blob and download
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `notices_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    alert(`Exported ${notices.length} notices to CSV!`)
  }

  // Filter notices based on search
  const getFilteredAndSortedNotices = () => {
    let filtered = notices.filter(notice =>
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (notice.categories || []).some(cat => 
        cat.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date)
      const dateB = new Date(b.createdAt || b.date)
      
      switch(sortBy) {
        case 'newest':
          return dateB - dateA
        case 'oldest':
          return dateA - dateB
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return dateB - dateA
      }
    })

    return filtered
  }

  const filteredNotices = getFilteredAndSortedNotices()

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Filter notices by category
  const filterByCategory = (category) => {
    setSearchTerm(category)
  }

  // View notice details
  const viewNoticeDetails = (notice) => {
    const details = `
Title: ${notice.title}
Description: ${notice.description}
Categories: ${(notice.categories || []).join(', ')}
Created: ${formatDate(notice.createdAt || notice.date)}
Status: ${notice.status || 'active'}
    `.trim()
    
    alert(details)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 mt-[15vh] flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading notices...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-[15vh]">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">MET College Notice Board</h1>
            <p className="text-gray-600 mt-2">Official notice management system for MET College</p>
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <span className="font-medium">Error:</span> {error}
              <button onClick={() => setError(null)} className="ml-4">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats and Categories */}
        <div className="lg:col-span-1 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.color === 'blue' ? 'bg-blue-50' :
                      stat.color === 'green' ? 'bg-green-50' :
                        stat.color === 'yellow' ? 'bg-yellow-50' : 'bg-purple-50'
                    }`}>
                    <div className={
                      stat.color === 'blue' ? 'text-blue-600' :
                        stat.color === 'green' ? 'text-green-600' :
                          stat.color === 'yellow' ? 'text-yellow-600' : 'text-purple-600'
                    }>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Categories Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
              <button
                onClick={() => setSearchTerm('')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear filters
              </button>
            </div>
            <div className="space-y-3">
              {categoryStats.map((category) => (
                <button
                  key={category.name}
                  onClick={() => filterByCategory(category.name)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition ${searchTerm === category.name ? 'bg-blue-50 border border-blue-200' : ''
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-400">
                      {category.icon}
                    </div>
                    <span className="text-gray-700">{category.name}</span>
                  </div>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">
                Select a category to filter notices. Click "Clear filters" to show all.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Notice</h3>
            <div className="space-y-3">
              <button
                onClick={exportToCSV}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                <Download className="h-5 w-5" />
                Export to CSV
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Notices List and Creation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header with Search */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Notice Management</h2>
                <p className="text-gray-600 mt-1">Create and manage all college notices</p>
              </div>
            </div>
            {searchTerm && (
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="text-gray-600">Filtering by:</span>
                <span className="font-medium">{searchTerm}</span>
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Create/Edit Notice Form */}
          <div id="notice-form" className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {isEditing ? 'Edit Notice' : 'Create New Notice'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {isEditing ? 'Update the notice details below' : 'Fill in the details to create a new notice'}
                </p>
              </div>
              {isEditing && (
                <button
                  onClick={resetForm}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  title="Cancel edit"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Notice Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notice Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={currentNotice.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Final Exam Schedule, Annual Sports Day, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {currentNotice.title.length}/200 characters
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={currentNotice.description}
                  onChange={handleInputChange}
                  className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Provide detailed information about the notice..."
                  required
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {currentNotice.description.length}/1000 characters
                </p>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories *
                  <span className="text-xs text-gray-500 ml-2">(Select one or more)</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {CATEGORY_ENUM.map((category) => (
                    <label
                      key={category}
                      className={`flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition ${selectedCategories.includes(category)
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                          : 'border-gray-300'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-2">
                        <div className="text-gray-600">
                          {categoryIcons[category]}
                        </div>
                        <span className="font-medium">{category}</span>
                      </div>
                    </label>
                  ))}
                </div>
                {selectedCategories.length === 0 && (
                  <p className="text-sm text-red-500 mt-2">
                    Please select at least one category
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  {isEditing ? 'Cancel' : 'Clear Form'}
                </button>
                <button
                  type="submit"
                  disabled={selectedCategories.length === 0}
                  className={`px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition ${selectedCategories.length === 0
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                  {isEditing ? (
                    <>
                      <Check className="h-4 w-4" />
                      Update Notice
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Publish Notice
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Notices List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">All Notices</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Showing {filteredNotices.length} notice{filteredNotices.length !== 1 ? 's' : ''}
                    {searchTerm && ` for "${searchTerm}"`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title">Title A-Z</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              {filteredNotices.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No notices found</h4>
                  <p className="text-gray-600 mb-6">
                    {searchTerm
                      ? `No notices match "${searchTerm}"`
                      : 'No notices available. Create your first notice!'}
                  </p>
                  <button
                    onClick={resetForm}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Create New Notice
                  </button>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Notice Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categories
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredNotices.map((notice) => (
                      <tr key={notice._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="max-w-md">
                            <div className="font-semibold text-gray-900 mb-1">{notice.title}</div>
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {notice.description}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {notice.categories?.map((category, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {categoryIcons[category]}
                                {category}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-500 text-sm">
                            {formatDate(notice.createdAt || notice.date)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => viewNoticeDetails(notice)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                              title="View notice details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(notice)}
                              className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg transition"
                              title="Edit notice"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(notice._id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                              title="Delete notice"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {filteredNotices.length > 0 && (
              <div className="p-4 border-t bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Total: {filteredNotices.length} notices
                  </span>
                  <button
                    onClick={exportToCSV}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    <Download className="h-4 w-4" />
                    Export to CSV
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard