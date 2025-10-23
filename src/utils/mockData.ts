// Mock email data to replace backend calls

export interface MockEmail {
  id: string
  accountId: string
  folder: string
  from: string
  to: string
  subject: string
  body: string
  date: string
  category?: string | null
  suggestedReply?: string
}

// Static filter data
export const accounts = [
  { id: 'acc-1', name: 'work@company.com', email: 'work@company.com' },
  { id: 'acc-2', name: 'personal@email.com', email: 'personal@email.com' },
]

export const folders = [
  { id: 'inbox', name: 'Inbox' },
  { id: 'sent', name: 'Sent' },
  { id: 'drafts', name: 'Drafts' },
  { id: 'spam', name: 'Spam' },
  { id: 'archive', name: 'Archive' },
]

export const mockEmails: MockEmail[] = [
  {
    id: '1',
    accountId: 'acc-1',
    folder: 'inbox',
    from: 'sarah.chen@acmecorp.com',
    to: 'work@company.com',
    subject: 'Partnership Opportunity - AI Platform Integration',
    body: `Hi,

I'm Sarah from Acme Corp. We're building an AI-powered analytics platform and we're looking for potential integration partners.

I came across your product and I think there's a great synergy between our solutions. Would you be interested in scheduling a call next week to discuss a potential partnership?

We've successfully partnered with companies like TechFlow and DataSync, and I believe we could create similar value together.

Looking forward to hearing from you!

Best regards,
Sarah Chen
Head of Partnerships, Acme Corp`,
    date: '2024-10-20T14:30:00Z',
    category: null,
    suggestedReply: 'Thanks for reaching out, Sarah! I\'m interested in learning more about the partnership opportunity. I\'m available for a call next week - Tuesday or Thursday afternoon works best for me. Please share some time slots that work for you.'
  },
  {
    id: '2',
    accountId: 'acc-1',
    folder: 'inbox',
    from: 'deals@superoffers.biz',
    to: 'work@company.com',
    subject: '🎉 AMAZING OFFER!!! LIMITED TIME ONLY!!!',
    body: `CONGRATULATIONS!!! 

You have been selected for an EXCLUSIVE opportunity to make $10,000 per week from home!!!

Click here NOW: http://suspicious-link-123.biz

This offer expires in 24 HOURS!!! Don't miss out on this INCREDIBLE opportunity!!!

ACT NOW before it's too late!!! 

🚀🚀🚀 GUARANTEED RESULTS 🚀🚀🚀`,
    date: '2024-10-21T09:15:00Z',
    category: null,
    suggestedReply: '' // Spam gets empty reply
  },
  {
    id: '3',
    accountId: 'acc-2',
    folder: 'inbox',
    from: 'john.davis@clientcompany.com',
    to: 'personal@email.com',
    subject: 'Re: Demo Request',
    body: `Hi,

Thank you for reaching out about the demo. Unfortunately, we've decided to go with another vendor for our current needs.

We appreciate your time and will keep you in mind for future opportunities.

Best regards,
John Davis`,
    date: '2024-10-19T16:45:00Z',
    category: null,
    suggestedReply: 'Thank you for letting me know, John. I appreciate you taking the time to respond. If your needs change in the future or if you\'d like to explore other solutions, please don\'t hesitate to reach out.'
  },
  {
    id: '4',
    accountId: 'acc-1',
    folder: 'inbox',
    from: 'meeting-scheduler@calendar.com',
    to: 'work@company.com',
    subject: 'Meeting Confirmed: Product Demo - Tuesday 2PM',
    body: `Hi,

This is to confirm our meeting scheduled for:

Date: Tuesday, October 24th, 2024
Time: 2:00 PM - 3:00 PM EST
Location: Zoom (link will be sent 15 minutes before)

I've added this to my calendar and I'm looking forward to seeing the demo of your product.

See you then!

Best,
Michael Rodriguez
VP of Engineering`,
    date: '2024-10-22T10:00:00Z',
    category: null,
    suggestedReply: 'Perfect! I\'ve confirmed the meeting on my calendar as well. Looking forward to our demo session on Tuesday at 2 PM EST. See you then, Michael!'
  },
  {
    id: '5',
    accountId: 'acc-2',
    folder: 'inbox',
    from: 'lisa.wong@startup.io',
    to: 'personal@email.com',
    subject: 'Quick Question',
    body: `Hey,

I saw your recent blog post about API integration best practices. Interesting stuff!

I might have some questions about implementing something similar. Let me think about it and I'll get back to you.

Thanks,
Lisa`,
    date: '2024-10-21T11:20:00Z',
    category: null,
    suggestedReply: 'Thanks for reading, Lisa! Feel free to reach out whenever you have questions - I\'m happy to discuss API integration or any related topics. Looking forward to hearing from you.'
  },
  {
    id: '6',
    accountId: 'acc-1',
    folder: 'spam',
    from: 'promotions@newsletter.com',
    to: 'work@company.com',
    subject: 'You Won\'t Believe These Prices!',
    body: `Dear Valued Customer,

CHECK OUT THESE UNBELIEVABLE DEALS!!!

⭐ 90% OFF Everything!
⭐ Free Shipping Worldwide!
⭐ Buy 1 Get 10 FREE!

Click here to claim your discount: http://sketchy-deals.xyz

Offer valid for next 2 hours only!!! HURRY!!!

Unsubscribe | Privacy Policy | Contact Us`,
    date: '2024-10-20T08:30:00Z',
    category: null,
    suggestedReply: '' // Spam gets empty reply
  },
  {
    id: '7',
    accountId: 'acc-2',
    folder: 'inbox',
    from: 'robert.kim@enterprise.com',
    to: 'personal@email.com',
    subject: 'Enterprise License Inquiry',
    body: `Hello,

We're a team of 50+ developers and we're very interested in your enterprise solution. 

Could you send us:
1. Enterprise pricing details
2. Feature comparison vs. standard plan
3. Available support options
4. Implementation timeline

We're looking to make a decision by end of month. Would it be possible to schedule a call this week to discuss further?

Thanks,
Robert Kim
CTO, Enterprise Solutions Inc.`,
    date: '2024-10-22T13:15:00Z',
    category: null,
    suggestedReply: 'Hi Robert, I\'d be happy to provide all the enterprise details and schedule a call this week. I\'ll send over a comprehensive comparison document within the next hour. Are you available for a call on Thursday or Friday afternoon?'
  },
  {
    id: '8',
    accountId: 'acc-1',
    folder: 'inbox',
    from: 'events@techconf.org',
    to: 'work@company.com',
    subject: 'Speaker Invitation - TechConf 2024',
    body: `Hi there,

We'd love to have you speak at TechConf 2024 in San Francisco (December 5-7).

Your work on AI integration has caught our attention, and we think our audience would greatly benefit from your insights.

The session would be 45 minutes + 15 minutes Q&A. We cover travel and accommodation.

Are you interested? If so, I can send over more details.

Best,
Amanda Foster
Event Coordinator, TechConf`,
    date: '2024-10-18T14:00:00Z',
    category: null,
    suggestedReply: 'Hi Amanda, thank you for the invitation! I\'m very interested in speaking at TechConf 2024. Please send over the details including topic expectations and schedule. I look forward to participating!'
  },
  {
    id: '9',
    accountId: 'acc-2',
    folder: 'inbox',
    from: 'support-request@customer.com',
    to: 'personal@email.com',
    subject: 'Issue with API Integration',
    body: `Hi,

We've been trying to integrate your API for the past few days but we're running into authentication errors.

Error: "Invalid API key" even though we're using the key from our dashboard.

Could you please help us troubleshoot this?

Thanks,
Developer Team`,
    date: '2024-10-21T15:30:00Z',
    category: null,
    suggestedReply: 'I\'m sorry to hear you\'re experiencing authentication issues. Let\'s troubleshoot this right away. Could you please verify you\'re using the latest API key from your dashboard and check if there are any extra spaces? I\'ll also check our system logs on my end.'
  },
  {
    id: '10',
    accountId: 'acc-1',
    folder: 'inbox',
    from: 'calendar@meeting.com',
    to: 'work@company.com',
    subject: 'Meeting Update: Weekly Sync moved to Thursday 3PM',
    body: `Hello,

Just a quick update - our weekly sync meeting has been moved from Wednesday to Thursday at 3PM.

I've updated the calendar invite. Let me know if this time doesn't work for you.

Thanks!
Jessica`,
    date: '2024-10-22T09:00:00Z',
    category: null,
    suggestedReply: 'Thanks for the update, Jessica! Thursday at 3PM works perfectly for me. See you then!'
  },
  {
    id: '11',
    accountId: 'acc-2',
    folder: 'spam',
    from: 'marketing@competitor.com',
    to: 'personal@email.com',
    subject: 'Why Our Product is Better',
    body: `Hi,

We noticed you're in the same industry and wanted to reach out.

Our product offers:
- 10x faster performance
- 50% lower cost
- Better support

Why not give us a try? First month is FREE!

Click here to sign up: http://competitor.com/signup

Best,
Marketing Team`,
    date: '2024-10-19T10:45:00Z',
    category: null,
    suggestedReply: '' // Spam gets empty reply
  },
  {
    id: '12',
    accountId: 'acc-1',
    folder: 'inbox',
    from: 'jane.patterson@bigclient.com',
    to: 'work@company.com',
    subject: 'Thanks for the great service!',
    body: `Hi,

I just wanted to send a quick note to say thank you for the excellent support over the past quarter.

Your team has been incredibly responsive and the product has exceeded our expectations. We're definitely interested in expanding our usage next year.

I'll be in touch in a few weeks to discuss renewal and potential add-ons.

Best regards,
Jane Patterson
Director of Operations`,
    date: '2024-10-20T16:20:00Z',
    category: null,
    suggestedReply: 'Thank you so much for the kind words, Jane! We\'re thrilled that you\'re happy with our service. I look forward to discussing expansion opportunities when you\'re ready. Please reach out anytime!'
  },
  {
    id: '13',
    accountId: 'acc-1',
    folder: 'sent',
    from: 'work@company.com',
    to: 'client@example.com',
    subject: 'Re: Project Proposal',
    body: `Hi,

Thank you for your interest in our services. I've attached the project proposal as requested.

Please review and let me know if you have any questions.

Best regards`,
    date: '2024-10-21T14:00:00Z',
    category: null,
    suggestedReply: 'This is a sent email - no reply needed.'
  },
  {
    id: '14',
    accountId: 'acc-2',
    folder: 'drafts',
    from: 'personal@email.com',
    to: 'friend@email.com',
    subject: 'Draft: Catch up soon',
    body: `Hey,

It's been a while! We should catch up soon.

[Draft - not sent yet]`,
    date: '2024-10-22T11:00:00Z',
    category: null,
    suggestedReply: 'This is a draft - complete and send when ready.'
  },
  {
    id: '15',
    accountId: 'acc-1',
    folder: 'archive',
    from: 'old-client@archive.com',
    to: 'work@company.com',
    subject: 'Project Completion Report',
    body: `Hi,

Attached is the final project completion report from Q2.

All deliverables have been met successfully.

Thanks for the partnership!`,
    date: '2024-06-30T16:00:00Z',
    category: null,
    suggestedReply: 'Thank you for the comprehensive report! It was a pleasure working together on this project. Looking forward to future collaborations.'
  }
]

// Filter emails based on search query and filters
export function filterEmails(
  emails: MockEmail[],
  searchQuery?: string,
  filters?: { folder?: string; account?: string }
): MockEmail[] {
  let filtered = [...emails]

  // Apply folder filter
  if (filters?.folder) {
    filtered = filtered.filter(email => email.folder === filters.folder)
  }

  // Apply account filter
  if (filters?.account) {
    filtered = filtered.filter(email => email.accountId === filters.account)
  }

  // Apply search query
  if (searchQuery && searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase()
    filtered = filtered.filter(email =>
      email.subject.toLowerCase().includes(query) ||
      email.body.toLowerCase().includes(query) ||
      email.from.toLowerCase().includes(query) ||
      email.to.toLowerCase().includes(query)
    )
  }

  return filtered
}

// Get email by ID
export function getEmailById(id: string): MockEmail | undefined {
  return mockEmails.find(email => email.id === id)
}

// Simulate async delay for more realistic UX
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
