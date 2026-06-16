<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { Column } from '@tanstack/vue-table'

interface BlogCategory {
  id: number
  title: string
}

interface BlogPost {
  id: number
  title: string
  slug: string
  is_published: boolean
  date_published: string | null
  user_id: number
  category_id: number
}

interface PostsResponse {
  data: BlogPost[]
}

interface CategoriesResponse {
  data: BlogCategory[]
}

useHead({
  title: 'Blog Posts UI'
})

const apiUrl = 'http://127.0.0.1:8000/api/admin/blog/posts'
const pageSizeOptions = [5, 10, 20, 50]

const page = ref(1)
const pageSize = ref(10)
const search = ref('')
const statusFilter = ref<'all' | 'published' | 'draft'>('all')
const rowSelection = ref<Record<string, boolean>>({})

const { data, pending, error } = await useFetch<PostsResponse>(apiUrl, {
  query: { page: 1, per_page: 1000 }
})

const { data: categoriesData } = await useFetch<CategoriesResponse>('http://127.0.0.1:8000/api/admin/blog/categories', {
  query: { page: 1, per_page: 1000 }
})

const posts = computed(() => data.value?.data ?? [])
const categories = computed(() => categoriesData.value?.data ?? [])
const categoryTitleById = computed(() => Object.fromEntries(categories.value.map(item => [item.id, item.title])))

const filteredPosts = computed(() => {
  const query = search.value.trim().toLowerCase()

  return posts.value.filter((item) => {
    const categoryTitle = categoryTitleById.value[item.category_id] || `#${item.category_id}`
    const status = item.is_published ? 'published' : 'draft'
    const matchesQuery = !query || [
      item.title,
      item.slug,
      String(item.id),
      String(item.user_id),
      categoryTitle
    ].some(value => value?.toLowerCase().includes(query))

    const matchesStatus = statusFilter.value === 'all' || statusFilter.value === status

    return matchesQuery && matchesStatus
  })
})

const pageCount = computed(() => Math.max(1, Math.ceil(filteredPosts.value.length / pageSize.value)))

const paginatedPosts = computed(() => {
  const start = (page.value - 1) * pageSize.value
  const end = page.value * pageSize.value

  return filteredPosts.value.slice(start, end)
})

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
  { accessorKey: 'user_id', header: 'Автор' },
  { accessorKey: 'category_id', header: 'Категорія' },
  { accessorKey: 'title', header: sortableHeader('Заголовок') },
  { accessorKey: 'date_published', header: sortableHeader('Дата публікації') }
]

const sorting = ref([{ id: 'id', desc: true }])

watch([search, statusFilter, pageSize], () => {
  page.value = 1
  rowSelection.value = {}
})

watch(page, () => {
  rowSelection.value = {}
})

const clearFilters = () => {
  search.value = ''
  statusFilter.value = 'all'
}
</script>

<template>
  <UContainer class="py-10 max-w-7xl">
    <div class="relative mb-6 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-2xl motion-safe:animate-[fadeUp_.7s_ease_both]">
      <div class="absolute -left-12 top-0 h-36 w-36 rounded-full bg-emerald-500/15 blur-3xl motion-safe:animate-[floaty_10s_ease-in-out_infinite]" />
      <div class="absolute right-0 top-8 h-28 w-28 rounded-full bg-cyan-400/10 blur-3xl motion-safe:animate-[floaty_8s_ease-in-out_infinite]" />

      <div class="relative flex flex-wrap items-end justify-between gap-4">
        <div class="space-y-2">
          <UBadge color="success" variant="soft" class="shadow-sm">
            Blog Posts UI
          </UBadge>
          <div>
            <h1 class="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Blog Posts UI
            </h1>
            <p class="max-w-2xl text-sm text-slate-300">
              Таблиця на базі Nuxt UI з пошуком, фільтрами, власною пагінацією та вибором рядків.
            </p>
          </div>
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
    </div>

    <UCard class="mb-4 overflow-hidden border border-white/10 bg-white/80 shadow-xl backdrop-blur dark:bg-slate-950/70" :ui="{ body: 'p-4 sm:p-6' }">
      <div class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px_180px_auto]">
        <UInput
          v-model="search"
          placeholder="Пошук за заголовком, slug, автором або категорією"
          icon="i-heroicons-magnifying-glass-20-solid"
          :ui="{ base: 'h-11 rounded-xl' }"
        />

        <select
          v-model="statusFilter"
          class="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-700 dark:bg-slate-900 dark:text-white"
        >
          <option value="all">Усі статуси</option>
          <option value="published">Опубліковані</option>
          <option value="draft">Чернетки</option>
        </select>

        <select
          v-model.number="pageSize"
          class="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-700 dark:bg-slate-900 dark:text-white"
        >
          <option
            v-for="item in pageSizeOptions"
            :key="item"
            :value="item"
          >
            {{ item }} / стор.
          </option>
        </select>

        <div class="flex flex-wrap items-center gap-2">
          <UButton
            color="neutral"
            variant="soft"
            icon="i-heroicons-x-mark"
            :disabled="!search && statusFilter === 'all'"
            @click="clearFilters"
          >
            Скинути
          </UButton>
        </div>
      </div>
    </UCard>

    <UCard
      class="overflow-hidden border border-white/10 bg-white/85 shadow-2xl backdrop-blur dark:bg-slate-950/70"
      :ui="{ body: 'p-0 sm:p-0', header: 'p-0 sm:p-0' }"
    >
      <div class="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <div class="text-sm text-gray-500">
          {{ Object.keys(rowSelection).length }} selected
        </div>
        <div class="text-sm text-gray-500">
          {{ filteredPosts.length }} posts
        </div>
      </div>

      <UTable
        v-model:row-selection="rowSelection"
        v-model:sorting="sorting"
        :data="paginatedPosts"
        :columns="columns"
        :loading="pending"
        class="w-full"
        :ui="{ th: 'bg-gray-50/90 dark:bg-slate-900 text-gray-600 font-medium py-3 cursor-pointer', td: 'align-middle py-3' }"
      >
        <template #user_id-cell="{ row }">
          <span class="text-gray-700 dark:text-gray-300">
            Користувач #{{ row.original?.user_id }}
          </span>
        </template>

        <template #category_id-cell="{ row }">
          <UBadge color="success" variant="subtle">
            {{ categoryTitleById[row.original.category_id] || `Категорія #${row.original.category_id}` }}
          </UBadge>
        </template>

        <template #title-cell="{ row }">
          <NuxtLink
            :to="'/blog-posts/' + row.original.id"
            class="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
          >
            {{ row.original?.title }}
          </NuxtLink>
          <div class="mt-1 text-xs text-gray-400 dark:text-gray-500">
            {{ row.original?.slug }}
          </div>
        </template>

        <template #date_published-cell="{ row }">
          <div class="space-y-1">
            <UBadge :color="row.original?.is_published ? 'success' : 'neutral'" variant="subtle">
              {{ row.original?.is_published ? 'Опубліковано' : 'Чернетка' }}
            </UBadge>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ row.original?.date_published || '—' }}
            </div>
          </div>
        </template>
      </UTable>

      <div class="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-slate-950">
        <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>Показувати</span>
          <select
            v-model.number="pageSize"
            class="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-700 dark:bg-slate-900 dark:text-white"
          >
            <option
              v-for="item in pageSizeOptions"
              :key="item"
              :value="item"
            >
              {{ item }}
            </option>
          </select>
          <span>на сторінці</span>
        </div>

        <UPagination
          v-model:page="page"
          :items-per-page="pageSize"
          :total="filteredPosts.length"
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

<style scoped>
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes floaty {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}
</style>
