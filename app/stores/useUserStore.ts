import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const name = ref('Guest')
  const isLoggedIn = ref(false)
  const loginTime = ref<string | null>(null)

  const welcomeMessage = computed(() => `Welcome, ${name.value}!`)

  const profileData = ref<unknown>(null)
  const isLoading = ref(false)

  function login(userName: string) {
    name.value = userName
    isLoggedIn.value = true
    loginTime.value = new Date().toLocaleTimeString()
  }

  function logout() {
    name.value = 'Guest'
    isLoggedIn.value = false
    loginTime.value = null
    profileData.value = null
  }

  async function fetchProfile() {
    isLoading.value = true

    try {
      const response = await $fetch('https://api.github.com/users/octocat')
      profileData.value = response
    } finally {
      isLoading.value = false
    }
  }

  return {
    name,
    isLoggedIn,
    loginTime,
    welcomeMessage,
    profileData,
    isLoading,
    login,
    logout,
    fetchProfile
  }
})
