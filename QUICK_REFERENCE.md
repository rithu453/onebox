# Gemini Email Classification - Quick Reference

## API Response Structure

```typescript
interface EmailClassification {
  category: 'Interested' | 'Not Interested' | 'Unknown' | 'Spam' | 'Meeting Booked';
  confidence: number;        // 0.0 to 1.0
  reasoning: string;         // Max 300 chars
  suggested_reply: string;   // Max 300 chars, empty for Spam
}
```

## Categories

| Category | Description | Example |
|----------|-------------|---------|
| **Interested** | Shows interest in product/service/partnership | "I'd love to schedule a call to discuss this" |
| **Not Interested** | Explicitly declines or shows no interest | "Thank you, but we're not interested" |
| **Unknown** | Cannot determine intent | "Let me think about it" |
| **Spam** | Unsolicited marketing or junk | "AMAZING OFFER!!! Click here!!!" |
| **Meeting Booked** | Meeting scheduled or confirmed | "I've added our call to my calendar for Tuesday" |

## Usage Examples

### Basic Classification

```typescript
import { classifyEmailWithGemini } from './utils/gemini';

const result = await classifyEmailWithGemini(
  "Hi, interested in your product. Can we schedule a demo?",
  "2024-01-15"
);

console.log(result);
// {
//   category: "Interested",
//   confidence: 0.92,
//   reasoning: "Sender explicitly requests product demo",
//   suggested_reply: "Thanks for your interest! I'd be happy to schedule a demo..."
// }
```

### Get Only Suggested Reply

```typescript
import { getSuggestedReply } from './utils/gemini';

const reply = await getSuggestedReply(
  "Your email content here",
  "2024-01-15"  // optional
);

console.log(reply);
// "Thanks for reaching out. I'm interested in learning more..."
```

### In React Component

```typescript
import { classifyEmailWithGemini } from '../utils/gemini';

async function handleClassify() {
  try {
    const result = await classifyEmailWithGemini(email.body, email.date);
    setCategory(result.category);
    setConfidence(result.confidence);
    setReasoning(result.reasoning);
  } catch (error) {
    console.error('Classification failed:', error);
  }
}
```

## Expected Response Times

- **Average:** 2-4 seconds
- **Fast:** 1-2 seconds (short emails)
- **Slow:** 5-8 seconds (long emails or high API load)

## Error Handling

```typescript
try {
  const result = await classifyEmailWithGemini(emailBody);
  // Use result
} catch (error) {
  // Fallback to default
  const fallback = {
    category: 'Unknown',
    confidence: 0.0,
    reasoning: 'Failed to classify',
    suggested_reply: ''
  };
}
```

## Common Issues & Solutions

### Issue: "API key not configured"
**Solution:** Set `VITE_GEMINI_API_KEY` in `.env` file and restart dev server

### Issue: Classification returns "Unknown" with 0.0 confidence
**Solution:** Check browser console for detailed error. Verify API key and internet connection.

### Issue: Suggested reply is too generic
**Solution:** Gemini is being conservative. Email content may be ambiguous.

### Issue: Wrong category assigned
**Solution:** 
- Verify email content is clear
- Check confidence score (low confidence = ambiguous email)
- Remember: temperature=0 means deterministic but not perfect

## Rate Limits

Gemini API free tier limits:
- **60 requests per minute**
- **1,500 requests per day**

For higher volumes, upgrade to paid tier.

## Testing

```bash
# Run the demo tests
npm run dev
# Then in browser console:
# > import { testClassifications } from './utils/gemini-demo'
# > await testClassifications()
```

## Prompt Customization

To modify classification behavior, edit the `SYSTEM_PROMPT` in `src/utils/gemini.ts`:

```typescript
const SYSTEM_PROMPT = `You are an assistant that reads a single email...`
```

## Model Configuration

Current settings (in `src/utils/gemini.ts`):

```typescript
{
  temperature: 0,      // Deterministic results
  topK: 1,            // Most likely token
  topP: 1,            // Nucleus sampling disabled
  maxOutputTokens: 512 // Max response length
}
```

## Character Limits

- **Reasoning:** 300 characters max
- **Suggested Reply:** 300 characters max
- **Email Input:** No hard limit, but keep under 2000 chars for best results

## Security Checklist

- [ ] Never commit `.env` file
- [ ] Use backend proxy for production
- [ ] Implement rate limiting
- [ ] Add request caching
- [ ] Log API usage for monitoring
- [ ] Sanitize email content before sending
- [ ] Handle PII appropriately

## Performance Tips

1. **Cache results** - Store classifications to avoid re-classifying same email
2. **Batch requests** - If classifying multiple emails, add delays between requests
3. **Optimize email content** - Send only relevant parts (body, not full headers)
4. **Monitor quota** - Track API usage to avoid hitting limits

## Integration Checklist

- [x] Install dependencies
- [x] Set up `.env` with API key
- [x] Import `classifyEmailWithGemini` function
- [x] Handle loading states
- [x] Handle errors gracefully
- [x] Display results to user
- [x] Test with sample emails
- [ ] Add backend proxy (recommended for production)
- [ ] Implement caching
- [ ] Monitor API usage

## Support Resources

- **Gemini API Docs:** https://ai.google.dev/docs
- **Get API Key:** https://makersuite.google.com/app/apikey
- **Pricing:** https://ai.google.dev/pricing
- **Status Page:** https://status.cloud.google.com/

## Example Outputs

### Interested Email
```json
{
  "category": "Interested",
  "confidence": 0.93,
  "reasoning": "Sender explicitly expresses interest in partnership and requests a call.",
  "suggested_reply": "Thanks for reaching out. I'm interested in learning more. Are you available for a 30-minute call next week?"
}
```

### Spam Email
```json
{
  "category": "Spam",
  "confidence": 0.98,
  "reasoning": "Contains typical spam markers: excessive punctuation, unrealistic offers, suspicious links.",
  "suggested_reply": ""
}
```

### Not Interested Email
```json
{
  "category": "Not Interested",
  "confidence": 0.89,
  "reasoning": "Sender politely declines the opportunity.",
  "suggested_reply": "Thank you for considering our offer. Feel free to reach out if your situation changes."
}
```
