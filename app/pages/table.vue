<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { Column } from '@tanstack/vue-table'

useHead({ title: 'Таблиця' })

interface Product {
  id?: number
  title?: string
  description?: string
  price?: number
  rating?: number
  brand?: string
  category?: string
  thumbnail?: string
  [key: string]: unknown
}

const { data, pending } = await useFetch<{ products: Product[] }>('/api/products')

const products = computed(() => {
  return data.value?.products || []
})

const UButton = resolveComponent('UButton')

const sortableHeader = (label: string) => {
  return ({ column }: { column: Column<Product, unknown> }) => {
    const isSorted = column.getIsSorted()

    return h(UButton, {
      color: 'neutral',
      variant: 'ghost',
      label: label,
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
  { accessorKey: 'thumbnail', header: 'Фото' }, // Фото сортувати не треба
  { accessorKey: 'title', header: sortableHeader('Назва') },
  { accessorKey: 'description', header: sortableHeader('Опис') },
  { accessorKey: 'price', header: sortableHeader('Ціна') },
  { accessorKey: 'rating', header: sortableHeader('Оцінка') },
  { accessorKey: 'brand', header: sortableHeader('Бренд') },
  { accessorKey: 'category', header: sortableHeader('Категорія') }
]

const q = ref('')
const page = ref(1)
const pageCount = ref(5)

const rowSelection = ref<Record<string, boolean>>({})

const sorting = ref([{ id: 'title', desc: false }])

const filteredRows = computed(() => {
  const items = products.value
  if (!q.value) return items

  const searchQuery = String(q.value).toLowerCase()

  return items.filter((product) => {
    return Object.values(product).some((value) => {
      return value && String(value).toLowerCase().includes(searchQuery)
    })
  })
})

const sortedRows = computed(() => {
  const sortRule = sorting.value[0]

  if (!sortRule) return filteredRows.value

  const { id: column, desc } = sortRule

  return [...filteredRows.value].sort((a, b) => {
    const aValue = a[column as keyof Product]
    const bValue = b[column as keyof Product]

    if (aValue === bValue) return 0
    if (aValue == null) return 1
    if (bValue == null) return -1

    return desc
      ? (aValue < bValue ? 1 : -1)
      : (aValue > bValue ? 1 : -1)
  })
})

const paginatedRows = computed(() => {
  const start = (page.value - 1) * pageCount.value
  const end = page.value * pageCount.value
  return sortedRows.value.slice(start, end)
})

watch(q, () => {
  page.value = 1
})
</script>

<template>
  <UContainer class="py-10 max-w-7xl">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">
        Таблиця
      </h1>
      <UButton
        to="/"
        color="neutral"
        variant="ghost"
        icon="i-heroicons-arrow-left"
      >
        На головну
      </UButton>
    </div>

    <div class="flex justify-between items-end mb-4">
      <div class="text-sm text-gray-500 font-medium">
        {{ Object.keys(rowSelection).length }} selected
      </div>
      <div class="w-72">
        <UInput
          v-model="q"
          placeholder="Пошук..."
          icon="i-heroicons-magnifying-glass-20-solid"
        />
      </div>
    </div>

    <UCard
      class="p-0 overflow-hidden shadow-sm ring-1 ring-gray-200 dark:ring-gray-800"
      :ui="{ body: 'p-0 sm:p-0', header: 'p-0 sm:p-0' }"
    >
      <UTable
        v-model:row-selection="rowSelection"
        v-model:sorting="sorting"
        :data="paginatedRows"
        :columns="columns"
        :loading="pending"
        class="w-full"
        :ui="{ th: 'bg-gray-50 dark:bg-gray-900 text-gray-600 font-medium py-3 cursor-pointer', td: 'align-middle py-3' }"
      >
        <template #thumbnail-cell="{ row }">
          <img
            v-if="row.original?.thumbnail"
            :src="row.original.thumbnail"
            :alt="row.original.title"
            class="w-25 h-25 object-cover rounded shadow-sm border border-gray-100"
          >
        </template>

        <template #rating-cell="{ row }">
          <span :class="(row.original?.rating || 0) < 4.5 ? 'text-red-500 font-bold' : 'text-green-500 font-bold'">
            {{ row.original?.rating }}
          </span>
        </template>

        <template #price-cell="{ row }">
          <span class="font-medium">
            ${{ row.original?.price }}
          </span>
        </template>

        <template #description-cell="{ row }">
          <div
            class="max-w-62.5 truncate"
            :title="row.original?.description"
          >
            {{ row.original?.description }}
          </div>
        </template>
      </UTable>

      <div class="flex justify-between items-center px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <span>Show</span>
          <USelect
            v-model.number="pageCount"
            :options="[5, 10, 20, 50]"
            class="w-20"
            size="sm"
          />
          <span>of {{ filteredRows.length }} results</span>
        </div>

        <UPagination
          v-model:page="page"
          :items-per-page="pageCount"
          :total="filteredRows.length"
          :active-button="{ variant: 'outline', color: 'success' }"
        />
      </div>
    </UCard>
  </UContainer>
</template>
