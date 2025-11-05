# Deployment Guide - Universal AI Chatbot SaaS

## 🚀 Quick Deploy (5 Minutes)

### Prerequisites
1. **Supabase Account** - https://supabase.com (Free tier OK)
2. **OpenAI API Key** - https://platform.openai.com
3. **Pinecone Account** - https://www.pinecone.io (Free tier OK)
4. **Vercel Account** - https://vercel.com (Free tier OK)

---

## Step 1: Setup Supabase

### 1.1 Create New Project
- Go to https://supabase.com/dashboard
- Click "New Project"
- Choose organization, name, database password
- Wait for project to be created (~2 minutes)

### 1.2 Run Database Schema
- In Supabase Dashboard → SQL Editor
- Copy entire `supabase/schema.sql` file
- Paste and click "Run"
- Verify tables created in Table Editor

### 1.3 Create Storage Bucket
- Go to Storage → Create Bucket
- Name: `documents`
- Public bucket: ✅ Yes
- Click Create

### 1.4 Get API Keys
- Go to Project Settings → API
- Copy:
  - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
  - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

---

## Step 2: Setup Pinecone

### 2.1 Create Index
- Go to https://app.pinecone.io
- Click "Create Index"
- Settings:
  - Name: `chatbot-knowledge-base`
  - Dimensions: `1536` (for OpenAI embeddings)
  - Metric: `cosine`
  - Cloud: `AWS` (or GCP)
  - Region: Choose closest to your users
- Click Create

### 2.2 Get API Key
- Go to API Keys
- Copy your API key → `PINECONE_API_KEY`
- Note your environment (e.g., `us-west1-gcp`) → `PINECONE_ENVIRONMENT`

---

## Step 3: Get OpenAI API Key

- Go to https://platform.openai.com/api-keys
- Click "Create new secret key"
- Copy key → `OPENAI_API_KEY`
- **Important:** Add payment method to avoid rate limits

---

## Step 4: Local Development

### 4.1 Clone & Install
```bash
cd fullstack
npm install
```

### 4.2 Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

OPENAI_API_KEY=sk-...

PINECONE_API_KEY=xxxxx
PINECONE_ENVIRONMENT=us-west1-gcp
PINECONE_INDEX=chatbot-knowledge-base

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4.3 Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000 🎉

---

## Step 5: Deploy to Vercel

### 5.1 Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

### 5.2 Import to Vercel
- Go to https://vercel.com/new
- Import your GitHub repository
- Configure project:
  - Framework Preset: Next.js
  - Root Directory: `fullstack`
  - Build Command: `npm run build`
  - Output Directory: `.next`

### 5.3 Add Environment Variables
In Vercel project settings → Environment Variables, add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `PINECONE_API_KEY`
- `PINECONE_ENVIRONMENT`
- `PINECONE_INDEX`
- `NEXT_PUBLIC_APP_URL` (your Vercel URL, e.g., https://your-app.vercel.app)

### 5.4 Deploy
- Click "Deploy"
- Wait ~2 minutes
- Visit your live URL!

---

## Step 6: Create Your First Chatbot

### 6.1 Create Workspace (via API or Database)
```sql
-- In Supabase SQL Editor
INSERT INTO workspaces (name, slug, industry, plan)
VALUES ('My Company', 'my-company', 'Technology', 'pro');
```

### 6.2 Create Chatbot
Use the API endpoint:
```bash
curl -X POST https://your-app.vercel.app/api/chatbots \
  -H "Content-Type: application/json" \
  -d '{
    "workspaceId": "YOUR_WORKSPACE_ID",
    "name": "Customer Support Bot",
    "description": "Helps customers with product questions",
    "useCase": "customer-support"
  }'
```

### 6.3 Upload Knowledge Base Documents
- PDF files (product docs, FAQs, policies)
- DOCX files (manuals, guides)
- TXT files (simple text data)

```bash
curl -X POST https://your-app.vercel.app/api/documents/upload \
  -F "file=@/path/to/document.pdf" \
  -F "chatbotId=YOUR_CHATBOT_ID"
```

### 6.4 Test Chat
```bash
curl -X POST https://your-app.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "chatbotId": "YOUR_CHATBOT_ID",
    "messages": [
      {"role": "user", "content": "What are your business hours?"}
    ],
    "visitorId": "test-user"
  }'
```

---

## Use Cases & Industry Templates

### 1. **Customer Support (E-commerce)**
```javascript
{
  "useCase": "customer-support",
  "documents": [
    "product-catalog.pdf",
    "shipping-policy.pdf",
    "return-policy.pdf",
    "faq.pdf"
  ]
}
```

### 2. **HR Assistant (Internal)**
```javascript
{
  "useCase": "hr-assistant",
  "documents": [
    "employee-handbook.pdf",
    "benefits-guide.pdf",
    "leave-policy.docx",
    "company-policies.pdf"
  ]
}
```

### 3. **Education Tutor**
```javascript
{
  "useCase": "education-tutor",
  "documents": [
    "course-syllabus.pdf",
    "lecture-notes.pdf",
    "textbook-chapters.pdf"
  ]
}
```

### 4. **Healthcare Info Bot**
```javascript
{
  "useCase": "healthcare-info",
  "documents": [
    "symptoms-guide.pdf",
    "treatment-info.pdf",
    "medication-guide.pdf"
  ]
}
```

### 5. **Legal Assistant**
```javascript
{
  "useCase": "legal-assistant",
  "documents": [
    "contract-templates.pdf",
    "legal-terms.pdf",
    "case-studies.docx"
  ]
}
```

### 6. **Finance Advisor**
```javascript
{
  "useCase": "finance-advisor",
  "documents": [
    "investment-products.pdf",
    "financial-planning.pdf",
    "risk-disclosures.pdf"
  ]
}
```

### 7. **Government Services**
```javascript
{
  "useCase": "general",
  "systemPrompt": "You are a government services assistant...",
  "documents": [
    "public-services-guide.pdf",
    "application-procedures.pdf",
    "requirements-checklist.pdf"
  ]
}
```

---

## Customization Options

### System Prompts (Per Industry)
Edit in `src/app/api/chatbots/route.ts` → `defaultPrompts`

### Widget Appearance
```javascript
{
  "widget_settings": {
    "theme": "light", // or "dark"
    "position": "bottom-right", // or "bottom-left"
    "primaryColor": "#3b82f6",
    "greeting": "Hi! How can I help you today?",
    "avatar": "https://your-cdn.com/avatar.png",
    "companyName": "Your Company",
    "showBranding": false
  }
}
```

### Model Selection
- `gpt-4-turbo-preview` - Best quality, slower, expensive
- `gpt-4` - High quality, balanced
- `gpt-3.5-turbo` - Fast, cheaper, good for simple queries

---

## Monitoring & Analytics

### Check Usage
```sql
SELECT 
  w.name AS workspace,
  w.message_used,
  w.message_quota,
  (w.message_used::float / w.message_quota * 100) AS usage_percent
FROM workspaces w;
```

### Popular Questions
```sql
SELECT 
  c.messages->-1->>'content' AS question,
  COUNT(*) AS frequency
FROM conversations c
WHERE c.messages->-1->>'role' = 'user'
GROUP BY question
ORDER BY frequency DESC
LIMIT 20;
```

### Response Quality
```sql
SELECT 
  cb.name AS chatbot,
  COUNT(c.id) AS total_conversations,
  AVG(jsonb_array_length(c.messages)) AS avg_messages_per_conversation
FROM chatbots cb
LEFT JOIN conversations c ON cb.id = c.chatbot_id
GROUP BY cb.id, cb.name;
```

---

## Scaling Considerations

### Free Tier Limits
- **Supabase:** 500 MB database, 1 GB file storage
- **Pinecone:** 1 index, 100K vectors
- **OpenAI:** Rate limits based on usage tier
- **Vercel:** 100 GB bandwidth/month

### When to Upgrade
- **Supabase Pro ($25/mo):** 8 GB database, 100 GB storage
- **Pinecone Standard ($70/mo):** Multiple indexes, 10M vectors
- **Vercel Pro ($20/mo):** Unlimited bandwidth
- **OpenAI Tier 2:** $50 spent → higher rate limits

### Performance Optimization
- Enable Supabase connection pooling
- Use Redis/Upstash for caching
- Implement rate limiting per visitor
- Batch document processing
- Use CDN for static assets

---

## Troubleshooting

### "Document processing failed"
- Check file size (< 10 MB)
- Verify Supabase storage permissions
- Check OpenAI API quota

### "Message quota exceeded"
- Increase quota in database
- Implement payment/upgrade flow

### "Pinecone namespace not found"
- Verify namespace created correctly
- Check Pinecone index name

### "Slow responses"
- Check OpenAI API status
- Reduce retriever `k` value (fewer docs)
- Use faster model (gpt-3.5-turbo)

---

## Security Best Practices

1. **Never expose service role key** in client-side code
2. **Implement rate limiting** to prevent abuse
3. **Validate file uploads** (type, size, content)
4. **Use RLS policies** in Supabase
5. **Sanitize user inputs** before sending to LLM
6. **Monitor usage** for anomalies
7. **Rotate API keys** periodically

---

## Next Steps

- [ ] Build admin dashboard UI
- [ ] Add authentication (Supabase Auth)
- [ ] Create embeddable widget script
- [ ] Implement analytics dashboard
- [ ] Add webhook notifications
- [ ] Support more file types (CSV, JSON, HTML)
- [ ] Add voice input/output
- [ ] Integrate with Zapier/Make
- [ ] Build mobile app

---

## Support & Resources

- **Documentation:** [Next.js](https://nextjs.org/docs) | [LangChain](https://js.langchain.com/) | [Supabase](https://supabase.com/docs)
- **Community:** Discord, GitHub Discussions
- **Issues:** GitHub Issues

---

**Your universal AI chatbot platform is ready!** 🎉
Deploy once, use for any industry! 🚀
