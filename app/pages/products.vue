<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { SubscriptionPlan } from '~/stores/useSubscriptionStore'

interface PricingFeature {
  text: string
  extra?: string
}

interface PricingApiPlan {
  title: string
  priceMonthly: string
  oldPriceBilled: string
  currentPriceBilled: string
  savings: string
  features: PricingFeature[]
}

useHead({ title: 'Products' })

const subscriptionStore = useSubscriptionStore()
const { selectedSubscription } = storeToRefs(subscriptionStore)

const { data: plans, pending, error } = await useFetch<PricingApiPlan[]>('/api/pricing')

const selectPlan = async (plan: PricingApiPlan) => {
  const normalizedPlan: SubscriptionPlan = {
    title: plan.title,
    monthlyPrice: plan.priceMonthly,
    oldBilledPrice: plan.oldPriceBilled,
    billedPrice: plan.currentPriceBilled,
    savings: plan.savings,
    trialLabel: '3-days free then:',
    billedText: 'billed yearly at',
    features: plan.features
  }

  subscriptionStore.setSubscription(normalizedPlan)
  await navigateTo('/checkout')
}

const isSelected = (planTitle: string) => {
  return selectedSubscription.value?.title === planTitle
}
</script>

<template>
  <UContainer class="py-12">
    <div class="mb-8 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-3xl font-bold text-neutral-900 dark:text-white">
          Choose Subscription
        </h1>
        <p class="mt-1 text-neutral-600 dark:text-neutral-300">
          Select a plan and continue to checkout.
        </p>
      </div>

      <div class="flex gap-2">
        <UButton
          to="/"
          color="neutral"
          variant="soft"
          icon="i-heroicons-home"
        >
          Home
        </UButton>
        <UButton
          to="/checkout"
          color="primary"
          icon="i-heroicons-credit-card"
        >
          Checkout
        </UButton>
      </div>
    </div>

    <div
      v-if="pending"
      class="py-8 text-neutral-600"
    >
      Loading plans...
    </div>

    <div
      v-else-if="error || !plans"
      class="py-8 text-red-600"
    >
      Failed to load plans.
    </div>

    <div
      v-else
      class="grid grid-cols-1 gap-6 lg:grid-cols-3"
    >
      <UCard
        v-for="plan in plans"
        :key="plan.title"
        class="flex flex-col border-t-4 border-cyan-400 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
      >
        <h2 class="text-2xl font-bold text-neutral-900 dark:text-white">
          {{ plan.title }}
        </h2>

        <p class="mt-4 inline-block rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-600">
          3-days free then:
        </p>

        <div class="mt-3 flex items-end gap-1">
          <span class="text-5xl font-black text-neutral-900 dark:text-white">${{ plan.priceMonthly }}</span>
          <span class="mb-1 text-neutral-500">/month</span>
        </div>

        <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
          billed yearly at <span class="line-through">${{ plan.oldPriceBilled }}</span> ${{ plan.currentPriceBilled }}
        </p>

        <UBadge
          color="success"
          variant="soft"
          class="mt-3"
        >
          ${{ plan.savings }} in savings
        </UBadge>

        <ul class="mt-6 space-y-2 border-t border-neutral-200 pt-4">
          <li
            v-for="feature in plan.features"
            :key="`${plan.title}-${feature.text}`"
            class="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-200"
          >
            <span class="text-green-500">&#9733;</span>
            <span>
              <strong>{{ feature.text }}</strong>
              <span
                v-if="feature.extra"
                class="block text-xs text-neutral-500"
              >
                {{ feature.extra }}
              </span>
            </span>
          </li>
        </ul>

        <UButton
          class="mt-6"
          block
          size="lg"
          :color="isSelected(plan.title) ? 'neutral' : 'primary'"
          :variant="isSelected(plan.title) ? 'soft' : 'solid'"
          @click="selectPlan(plan)"
        >
          {{ isSelected(plan.title) ? 'Selected' : 'Select and Continue' }}
        </UButton>
      </UCard>
    </div>
  </UContainer>
</template>
