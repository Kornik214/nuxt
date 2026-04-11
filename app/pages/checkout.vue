<script setup lang="ts">
interface CheckoutFeature {
  text: string
  extra?: string
}

interface CheckoutResponse {
  pageTitle: string
  heading: string
  subheading: string
  plan: {
    title: string
    trialLabel: string
    monthlyPrice: string
    billedText: string
    oldBilledPrice: string
    billedPrice: string
    savings: string
    features: CheckoutFeature[]
  }
  summary: {
    planLabel: string
    annualPrice: string
    totalDueLabel: string
    dueToday: string
    trialNotice: string
  }
  consentText: string
}

const { data, pending, error } = await useFetch<CheckoutResponse>('/api/subscription/checkout')

const pageTitle = computed(() => data.value?.pageTitle || 'Checkout')

useHead(() => ({
  title: pageTitle.value
}))

const form = reactive({
  cardNumber: '',
  expiry: '',
  cvc: '',
  fullName: '',
  address: '',
  consent: false
})

const submitError = ref('')
const submitSuccess = ref('')
const isSubmitting = ref(false)

const getReadableError = (err: unknown) => {
  const maybeError = err as {
    data?: { statusMessage?: string }
    statusMessage?: string
    message?: string
  }

  return maybeError?.data?.statusMessage
    || maybeError?.statusMessage
    || maybeError?.message
    || 'Failed to submit subscription form.'
}

const submitForm = async () => {
  submitError.value = ''
  submitSuccess.value = ''

  if (!form.cardNumber || !form.expiry || !form.cvc || !form.fullName || !form.address) {
    submitError.value = 'Please fill in all billing fields.'
    return
  }

  if (!form.consent) {
    submitError.value = 'Please accept the terms before continuing.'
    return
  }

  isSubmitting.value = true

  try {
    const response = await $fetch<{ message: string }>('/api/subscription/create', {
      method: 'POST',
      body: form
    })

    submitSuccess.value = response.message
  } catch (err: unknown) {
    submitError.value = getReadableError(err)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#f3f4f6]">
    <header class="bg-gradient-to-r from-[#3f3f46] to-[#27272a] py-4 text-center text-xl font-semibold text-white">
      {{ pageTitle }}
    </header>

    <UContainer class="mx-auto max-w-6xl py-8">
      <NuxtLink
        to="/"
        class="inline-block text-sm text-neutral-500 transition-colors hover:text-neutral-800"
      >
        &lt;&lt; back
      </NuxtLink>

      <div
        v-if="pending"
        class="mt-6"
      >
        Loading...
      </div>

      <div
        v-else-if="error || !data"
        class="mt-6 text-red-600"
      >
        Failed to load checkout data.
      </div>

      <template v-else>
        <h1 class="mt-5 text-4xl font-extrabold text-neutral-900 md:text-5xl">
          {{ data.heading }}
        </h1>
        <p class="mt-2 text-xl text-neutral-700 md:text-2xl">
          {{ data.subheading }}
        </p>

        <div class="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-12">
          <UCard class="checkout-card lg:max-w-none xl:col-span-4 border-t-[3px] border-cyan-400">
            <h2 class="text-3xl font-bold text-neutral-900">
              {{ data.plan.title }}
            </h2>

            <p class="mt-4 inline-block rounded bg-neutral-200 px-2 py-1 text-xs text-neutral-600">
              {{ data.plan.trialLabel }}
            </p>

            <div class="mt-3 flex items-end gap-1">
              <span class="text-5xl font-extrabold leading-none text-neutral-900">${{ data.plan.monthlyPrice }}</span>
              <span class="mb-1 text-base text-neutral-500">/month</span>
            </div>

            <p class="mt-2 text-base text-neutral-600">
              {{ data.plan.billedText }}
              <span class="line-through">${{ data.plan.oldBilledPrice }}</span>
              ${{ data.plan.billedPrice }}
            </p>

            <UBadge
              color="success"
              variant="soft"
              class="mt-4 text-sm"
            >
              ${{ data.plan.savings }} in savings
            </UBadge>

            <ul class="mt-6 space-y-2 border-t border-neutral-200 pt-5">
              <li
                v-for="feature in data.plan.features"
                :key="feature.text"
                class="feature-item flex gap-2 rounded-md px-1 py-1 text-base text-neutral-700"
              >
                <span class="mt-0.5 text-green-500">&#9733;</span>
                <span>
                  <strong>{{ feature.text }}</strong>
                  <span
                    v-if="feature.extra"
                    class="block text-sm text-neutral-500"
                  >
                    {{ feature.extra }}
                  </span>
                </span>
              </li>
            </ul>
          </UCard>

          <UCard class="checkout-card lg:max-w-none xl:col-span-8">
            <h2 class="text-3xl font-bold text-neutral-900">
              Order Summary
            </h2>

            <div class="mt-5 space-y-2 text-base text-neutral-700">
              <div class="flex items-center justify-between">
                <span>{{ data.summary.planLabel }}</span>
                <span>{{ data.summary.annualPrice }}</span>
              </div>
              <div class="flex items-start justify-between gap-3">
                <span class="max-w-[75%] text-sm">{{ data.summary.totalDueLabel }}</span>
                <span>{{ data.summary.annualPrice }}</span>
              </div>
              <div class="flex justify-between border-t border-neutral-200 pt-2 font-bold text-neutral-900">
                <span>Due Today</span>
                <span>{{ data.summary.dueToday }}</span>
              </div>
            </div>

            <div class="mt-4 bg-neutral-100 px-4 py-3 text-center text-base text-neutral-700">
              {{ data.summary.trialNotice }}
            </div>

            <h3 class="mt-6 text-3xl font-semibold text-neutral-900">
              Billing Information
            </h3>

            <form
              class="mt-4 space-y-4"
              @submit.prevent="submitForm"
            >
              <p class="text-sm text-neutral-700">
                Card Details
              </p>
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <UInput
                  v-model="form.cardNumber"
                  placeholder="Number"
                  class="w-full"
                  required
                />
                <UInput
                  v-model="form.expiry"
                  placeholder="MM / YY"
                  class="w-full"
                  required
                />
                <UInput
                  v-model="form.cvc"
                  placeholder="CVC"
                  class="w-full"
                  required
                />
              </div>

              <p class="pt-1 text-sm text-neutral-700">
                Address
              </p>
              <UInput
                v-model="form.fullName"
                placeholder="Full name"
                class="w-full"
                required
              />

              <UTextarea
                v-model="form.address"
                placeholder="Address"
                :rows="3"
                class="w-full"
                required
              />

              <UCheckbox
                v-model="form.consent"
                :label="data.consentText"
                class="text-sm text-neutral-700"
              />

              <p
                v-if="submitError"
                class="text-red-600"
              >
                {{ submitError }}
              </p>

              <p
                v-if="submitSuccess"
                class="text-green-700"
              >
                {{ submitSuccess }}
              </p>

              <UButton
                type="submit"
                color="neutral"
                size="lg"
                :loading="isSubmitting"
              >
                Try It Free
              </UButton>
            </form>
          </UCard>
        </div>
      </template>
    </UContainer>
  </div>
</template>

<style scoped>
.checkout-card {
  border: 1px solid #d4d4d8;
  background: #fff;
  box-shadow: 0 6px 16px rgb(15 23 42 / 6%);
  transition: box-shadow 0.25s ease, transform 0.25s ease, border-color 0.25s ease;
}

.checkout-card:hover {
  transform: translateY(-2px);
  border-color: #06b6d4;
  box-shadow: 0 10px 28px rgb(6 182 212 / 18%);
}

.feature-item {
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.feature-item:hover {
  background: #f0fdfa;
  box-shadow: inset 0 0 0 1px #67e8f9;
}
</style>
