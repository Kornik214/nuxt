<script setup lang="ts">
import { storeToRefs } from 'pinia'

useHead({ title: 'Store Example' })

const userStore = useUserStore()
const { name, isLoggedIn, welcomeMessage } = storeToRefs(userStore)

const inputName = ref('')

const handleLogin = () => {
  if (inputName.value.trim()) {
    userStore.login(inputName.value.trim())
    inputName.value = ''
  }
}
</script>

<template>
  <div class="mx-auto max-w-3xl p-8">
    <h1 class="text-3xl font-bold">
      {{ welcomeMessage }}
    </h1>

    <div
      v-if="!isLoggedIn"
      class="mt-4 flex flex-wrap items-center gap-2"
    >
      <UInput
        v-model="inputName"
        placeholder="Enter your name"
        class="min-w-64"
      />
      <UButton @click="handleLogin">
        Login
      </UButton>
    </div>

    <div
      v-else
      class="mt-4 space-y-3"
    >
      <p>
        Logged in as: <strong>{{ name }}</strong>
      </p>
      <p>
        Login time: {{ userStore.loginTime }}
      </p>

      <div class="flex flex-wrap gap-2">
        <UButton
          :loading="userStore.isLoading"
          variant="soft"
          @click="userStore.fetchProfile"
        >
          Load profile (GitHub)
        </UButton>
        <UButton
          color="neutral"
          @click="userStore.logout"
        >
          Logout
        </UButton>
      </div>

      <pre
        v-if="userStore.profileData"
        class="overflow-auto rounded bg-neutral-100 p-3 text-xs"
      >{{ userStore.profileData }}</pre>
    </div>
  </div>
</template>
