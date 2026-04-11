interface SubscriptionCreatePayload {
  fullName?: string
  address?: string
  cardNumber?: string
  expiry?: string
  cvc?: string
  consent?: boolean
}

export default defineEventHandler(async (event) => {
  const body = await readBody<SubscriptionCreatePayload>(event)

  if (!body?.fullName || !body?.address || !body?.cardNumber || !body?.expiry || !body?.cvc || !body?.consent) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Please fill all required fields and accept consent.'
    })
  }

  return {
    success: true,
    message: 'Subscription trial was created successfully.',
    data: {
      fullName: body.fullName,
      address: body.address
    }
  }
})
