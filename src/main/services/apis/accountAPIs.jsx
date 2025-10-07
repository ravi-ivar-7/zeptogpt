const API_BASE = '/api/main/account'

class AccountAPI {

  // Authentication
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(credentials)
      })
      
      return await response.json()
    } catch (error) {
      console.error('Error during login:', error)
      return {
        success: false,
        data: null,
        error: error.message,
        message: null,
        meta: { timestamp: new Date().toISOString() }
      }
    }
  }

  async register(userData) {
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(userData)
      })
      
      return await response.json()
    } catch (error) {
      console.error('Error during registration:', error)
      return {
        success: false,
        data: null,
        error: error.message,
        message: null,
        meta: { timestamp: new Date().toISOString() }
      }
    }
  }

  // OTP Management
  async verifyOTP(email, otp, intent) {
    try {
      const response = await fetch(`${API_BASE}/otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, otp, intent })
      })
      
      return await response.json()
    } catch (error) {
      console.error('Error verifying OTP:', error)
      return {
        success: false,
        data: null,
        error: error.message,
        message: null,
        meta: { timestamp: new Date().toISOString() }
      }
    }
  }

  async resendOTP(email, intent) {
    try {
      const response = await fetch(`${API_BASE}/otp`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, intent })
      })
      
      return await response.json()
    } catch (error) {
      console.error('Error resending OTP:', error)
      return {
        success: false,
        data: null,
        error: error.message,
        message: null,
        meta: { timestamp: new Date().toISOString() }
      }
    }
  }

  // Session Management
  async getSession() {
    try {
      const response = await fetch(`${API_BASE}/session`, {
        method: 'GET',
        credentials: 'include'
      })
      
      return await response.json()
    } catch (error) {
      console.error('Error getting session:', error)
      return {
        success: false,
        data: null,
        error: error.message,
        message: null,
        meta: { timestamp: new Date().toISOString() }
      }
    }
  }

  async refreshToken() {
    try {
      const response = await fetch(`${API_BASE}/session`, {
        method: 'POST',
        credentials: 'include'
      })
      
      return await response.json()
    } catch (error) {
      console.error('Error refreshing token:', error)
      return {
        success: false,
        data: null,
        error: error.message,
        message: null,
        meta: { timestamp: new Date().toISOString() }
      }
    }
  }

  async revokeAllSessions() {
    try {
      const response = await fetch(`${API_BASE}/session?all=true`, {
        method: 'DELETE',
        credentials: 'include'
      })
      
      return await response.json()
    } catch (error) {
      console.error('Error revoking all sessions:', error)
      return {
        success: false,
        data: null,
        error: error.message,
        message: null,
        meta: { timestamp: new Date().toISOString() }
      }
    }
  }

  async revokeSession(sessionId) {
    try {
      const response = await fetch(`${API_BASE}/session?sessionId=${sessionId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      
      return await response.json()
    } catch (error) {
      console.error('Error revoking session:', error)
      return {
        success: false,
        data: null,
        error: error.message,
        message: null,
        meta: { timestamp: new Date().toISOString() }
      }
    }
  }

  async revokeCurrentSession() {
    try {
      const response = await fetch(`${API_BASE}/session`, {
        method: 'DELETE',
        credentials: 'include'
      })
      
      return await response.json()
    } catch (error) {
      console.error('Error revoking current session:', error)
      return {
        success: false,
        data: null,
        error: error.message,
        message: null,
        meta: { timestamp: new Date().toISOString() }
      }
    }
  }

  // Profile Management
  async getProfile() {
    try {
      const response = await fetch(`${API_BASE}/profile`, {
        method: 'GET',
        credentials: 'include'
      })
      
      return await response.json()
    } catch (error) {
      console.error('Error getting profile:', error)
      return {
        success: false,
        data: null,
        error: error.message,
        message: null,
        meta: { timestamp: new Date().toISOString() }
      }
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(profileData)
      })
      
      return await response.json()
    } catch (error) {
      console.error('Error updating profile:', error)
      return {
        success: false,
        data: null,
        error: error.message,
        message: null,
        meta: { timestamp: new Date().toISOString() }
      }
    }
  }

  // Password Management
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await fetch(`${API_BASE}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword })
      })
      
      return await response.json()
    } catch (error) {
      console.error('Error changing password:', error)
      return {
        success: false,
        data: null,
        error: error.message,
        message: null,
        meta: { timestamp: new Date().toISOString() }
      }
    }
  }

  async requestPasswordReset(email) {
    try {
      const response = await fetch(`${API_BASE}/password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })
      
      return await response.json()
    } catch (error) {
      console.error('Error requesting password reset:', error)
      return {
        success: false,
        data: null,
        error: error.message,
        message: null,
        meta: { timestamp: new Date().toISOString() }
      }
    }
  }

  async resetPasswordWithOTP(email, otp, newPassword) {
    try {
      const response = await fetch(`${API_BASE}/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, otp, newPassword })
      })
      
      return await response.json()
    } catch (error) {
      console.error('Error resetting password:', error)
      return {
        success: false,
        data: null,
        error: error.message,
        message: null,
        meta: { timestamp: new Date().toISOString() }
      }
    }
  }

  async getGoogleAuthURL(returnTo = null) {
    try {
      const params = new URLSearchParams()
      if (returnTo) {
        params.set('returnTo', returnTo)
      }
      
      return {
        success: true,
        data: {
          authUrl: `${API_BASE}/google${params.toString() ? '?' + params.toString() : ''}`
        },
        message: null,
        error: null,
        meta: { timestamp: new Date().toISOString() }
      }
    } catch (error) {
      console.error('Error getting Google auth URL:', error)
      return {
        success: false,
        data: null,
        error: error.message,
        message: null,
        meta: { timestamp: new Date().toISOString() }
      }
    }
  }

  async handleGoogleCallback(code, state) {
    try {
      const response = await fetch(`${API_BASE}/google/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ code, state })
      })
      
      return await response.json()
    } catch (error) {
      console.error('Error handling Google callback:', error)
      return {
        success: false,
        data: null,
        error: error.message,
        message: null,
        meta: { timestamp: new Date().toISOString() }
      }
    }
  }

  // Account Management
  async disableAccount() {
    try {
      const response = await fetch(`${API_BASE}/disable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      
      return await response.json()
    } catch (error) {
      console.error('Error disabling account:', error)
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

const accountAPI = new AccountAPI()

export default accountAPI