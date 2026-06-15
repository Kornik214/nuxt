<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { Column } from '@tanstack/vue-table'

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
  current_page: number
  data: BlogPost[]
  per_page: number
  total: number
  last_page: number
}

useHead({
  title: 'Blog Posts UI'
})

const apiUrl = 'http://127.0.0.1:8000/api/blog/posts'

const page = ref(1)

const { data, pending, error } = await useFetch<PostsResponse>(apiUrl, {
  query: computed(() => ({ page: page.value })),
  watch: [page]
})

const posts = computed(() => data.value?.data ?? [])
const total = computed(() => data.value?.total ?? 0)
const perPage = computed(() => data.value?.per_page ?? 10)

const UButton = resolveComponent('UButton')

const sortableHeader = (label: string) => {
  return ({ column }: { column: Column<BlogPost, unknown> }) => {
    const isSorted = column.getIsSorted()

    return h(UButton, {
      color: 'neutral',
      variant: 'ghost',
      label,
      icon: isSorted === 'asc'
        ? 'i-heroicons-arrow-up-20-solid'
        : isSorted === 'desc'
          ? 'i-heroicons-arrow-down-20-solid'
          : 'i-heroicons-arrows-up-down-20-solid',
      class: '-ml-2.5',
      onClick: () => column.toggleSorting()
    })
  }
}

const columns = [
  { accessorKey: 'id', header: sortableHeader('#') },
  { accessorKey: 'user', header: 'Автор' },
  { accessorKey: 'category', header: 'Категорія' },
  { accessorKey: 'title', header: sortableHeader('Заголовок') },
  { accessorKey: 'published_at', header: sortableHeader('Дата публікації') }
]

const rowSelection = ref<Record<string, boolean>>({})
const sorting = ref([{ id: 'id', desc: true }])

const refreshTable = () => {
  if (page.value < 1) {
    page.value = 1
  }
}

watch(page, refreshTable)
</script>

<template>
  <UContainer class="py-10 max-w-7xl">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Blog Posts UI
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Таблиця на базі Nuxt UI з пагінацією
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <UButton
          to="/blog-posts"
          color="neutral"
          variant="soft"
          icon="i-heroicons-table-cells"
        >
          HTML Table
        </UButton>
        <UButton
          to="/"
          color="neutral"
          variant="ghost"
          icon="i-heroicons-home"
        >
          Home
        </UButton>
      </div>
    </div>

    <UCard
      class="overflow-hidden shadow-sm ring-1 ring-gray-200 dark:ring-gray-800"
      :ui="{ body: 'p-0 sm:p-0', header: 'p-0 sm:p-0' }"
    >
      <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <div class="text-sm text-gray-500">
          {{ Object.keys(rowSelection).length }} selected
        </div>
        <div class="text-sm text-gray-500">
          {{ total }} posts
        </div>
      </div>

      <UTable
        v-model:row-selection="rowSelection"
        v-model:sorting="sorting"
        :data="posts"
        :columns="columns"
        :loading="pending"
        class="w-full"
        :ui="{ th: 'bg-gray-50 dark:bg-gray-900 text-gray-600 font-medium py-3 cursor-pointer', td: 'align-middle py-3' }"
      >
        <template #user-cell="{ row }">
          <span>{{ row.original?.user?.name }}</span>
        </template>

        <template #category-cell="{ row }">
          <span>{{ row.original?.category?.title }}</span>
        </template>

        <template #title-cell="{ row }">
          <NuxtLink
            :to="'/admin/blog/posts/' + row.original.id + '/edit'"
            class="text-green-600 hover:underline dark:text-green-400"
          >
            {{ row.original?.title }}
          </NuxtLink>
        </template>

        <template #published_at-cell="{ row }">
          <span>{{ row.original?.published_at }}</span>
        </template>
      </UTable>

      <div class="flex items-center justify-between gap-3 border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
        <div class="text-sm text-gray-500">
          Showing {{ posts.length }} of {{ total }} results
        </div>

        <UPagination
          v-model:page="page"
          :items-per-page="perPage"
          :total="total"
          :active-button="{ variant: 'outline', color: 'success' }"
        />
      </div>

      <div
        v-if="error"
        class="px-4 pb-4 text-sm text-red-600 dark:text-red-400"
      >
        Не вдалося завантажити дані з API.
      </div>
    </UCard>
  </UContainer>
</template>
