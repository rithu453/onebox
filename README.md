# 📧 Email Management System with AI Classification

A modern email management application with AI-powered classification and reply suggestions using Google's Gemini API.

## ✨ Features

- 🤖 **AI Email Classification** - Automatically categorizes emails into 5 types
- 💬 **Smart Reply Suggestions** - Generates professional, actionable replies
- 📊 **Confidence Scoring** - Shows classification confidence (0-100%)
- 🎯 **Reasoning Display** - Explains why each email was categorized
- 🔍 **Email Search** - Search and filter emails
- 📁 **Category Management** - Manual or automatic categorization

## 🎯 Email Categories

1. **Interested** - Sender shows interest in product/service
2. **Not Interested** - Sender declines or shows no interest
3. **Unknown** - Cannot determine intent
4. **Spam** - Unsolicited marketing or junk
5. **Meeting Booked** - Meeting scheduled or confirmed

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.17.0
- npm >= 9.0.0
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Harshavardhan-student/onebox-assignment.git
cd email

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and add your Gemini API key:
# VITE_GEMINI_API_KEY=your_api_key_here

# 4. Start development server
npm run dev
```

### Usage

1. **View Emails** - Select an email from the list
2. **Auto-Classify** - Click "✨ Auto Classify" button
3. **Get Reply** - Click "Suggest Reply" button
4. **Copy Reply** - Click "📋 Copy to Clipboard"

## 📁 Project Structure

```
email/
├── src/
│   ├── components/
│   │   ├── CategoryBadge.tsx      # Category display badges
│   │   ├── EmailList.tsx          # Email list component
│   │   ├── EmailView.tsx          # Email detail view with AI features
│   │   ├── SearchBar.tsx          # Search and filter
│   │   ├── SuggestedReplyModal.tsx # Reply suggestion modal
│   │   └── GeminiSettings.tsx     # API settings (optional)
│   ├── utils/
│   │   ├── gemini.ts              # ⭐ Gemini API integration
│   │   ├── gemini-demo.ts         # Test suite and examples
│   │   └── api.ts                 # Base API configuration
│   ├── App.tsx                    # Main application
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore rules
├── package.json                   # Dependencies
├── GEMINI_INTEGRATION.md         # 📚 Complete documentation
├── QUICK_REFERENCE.md            # 🔍 Quick lookup guide
└── IMPLEMENTATION_SUMMARY.md     # ✅ Implementation details
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Get your API key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy and paste into `.env`

### Optional: UI-Based Configuration

You can also configure the API key through the UI (development only):
- Use the `GeminiSettings` component
- Stores key in localStorage
- Not recommended for production

## 📚 Documentation

- **[GEMINI_INTEGRATION.md](./GEMINI_INTEGRATION.md)** - Complete setup and usage guide
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick code examples and troubleshooting
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical implementation details

## 🎨 Tech Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS
- **AI:** Google Gemini API (gemini-pro model)
- **Build Tool:** Vite 4
- **HTTP Client:** Axios
- **Icons:** Lucide React

## 🔌 API Integration

### Main Functions

```typescript
// Classify email and get suggested reply
import { classifyEmailWithGemini } from './utils/gemini';

const result = await classifyEmailWithGemini(emailBody, emailDate);
// Returns: { category, confidence, reasoning, suggested_reply }

// Get only suggested reply
import { getSuggestedReply } from './utils/gemini';

const reply = await getSuggestedReply(emailBody, emailDate);
// Returns: string
```

### Response Format

```json
{
  "category": "Interested",
  "confidence": 0.93,
  "reasoning": "Sender explicitly expresses interest in partnership and requests a call.",
  "suggested_reply": "Thanks for reaching out. I'm interested in learning more. Are you available for a 30-minute call next week?"
}
```

## 🧪 Testing

```bash
# Run development server
npm run dev

# Test with sample emails
# In browser console:
import { testClassifications } from './utils/gemini-demo'
await testClassifications()
```

## 📦 Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel (configured in vercel.json)
vercel deploy

# Deploy to Netlify (configured in netlify.toml)
netlify deploy
```

## 🔒 Security

⚠️ **Important Security Notes:**

- Never commit `.env` file (already in `.gitignore`)
- Current implementation uses client-side API calls (development only)
- For production: Move API calls to backend server
- Implement rate limiting and caching
- Monitor API usage and costs

## 💰 Pricing

**Gemini API Free Tier:**
- 60 requests per minute
- 1,500 requests per day
- Sufficient for development and small-scale use

**Paid Tier:**
- Pay-as-you-go pricing
- Very affordable for most use cases
- See [pricing details](https://ai.google.dev/pricing)

## 🐛 Troubleshooting

### Common Issues

**"API key not configured"**
- Check `.env` file exists
- Verify `VITE_GEMINI_API_KEY` is set
- Restart dev server

**Classification returns "Unknown" with 0.0 confidence**
- Check browser console for errors
- Verify API key is valid
- Check internet connectivity

**Build errors**
- Run `npm install` to ensure dependencies
- Clear cache: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be >= 18.17.0)

See [GEMINI_INTEGRATION.md](./GEMINI_INTEGRATION.md) for detailed troubleshooting.

## 📈 Performance

- **Average response time:** 2-4 seconds
- **Deterministic results:** temperature=0
- **Token limit:** 512 tokens max
- **Rate limiting:** 60 requests/minute (free tier)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is part of the OneBox assignment.

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- React and Vite teams
- Tailwind CSS for styling
- All contributors and testers

## 📞 Support

For questions or issues:
1. Check [documentation files](./GEMINI_INTEGRATION.md)
2. Review [troubleshooting guide](./QUICK_REFERENCE.md)
3. Check browser console for errors
4. Open an issue in the repository

---

**Built with ❤️ using React, TypeScript, and Google Gemini AI**

**Status:** ✅ Ready to Use  
**Version:** 1.0.0  
**Last Updated:** October 23, 2025
