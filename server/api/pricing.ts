export default defineEventHandler(() => {
  return [
    {
      title: 'Starter - Annual',
      priceMonthly: '83.25',
      oldPriceBilled: '1,188',
      currentPriceBilled: '999',
      savings: '189',
      iconColor: 'blue-500',
      features: [
        { text: 'Primary user only', extra: '(extra team members for $35/month)' },
        { text: 'Save unlimited properties' },
        { text: '10,000 exports', extra: '(additional exports at $0.02 each)' },
        { text: '500 free skip traces', extra: '(additional skip tracing at $0.08 each)' },
        { text: 'Imports $0.01' },
        { text: 'FREE daily product trainings and support' }
      ]
    },
    {
      title: 'Team - Annual',
      priceMonthly: '207.50',
      oldPriceBilled: '2,988',
      currentPriceBilled: '2,490',
      savings: '498',
      iconColor: 'cyan-400',
      features: [
        { text: 'Primary user + 2 free team members', extra: '(extra team members for $25/month)' },
        { text: 'Save unlimited properties' },
        { text: '50,000 exports', extra: '(additional exports at $0.01 each)' },
        { text: '1,000 free skip traces', extra: '(additional skip tracing at $0.08 each)' },
        { text: 'Imports $0.01' },
        { text: 'FREE daily product trainings and support' }
      ]
    },
    {
      title: 'Business - Annual',
      priceMonthly: '457.50',
      oldPriceBilled: '6,588',
      currentPriceBilled: '5,490',
      savings: '1,098',
      iconColor: 'green-500',
      features: [
        { text: 'Primary user + 6 free team members', extra: '(extra team members for $20/month)' },
        { text: 'Save unlimited properties' },
        { text: '100,000 exports', extra: '(additional exports at $0.01 each)' },
        { text: '2,000 free skip traces', extra: '(additional skip tracing at $0.08 each)' },
        { text: 'Imports $0.01' },
        { text: 'FREE daily product trainings and support' }
      ]
    }
  ]
})
