<script setup lang="ts">
import { storeToRefs } from 'pinia'

interface PlanBilling {
  price: number
  oldPrice: number
  finalPrice: number
  savings: number
  billedText: string
}

interface PricingPlan {
  name: string
  annual: PlanBilling
  monthly: PlanBilling
  features: string[]
  color: string
}

const isAnnual = ref(true)
const subscriptionStore = useSubscriptionStore()
const { selectedSubscription } = storeToRefs(subscriptionStore)

const plans: PricingPlan[] = [
  {
    name: 'Starter',
    annual: {
      price: 83.25,
      oldPrice: 1188,
      finalPrice: 999,
      savings: 189,
      billedText: 'billed yearly at'
    },
    monthly: {
      price: 99,
      oldPrice: 99,
      finalPrice: 99,
      savings: 0,
      billedText: 'billed monthly at'
    },
    features: [
      'Primary user only',
      'Save unlimited properties',
      '10,000 exports',
      '500 free skip traces',
      'Imports $0.01',
      'FREE daily product trainings and support',
      'Full suite of next-gen investing tools',
      'Industry first AI powered comp tool',
      'Includes dedicated support agent'
    ],
    color: 'border-t-cyan-400'
  },
  {
    name: 'Team',
    annual: {
      price: 207.5,
      oldPrice: 2988,
      finalPrice: 2490,
      savings: 498,
      billedText: 'billed yearly at'
    },
    monthly: {
      price: 249,
      oldPrice: 249,
      finalPrice: 249,
      savings: 0,
      billedText: 'billed monthly at'
    },
    features: [
      'Primary user + 2 free team members',
      'Save unlimited properties',
      '50,000 exports',
      '1,000 free skip traces',
      'Imports $0.01',
      'FREE daily product trainings and support',
      'Full suite of next-gen investing tools',
      'Industry first AI powered comp tool',
      'Includes dedicated support agent'
    ],
    color: 'border-t-yellow-400'
  },
  {
    name: 'Business',
    annual: {
      price: 457.5,
      oldPrice: 6588,
      finalPrice: 5490,
      savings: 1098,
      billedText: 'billed yearly at'
    },
    monthly: {
      price: 549,
      oldPrice: 549,
      finalPrice: 549,
      savings: 0,
      billedText: 'billed monthly at'
    },
    features: [
      'Primary user + 6 free team members',
      'Save unlimited properties',
      '10,000 exports',
      '2,000 free skip traces',
      'Imports $0.01',
      'FREE daily product trainings and support',
      'Full suite of next-gen investing tools',
      'Industry first AI powered comp tool',
      'Includes dedicated support agent'
    ],
    color: 'border-t-lime-400'
  }
]

const displayedPlans = computed(() => {
  return plans.map((plan) => {
    const billing = isAnnual.value ? plan.annual : plan.monthly

    return {
      ...plan,
      periodLabel: isAnnual.value ? 'Annual' : 'Monthly',
      ...billing
    }
  })
})

const toStorePrice = (value: number) => value.toFixed(2)

const isPlanSelected = (plan: (typeof displayedPlans.value)[number]) => {
  return selectedSubscription.value?.title === plan.name
    && selectedSubscription.value?.billedText === plan.billedText
}

const handleSelect = async (plan: (typeof displayedPlans.value)[number]) => {
  subscriptionStore.setSubscription({
    title: plan.name,
    monthlyPrice: toStorePrice(plan.price),
    oldBilledPrice: String(plan.oldPrice),
    billedPrice: String(plan.finalPrice),
    savings: String(plan.savings),
    trialLabel: '3-days free then:',
    billedText: plan.billedText,
    features: plan.features.map(text => ({ text }))
  })

  await navigateTo('/checkout')
}
</script>

<template>
  <UContainer class="py-16">
    <div class="text-center mb-12">
      <div class="mb-6 flex justify-center gap-3">
        <UButton
          to="/checkout"
          color="primary"
          icon="i-heroicons-credit-card"
        >
          Checkout
        </UButton>
        <UButton
          to="/table"
          color="neutral"
          variant="soft"
          icon="i-heroicons-table-cells"
        >
          Table
        </UButton>
        <UButton
          to="/store"
          color="neutral"
          variant="outline"
          icon="i-heroicons-user-circle"
        >
          Store Demo
        </UButton>
      </div>
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Start Your 3 Day Free Trial
      </h1>
      <div class="flex justify-center items-center gap-4 mt-8">
        <span class="text-sm text-green-600 font-medium">
          Save up to 20%
        </span>
        <div class="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg flex items-center">
          <UButton
            :variant="isAnnual ? 'solid' : 'ghost'"
            color="neutral"
            size="sm"
            label="Annual"
            @click="isAnnual = true"
          />
          <UButton
            :variant="!isAnnual ? 'solid' : 'ghost'"
            color="neutral"
            size="sm"
            label="Monthly"
            @click="isAnnual = false"
          />
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <UCard
        v-for="plan in displayedPlans"
        :key="plan.name"
        :class="[
          plan.color,
          'relative flex flex-col border-t-4 shadow-xl overflow-visible transition-transform hover:-translate-y-1'
        ]"
      >
        <div class="mb-6">
          <h2 class="text-xl font-bold mb-4">
            {{ plan.name }} - {{ plan.periodLabel }}
          </h2>
          <div class="text-xs text-gray-400 uppercase font-bold mb-2">
            3-days free then:
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-4xl font-black">
              ${{ plan.price }}
            </span>
            <span class="text-gray-500">
              /month
            </span>
          </div>
          <div class="text-sm text-gray-400 mt-2">
            {{ plan.billedText }}
            <span class="line-through">
              ${{ plan.oldPrice }}
            </span>
            <span class="font-bold text-gray-700 dark:text-gray-200">
              ${{ plan.finalPrice }}
            </span>
          </div>
          <UBadge
            v-if="plan.savings > 0"
            color="success"
            variant="subtle"
            class="mt-3 font-bold"
          >
            ${{ plan.savings }} in savings
          </UBadge>
        </div>
        <UButton
          block
          size="lg"
          :color="isPlanSelected(plan) ? 'neutral' : 'warning'"
          :variant="isPlanSelected(plan) ? 'soft' : 'solid'"
          class="font-bold py-3 mb-8"
          @click="handleSelect(plan)"
        >
          {{ isPlanSelected(plan) ? 'Selected' : 'Try It Free' }}
        </UButton>
        <ul class="space-y-3">
          <li
            v-for="feature in plan.features"
            :key="feature"
            class="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400"
          >
            <UIcon
              name="i-heroicons-sparkles-20-solid"
              class="w-5 h-5 text-green-400 shrink-0"
            />
            <span>
              {{ feature }}
            </span>
          </li>
        </ul>
      </UCard>
    </div>
  </UContainer>
</template>

<style scoped>
.relative:hover {
  transform: translateY(-5px);
  transition: transform 0.3s ease;
}
</style>
