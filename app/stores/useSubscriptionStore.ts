import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface SubscriptionFeature {
  text: string
  extra?: string
}

export interface SubscriptionPlan {
  title: string
  monthlyPrice: string
  oldBilledPrice: string
  billedPrice: string
  savings: string
  trialLabel?: string
  billedText?: string
  features: SubscriptionFeature[]
}

export const useSubscriptionStore = defineStore('subscription', () => {
  const selectedSubscription = ref<SubscriptionPlan | null>(null)

  const hasSelectedSubscription = computed(() => !!selectedSubscription.value)

  function setSubscription(plan: SubscriptionPlan) {
    selectedSubscription.value = plan
  }

  function clearSubscription() {
    selectedSubscription.value = null
  }

  return {
    selectedSubscription,
    hasSelectedSubscription,
    setSubscription,
    clearSubscription
  }
})
