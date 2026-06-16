export default defineEventHandler(async () => {
  const response = await $fetch('https://dummyjson.com/products?limit=100')
  return response
})
