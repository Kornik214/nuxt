<script setup lang="ts">
const isAnnual = ref(true)
const selectedPlan = ref<string | null>(null)
const plans = [
  {
    name: 'Starter',
    price: 83.25,
    oldPrice: 1188,
    finalPrice: 999,
    savings: 189,
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
    price: 207.50,
    oldPrice: 2988,
    finalPrice: 2490,
    savings: 498,
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
    price: 457.50,
    oldPrice: 6588,
    finalPrice: 5490,
    savings: 1098,
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

const handleSelect = (planName: string) => {
  selectedPlan.value = planName
}
</script>

<template>
  <UContainer class="py-16">
    <div class="text-center mb-12">
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
        v-for="plan in plans"
        :key="plan.name"
        :class="[
          plan.color,
          'relative flex flex-col border-t-4 shadow-xl overflow-visible transition-transform hover:-translate-y-1'
        ]"
      >
        <div class="mb-6">
          <h2 class="text-xl font-bold mb-4">
            {{ plan.name }} - Annual
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
            billed yearly at
            <span class="line-through">
              ${{ plan.oldPrice }}
            </span>
            <span class="font-bold text-gray-700 dark:text-gray-200">
              ${{ plan.finalPrice }}
            </span>
          </div>

          <UBadge
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
          :color="selectedPlan === plan.name ? 'neutral' : 'warning'"
          :variant="selectedPlan === plan.name ? 'soft' : 'solid'"
          class="font-bold py-3 mb-8"
          @click="handleSelect(plan.name)"
        >
          {{ selectedPlan === plan.name ? 'Selected' : 'Try It Free' }}
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
