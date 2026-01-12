# 🌐 DOMAIN CONFIGURATION GUIDE

**Date:** 2026-01-12
**Purpose:** Clarify production domain configuration

---

## ❓ DOMAIN DECISION

Based on your Privy configuration, I need clarification on the production domain:

### Current Privy Allowed Origins (you mentioned):
```
✅ https://app.senkai.xyz
✅ https://www.app.senkai.xyz
✅ http://localhost:3000
```

### Code Currently Configured For:
```
✅ https://senkai.xyz (root domain)
✅ https://www.senkai.xyz
✅ http://localhost:3000
```

---

## 🎯 WHICH DOMAIN IS CORRECT?

### Option A: app.senkai.xyz (Subdomain)

**If production URL is:** `https://app.senkai.xyz`

**Then you need:**

1. **Keep Privy origins as is:**
   ```
   ✅ https://app.senkai.xyz
   ✅ https://www.app.senkai.xyz
   ✅ http://localhost:3000
   ```

2. **Update code back to app.senkai.xyz:**
   - `components/PrivyProvider.tsx` → logo: `https://app.senkai.xyz/logo.svg`
   - `components/PrivyProvider.tsx` → terms: `https://app.senkai.xyz/terms`
   - `components/PrivyProvider.tsx` → privacy: `https://app.senkai.xyz/privacy`
   - `vercel.json` → `NEXT_PUBLIC_APP_URL`: `https://app.senkai.xyz`
   - `next.config.js` → fallback URL: `https://app.senkai.xyz`

3. **Vercel domain:**
   - Configure: `app.senkai.xyz` as production domain

---

### Option B: senkai.xyz (Root Domain)

**If production URL is:** `https://senkai.xyz`

**Then you need:**

1. **Update Privy origins:**
   ```
   ❌ Remove: https://app.senkai.xyz
   ❌ Remove: https://www.app.senkai.xyz
   ✅ Add: https://senkai.xyz
   ✅ Add: https://www.senkai.xyz
   ✅ Keep: http://localhost:3000
   ```

2. **Code is already correct** (no changes needed):
   - All references already use `senkai.xyz`
   - `vercel.json` already set to `senkai.xyz`
   - Privy provider already configured for `senkai.xyz`

3. **Vercel domain:**
   - Configure: `senkai.xyz` as production domain

---

## 🔄 MIGRATION SCENARIOS

### Scenario 1: Migrating from app.senkai.xyz → senkai.xyz

**If you're changing domains:**

1. **Update Privy** (5 minutes)
   ```
   Dashboard → Settings → Allowed Origins
   - Add: https://senkai.xyz
   - Add: https://www.senkai.xyz
   - Keep app.senkai.xyz temporarily (for smooth migration)
   - After migration complete, remove app.senkai.xyz
   ```

2. **Update Vercel** (2 minutes)
   ```
   Project → Settings → Domains
   - Add: senkai.xyz (set as primary)
   - Keep app.senkai.xyz (redirect)
   - Or remove app.senkai.xyz if fully migrating
   ```

3. **DNS Configuration**
   ```
   Add A record for senkai.xyz → Vercel IP
   Keep CNAME for app.senkai.xyz (if redirecting)
   ```

4. **Test both domains work** during transition

5. **Remove old domain** from Privy after migration complete

---

### Scenario 2: Keeping app.senkai.xyz

**If staying with subdomain:**

1. **Revert code changes** (need to update 5 files)
   - See Option A above

2. **Keep Privy as is** (already correct)

3. **Update deployment docs** to reference app.senkai.xyz

---

## 📋 QUICK FIX GUIDE

### If Production is app.senkai.xyz:

Run these commands to update code:

```bash
# Update PrivyProvider
sed -i 's/https:\/\/senkai\.xyz/https:\/\/app.senkai.xyz/g' components/PrivyProvider.tsx

# Update vercel.json
sed -i 's/"https:\/\/senkai\.xyz"/"https:\/\/app.senkai.xyz"/g' vercel.json

# Update next.config.js
sed -i 's/https:\/\/senkai\.xyz/https:\/\/app.senkai.xyz/g' next.config.js

# Commit changes
git add components/PrivyProvider.tsx vercel.json next.config.js
git commit -m "fix: Update domain to app.senkai.xyz for production"
git push
```

### If Production is senkai.xyz:

Update Privy Dashboard:

```
1. Go to: https://dashboard.privy.io/
2. Settings → Allowed Origins
3. Remove: https://app.senkai.xyz
4. Remove: https://www.app.senkai.xyz
5. Add: https://senkai.xyz
6. Add: https://www.senkai.xyz
7. Save
```

---

## ✅ VERIFICATION

After fixing domain configuration:

### Check Code
```bash
# Verify domain in files
grep -r "senkai.xyz" components/PrivyProvider.tsx
grep -r "senkai.xyz" vercel.json
grep -r "senkai.xyz" next.config.js

# Should all show same domain (either senkai.xyz or app.senkai.xyz)
```

### Check Privy Dashboard
```
Login → Settings → Allowed Origins
Verify list matches your production domain
```

### Check Vercel
```
Project → Settings → Domains
Verify production domain is correct
```

### Test Production
```
1. Visit your production URL
2. Click "Connect Wallet"
3. Privy modal should appear (no CORS errors)
4. Complete login flow
5. Verify no console errors
```

---

## 🚨 IMPORTANT

**The domain MUST match in ALL THREE places:**

1. ✅ Code (PrivyProvider, configs)
2. ✅ Privy Dashboard (Allowed Origins)
3. ✅ Vercel (Production Domain)

**Mismatch = CORS errors and Privy won't work!**

---

## 💡 RECOMMENDATION

Based on standard practices:

**Use root domain:** `senkai.xyz`

**Why:**
- Shorter, cleaner URL
- Better for branding
- Standard for modern apps
- Easier to remember

**Subdomain (app.senkai.xyz) is fine if:**
- You have other services on root
- Marketing site on root domain
- Backend on api.senkai.xyz
- Prefer subdomain structure

---

## ❓ WHICH DO YOU WANT?

Please confirm:

**A) senkai.xyz** (root domain - code already configured)
- No code changes needed
- Just update Privy dashboard
- Update Vercel domain

**B) app.senkai.xyz** (subdomain - Privy already configured)
- Update code (3 files)
- Privy already correct
- Ensure Vercel uses app.senkai.xyz

Let me know and I'll make the necessary updates! 🚀

---

**Status:** Awaiting domain confirmation
**Current Code:** Configured for `senkai.xyz`
**Current Privy:** Configured for `app.senkai.xyz`
**Action Needed:** Align all three (Code + Privy + Vercel)
