# 🔐 PRIVY CONFIGURATION GUIDE

**Date:** 2026-01-12
**App ID:** `cmjmrxm39022pl10ct4kdn95w`
**Dashboard:** https://dashboard.privy.io/

---

## ✅ STEP 1: VERIFY PRIVY DASHBOARD SETTINGS

### Login to Privy Dashboard

```
1. Go to: https://dashboard.privy.io/
2. Login with your account
3. Select App: SENKAI (App ID: cmjmrxm39022pl10ct4kdn95w)
```

---

## 🌐 STEP 2: CONFIGURE ALLOWED ORIGINS

### Navigate to Settings

```
4. In Privy Dashboard sidebar
5. Click: Settings → Login Methods
6. Scroll to: Allowed Origins section
```

### Add Production Domains

**Required Origins:**

```
✅ http://localhost:3000           (Development)
✅ https://senkai.xyz              (Production - PRIMARY)
✅ https://www.senkai.xyz          (Production - WWW)
```

**Remove if present:**

```
❌ https://app.senkai.xyz          (Old domain - REMOVE)
❌ https://www.app.senkai.xyz      (Old domain - REMOVE)
```

### How to Add/Remove Origins

**To Add:**
```
7. Click: "Add origin"
8. Enter: https://senkai.xyz
9. Click: Save
10. Repeat for https://www.senkai.xyz
```

**To Remove:**
```
11. Find: https://app.senkai.xyz in list
12. Click: X (remove button)
13. Confirm deletion
```

---

## 📧 STEP 3: CONFIGURE LOGIN METHODS

### Email Login

```
14. Settings → Login Methods
15. Ensure "Email" is ENABLED
16. Configure:
    - ✅ Email verification required
    - ✅ OTP code delivery
    - ⬜ Magic link (optional)
```

### Wallet Login

```
17. Ensure "Wallet" is ENABLED
18. Configure supported wallets:
    - ✅ Phantom
    - ✅ Solflare
    - ✅ Coinbase Wallet
    - ✅ WalletConnect
    - ✅ MetaMask (if needed)
```

---

## 👛 STEP 4: CONFIGURE EMBEDDED WALLETS

### Solana Embedded Wallet

```
19. Settings → Embedded Wallets
20. Ensure Solana is ENABLED
21. Configure:
    - Creation method: "Automatically for users without wallets"
    - Network: Mainnet
    - ✅ Enable wallet export (let users backup)
```

### Wallet Recovery

```
22. Settings → Embedded Wallets → Recovery
23. Configure recovery options:
    - ✅ Email recovery
    - ✅ Social recovery (optional)
    - ✅ Passkey recovery (recommended)
```

---

## 🎨 STEP 5: CONFIGURE APPEARANCE

### Branding

```
24. Settings → Appearance
25. Configure:
    - Theme: Dark
    - Accent color: #FFFF02 (SENKAI Yellow)
    - Logo URL: https://senkai.xyz/logo.svg
```

### Legal Links

```
26. Settings → Legal
27. Configure:
    - Terms of Service: https://senkai.xyz/terms
    - Privacy Policy: https://senkai.xyz/privacy
```

---

## 🔒 STEP 6: SECURITY SETTINGS

### Authentication

```
28. Settings → Security
29. Configure:
    - ✅ Require email verification
    - ✅ Enable 2FA (recommended)
    - Session timeout: 7 days (or your preference)
```

### API Keys

```
30. Settings → API Keys
31. Verify:
    - App ID: cmjmrxm39022pl10ct4kdn95w
    - Verification Key: [keep secure]
```

**⚠️ NEVER share API keys publicly!**

---

## 📊 STEP 7: ANALYTICS & MONITORING

### User Analytics

```
32. Dashboard → Analytics
33. Monitor:
    - Total users
    - Active users (daily/monthly)
    - Login methods distribution
    - Wallet types
```

### Error Monitoring

```
34. Dashboard → Logs
35. Check for:
    - Failed login attempts
    - API errors
    - Origin errors (if allowed origins not configured)
```

---

## ✅ VERIFICATION CHECKLIST

After configuration, verify these:

### In Privy Dashboard:

- [ ] App ID correct: `cmjmrxm39022pl10ct4kdn95w`
- [ ] Allowed origins include: `https://senkai.xyz`
- [ ] Allowed origins include: `https://www.senkai.xyz`
- [ ] Allowed origins include: `http://localhost:3000`
- [ ] Old domains removed: `app.senkai.xyz`
- [ ] Email login enabled
- [ ] Wallet login enabled
- [ ] Solana embedded wallet enabled
- [ ] Branding configured (dark theme, yellow accent)
- [ ] Legal links configured
- [ ] Logo URL set: `https://senkai.xyz/logo.svg`

### In Your Code:

- [ ] `components/PrivyProvider.tsx` has correct App ID
- [ ] `components/PrivyProvider.tsx` logo URL: `senkai.xyz`
- [ ] `components/PrivyProvider.tsx` legal links: `senkai.xyz`
- [ ] Environment variable set: `NEXT_PUBLIC_PRIVY_APP_ID`
- [ ] Environment variable set: `PRIVY_APP_ID`

### In Vercel:

- [ ] `NEXT_PUBLIC_PRIVY_APP_ID` set in environment variables
- [ ] `PRIVY_APP_ID` set in environment variables
- [ ] Both set for: Production, Preview, Development

---

## 🧪 TESTING PRIVY INTEGRATION

### Test on Localhost (Development)

```bash
1. npm run dev
2. Open: http://localhost:3000/
3. Click: "Launch App" or "Connect Wallet"
4. Verify: Privy modal appears
5. Test: Email login
   - Enter email
   - Receive OTP
   - Enter OTP
   - Verify: Login successful
6. Test: External wallet
   - Click: "Connect Wallet"
   - Select: Phantom or Solflare
   - Approve connection
   - Verify: Wallet connected
7. Check: Embedded wallet created for email users
8. Check: Browser console for errors
```

### Test on Production

```bash
1. Open: https://senkai.xyz/
2. Click: "Launch App" or "Connect Wallet"
3. Verify: Privy modal appears with SENKAI branding
4. Test: Email login (same flow as above)
5. Test: External wallet connection
6. Verify: No CORS errors in console
7. Verify: Wallet address shows in header
8. Test: Disconnect and reconnect
9. Test: On mobile device
```

---

## 🚨 TROUBLESHOOTING

### Issue: Privy Modal Not Appearing

**Check:**
```
1. Browser console for errors
2. Network tab for blocked requests
3. NEXT_PUBLIC_PRIVY_APP_ID is set correctly
4. Privy dashboard → Allowed origins includes your domain
5. No typos in App ID
```

**Fix:**
```
- Verify env var: echo $NEXT_PUBLIC_PRIVY_APP_ID
- Check Vercel: Settings → Environment Variables
- Restart dev server: npm run dev
- Clear browser cache
```

### Issue: CORS Error

**Error Message:**
```
Access to fetch at 'https://auth.privy.io' from origin 'https://senkai.xyz'
has been blocked by CORS policy
```

**Fix:**
```
1. Go to Privy Dashboard
2. Settings → Allowed Origins
3. Add: https://senkai.xyz
4. Save and wait 1-2 minutes for propagation
5. Clear browser cache and retry
```

### Issue: Email OTP Not Sending

**Check:**
```
1. Privy Dashboard → Settings → Email
2. Verify: Email provider configured
3. Check: Spam/junk folder
4. Test: Different email address
```

**Fix:**
```
- Contact Privy support if issue persists
- Check Privy logs for delivery errors
```

### Issue: Embedded Wallet Not Created

**Check:**
```
1. Privy Dashboard → Embedded Wallets
2. Verify: Solana is enabled
3. Verify: Creation method = "Automatically"
4. User logged in via email (not external wallet)
```

**Fix:**
```
- Enable embedded wallets in dashboard
- Set creation method correctly
- Test with fresh email account
```

### Issue: Wallet Connection Fails

**Check:**
```
1. Browser wallet extension installed (Phantom/Solflare)
2. Wallet extension unlocked
3. Network set to Solana Mainnet
4. Browser console for specific errors
```

**Fix:**
```
- Reinstall wallet extension
- Switch browser (try Chrome/Brave)
- Check wallet extension permissions
- Test with different wallet
```

---

## 📞 SUPPORT

### Privy Resources

**Documentation:**
- Main Docs: https://docs.privy.io/
- SDK Reference: https://docs.privy.io/reference
- Troubleshooting: https://docs.privy.io/guide/troubleshooting

**Dashboard:**
- Login: https://dashboard.privy.io/
- Status: https://status.privy.io/

**Support:**
- Email: support@privy.io
- Discord: https://privy.io/discord
- Twitter: https://twitter.com/privy_io

### SENKAI Configuration

**App Details:**
```
App ID: cmjmrxm39022pl10ct4kdn95w
App Name: SENKAI
Production URL: https://senkai.xyz
Development URL: http://localhost:3000
```

**Environment Variables:**
```
NEXT_PUBLIC_PRIVY_APP_ID=cmjmrxm39022pl10ct4kdn95w
PRIVY_APP_ID=cmjmrxm39022pl10ct4kdn95w
```

**Code Files:**
```
- components/PrivyProvider.tsx (Privy configuration)
- components/PrivyWalletButton.tsx (Authentication UI)
- components/Providers.tsx (Context wrapper)
- app/layout.tsx (Provider integration)
```

---

## ✅ COMPLETION

After completing all steps:

1. ✅ Privy dashboard configured
2. ✅ Allowed origins updated
3. ✅ Email and wallet login enabled
4. ✅ Embedded wallets configured
5. ✅ Branding customized
6. ✅ Legal links added
7. ✅ Tested on localhost
8. ✅ Tested on production
9. ✅ No errors in console
10. ✅ Users can login successfully

---

**Status:** READY FOR PRODUCTION
**Last Updated:** 2026-01-12
**Next Step:** Deploy to Vercel and test live

---

**Created by:** Claude Code Agent
**Purpose:** Complete Privy configuration guide
**Branch:** claude/crypto-analytics-platform-5dULn
