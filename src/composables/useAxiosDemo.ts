import axios from 'axios'
import { ref } from 'vue'

// Types
interface Post {
  id: number
  title: string
  body: string
  userId: number
}

export function useAxiosDemo() {
  const posts = ref<Post[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Example function to fetch posts using Axios
  const fetchPosts = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts')
      posts.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch posts'
      console.error('Error fetching posts:', err)
    } finally {
      loading.value = false
    }
  }

  const createPost = async (title: string, body: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
        title,
        body,
        userId: 1 
      })
      
      // Add the new post to the beginning of the posts array
      posts.value = [response.data, ...posts.value]
      return response.data
    } catch (err) {
      error.value = 'Failed to create post'
      console.error('Error creating post:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost
  }
} 