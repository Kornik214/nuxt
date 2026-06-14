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
  published_at: string | null
  user: BlogUser
  category: BlogCategory
}

interface PostsResponse {
  data: BlogPost[]
}

useHead({
  title: 'Blog Posts'
})

const apiUrl = 'http://127.0.0.1:8000/api/blog/posts'

const { data, pending, error } = await useFetch<PostsResponse>(apiUrl)

const posts = computed(() => data.value?.data ?? [])
</script>

<template>
  <div class="container mx-auto px-4 py-10">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Blog Posts
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Таблиця статей з API Laravel
        </p>
      </div>

      <div class="flex flex-wrap gap-3">
        <NuxtLink
          to="/blog-posts-ui"
          class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          UI Table
        </NuxtLink>
        <a
          href="/admin/blog/posts/create"
          class="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          Додати
        </a>
      </div>
    </div>

    <div
      v-if="pending"
      class="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      Завантаження даних...
    </div>

    <div
      v-else-if="error"
      class="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
    >
      Не вдалося завантажити пости з API.
    </div>

    <div
      v-else
      class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              #
            </th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Автор
            </th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Категорія
            </th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Заголовок
            </th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Дата публікації
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
          <tr
            v-for="post in posts"
            :key="post.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-800/50"
          >
            <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
              {{ post.id }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
              {{ post.user?.name }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
              {{ post.category?.title }}
            </td>
            <td class="px-4 py-3 text-sm text-green-700 dark:text-green-400">
              <NuxtLink :to="'/admin/blog/posts/' + post.id + '/edit'">
                {{ post.title }}
              </NuxtLink>
            </td>
            <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
              {{ post.published_at }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

