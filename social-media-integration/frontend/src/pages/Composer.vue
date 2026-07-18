<template>
  <div class="composer-page">
    <h2>✍️ Compose New Post</h2>
    
    <div class="composer-container">
      <form @submit.prevent="submitPost" class="post-form">
        <div class="form-group">
          <label>Content</label>
          <textarea
            v-model="form.content"
            placeholder="What's on your mind?"
            maxlength="5000"
            rows="6"
          ></textarea>
          <small>{{ form.content.length }}/5000 characters</small>
        </div>

        <div class="form-group">
          <label>Platforms</label>
          <div class="platform-selector">
            <label v-for="platform in platforms" :key="platform" class="checkbox">
              <input
                type="checkbox"
                :value="platform"
                v-model="form.platforms"
              >
              {{ getPlatformLabel(platform) }}
            </label>
          </div>
        </div>

        <div class="form-group">
          <label>Schedule (Optional)</label>
          <input
            v-model="form.scheduledAt"
            type="datetime-local"
            placeholder="Leave empty to publish immediately"
          >
        </div>

        <div class="form-group">
          <label>Media Upload (Optional)</label>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            @change="handleMediaUpload"
          >
          <div class="media-preview" v-if="form.mediaUrls.length">
            <img v-for="url in form.mediaUrls" :key="url" :src="url" alt="preview">
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ form.scheduledAt ? '📅 Schedule Post' : '🚀 Publish Now' }}
          </button>
          <button type="button" class="btn btn-secondary" @click="resetForm">
            Clear
          </button>
        </div>
      </form>

      <div class="preview-panel">
        <h3>Preview</h3>
        <div class="tweet-preview">
          <div class="tweet-header">
            <strong>Your Post</strong>
            <span class="timestamp">Just now</span>
          </div>
          <div class="tweet-body">{{ form.content || 'Your content will appear here...' }}</div>
          <div class="tweet-footer">
            <span>❤️ 0</span>
            <span>💬 0</span>
            <span>🔄 0</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePostsStore } from '../stores'

const postsStore = usePostsStore()
const loading = ref(false)
const platforms = ['twitter', 'linkedin', 'telegram', 'medium']

const form = ref({
  content: '',
  platforms: ['twitter'],
  scheduledAt: '',
  mediaUrls: []
})

const getPlatformLabel = (platform) => {
  const labels = {
    twitter: '𝕏 Twitter',
    linkedin: '🔗 LinkedIn',
    tiktok: '♪ TikTok',
    instagram: '📸 Instagram',
    youtube: '▶️ YouTube',
    medium: '📝 Medium',
    telegram: '✈️ Telegram',
    whatsapp: '💬 WhatsApp'
  }
  return labels[platform] || platform
}

const handleMediaUpload = (event) => {
  const files = Array.from(event.target.files)
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.mediaUrls.push(e.target.result)
    }
    reader.readAsDataURL(file)
  })
}

const submitPost = async () => {
  if (!form.value.content.trim()) {
    alert('Please enter some content')
    return
  }

  loading.value = true
  try {
    await postsStore.createPost({
      content: form.value.content,
      platforms: form.value.platforms,
      scheduledAt: form.value.scheduledAt || null,
      mediaUrls: form.value.mediaUrls
    })
    alert('Post created successfully!')
    resetForm()
  } catch (error) {
    alert('Failed to create post: ' + error.message)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    content: '',
    platforms: ['twitter'],
    scheduledAt: '',
    mediaUrls: []
  }
}
</script>

<style scoped>
.composer-page {
  background: rgba(30, 41, 59, 0.5);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #334155;
}

h2 {
  margin-top: 0;
  color: #818cf8;
  font-size: 1.8rem;
}

.composer-container {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #e2e8f0;
}

textarea,
input[type="datetime-local"],
input[type="file"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #475569;
  border-radius: 6px;
  background: rgba(15, 23, 42, 0.5);
  color: #e2e8f0;
  font-family: inherit;
}

textarea:focus,
input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

small {
  display: block;
  color: #94a3b8;
  margin-top: 0.25rem;
}

.platform-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #cbd5e1;
}

.checkbox input {
  width: auto;
}

.media-preview {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.media-preview img {
  max-width: 150px;
  max-height: 150px;
  border-radius: 6px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #4f46e5;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #4338ca;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #475569;
  color: #e2e8f0;
}

.btn-secondary:hover {
  background: #64748b;
}

.preview-panel {
  background: rgba(15, 23, 42, 0.3);
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 1.5rem;
  height: fit-content;
}

.preview-panel h3 {
  margin-top: 0;
  color: #818cf8;
}

.tweet-preview {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 1rem;
  color: #cbd5e1;
}

.tweet-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.timestamp {
  color: #94a3b8;
}

.tweet-body {
  line-height: 1.5;
  margin-bottom: 0.75rem;
  color: #e2e8f0;
}

.tweet-footer {
  display: flex;
  gap: 1.5rem;
  border-top: 1px solid #334155;
  padding-top: 0.75rem;
  color: #94a3b8;
  font-size: 0.9rem;
}

@media (max-width: 900px) {
  .composer-container {
    grid-template-columns: 1fr;
  }
}
</style>
