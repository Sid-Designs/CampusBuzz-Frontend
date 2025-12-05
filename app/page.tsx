// components/Home.tsx
"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notice {
  _id: string;
  title: string;
  description: string;
  categories: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Category {
  id: number;
  name: string;
  count: number;
  color: string;
}

interface BookmarkedNotice extends Notice {
  bookmarkedAt: string;
}

const Home = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All Notices');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [bookmarkedNotices, setBookmarkedNotices] = useState<BookmarkedNotice[]>([]);

  // Initialize bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('metCollegeBookmarks');
    if (savedBookmarks) {
      setBookmarkedNotices(JSON.parse(savedBookmarks));
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('metCollegeBookmarks', JSON.stringify(bookmarkedNotices));
  }, [bookmarkedNotices]);

  // Categories with dynamic counts - MET College specific
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: 'All Notices', count: 0, color: '#dc2626' },
    { id: 2, name: 'General', count: 0, color: '#dc2626' },
    { id: 3, name: 'Events', count: 0, color: '#ef4444' },
    { id: 4, name: 'Academic', count: 0, color: '#b91c1c' },
    { id: 5, name: 'Important', count: 0, color: '#991b1b' },
    { id: 6, name: 'Exam', count: 0, color: '#7f1d1d' },
    { id: 7, name: 'Placements', count: 0, color: '#dc2626' },
    { id: 8, name: 'Sports', count: 0, color: '#ef4444' },
    { id: 9, name: 'Cultural', count: 0, color: '#f87171' },
  ]);

  // Fetch notices from API
  useEffect(() => {
    fetchNotices();
  }, []);

  // Update category counts when notices change
  useEffect(() => {
    updateCategoryCounts();
  }, [notices]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://campus-buzz-backend.vercel.app/api/notices');
      const data = await response.json();
      setNotices(data);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCategoryCounts = () => {
    const updatedCategories = categories.map(category => {
      if (category.name === 'All Notices') {
        return { ...category, count: notices.length };
      }
      
      const count = notices.filter(notice => 
        notice.categories.some(cat => 
          cat.toLowerCase() === category.name.toLowerCase()
        )
      ).length;
      
      return { ...category, count };
    });
    
    setCategories(updatedCategories);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => 
      cat.name.toLowerCase() === categoryName.toLowerCase()
    );
    return category?.color || '#dc2626';
  };

  const handleReadMore = (notice: Notice) => {
    setSelectedNotice(notice);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedNotice(null);
    document.body.style.overflow = 'auto';
  };

  const toggleBookmark = (notice: Notice, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    const isBookmarked = bookmarkedNotices.some(bn => bn._id === notice._id);
    
    if (isBookmarked) {
      // Remove bookmark
      setBookmarkedNotices(prev => prev.filter(bn => bn._id !== notice._id));
    } else {
      // Add bookmark
      const bookmarkedNotice: BookmarkedNotice = {
        ...notice,
        bookmarkedAt: new Date().toISOString()
      };
      setBookmarkedNotices(prev => [...prev, bookmarkedNotice]);
    }
  };

  const isNoticeBookmarked = (noticeId: string) => {
    return bookmarkedNotices.some(bn => bn._id === noticeId);
  };

  const filteredNotices = showBookmarks 
    ? bookmarkedNotices
    : selectedCategory === 'All Notices' 
      ? notices 
      : notices.filter(notice => 
          notice.categories.some(cat => 
            cat.toLowerCase() === selectedCategory.toLowerCase()
          )
        );

  // Sort bookmarks with most recent first
  const sortedBookmarkedNotices = [...bookmarkedNotices].sort(
    (a, b) => new Date(b.bookmarkedAt).getTime() - new Date(a.bookmarkedAt).getTime()
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* Hero Section - MET College Theme */}
      <div className="pt-[15vh] bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white py-16 px-4 relative overflow-hidden">
        {/* MET Logo/Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  <span className="text-white">MET</span>{' '}
                  <span className="text-yellow-300">College</span>{' '}
                  <span className="text-white">Notices</span>
                </h1>
                <p className="text-xl text-red-100 mb-4">
                  Stay updated with the latest campus announcements, events, and academic notices
                </p>
              </div>
              
              {/* Bookmarks Badge */}
              <button
                onClick={() => setShowBookmarks(!showBookmarks)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all ${
                  showBookmarks 
                    ? 'bg-yellow-500 text-red-900' 
                    : 'bg-white/20 backdrop-blur-sm hover:bg-white/30'
                }`}
              >
                <svg 
                  className={`w-6 h-6 ${showBookmarks ? 'fill-red-900' : 'fill-yellow-300'}`} 
                  viewBox="0 0 24 24"
                >
                  <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                </svg>
                <div className="text-left">
                  <div className="font-bold">{bookmarkedNotices.length}</div>
                  <div className="text-sm">
                    {showBookmarks ? 'Show All' : 'Bookmarks'}
                  </div>
                </div>
              </button>
            </div>
            
            <div className="flex flex-wrap gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[120px]">
                <div className="text-2xl font-bold">{notices.length}</div>
                <div className="text-sm text-red-100">Total Notices</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[120px]">
                <div className="text-2xl font-bold">{categories.length}</div>
                <div className="text-sm text-red-100">Categories</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[120px]">
                <div className="text-2xl font-bold">{bookmarkedNotices.length}</div>
                <div className="text-sm text-red-100">Bookmarked</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md border border-red-100 p-6 sticky top-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-red-800">Categories</h2>
                <div className="text-red-600 font-bold">MET</div>
              </div>
              
              <div className="space-y-3 mb-8">
                <button
                  onClick={() => {
                    setShowBookmarks(false);
                    setSelectedCategory('All Notices');
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                    selectedCategory === 'All Notices' && !showBookmarks
                      ? 'bg-red-50 border-l-4 border-red-600'
                      : 'hover:bg-red-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-600 to-red-400" />
                    <span className="font-medium text-gray-700">
                      All Notices
                    </span>
                  </div>
                  <span className="bg-red-100 text-red-600 text-sm font-medium px-2 py-1 rounded-full">
                    {categories.find(c => c.name === 'All Notices')?.count}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setShowBookmarks(true);
                    setSelectedCategory('All Notices');
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                    showBookmarks
                      ? 'bg-yellow-50 border-l-4 border-yellow-500'
                      : 'hover:bg-red-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400" />
                    <span className="font-medium text-gray-700 flex items-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                      </svg>
                      Bookmarks
                    </span>
                  </div>
                  <span className="bg-yellow-100 text-yellow-700 text-sm font-medium px-2 py-1 rounded-full">
                    {bookmarkedNotices.length}
                  </span>
                </button>
              </div>

              <h3 className="font-semibold text-gray-700 mb-3">Notice Categories</h3>
              <div className="space-y-3">
                {categories.slice(1).map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowBookmarks(false);
                      setSelectedCategory(category.name);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      selectedCategory === category.name && !showBookmarks
                        ? 'bg-red-50 border-l-4 border-red-600'
                        : 'hover:bg-red-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium text-gray-700">
                        {category.name}
                      </span>
                    </div>
                    <span className="bg-red-100 text-red-600 text-sm font-medium px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Notices Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md border border-red-100 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-red-800">
                    {showBookmarks ? '📌 Bookmarked Notices' : `${selectedCategory} Notices`}
                  </h2>
                  {showBookmarks && bookmarkedNotices.length > 0 && (
                    <p className="text-gray-600 mt-1">
                      Most recent bookmarks appear first
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowBookmarks(false)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      !showBookmarks
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Notices
                  </button>
                  <button 
                    onClick={() => setShowBookmarks(true)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      showBookmarks
                        ? 'bg-yellow-500 text-red-900 hover:bg-yellow-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Bookmarks ({bookmarkedNotices.length})
                  </button>
                </div>
              </div>

              {/* Notices Grid */}
              {(showBookmarks ? sortedBookmarkedNotices : filteredNotices).length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">
                    {showBookmarks ? '📑' : '📄'}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    {showBookmarks ? 'No bookmarked notices' : 'No notices found'}
                  </h3>
                  <p className="text-gray-500">
                    {showBookmarks 
                      ? 'Bookmark notices by clicking the bookmark icon to see them here.'
                      : selectedCategory === 'All Notices' 
                        ? 'No notices have been posted yet.'
                        : `No notices found in ${selectedCategory} category.`
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {(showBookmarks ? sortedBookmarkedNotices : filteredNotices).map((notice, index) => {
                    const isBookmarked = isNoticeBookmarked(notice._id);
                    const displayNotice = showBookmarks ? (notice as BookmarkedNotice) : notice;
                    
                    return (
                      <motion.div
                        key={displayNotice._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{ y: -4 }}
                        className={`border rounded-xl p-6 transition-all cursor-pointer relative ${
                          isBookmarked
                            ? 'border-yellow-400 bg-yellow-50/50 hover:shadow-lg'
                            : 'border-red-100 hover:shadow-lg'
                        }`}
                        onClick={() => handleReadMore(displayNotice)}
                      >
                        {/* Bookmark Badge */}
                        {isBookmarked && (
                          <div className="absolute -top-2 -right-2 bg-yellow-500 text-red-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            <svg className="w-3 h-3" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                            </svg>
                            Bookmarked
                          </div>
                        )}
                        
                        {/* Bookmarked Date */}
                        {showBookmarks && (
                          <div className="text-xs text-yellow-700 mb-2 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Bookmarked: {formatDate((displayNotice as BookmarkedNotice).bookmarkedAt)}
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
                          <div className="flex flex-wrap gap-2">
                            {displayNotice.categories.map((category) => (
                              <span
                                key={category}
                                className="px-3 py-1 rounded-full text-sm font-medium"
                                style={{
                                  backgroundColor: `${getCategoryColor(category)}20`,
                                  color: getCategoryColor(category)
                                }}
                              >
                                {category}
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            Posted: {formatDate(displayNotice.createdAt)}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                          {displayNotice.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-6 line-clamp-2">
                          {displayNotice.description}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <button 
                            className="text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReadMore(displayNotice);
                            }}
                          >
                            Read More
                            <span>→</span>
                          </button>
                          
                          <div className="flex gap-3">
                            <button 
                              className={`p-2 rounded-lg transition-colors ${
                                isBookmarked
                                  ? 'bg-yellow-100 text-yellow-600'
                                  : 'hover:bg-red-50 text-gray-500'
                              }`}
                              onClick={(e) => toggleBookmark(displayNotice, e)}
                              title={isBookmarked ? 'Remove bookmark' : 'Add to bookmarks'}
                            >
                              <svg 
                                className={`w-5 h-5 ${isBookmarked ? 'fill-yellow-500' : ''}`} 
                                viewBox="0 0 24 24"
                              >
                                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                              </svg>
                            </button>
                            <button 
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-500"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {filteredNotices.length > 0 && !showBookmarks && (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    1
                  </button>
                  <button className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                    2
                  </button>
                  <button className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                    3
                  </button>
                  <span className="px-2 text-gray-500">...</span>
                  <button className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                    Next
                  </button>
                  <span className="text-sm text-gray-500 ml-4">
                    Page 1 of {Math.ceil(filteredNotices.length / 10)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notice Detail Modal */}
      <AnimatePresence>
        {showModal && selectedNotice && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={handleCloseModal}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-4 md:inset-x-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl z-50 border border-red-200"
            >
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedNotice.categories.map((category) => (
                        <span
                          key={category}
                          className="px-3 py-1 rounded-full text-sm font-medium"
                          style={{
                            backgroundColor: `${getCategoryColor(category)}20`,
                            color: getCategoryColor(category)
                          }}
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-red-800">
                      {selectedNotice.title}
                    </h2>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>Posted: {formatDate(selectedNotice.createdAt)}</span>
                      {selectedNotice.updatedAt !== selectedNotice.createdAt && (
                        <span>Updated: {formatDate(selectedNotice.updatedAt)}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-500"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Modal Content */}
                <div className="prose max-w-none mb-8">
                  <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                    <h3 className="text-lg font-semibold text-red-800 mb-3">Full Description</h3>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {selectedNotice.description}
                    </p>
                  </div>
                  
                  {/* Additional Info */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-red-50 rounded-xl p-4">
                      <h4 className="font-semibold text-red-800 mb-2">Notice ID</h4>
                      <p className="text-red-600 font-mono text-sm">{selectedNotice._id}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-4">
                      <h4 className="font-semibold text-yellow-800 mb-2">Bookmark Status</h4>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleBookmark(selectedNotice)}
                          className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
                            isNoticeBookmarked(selectedNotice._id)
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          <svg 
                            className={`w-4 h-4 ${isNoticeBookmarked(selectedNotice._id) ? 'fill-yellow-500' : ''}`} 
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                          </svg>
                          {isNoticeBookmarked(selectedNotice._id) ? 'Bookmarked' : 'Bookmark'}
                        </button>
                        {isNoticeBookmarked(selectedNotice._id) && (
                          <span className="text-xs text-yellow-600">
                            ✓ Saved locally
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-red-200">
                  <div className="flex gap-3">
                    <button
                      onClick={() => toggleBookmark(selectedNotice)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isNoticeBookmarked(selectedNotice._id)
                          ? 'bg-yellow-500 text-red-900 hover:bg-yellow-600'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      <svg 
                        className={`w-5 h-5 ${isNoticeBookmarked(selectedNotice._id) ? 'fill-red-900' : ''}`} 
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                      </svg>
                      {isNoticeBookmarked(selectedNotice._id) ? 'Remove Bookmark' : 'Bookmark'}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share
                    </button>
                  </div>
                  
                  <button
                    onClick={handleCloseModal}
                    className="px-6 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;