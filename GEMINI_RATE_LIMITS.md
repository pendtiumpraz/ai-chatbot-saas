# 🚨 **GEMINI API RATE LIMITS & SOLUTIONS**

## ❌ **ERROR YANG TERJADI:**

```
❌ Error: Resource exhausted. Please try again later.
Please refer to https://cloud.google.com/vertex-ai/generative-ai/docs/error-code-429
```

---

## 🔍 **PENYEBAB:**

### **Google Gemini Free Tier Limits:**

```
📊 GEMINI 2.0 FLASH (FREE):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Rate Limit:        15 requests per minute (RPM)
Daily Quota:       1,500 requests per day
Tokens per Day:    1 million tokens

Jika melebihi:
- 15 RPM  → Error 429 (Rate Limit)
- Daily   → Error 429 (Quota Exceeded)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Artinya:**
- Maksimal **15 chat messages per menit**
- Setelah itu, harus tunggu 1 menit
- Maksimal **1,500 requests per hari**

---

## ✅ **SOLUSI CEPAT:**

### **Solusi 1: Tunggu 1 Menit** ⏰
```
Paling simple:
1. Tunggu 60 detik
2. Try lagi
3. Works! ✅
```

### **Solusi 2: Pakai Model Lain** 🔄
```
Ganti ke model dengan limit lebih tinggi:

gemini-1.5-flash:
- Rate: 15 RPM (sama)
- Tapi beda quota pool

gemini-1.5-pro:
- Rate: 2 RPM (lebih rendah!)
- Quality lebih tinggi
```

### **Solusi 3: Upgrade to Paid** 💰
```
Upgrade Gemini API Key:

Free Tier:
- 15 RPM
- 1,500 requests/day

Pay-as-you-go:
- 360 RPM (24x lebih tinggi!)
- 30,000 requests/day
- Cost: $0.075-0.30 per 1M tokens (murah!)
```

### **Solusi 4: Pakai OpenAI/Claude** 🤖
```
Switch ke provider lain:

OpenAI (gpt-4o-mini):
- Rate: 500 RPM
- Cost: $0.15-0.60 per 1M tokens

Claude (claude-3-5-haiku):
- Rate: 1000 RPM
- Cost: $0.25-1.25 per 1M tokens
```

---

## 🔧 **IMPLEMENTASI SOLUTIONS:**

### **Solution 1: Add Retry Logic**

Otomatis retry setelah delay:

```typescript
// src/lib/ai-clients/gemini.ts

async generateContent(messages, options) {
  let retries = 3;
  let delay = 1000; // Start with 1 second
  
  while (retries > 0) {
    try {
      const response = await fetch(url, { ... });
      
      if (response.ok) {
        return await response.json();
      }
      
      if (response.status === 429) {
        retries--;
        if (retries === 0) throw new Error('Rate limit exceeded');
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Double the delay
        continue;
      }
      
      throw new Error('API error');
    } catch (error) {
      if (retries === 0) throw error;
      retries--;
    }
  }
}
```

### **Solution 2: Add Rate Limiter**

Track requests dan prevent over-limit:

```typescript
// src/lib/rate-limiter.ts

class RateLimiter {
  private requests: number[] = [];
  private limit = 15; // 15 RPM
  private window = 60000; // 1 minute
  
  canMakeRequest(): boolean {
    const now = Date.now();
    
    // Remove old requests outside window
    this.requests = this.requests.filter(
      time => now - time < this.window
    );
    
    // Check if under limit
    return this.requests.length < this.limit;
  }
  
  recordRequest() {
    this.requests.push(Date.now());
  }
  
  getWaitTime(): number {
    if (this.requests.length < this.limit) return 0;
    
    const oldest = this.requests[0];
    const now = Date.now();
    const elapsed = now - oldest;
    
    return Math.max(0, this.window - elapsed);
  }
}

// Usage in chat API
const rateLimiter = new RateLimiter();

if (!rateLimiter.canMakeRequest()) {
  const waitTime = rateLimiter.getWaitTime();
  throw new Error(`Rate limit: Please wait ${Math.ceil(waitTime/1000)} seconds`);
}

rateLimiter.recordRequest();
// Make API call...
```

### **Solution 3: Queue System**

Queue requests dan process dengan delay:

```typescript
// src/lib/request-queue.ts

class RequestQueue {
  private queue: Array<{
    resolve: Function;
    reject: Function;
    fn: Function;
  }> = [];
  
  private processing = false;
  private minDelay = 4000; // 4 seconds between requests = 15 RPM
  
  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ resolve, reject, fn });
      this.process();
    });
  }
  
  private async process() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const item = this.queue.shift()!;
      
      try {
        const result = await item.fn();
        item.resolve(result);
      } catch (error) {
        item.reject(error);
      }
      
      // Wait before next request
      if (this.queue.length > 0) {
        await new Promise(resolve => 
          setTimeout(resolve, this.minDelay)
        );
      }
    }
    
    this.processing = false;
  }
}

// Usage
const queue = new RequestQueue();

const response = await queue.add(() => 
  geminiClient.chat(message, prompt, history)
);
```

---

## 📊 **RATE LIMITS COMPARISON:**

### **Google Gemini:**
```
Model                RPM    RPD      Daily Tokens
────────────────     ────   ──────   ────────────
gemini-2.0-flash     15     1,500    1M tokens
gemini-1.5-flash     15     1,500    1M tokens
gemini-1.5-pro       2      50       50K tokens (free)

With Billing:
gemini-2.0-flash     360    30,000   10M tokens
gemini-1.5-pro       360    10,000   10M tokens
```

### **OpenAI:**
```
Model                RPM      TPM       Daily
────────────────     ──────   ───────   ──────
gpt-4o               500      30,000    ∞
gpt-4o-mini          500      200,000   ∞
gpt-3.5-turbo        500      200,000   ∞
```

### **Anthropic Claude:**
```
Model                RPM      TPM       Daily
────────────────     ──────   ───────   ──────
claude-3-5-sonnet    1,000    40,000    ∞
claude-3-5-haiku     1,000    50,000    ∞
claude-3-haiku       1,000    50,000    ∞
```

---

## 💡 **RECOMMENDATIONS:**

### **For Development/Testing:**
```
✅ Use: gemini-2.0-flash (FREE)
   Limit: 15 RPM
   Strategy: Test slowly, wait between requests
```

### **For Light Production (<100 users):**
```
✅ Use: gemini-2.0-flash + billing
   Cost: ~$0.30 per 1M tokens
   Rate: 360 RPM
   
OR

✅ Use: gpt-4o-mini
   Cost: $0.15-0.60 per 1M tokens
   Rate: 500 RPM
```

### **For Heavy Production (>100 users):**
```
✅ Use: Multiple providers with fallback
   Primary: OpenAI (gpt-4o-mini)
   Fallback 1: Gemini (with billing)
   Fallback 2: Claude (claude-3-5-haiku)
   
✅ Implement: Request queue + rate limiting
✅ Add: Caching for common queries
```

---

## 🚀 **QUICK FIXES NOW:**

### **Option 1: Wait (Simplest)**
```
1. Tunggu 60 detik
2. Refresh page
3. Try chat lagi
4. Works! ✅
```

### **Option 2: Use Different Model**
```
1. Edit chatbot
2. Change model: gemini-1.5-flash
3. Save
4. Try chat lagi
5. Different quota pool! ✅
```

### **Option 3: Add Billing (Best)**
```
1. Go to: https://console.cloud.google.com/
2. Enable billing
3. Go to: https://aistudio.google.com/
4. API Keys → Create new key (with billing enabled)
5. Replace API key in platform
6. Get 360 RPM! ✅
```

### **Option 4: Switch to OpenAI**
```
1. Get OpenAI API key
2. Settings → API Keys → Add
3. Provider: OpenAI
4. Key: sk-proj-...
5. Edit chatbot → Change to gpt-4o-mini
6. Save
7. 500 RPM! ✅
```

---

## 📈 **COST CALCULATOR:**

### **Scenario: 1000 users, 10 messages/day each**
```
Total messages: 10,000/day
Avg tokens: 300 tokens/message
Total tokens: 3M tokens/day

Cost per provider:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
gemini-2.0-flash:    FREE! (under 1M/day limit)
                     If over: ~$0.90/day
                     
gemini-1.5-flash:    $0.23-0.90/day
gpt-4o-mini:         $0.45-1.80/day
claude-3-5-haiku:    $0.75-3.75/day
gpt-4o:              $7.50-30/day
claude-3-5-sonnet:   $9-45/day
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Best value: gemini-2.0-flash (FREE or $0.90/day)
```

---

## 🔧 **IMPLEMENT RETRY NOW:**

Update chat API dengan retry logic:

```typescript
// src/app/api/chatbots/[id]/chat/route.ts

const response = await geminiClient.chat(
  message,
  chatbot.system_prompt,
  conversationHistory,
  {
    temperature: chatbot.temperature,
    maxTokens: chatbot.max_tokens,
    topP: chatbot.top_p,
  }
);

// If rate limit error, return helpful message
} catch (error: any) {
  if (error.message.includes('Rate limit') || error.message.includes('quota')) {
    return NextResponse.json({
      error: `⏰ Rate limit reached!\n\n` +
             `Gemini Free: 15 requests/minute\n` +
             `Solutions:\n` +
             `1. Wait 60 seconds ⏱️\n` +
             `2. Change model to gpt-4o-mini 🤖\n` +
             `3. Add billing to Gemini API 💳\n\n` +
             `Error: ${error.message}`
    }, { status: 429 });
  }
  
  throw error;
}
```

---

## ✅ **SUMMARY:**

### **Current Situation:**
```
❌ Gemini Free: 15 RPM limit hit
❌ Error 429: Resource exhausted
```

### **Immediate Solutions:**
```
✅ Wait 60 seconds (FREE)
✅ Use gemini-1.5-flash (FREE, different pool)
✅ Switch to gpt-4o-mini ($0.15-0.60/1M, 500 RPM)
✅ Add Gemini billing ($0.30/1M, 360 RPM)
```

### **Long-term Solutions:**
```
✅ Implement request queue
✅ Add rate limiter
✅ Multi-provider fallback
✅ Response caching
✅ Add billing to API key
```

---

## 🎯 **NEXT STEPS:**

### **Right Now (Choose ONE):**

**A. Wait & Continue:**
```
1. Wait 60 seconds
2. Try again
3. Free! ✅
```

**B. Switch Model:**
```
1. Edit chatbot
2. Model: gpt-4o-mini
3. Need OpenAI API key
4. 500 RPM! ✅
```

**C. Upgrade Gemini:**
```
1. console.cloud.google.com
2. Enable billing
3. New API key
4. 360 RPM! ✅
```

---

**RECOMMENDED: Wait 60s or switch to gpt-4o-mini untuk production!**
