<script setup lang="ts">
interface BlogUser {
  name: string
}

interface BlogCategory {
  title: string
}

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content_raw: string | null
  published_at: string | null
  user: BlogUser
  category: BlogCategory
}

const route = useRoute()

useHead({
  title: 'Blog Post'
})

const apiUrl = computed(() => `http://127.0.0.1:8000/api/blog/posts/${route.params.id}`)

const { data, pending, error } = await useFetch<BlogPost>(apiUrl)

const post = computed(() => data.value)
</script>

<template>
  <UContainer class="py-10 max-w-4xl">
    <div class="mb-6 flex items-center justify-between gap-3">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Blog Post
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Окрема стаття з API Laravel
        </p>
      </div>

      <UButton
        to="/blog-posts"
        color="neutral"
        variant="soft"
        icon="i-heroicons-arrow-left"
      >
        Back
      </UButton>
    </div>

    <UCard v-if="pending" class="p-6">
      Loading...
    </UCard>

    <UAlert
      v-else-if="error || !post"
      color="error"
      title="Не вдалося завантажити пост"
    />

    <UCard v-else class="space-y-6">
      <div class="space-y-2">
        <UBadge color="success" variant="subtle">
          {{ post.category?.title }}
        </UBadge>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ post.title }}
        </h2>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          Автор: {{ post.user?.name }} | Опубліковано: {{ post.published_at }}
        </div>
      </div>

      <div v-if="post.excerpt" class="rounded-xl bg-gray-50 p-4 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
        {{ post.excerpt }}
      </div>

      <div class="prose max-w-none dark:prose-invert">
        <p>{{ post.content_raw }}</p>
      </div>
    </UCard>
  </UContainer>
</template>
