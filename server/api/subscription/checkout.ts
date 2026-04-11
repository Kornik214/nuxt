interface PlanFeature {
  text: string
  extra?: string
}

interface CheckoutData {
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
    features: PlanFeature[]
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

export default defineEventHandler<CheckoutData>(() => {
  return {
    pageTitle: 'Checkout',
    heading: 'You\'re Almost In - Start Your 3-Day Free Trial Now!',
    subheading: 'Set up your account to gain instant access! You won\'t be charged if you decide to cancel within 3 days',
    plan: {
      title: 'Team - Annual',
      trialLabel: '3-days free then:',
      monthlyPrice: '207.50',
      billedText: 'billed yearly at',
      oldBilledPrice: '2,988',
      billedPrice: '2,490',
      savings: '498',
      features: [
        { text: 'Primary user + 2 free team members', extra: '(extra team members for $25/month)' },
        { text: 'Save unlimited properties' },
        { text: '50,000 exports', extra: '(additional exports at $0.01 each)' },
        { text: '1,000 free skip traces', extra: '(additional skip tracing at $0.08 each)' },
        { text: 'Imports $0.01' },
        { text: 'FREE daily product trainings and support' },
        { text: 'Full suite of next-gen investing tools' },
        { text: 'Industry first AI powered comp tool' },
        { text: 'Includes dedicated support agent' }
      ]
    },
    summary: {
      planLabel: 'Annual Plan',
      annualPrice: '$2490.00',
      totalDueLabel: 'Total Due (not including sales tax where applicable)',
      dueToday: '$0.00',
      trialNotice: 'Includes 3-Day Free Trial'
    },
    consentText: 'I consent to Terms of Use and understand my 3-day free trial will automatically convert to $2,490.00 per year starting on 04/02/2026. The yearly fee will be automatically charged each year going forward unless I cancel my account at least one (1) business day before the end of the current billing period, which can be done by calling (888) 463-3163.'
  }
})
