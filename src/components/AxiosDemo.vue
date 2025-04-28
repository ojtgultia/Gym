<script setup lang="ts">
import { useAxiosDemo } from '../composables/useAxiosDemo'
import { onMounted } from 'vue'

const { posts, loading, error, fetchPosts, createPost } = useAxiosDemo()

// Fetch posts when component mounts
onMounted(() => {
  fetchPosts()
})

const handleCreatePost = async () => {
  try {
    await createPost(
      'Example Post Title',
      'This is an example post body created using Axios.'
    )
  } catch (err) {
    // Error is handled in the composable
  }
}
</script>

<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Axios Demo</h2>
    
    <!-- Create Post Button -->
    <button
      @click="handleCreatePost"
      class="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
      :disabled="loading"
    >
      Create Example Post
    </button>

    <!-- Loading State -->
    <div v-if="loading" class="text-gray-600">Loading...</div>

    <!-- Error State -->
    <div v-if="error" class="text-red-600 mb-4">{{ error }}</div>

    <!-- Posts List -->
    <div v-if="posts.length" class="space-y-4">
      <div
        v-for="post in posts"
        :key="post.id"
        class="p-4 border rounded-lg hover:shadow-md transition-shadow"
      >
        <h3 class="text-lg font-semibold">{{ post.title }}</h3>
        <p class="text-gray-600 mt-2">{{ post.body }}</p>
      </div>
    </div>

    <!-- No Posts State -->
    <div v-else-if="!loading" class="text-gray-600">
      No posts available.
    </div>
  </div>
</template> 