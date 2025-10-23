/**
 * Demo script to test Gemini email classification
 * Run this in browser console or use as reference
 */

import { classifyEmailWithGemini } from './gemini';

// Example emails for testing
const testEmails = [
  {
    title: "Interested - Partnership Request",
    body: `Hi, I'm from Acme Corp. We're building an AI platform and want to partner. 
Please let me know if you're interested in a call next week.`,
    date: "2024-01-15"
  },
  {
    title: "Spam - Promotional",
    body: `AMAZING OFFER!!! Buy now and get 90% off! Click here: http://spam-link.com
Limited time only!!! Act now!!!`,
    date: "2024-01-16"
  },
  {
    title: "Meeting Booked",
    body: `Perfect! I've added our meeting to my calendar for Tuesday, March 15th at 2 PM EST.
Looking forward to our discussion.`,
    date: "2024-03-10"
  },
  {
    title: "Not Interested",
    body: `Thank you for reaching out, but we're not interested in this opportunity at the moment.
Best of luck with your product.`,
    date: "2024-01-14"
  },
  {
    title: "Unknown - Ambiguous",
    body: `Hi there, I received your message. Let me think about it and get back to you.`,
    date: "2024-01-17"
  }
];

/**
 * Test the classification for all sample emails
 */
async function testClassifications() {
  console.log('=== Testing Gemini Email Classification ===\n');
  
  for (const email of testEmails) {
    console.log(`\n📧 Testing: ${email.title}`);
    console.log(`Email: ${email.body.substring(0, 60)}...`);
    console.log('---');
    
    try {
      const result = await classifyEmailWithGemini(email.body, email.date);
      
      console.log(`✅ Category: ${result.category}`);
      console.log(`📊 Confidence: ${(result.confidence * 100).toFixed(1)}%`);
      console.log(`💭 Reasoning: ${result.reasoning}`);
      console.log(`💬 Suggested Reply: ${result.suggested_reply || '(none - spam)'}`);
      console.log('---');
      
      // Verify expected category
      const expectedCategory = email.title.split(' - ')[0];
      if (result.category === expectedCategory) {
        console.log('✅ Classification matches expected category!');
      } else {
        console.log(`⚠️ Expected ${expectedCategory}, got ${result.category}`);
      }
      
    } catch (error) {
      console.error(`❌ Error: ${error}`);
    }
    
    // Add delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n\n=== Testing Complete ===');
}

/**
 * Test a single custom email
 */
async function testSingleEmail(emailBody: string, emailDate?: string) {
  console.log('=== Testing Single Email ===\n');
  console.log(`Email: ${emailBody}\n`);
  
  try {
    const result = await classifyEmailWithGemini(emailBody, emailDate);
    
    console.log('Result:');
    console.log(JSON.stringify(result, null, 2));
    
    return result;
  } catch (error) {
    console.error(`Error: ${error}`);
    throw error;
  }
}

/**
 * Validate JSON structure
 */
function validateClassification(result: any): boolean {
  const requiredKeys = ['category', 'confidence', 'reasoning', 'suggested_reply'];
  const validCategories = ['Interested', 'Not Interested', 'Unknown', 'Spam', 'Meeting Booked'];
  
  // Check all required keys exist
  for (const key of requiredKeys) {
    if (!(key in result)) {
      console.error(`❌ Missing required key: ${key}`);
      return false;
    }
  }
  
  // Validate category
  if (!validCategories.includes(result.category)) {
    console.error(`❌ Invalid category: ${result.category}`);
    return false;
  }
  
  // Validate confidence range
  if (typeof result.confidence !== 'number' || result.confidence < 0 || result.confidence > 1) {
    console.error(`❌ Invalid confidence: ${result.confidence}`);
    return false;
  }
  
  // Validate string fields
  if (typeof result.reasoning !== 'string' || result.reasoning.length === 0) {
    console.error(`❌ Invalid reasoning`);
    return false;
  }
  
  if (typeof result.suggested_reply !== 'string') {
    console.error(`❌ Invalid suggested_reply`);
    return false;
  }
  
  // Validate character limits
  if (result.reasoning.length > 300) {
    console.error(`⚠️ Reasoning exceeds 300 characters: ${result.reasoning.length}`);
  }
  
  if (result.suggested_reply.length > 300) {
    console.error(`⚠️ Suggested reply exceeds 300 characters: ${result.suggested_reply.length}`);
  }
  
  // Validate spam has empty reply
  if (result.category === 'Spam' && result.suggested_reply !== '') {
    console.error(`❌ Spam email should have empty suggested_reply`);
    return false;
  }
  
  console.log('✅ All validation checks passed!');
  return true;
}

// Export for use in browser console or tests
export {
  testClassifications,
  testSingleEmail,
  validateClassification,
  testEmails
};

// Example usage in browser console:
// import { testClassifications, testSingleEmail } from './demo'
// await testClassifications()
// await testSingleEmail("Your custom email here")
