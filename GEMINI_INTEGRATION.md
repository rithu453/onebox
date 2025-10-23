# Email Classification & Reply Suggestion with Gemini API

This implementation provides AI-powered email classification and suggested reply generation using Google's Gemini API.

## Features

✅ **Automatic Email Classification** - Classifies emails into 5 categories:
- `Interested` - Sender shows interest in your product/service
- `Not Interested` - Sender explicitly declines or shows no interest
- `Unknown` - Cannot determine intent from content
- `Spam` - Unsolicited marketing or junk
- `Meeting Booked` - Meeting has been scheduled or confirmed

✅ **Confidence Scoring** - Each classification includes a confidence score (0.0 - 1.0)

✅ **Reasoning** - Provides human-readable explanation for the classification

✅ **Suggested Replies** - Generates professional, actionable 1-2 sentence replies

✅ **Deterministic Results** - Uses temperature=0 for consistent classifications

## Setup Instructions

### 1. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
# .env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Important:** Never commit your `.env` file to version control. It's already in `.gitignore`.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

```bash
npm run dev
```

## Usage

### Auto-Classify Feature

1. Select an email from the list
2. Click the **"✨ Auto Classify"** button in the email view
3. The system will automatically:
   - Classify the email into one of 5 categories
   - Show confidence score (0-100%)
   - Display reasoning for the classification

### Suggest Reply Feature

1. Select an email from the list
2. Click **"Suggest Reply"** button
3. View the AI-generated suggested reply
4. Click **"📋 Copy to Clipboard"** to copy the reply

## API Integration Details

### Gemini API Implementation

File: `src/utils/gemini.ts`

**Key Functions:**

```typescript
// Main classification function
async function classifyEmailWithGemini(
  emailBody: string,
  emailDate?: string
): Promise<EmailClassification>

// Get only the suggested reply
async function getSuggestedReply(
  emailBody: string,
  emailDate?: string
): Promise<string>
```

**Response Format:**

```json
{
  "category": "Interested",
  "confidence": 0.93,
  "reasoning": "Sender explicitly expresses interest in partnership and requests a call.",
  "suggested_reply": "Thanks for reaching out. I'm interested in learning more. Are you available for a 30-minute call next week?"
}
```

### API Configuration

- **Model:** `gemini-pro`
- **Temperature:** 0 (deterministic)
- **Max Output Tokens:** 512
- **Safety Settings:** Disabled (to allow business email content)

## System Prompt

The system uses a carefully crafted prompt that enforces:

1. **Strict JSON output** - No extra text or markdown
2. **5 category limit** - Only the specified categories
3. **Confidence range** - Between 0.0 and 1.0
4. **Reasoning** - One-sentence human-readable explanation
5. **Professional replies** - 1-2 sentences, actionable
6. **Spam handling** - Empty reply for spam emails
7. **Character limits** - Max 300 characters per field
8. **No hallucination** - Only use email content provided

## Components Updated

### 1. `CategoryBadge.tsx`
- Updated to use 5 categories (removed "Out of Office")
- Color-coded badges for visual distinction

### 2. `EmailView.tsx`
- Added **Auto Classify** button
- Shows confidence score and reasoning
- Integrated with Gemini API
- Manual category selection still available

### 3. `SuggestedReplyModal.tsx`
- Calls Gemini API for reply suggestions
- Shows loading state
- Copy to clipboard functionality
- Better error handling

## Example Flows

### Example 1: Interested Email

**Input:**
```
Hi, I'm from Acme Corp. We're building an AI platform and want to partner. 
Please let me know if you're interested in a call next week.
```

**Output:**
```json
{
  "category": "Interested",
  "confidence": 0.93,
  "reasoning": "Sender explicitly expresses interest in partnership and requests a call.",
  "suggested_reply": "Thanks for reaching out. I'm interested in learning more. Are you available for a 30-minute call next week? Here is my calendar link: https://cal.com/example"
}
```

### Example 2: Spam Email

**Input:**
```
AMAZING OFFER!!! Buy now and get 90% off! Click here: http://spam-link.com
Limited time only!!!
```

**Output:**
```json
{
  "category": "Spam",
  "confidence": 0.98,
  "reasoning": "Contains typical spam markers: excessive punctuation, unrealistic offers, suspicious links.",
  "suggested_reply": ""
}
```

### Example 3: Meeting Booked

**Input:**
```
Perfect! I've added our meeting to my calendar for Tuesday, March 15th at 2 PM EST.
Looking forward to our discussion.
```

**Output:**
```json
{
  "category": "Meeting Booked",
  "confidence": 0.95,
  "reasoning": "Email confirms a scheduled meeting with specific date and time.",
  "suggested_reply": "Great! I've also added it to my calendar. See you on Tuesday, March 15th at 2 PM EST."
}
```

## Error Handling

The implementation includes robust error handling:

1. **API Key Missing** - Falls back to "Unknown" category with confidence 0.0
2. **Network Errors** - Shows error message to user
3. **Invalid JSON** - Attempts to parse and validate response
4. **Invalid Categories** - Validates against allowed categories
5. **Confidence Range** - Clamps confidence to 0.0-1.0 range

## Performance Considerations

- **Deterministic Results** (temperature=0) ensures same email gets same classification
- **Token Limit** (512) keeps responses concise and fast
- **Client-side API calls** - Direct calls to Gemini from frontend
- **Debounced search** - Already implemented in App.tsx

## Security Notes

⚠️ **Important Security Considerations:**

1. **API Key Exposure** - Current implementation uses client-side API calls
   - For production, move API calls to backend
   - Never expose API keys in frontend code
   - Use environment variables properly

2. **Rate Limiting** - Gemini API has rate limits
   - Implement caching for repeated emails
   - Consider backend proxy for better control

3. **Data Privacy** - Email content is sent to Google's API
   - Ensure compliance with privacy policies
   - Consider on-premise alternatives for sensitive data

## Production Recommendations

For production deployment:

1. **Move API calls to backend** - Create a backend API endpoint that calls Gemini
2. **Add caching** - Cache classifications to avoid redundant API calls
3. **Implement rate limiting** - Protect against abuse
4. **Add authentication** - Secure API endpoints
5. **Monitor costs** - Track Gemini API usage
6. **Add logging** - Log classifications for audit trail
7. **Implement retry logic** - Handle transient failures
8. **Add batch processing** - Classify multiple emails efficiently

## Troubleshooting

### "API key not configured" error
- Check that `.env` file exists
- Verify `VITE_GEMINI_API_KEY` is set correctly
- Restart the dev server after adding environment variables

### Classification returns "Unknown" with 0.0 confidence
- Check browser console for detailed error messages
- Verify API key is valid
- Check internet connectivity
- Verify Gemini API is accessible (not blocked by firewall)

### Response parsing errors
- Check if Gemini API returned valid JSON
- Look for markdown code blocks in response
- Check console logs for raw API response

## API Costs

Google Gemini API pricing (as of 2024):
- **Free tier:** 60 requests per minute
- **Paid tier:** Pay as you go

Estimated costs for 1000 emails/day:
- ~1000 API calls
- ~500K input tokens (avg 500 tokens/email)
- ~100K output tokens (avg 100 tokens/response)
- **Cost:** Minimal (within free tier for most use cases)

## License

This implementation is part of the OneBox email management system.

## Support

For issues or questions:
1. Check browser console for error messages
2. Verify environment configuration
3. Review Gemini API documentation: https://ai.google.dev/docs
4. Open an issue in the repository
