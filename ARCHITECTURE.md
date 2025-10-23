# System Architecture & Flow Diagrams

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Email Management System                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │   EmailList  │  │  EmailView   │  │ SuggestedReply  │  │
│  │  Component   │  │  Component   │  │     Modal       │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
│         │                  │                    │           │
│         └──────────────────┼────────────────────┘           │
│                            │                                │
│                            ▼                                │
│                   ┌─────────────────┐                       │
│                   │  gemini.ts      │                       │
│                   │  API Integration│                       │
│                   └─────────────────┘                       │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              Google Gemini API (gemini-pro)                 │
│                                                              │
│  • Email Classification                                      │
│  • Reply Generation                                          │
│  • Confidence Scoring                                        │
│  • Reasoning Explanation                                     │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Email Classification Flow

```
┌─────────────┐
│   User      │
│ Selects     │
│   Email     │
└──────┬──────┘
       │
       ▼
┌────────────────────────────────┐
│  Clicks "✨ Auto Classify"     │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│  EmailView Component           │
│  • Gets email body             │
│  • Gets email date (optional)  │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│  classifyEmailWithGemini()     │
│  • Constructs prompt           │
│  • Calls Gemini API            │
│  • Temperature = 0             │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│  Gemini API Processing         │
│  1. Reads email content        │
│  2. Analyzes intent            │
│  3. Classifies category        │
│  4. Calculates confidence      │
│  5. Generates reasoning        │
│  6. Creates suggested reply    │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│  JSON Response                 │
│  {                             │
│    category: "Interested",     │
│    confidence: 0.93,           │
│    reasoning: "...",           │
│    suggested_reply: "..."      │
│  }                             │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│  Parse & Validate              │
│  • Remove markdown             │
│  • Parse JSON                  │
│  • Validate category           │
│  • Clamp confidence (0-1)      │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│  Update UI                     │
│  • Show category badge         │
│  • Display confidence %        │
│  • Show reasoning              │
│  • Update email state          │
└────────────────────────────────┘
```

## 💬 Suggested Reply Flow

```
┌─────────────┐
│   User      │
│   Clicks    │
│ "Suggest    │
│  Reply"     │
└──────┬──────┘
       │
       ▼
┌────────────────────────────────┐
│  SuggestedReplyModal Opens     │
│  • Shows loading spinner       │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│  getSuggestedReply()           │
│  (calls classifyEmailWithGemini)│
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│  Gemini API Processing         │
│  • Reads email                 │
│  • Generates reply             │
│  • Ensures 1-2 sentences       │
│  • Professional tone           │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│  Extract suggested_reply       │
│  from classification           │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│  Display Reply in Modal        │
│  • Show suggested text         │
│  • Copy to clipboard button    │
└────────────────────────────────┘
```

## 🏗️ Component Hierarchy

```
App.tsx
├── SearchBar
├── EmailList
│   └── Email Items (map)
├── EmailView
│   ├── CategoryBadge
│   ├── Auto Classify Button → classifyEmailWithGemini()
│   ├── Suggest Reply Button → Opens Modal
│   └── Category Dropdown (manual)
└── SuggestedReplyModal
    └── getSuggestedReply() → displays result
```

## 🔐 Data Flow (Security)

### Development (Current Implementation)

```
┌─────────────┐
│  .env file  │
│  API Key    │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ import.meta.env     │
│ VITE_GEMINI_API_KEY │
└──────┬──────────────┘
       │
       ▼
┌─────────────────┐
│  Frontend       │
│  Direct API     │
│  Call           │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Gemini API     │
└─────────────────┘
```

### Production (Recommended)

```
┌─────────────┐
│  .env file  │
│  API Key    │
│  (server)   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Backend API    │
│  /api/classify  │
└──────┬──────────┘
       ▲
       │ HTTPS
       │
┌──────┴──────────┐
│  Frontend       │
│  (No API Key)   │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Backend calls  │
│  Gemini API     │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Gemini API     │
└─────────────────┘
```

## 📝 Prompt Structure

```
┌────────────────────────────────────────┐
│         SYSTEM PROMPT                  │
│  Rules for classification:             │
│  1. 5 categories only                  │
│  2. Confidence 0.0-1.0                 │
│  3. One-sentence reasoning             │
│  4. 1-2 sentence reply                 │
│  5. JSON output only                   │
│  6. No hallucination                   │
└────────────┬───────────────────────────┘
             │
             ▼
┌────────────────────────────────────────┐
│         USER MESSAGE                   │
│  Email: """                            │
│  [email content here]                  │
│  """                                   │
│  Date: [optional date]                 │
│                                        │
│  Produce the JSON output now.          │
└────────────┬───────────────────────────┘
             │
             ▼
┌────────────────────────────────────────┐
│      GEMINI API PROCESSING             │
│  • Model: gemini-pro                   │
│  • Temperature: 0 (deterministic)      │
│  • Max Tokens: 512                     │
└────────────┬───────────────────────────┘
             │
             ▼
┌────────────────────────────────────────┐
│         JSON RESPONSE                  │
│  {                                     │
│    "category": "Interested",           │
│    "confidence": 0.93,                 │
│    "reasoning": "...",                 │
│    "suggested_reply": "..."            │
│  }                                     │
└────────────────────────────────────────┘
```

## 🎯 Category Decision Tree

```
                    ┌─────────────┐
                    │ Read Email  │
                    └──────┬──────┘
                           │
                           ▼
                 ┌──────────────────┐
                 │  Check for Spam  │
                 │  Indicators      │
                 └────┬────────┬────┘
                      │        │
              No ←────┘        └────→ Yes
              │                      │
              ▼                      ▼
    ┌──────────────────┐    ┌──────────────┐
    │ Check Meeting    │    │   Category:  │
    │ Confirmation     │    │     SPAM     │
    └────┬────────┬────┘    └──────────────┘
         │        │
  No ←───┘        └───→ Yes
  │                    │
  ▼                    ▼
┌────────────────┐  ┌────────────────┐
│ Check Interest │  │   Category:    │
│ Signals        │  │ MEETING BOOKED │
└────┬──────┬────┘  └────────────────┘
     │      │
     │      └──→ Interest: Yes
     │                │
     │                ▼
     │         ┌──────────────┐
     │         │  Category:   │
     │         │  INTERESTED  │
     │         └──────────────┘
     │
     └──→ Interest: No
           │
           ▼
    ┌──────────────┐
    │ Check for    │
    │ Rejection    │
    └───┬─────┬────┘
        │     │
        │     └──→ Yes
        │          │
        │          ▼
        │   ┌────────────────┐
        │   │   Category:    │
        │   │ NOT INTERESTED │
        │   └────────────────┘
        │
        └──→ Unclear
             │
             ▼
      ┌──────────────┐
      │  Category:   │
      │   UNKNOWN    │
      └──────────────┘
```

## 🔄 State Management Flow

```
┌────────────────────────────────────────┐
│           App.tsx State                │
│                                        │
│  • inputQ (search input)               │
│  • searchQuery (debounced)             │
│  • filters (folder, account)           │
│  • selectedEmail (current email)       │
│  • modalOpen (reply modal state)       │
└────────────┬───────────────────────────┘
             │
             ├─────────────────┬──────────────┐
             │                 │              │
             ▼                 ▼              ▼
┌────────────────────┐  ┌─────────────┐  ┌──────────────┐
│    EmailList       │  │ EmailView   │  │ ReplyModal   │
│                    │  │             │  │              │
│ • Displays list    │  │ • Shows     │  │ • Shows      │
│ • Filters emails   │  │   details   │  │   suggested  │
│ • Updates on       │  │ • Auto      │  │   reply      │
│   search           │  │   classify  │  │ • Copy       │
└────────────────────┘  │ • Manual    │  │   button     │
                        │   category  │  └──────────────┘
                        └─────────────┘
```

## 📊 Error Handling Flow

```
┌─────────────────────┐
│  API Call Made      │
└──────┬──────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Try API Request             │
└──────┬───────────────────────┘
       │
       ├──→ Success
       │    │
       │    ▼
       │  ┌─────────────────────┐
       │  │ Parse JSON          │
       │  └──┬──────────────────┘
       │     │
       │     ├──→ Valid
       │     │    │
       │     │    ▼
       │     │  ┌─────────────┐
       │     │  │ Return Data │
       │     │  └─────────────┘
       │     │
       │     └──→ Invalid
       │          │
       │          ▼
       │        ┌─────────────────┐
       │        │ Throw Error     │
       │        └────────┬────────┘
       │                 │
       └──→ Error ←──────┘
            │
            ▼
       ┌─────────────────────┐
       │  Catch Error        │
       │  • Log to console   │
       │  • Return fallback: │
       │    - Unknown        │
       │    - confidence 0.0 │
       │    - error message  │
       └─────────────────────┘
```

## 🚀 Performance Optimization

```
┌──────────────────────────┐
│  Email Selected          │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐     ┌─────────────────┐
│  Check Cache             │────→│ Cache Hit?      │
│  (future enhancement)    │     └────┬────────┬───┘
└──────────────────────────┘          │        │
                                      │        │
                                 Yes ←┘        └→ No
                                  │               │
                                  ▼               ▼
                           ┌─────────────┐  ┌────────────┐
                           │ Return      │  │ Call API   │
                           │ Cached Data │  └──────┬─────┘
                           └─────────────┘         │
                                                   ▼
                                            ┌──────────────┐
                                            │ Cache Result │
                                            │ Return Data  │
                                            └──────────────┘
```

---

**These diagrams illustrate the complete system architecture and data flow for the Gemini email classification system.**
