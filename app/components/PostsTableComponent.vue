<script setup lang="ts">
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
  title: 'Blog Posts'
})

const apiUrl = 'http://127.0.0.1:8000/api/admin/blog/posts'
const pageSizeOptions = [5, 10, 20, 50]

const page = ref(1)
const pageSize = ref(10)
const search = ref('')
const statusFilter = ref<'all' | 'published' | 'draft'>('all')
const categoryFilter = ref<'all' | string>('all')
const rowSelection = ref<Record<string, boolean>>({})

const { data, pending, error, refresh } = useLazyFetch<PostsResponse>(apiUrl, {
  query: { page: 1, per_page: 1000 }
})

const { data: categoriesData } = useLazyFetch<CategoriesResponse>('http://127.0.0.1:8000/api/admin/blog/categories', {
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
      String(item.category_id),
      categoryTitle
    ].some(value => value?.toLowerCase().includes(query))

    const matchesStatus = statusFilter.value === 'all' || statusFilter.value === status
    const matchesCategory = categoryFilter.value === 'all' || String(item.category_id) === categoryFilter.value

    return matchesQuery && matchesStatus && matchesCategory
  })
})

const pageCount = computed(() => Math.max(1, Math.ceil(filteredPosts.value.length / pageSize.value)))

const paginatedPosts = computed(() => {
  const start = (page.value - 1) * pageSize.value
  const end = page.value * pageSize.value

  return filteredPosts.value.slice(start, end)
})

const selectedCount = computed(() => Object.keys(rowSelection.value).length)
const filtersActive = computed(() => search.value.length > 0 || statusFilter.value !== 'all' || categoryFilter.value !== 'all')

const columns = [
  { accessorKey: 'id', header: '#' },
  { accessorKey: 'user_id', header: 'Автор' },
  { accessorKey: 'category_id', header: 'Категорія' },
  { accessorKey: 'title', header: 'Заголовок' },
  { accessorKey: 'date_published', header: 'Дата публікації' },
  { accessorKey: 'actions', header: 'Дії' }
]

const clearFilters = () => {
  search.value = ''
  statusFilter.value = 'all'
  categoryFilter.value = 'all'
}

const clearSelection = () => {
  rowSelection.value = {}
}

watch([search, statusFilter, categoryFilter, pageSize], () => {
  page.value = 1
  clearSelection()
})

watch(page, () => {
  clearSelection()
})

watch(filteredPosts, () => {
  if (page.value > pageCount.value) {
    page.value = pageCount.value
  }
})

const deletePost = async (id: number) => {
  if (!confirm('Видалити пост?')) return

  await $fetch(`http://127.0.0.1:8000/api/admin/blog/posts/${id}`, { method: 'DELETE' })

  clearSelection()
  await refresh()
}

const deleteSelected = async () => {
  const ids = Object.keys(rowSelection.value).map(Number)

  if (!ids.length) return

  if (!confirm(`Видалити ${ids.length} постів?`)) return

  await Promise.all(ids.map(id => $fetch(`http://127.0.0.1:8000/api/admin/blog/posts/${id}`, {
    method: 'DELETE'
  })))

  clearSelection()
  await refresh()
}

const postActions = (id: number) => [
  [
    {
      label: 'Редагувати',
      icon: 'i-heroicons-pencil-square',
      to: `/blog-posts/${id}/edit`
    },
    {
      label: 'Видалити',
      icon: 'i-heroicons-trash',
      color: 'error',
      onSelect: () => deletePost(id)
    }
  ]
]

const categoryOptions = computed(() => [
  { label: 'Усі категорії', value: 'all' },
  ...categories.value.map(item => ({
    label: item.title,
    value: String(item.id)
  }))
])
</script>

<template>
  <UContainer class="py-10 max-w-7xl">
    <div class="relative mb-6 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-2xl motion-safe:animate-[fadeUp_.7s_ease_both]">
      <div class="absolute -left-12 top-0 h-36 w-36 rounded-full bg-emerald-500/15 blur-3xl motion-safe:animate-[floaty_10s_ease-in-out_infinite]" />
      <div class="absolute right-0 top-8 h-28 w-28 rounded-full bg-cyan-400/10 blur-3xl motion-safe:animate-[floaty_8s_ease-in-out_infinite]" />

      <div class="relative flex flex-wrap items-end justify-between gap-4">
        <div class="space-y-2">
          <UBadge color="success" variant="soft" class="shadow-sm">
            Blog Posts
          </UBadge>
          <div>
            <h1 class="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Blog Posts
            </h1>
            <p class="max-w-2xl text-sm text-slate-300">
              Таблиця статей з пошуком, фільтром за статусом та категорією, вибором кількості рядків і масовими діями.
            </p>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <UButton
            to="/blog-categories"
            color="neutral"
            variant="soft"
            icon="i-heroicons-squares-2x2"
          >
            Категорії
          </UButton>
          <UButton
            to="/blog-posts/create"
            color="success"
            icon="i-heroicons-plus"
          >
            Додати
          </UButton>
        </div>
      </div>
    </div>

    <UCard class="mb-4 overflow-hidden border border-white/10 bg-white/80 shadow-xl backdrop-blur dark:bg-slate-950/70" :ui="{ body: 'p-4 sm:p-6' }">
      <div class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px_220px_180px_auto]">
        <UInput
          v-model="search"
          icon="i-heroicons-magnifying-glass-20-solid"
          placeholder="Пошук за заголовком, slug, ID, автором або категорією"
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
          v-model="categoryFilter"
          class="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-700 dark:bg-slate-900 dark:text-white"
        >
          <option value="all">Усі категорії</option>
          <option
            v-for="item in categoryOptions"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </option>
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
            :disabled="!filtersActive"
            @click="clearFilters"
          >
            Скинути
          </UButton>

          <UButton
            color="error"
            variant="soft"
            icon="i-heroicons-trash"
            :disabled="selectedCount === 0"
            @click="deleteSelected"
          >
            Видалити вибрані
          </UButton>
        </div>
      </div>
    </UCard>

    <UCard
      class="overflow-hidden border border-white/10 bg-white/85 shadow-2xl backdrop-blur dark:bg-slate-950/70"
      :ui="{ body: 'p-0 sm:p-0', header: 'p-0 sm:p-0' }"
    >
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          Вибрано: {{ selectedCount }} | Показано: {{ paginatedPosts.length }} з {{ filteredPosts.length }} записів
        </div>

        <UBadge color="neutral" variant="soft">
          Сторінка {{ page }} з {{ pageCount }}
        </UBadge>
      </div>

      <UTable
        v-model:row-selection="rowSelection"
        :data="paginatedPosts"
        :columns="columns"
        :loading="pending"
        class="w-full"
        :ui="{ th: 'bg-gray-50/90 dark:bg-slate-900 text-gray-600 font-medium py-3', td: 'align-middle py-3' }"
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

        <template #actions-cell="{ row }">
          <UDropdownMenu :items="postActions(row.original.id)">
            <UButton
              icon="i-heroicons-ellipsis-vertical"
              variant="ghost"
              color="neutral"
            />
          </UDropdownMenu>
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
        Не вдалося завантажити пости.
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
