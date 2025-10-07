const API_BASE = '/api/main/search'

class SearchAPI {

  // Search across canvases, users, and prompts
  async search(query, options = {}) {
    try {
      const {
        type = 'all', // all, canvases, users, prompts
        deep = false,
        limit = 20
      } = options

      const params = new URLSearchParams({
        q: query,
        type,
        deep: deep.toString(),
        limit: limit.toString()
      })

      const response = await fetch(`${API_BASE}?${params.toString()}`, {
        method: 'GET',
        credentials: 'include'
      })
      
      return await response.json()
    } catch (error) {
      console.error('Error during search:', error)
      return {
        success: false,
        data: null,
        error: error.message,
        message: null,
        meta: { timestamp: new Date().toISOString() }
      }
    }
  }

  // Search canvases only
  async searchCanvases(query, options = {}) {
    return await this.search(query, { ...options, type: 'canvases' })
  }

  // Search users only
  async searchUsers(query, options = {}) {
    return await this.search(query, { ...options, type: 'users' })
  }

  // Search prompts only
  async searchPrompts(query, options = {}) {
    return await this.search(query, { ...options, type: 'prompts' })
  }

  // Advanced search with filters
  async advancedSearch(query, filters = {}) {
    try {
      const {
        type = 'all',
        category = '',
        tags = [],
        dateRange = null,
        sortBy = 'relevance',
        sortOrder = 'desc',
        limit = 20,
        page = 1
      } = filters

      const params = new URLSearchParams({
        q: query,
        type,
        limit: limit.toString(),
        page: page.toString(),
        sortBy,
        sortOrder
      })

      if (category) params.set('category', category)
      if (tags.length > 0) params.set('tags', tags.join(','))
      if (dateRange) {
        if (dateRange.from) params.set('dateFrom', dateRange.from)
        if (dateRange.to) params.set('dateTo', dateRange.to)
      }

      const response = await fetch(`${API_BASE}?${params.toString()}`, {
        method: 'GET',
        credentials: 'include'
      })
      
      return await response.json()
    } catch (error) {
      console.error('Error during advanced search:', error)
      return {
        success: false,
        data: null,
        error: error.message,
        message: null,
        meta: { timestamp: new Date().toISOString() }
      }
    }
  }

  // Get search suggestions
  async getSearchSuggestions(query) {
    try {
      const params = new URLSearchParams({
        q: query,
        type: 'suggestions'
      })

      const response = await fetch(`${API_BASE}?${params.toString()}`, {
        method: 'GET',
        credentials: 'include'
      })
      
      return await response.json()
    } catch (error) {
      console.error('Error getting search suggestions:', error)
      return {
        success: false,
        data: null,
        error: error.message,
        message: null,
        meta: { timestamp: new Date().toISOString() }
      }
    }
  }

  // Get trending searches
  async getTrendingSearches() {
    try {
      const params = new URLSearchParams({
        type: 'trending'
      })

      const response = await fetch(`${API_BASE}?${params.toString()}`, {
        method: 'GET',
        credentials: 'include'
      })
      
      return await response.json()
    } catch (error) {
      console.error('Error getting trending searches:', error)
      return {
        success: false,
        data: null,
        error: error.message,
        message: null,
        meta: { timestamp: new Date().toISOString() }
      }
    }
  }
}

const searchAPI = new SearchAPI()

export default searchAPI
