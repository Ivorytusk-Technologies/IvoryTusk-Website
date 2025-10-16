# Cloudflare Environment Variables Setup

## 🔐 Required Environment Variables

You need to configure **3 environment variables** in Cloudflare Pages for the Chatwoot widget to work properly.

---

## 📋 Step-by-Step Instructions

### 1. Access Cloudflare Pages Dashboard

1. Log in to your Cloudflare account
2. Go to **Pages**
3. Select your project: **IvoryTusk Website**
4. Click on **Settings** tab
5. Click on **Environment variables** in the sidebar

### 2. Add Environment Variables

Click **"Add variable"** for each of the following:

---

#### Variable 1: User Identity Validation Key

```
Variable name: CHAT_WIDGET_USER_VALIDATION_KEY
Value: F91s2b7fq8qGtGhoAA4VKQzw
Environment: Production ☑️  Preview ☑️
```

**Purpose:** Used by the HMAC serverless function to generate secure identity hashes for user validation

**Used in:** `/functions/api/chatwoot-hmac.js`

---

#### Variable 2: Website Token

```
Variable name: CHAT_WIDGET_TOKEN
Value: yPeyyqpSmVDZ65YHn43M1t21
Environment: Production ☑️  Preview ☑️
```

**Purpose:** Your unique Chatwoot website token for widget authentication

**Used in:** `/functions/api/chatwoot-config.js`

---

#### Variable 3: Chatwoot Base URL

```
Variable name: CHAT_WIDGET_BASE_URL
Value: https://chat.ivorytusk.co.in
Environment: Production ☑️  Preview ☑️
```

**Purpose:** Your Chatwoot instance URL

**Used in:** `/functions/api/chatwoot-config.js`

---

### 3. Apply Changes

After adding all three variables:

1. Click **"Save"** for each variable
2. Go to **Deployments** tab
3. Click **"Create deployment"** or wait for next git push
4. **Important:** The environment variables only take effect after a new deployment

---

## ✅ Verification

After deployment, test the setup:

### 1. Check Browser Console

Open your website and check the console (F12):

```
✓ Chatwoot: Configuration loaded from server
✓ User Identifier: [32-character-string]
✓ Chatwoot initialized with identity validation
```

### 2. Test API Endpoints

**Test Config Endpoint:**
```bash
curl https://your-domain.pages.dev/api/chatwoot-config
```

Expected response:
```json
{
  "websiteToken": "yPeyyqpSmVDZ65YHn43M1t21",
  "baseUrl": "https://chat.ivorytusk.co.in"
}
```

**Test HMAC Endpoint:**
```bash
curl -X POST https://your-domain.pages.dev/api/chatwoot-hmac \
  -H "Content-Type: application/json" \
  -d '{"identifier":"test123"}'
```

Expected response:
```json
{
  "identifier": "test123",
  "identifierHash": "[64-character-hash]"
}
```

---

## 🔍 Troubleshooting

### Issue: "Configuration not available" error

**Cause:** Environment variables not set or deployment not complete

**Solution:**
1. Verify all 3 variables are added correctly
2. Check variable names match exactly (case-sensitive)
3. Redeploy the site
4. Clear browser cache and reload

### Issue: "CHAT_WIDGET_USER_VALIDATION_KEY not configured" error

**Cause:** Identity validation key missing

**Solution:**
1. Verify `CHAT_WIDGET_USER_VALIDATION_KEY` is set
2. Value should be: `F91s2b7fq8qGtGhoAA4VKQzw`
3. Redeploy

### Issue: Widget doesn't load

**Cause:** Website token or base URL incorrect

**Solution:**
1. Check `/api/chatwoot-config` returns correct values
2. Verify token matches your Chatwoot inbox settings
3. Verify base URL is accessible

---

## 🔒 Security Best Practices

✅ **Never commit these values to git**
✅ **Use different tokens for Preview/Production if possible**
✅ **Rotate tokens periodically**
✅ **Monitor Cloudflare logs for suspicious activity**
✅ **Keep backup of current values before changing**

---

## 📚 Related Documentation

- **Main Setup Guide:** `CHATWOOT_SETUP.md`
- **Chatwoot Dashboard:** https://chat.ivorytusk.co.in
- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages/

---

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Test API endpoints directly
3. Verify environment variables in Cloudflare dashboard
4. Check Cloudflare deployment logs
5. Review Chatwoot inbox settings

---

**Last Updated:** October 2025
