# Chatwoot Widget Setup Guide

## Overview
This document explains the enhanced Chatwoot chat widget implementation with identity validation, custom styling, and advanced features.

## Features Implemented

### 1. ✅ Custom Widget Icon & Styling
- Orange gradient launcher button matching your brand colors
- Smooth hover effects with scale transformation
- Custom scrollbar styling
- Branded header with gradient

### 2. ✅ Removed "Powered by Chatwoot" Branding
- CSS rules hide all branding elements
- Clean, professional appearance
- Your brand front and center

### 3. ✅ Identity Validation with HMAC
- Secure user identification using SHA-256 HMAC
- Prevents user impersonation
- Serverless function at `/api/chatwoot-hmac`

### 4. ✅ Browser Language Integration
- Automatically detects user's browser language
- Falls back to English if detection fails
- Configured via `useBrowserLanguage: true`

### 5. ✅ Dark/Light Mode
- Auto-detects system preferences
- Configured via `darkMode: 'auto'`
- Users get their preferred theme automatically

### 6. ✅ Popout Window
- Users can open chat in separate window
- Configured via `showPopoutButton: true`

### 7. ✅ Optional UI Features
- ✓ File upload enabled
- ✓ Emoji picker enabled
- ✓ End conversation button enabled
- ✓ Unread messages dialog enabled

### 8. ✅ User Identification System
- Browser fingerprinting for unique IDs
- Persistent across sessions using localStorage
- Includes: screen resolution, timezone, language, platform
- Optional IP geolocation (city, country)

## Environment Setup

### Required Environment Variables

You need to set **3 environment variables** in Cloudflare Pages:

1. Go to your Cloudflare Pages dashboard
2. Select your project (IvoryTusk Website)
3. Go to **Settings** > **Environment variables**
4. Add these variables:

   **Variable 1: User Identity Validation Key**
   - **Variable name:** `CHAT_WIDGET_USER_VALIDATION_KEY`
   - **Value:** `F91s2b7fq8qGtGhoAA4VKQzw`
   - **Environment:** Production (and Preview if needed)
   - **Purpose:** Used for HMAC SHA-256 identity validation

   **Variable 2: Website Token**
   - **Variable name:** `CHAT_WIDGET_TOKEN`
   - **Value:** `yPeyyqpSmVDZ65YHn43M1t21`
   - **Environment:** Production (and Preview if needed)
   - **Purpose:** Your Chatwoot website token

   **Variable 3: Base URL**
   - **Variable name:** `CHAT_WIDGET_BASE_URL`
   - **Value:** `https://chat.ivorytusk.co.in`
   - **Environment:** Production (and Preview if needed)
   - **Purpose:** Your Chatwoot instance URL

5. **Important:** Redeploy your site for the changes to take effect

### Why Environment Variables?

✅ **Security:** Sensitive tokens not exposed in frontend code
✅ **Flexibility:** Change configuration without redeploying
✅ **Best Practice:** Industry standard for managing secrets
✅ **Scalability:** Different values for production/preview/development

## How It Works

### User Identifier Generation

```javascript
// 1. Check localStorage for existing ID
let identifier = localStorage.getItem('chatwoot_user_id');

// 2. If not found, generate based on browser fingerprint
const fingerprint = {
  screen: '1920x1080x24',
  timezone: 'America/New_York',
  language: 'en-US',
  platform: 'MacIntel',
  // ... more
};

// 3. Create unique hash and store
identifier = base64(fingerprint).substring(0, 32);
localStorage.setItem('chatwoot_user_id', identifier);
```

### HMAC Hash Generation

```javascript
// 1. Send identifier to serverless function
const response = await fetch('/api/chatwoot-hmac', {
  method: 'POST',
  body: JSON.stringify({ identifier })
});

// 2. Server generates HMAC SHA-256 hash
const hash = HMAC-SHA256(identifier, IDENTITY_TOKEN);

// 3. Return hash to client
return { identifier, identifierHash: hash };
```

### Chatwoot Initialization

```javascript
// 1. Generate user identifier
const userIdentifier = generateUserIdentifier();

// 2. Get HMAC hash
const identifierHash = await getIdentifierHash(userIdentifier);

// 3. Initialize with identity validation
window.$chatwoot.setUser(userIdentifier, {
  identifier_hash: identifierHash,
  name: 'Website Visitor',
  // ... additional info
});
```

## Customization Options

### Change Widget Position

In `index.html`, modify:
```javascript
window.chatwootSettings = {
  position: 'left', // Change from 'right' to 'left'
  // ...
};
```

### Change Widget Colors

In the `<style>` section:
```css
.woot-widget-bubble {
  background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%) !important;
}
```

### Disable Popout Button

```javascript
window.chatwootSettings = {
  showPopoutButton: false, // Change to false
  // ...
};
```

### Custom Welcome Messages

```javascript
window.chatwootSettings = {
  welcomeTitle: 'Your Custom Title',
  welcomeDescription: 'Your custom description',
  // ...
};
```

## Testing

### 1. Test Identity Validation

Open your browser console when the widget loads:
- You should see: `User Identifier: [32-character string]`
- You should see: `Chatwoot initialized with identity validation`

### 2. Test Branding Removal

Inspect the widget:
- No "Powered by Chatwoot" text should be visible
- Footer should be clean

### 3. Test Dark Mode

Change your system theme:
- Widget should automatically adapt to dark/light mode

### 4. Test Popout

Click the popout button in the widget:
- Chat should open in a new window

### 5. Test Features

- Try uploading a file
- Try using emojis
- Check if language matches your browser

## Troubleshooting

### HMAC Generation Fails

Check console for errors:
```javascript
Failed to generate HMAC: [error message]
```

**Solution:** Ensure environment variable is set correctly in Cloudflare Pages

### Widget Doesn't Load

Check:
1. Correct `websiteToken`: `yPeyyqpSmVDZ65YHn43M1t21`
2. Correct `baseUrl`: `https://chat.ivorytusk.co.in`
3. Widget is enabled in Chatwoot dashboard

### Branding Still Visible

Try adding more specific CSS selectors or check if Chatwoot updated their class names.

## Security Notes

1. **All Secrets in Environment Variables:** No sensitive data exposed in frontend code
2. **Identity Token:** `CHAT_WIDGET_USER_VALIDATION_KEY` used for HMAC validation
3. **HMAC Validation:** Prevents users from impersonating others
4. **CORS:** Serverless functions allow all origins (consider restricting in production)
5. **No Hardcoded Values:** All configuration fetched from secure server endpoints

## API Endpoints

### GET /api/chatwoot-config

Fetches Chatwoot configuration from server environment variables.

**Request:** Simple GET request, no body needed

**Response:**
```json
{
  "websiteToken": "yPeyyqpSmVDZ65YHn43M1t21",
  "baseUrl": "https://chat.ivorytusk.co.in"
}
```

**Status Codes:**
- 200: Success
- 405: Method not allowed (only GET accepted)
- 500: Server error (missing environment variables)

**Cache:** 5 minutes (300 seconds)

---

### POST /api/chatwoot-hmac

Generates HMAC hash for user identifier.

**Request:**
```json
{
  "identifier": "user_identifier_string"
}
```

**Response:**
```json
{
  "identifier": "user_identifier_string",
  "identifierHash": "generated_hmac_hash"
}
```

**Status Codes:**
- 200: Success
- 400: Missing identifier
- 405: Method not allowed (only POST accepted)
- 500: Server error (missing CHAT_WIDGET_USER_VALIDATION_KEY)

## Additional Resources

- [Chatwoot SDK Documentation](https://www.chatwoot.com/docs/user-guide/setting-up-chatwootwidget/)
- [Identity Validation Guide](https://www.chatwoot.com/hc/user-guide/articles/1677587479)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/platform/functions/)

## Support

For issues or questions:
- Check browser console for errors
- Verify environment variables are set
- Test the HMAC endpoint directly: `/api/chatwoot-hmac`
- Contact development team

---

**Last Updated:** October 2025
**Version:** 2.0
