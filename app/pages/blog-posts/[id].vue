<script setup lang="ts">
interface BlogUser {
  id: number
  name: string
}

interface BlogCategory {
  id: number
  title: string
  parent_title?: string | null
}

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content_raw: string | null
  published_at: string | null
  date_published?: string | null
  is_published?: boolean | number
  user_id?: number
  category_id?: number
  user?: BlogUser
  category?: BlogCategory
}

const route = useRoute()

useHead({
  title: 'Blog Post'
})

const apiUrl = computed(() => `http://127.0.0.1:8000/api/blog/posts/${route.params.id}`)

const { data, pending, error } = useLazyFetch<BlogPost>(apiUrl)

const post = computed(() => data.value)

const publishedDate = computed(() => post.value?.date_published || post.value?.published_at || '—')
const authorLabel = computed(() => post.value?.user?.name || (post.value?.user_id ? `Користувач #${post.value.user_id}` : '—'))
const categoryLabel = computed(() => post.value?.category?.title || (post.value?.category_id ? `Категорія #${post.value.category_id}` : '—'))
const isPublished = computed(() => Boolean(post.value?.is_published))
</script>

<template>
  <!-- cspell:ignore heroicons -->
  <UContainer class="py-10 max-w-4xl">
    <!-- Breadcrumb -->
    <nav class="bc-row">
      <NuxtLink to="/" class="bc-link">
        <UIcon name="i-heroicons-home" class="bc-icon" />
        Головна
      </NuxtLink>
      <span class="bc-sep">/</span>
      <NuxtLink to="/blog-posts" class="bc-link">Статті блогу</NuxtLink>
      <span class="bc-sep">/</span>
      <span class="bc-cur">{{ post?.title ?? 'Стаття' }}</span>
    </nav>

    <!-- Back button row -->
    <div class="top-row">
      <UButton
        to="/blog-posts"
        color="neutral"
        variant="ghost"
        icon="i-heroicons-arrow-left"
        size="sm"
      >
        До списку статей
      </UButton>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="state-card">
      <div class="skeleton-title" />
      <div class="skeleton-meta" />
      <div class="skeleton-body" />
    </div>

    <!-- Error -->
    <div v-else-if="error || !post" class="error-card">
      <UIcon name="i-heroicons-exclamation-circle" class="error-icon" />
      <div>
        <div class="error-title">Не вдалося завантажити статтю</div>
        <p class="error-body">Перевірте підключення або поверніться до списку статей.</p>
      </div>
    </div>

    <!-- Post -->
    <article v-else class="post-card">
      <!-- Header -->
      <header class="post-header">
        <div class="post-badges">
          <span class="badge-cat">{{ categoryLabel }}</span>
          <span :class="['badge-status', isPublished ? 'badge-pub' : 'badge-draft']">
            {{ isPublished ? 'Опубліковано' : 'Чернетка' }}
          </span>
        </div>

        <h1 class="post-title">{{ post.title }}</h1>

        <div class="post-meta">
          <span class="meta-item">
            <UIcon name="i-heroicons-user" class="meta-icon" />
            {{ authorLabel }}
          </span>
          <span class="meta-dot">·</span>
          <span class="meta-item">
            <UIcon name="i-heroicons-calendar" class="meta-icon" />
            {{ publishedDate }}
          </span>
          <span class="meta-dot">·</span>
          <span class="meta-item mono">
            /{{ post.slug }}
          </span>
        </div>
      </header>

      <!-- Excerpt -->
      <div v-if="post.excerpt" class="post-excerpt">
        <div class="excerpt-bar" />
        <p>{{ post.excerpt }}</p>
      </div>

      <!-- Content -->
      <div class="post-content">
        <p>{{ post.content_raw }}</p>
      </div>
    </article>
  </UContainer>
</template>

<style scoped>
/* ─── Breadcrumb ─────────────────────────────────── */
.bc-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
  font-size: 12px;
  color: #94a3b8;
}
.bc-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #94a3b8;
  text-decoration: none;
  transition: color .15s;
}
.bc-link:hover { color: #e2e8f0; }
.bc-icon { width: 13px; height: 13px; }
.bc-sep { color: #334155; }
.bc-cur {
  color: #cbd5e1;
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ─── Top row ─────────────────────────────────────── */
.top-row { margin-bottom: 24px; }

/* ─── Loading skeletons ───────────────────────────── */
.state-card {
  border: 1px solid #1e293b;
  border-radius: 20px;
  background: #0f172a;
  padding: 40px;
  display: grid;
  gap: 14px;
}
.skeleton-title {
  height: 28px;
  width: 60%;
  border-radius: 8px;
  background: #1e293b;
  animation: pulse 1.4s ease-in-out infinite;
}
.skeleton-meta {
  height: 14px;
  width: 40%;
  border-radius: 6px;
  background: #1e293b;
  animation: pulse 1.4s ease-in-out infinite .1s;
}
.skeleton-body {
  height: 180px;
  border-radius: 12px;
  background: #1e293b;
  animation: pulse 1.4s ease-in-out infinite .2s;
  margin-top: 10px;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .45; }
}

/* ─── Error card ─────────────────────────────────── */
.error-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  border: 1px solid #7f1d1d;
  border-radius: 16px;
  background: #1a0a0a;
  padding: 24px;
}
.error-icon {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  color: #f87171;
  margin-top: 1px;
}
.error-title {
  font-size: 15px;
  font-weight: 600;
  color: #fca5a5;
  margin-bottom: 4px;
}
.error-body { margin: 0; font-size: 13px; color: #7f6060; }

/* ─── Post card ──────────────────────────────────── */
.post-card {
  border: 1px solid #1e293b;
  border-radius: 20px;
  background: #0f172a;
  overflow: hidden;
}

/* ─── Post header ────────────────────────────────── */
.post-header {
  padding: 36px 40px 28px;
  border-bottom: 1px solid #1e293b;
  display: grid;
  gap: 14px;
}

.post-badges {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.badge-cat {
  font-size: 11.5px;
  font-weight: 500;
  background: rgba(34,197,94,.12);
  color: #22c55e;
  border: 1px solid rgba(34,197,94,.2);
  padding: 3px 10px;
  border-radius: 999px;
}

.badge-status {
  font-size: 11.5px;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 999px;
}
.badge-pub {
  background: rgba(56,189,248,.1);
  color: #38bdf8;
  border: 1px solid rgba(56,189,248,.2);
}
.badge-draft {
  background: #1e293b;
  color: #94a3b8;
  border: 1px solid #334155;
}

.post-title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #f1f5f9;
  line-height: 1.25;
  letter-spacing: -.02em;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  color: #64748b;
}
.meta-icon { width: 13px; height: 13px; }
.meta-dot { color: #334155; }
.mono { font-family: ui-monospace, monospace; font-size: 12px; color: #475569; }

/* ─── Excerpt ────────────────────────────────────── */
.post-excerpt {
  display: flex;
  gap: 16px;
  padding: 24px 40px;
  border-bottom: 1px solid #1e293b;
  background: #0a1628;
}
.excerpt-bar {
  flex-shrink: 0;
  width: 3px;
  border-radius: 2px;
  background: #22c55e;
}
.post-excerpt p {
  margin: 0;
  font-size: 14px;
  color: #94a3b8;
  line-height: 1.7;
  font-style: italic;
}

/* ─── Content ────────────────────────────────────── */
.post-content {
  padding: 32px 40px;
  font-size: 15px;
  color: #cbd5e1;
  line-height: 1.8;
}
.post-content p { margin: 0; }

/* ─── Responsive ─────────────────────────────────── */
@media (max-width: 640px) {
  .post-header,
  .post-excerpt,
  .post-content { padding-left: 22px; padding-right: 22px; }
  .post-title { font-size: 22px; }
}
</style>
