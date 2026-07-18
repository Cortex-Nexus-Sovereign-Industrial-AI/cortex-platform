import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null)

  const isAuthenticated = computed(() => !!token.value)

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      })
      setToken(response.data.token)
      user.value = response.data.user
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  return {
    token,
    user,
    isAuthenticated,
    setToken,
    login,
    logout
  }
})

export const usePostsStore = defineStore('posts', () => {
  const posts = ref([])
  const loading = ref(false)

  const fetchPosts = async () => {
    loading.value = true
    try {
      const response = await axios.get(`${API_URL}/api/posts`)
      posts.value = response.data
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      loading.value = false
    }
  }

  const createPost = async (postData) => {
    try {
      const response = await axios.post(`${API_URL}/api/posts`, postData)
      posts.value.unshift(response.data)
      return response.data
    } catch (error) {
      console.error('Failed to create post:', error)
      throw error
    }
  }

  const publishPost = async (postId) => {
    try {
      const response = await axios.post(`${API_URL}/api/posts/${postId}/publish`)
      const index = posts.value.findIndex(p => p.id === postId)
      if (index !== -1) {
        posts.value[index].status = 'posted'
      }
      return response.data
    } catch (error) {
      console.error('Failed to publish post:', error)
      throw error
    }
  }

  return {
    posts,
    loading,
    fetchPosts,
    createPost,
    publishPost
  }
})
