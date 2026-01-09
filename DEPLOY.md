# 🚀 Deployment Guide - SENKAI Platform

Hướng dẫn chi tiết deploy SENKAI lên Vercel và GitHub.

## 📋 Mục lục

1. [Chuẩn bị](#chuẩn-bị)
2. [Deploy Frontend lên Vercel](#deploy-frontend-lên-vercel)
3. [Deploy Backend](#deploy-backend)
4. [Cấu hình Environment Variables](#cấu-hình-environment-variables)
5. [Push code lên GitHub](#push-code-lên-github)
6. [Troubleshooting](#troubleshooting)

---

## ✅ Chuẩn bị

### Yêu cầu

- [x] GitHub account
- [x] Vercel account (đăng ký tại [vercel.com](https://vercel.com))
- [x] Privy App ID và App Secret
- [x] Node.js 18+ đã cài đặt

### Files cần thiết

Đảm bảo các file sau đã được tạo:

```
project/
├── frontend/
│   ├── vercel.json          ✅
│   ├── .env.example         ✅
│   ├── .gitignore           ✅
│   └── next.config.js       ✅
├── backend/
│   ├── .gitignore           ✅
│   └── env.example          ✅
├── .gitignore               ✅
├── README.md                ✅
└── DEPLOY.md                ✅
```

---

## 🌐 Deploy Frontend lên Vercel

### Bước 1: Chuẩn bị code

```bash
cd project/frontend
npm install
npm run build  # Test build trước khi deploy
```

Nếu build thành công → ✅ Sẵn sàng deploy!

### Bước 2: Push code lên GitHub

```bash
# Trong thư mục project/
git init
git add .
git commit -m "Initial commit: SENKAI platform"
git branch -M main
git remote add origin https://github.com/tuantran12/JS.git
git push -u origin main
```

### Bước 3: Deploy trên Vercel

#### Method 1: Vercel Dashboard (Recommended)

1. Truy cập [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Chọn repository: `tuantran12/JS`
5. **Cấu hình Project Settings:**
   - **Framework Preset:** Next.js (auto-detect)
   - **Root Directory:** `frontend` ⚠️ **QUAN TRỌNG!**
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

6. **Add Environment Variables:**
   ```
   NEXT_PUBLIC_PRIVY_APP_ID=cmjmrxm39022pl10ct4kdn95w
   NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.vercel.app/api
   NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com
   ```

7. Click **"Deploy"**

#### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd project/frontend
vercel

# Follow prompts:
# ? Set up and deploy? Y
# ? Which scope? (Select your account)
# ? Link to existing project? N
# ? What's your project's name? senkai-frontend
# ? In which directory is your code located? ./
# ? Want to override the settings? N

# Add environment variables
vercel env add NEXT_PUBLIC_PRIVY_APP_ID
vercel env add NEXT_PUBLIC_BACKEND_URL
vercel env add NEXT_PUBLIC_SOLANA_RPC

# Deploy to production
vercel --prod
```

### Bước 4: Verify Deployment

- ✅ Vercel sẽ cung cấp URL: `https://your-project.vercel.app`
- ✅ Test các pages: `/`, `/copy`, `/wallet`, `/token`, `/stake`, `/referral`
- ✅ Kiểm tra console không có errors

---

## 🔧 Deploy Backend

### Option 1: Vercel Serverless Functions (Recommended)

Chuyển Express routes sang Next.js API routes để deploy cùng frontend:

```bash
# Tạo thư mục API routes trong frontend
mkdir -p project/frontend/src/app/api
```

**Ưu điểm:**
- Deploy cùng frontend
- Không cần server riêng
- Auto-scaling

**Nhược điểm:**
- Cần refactor code
- Function timeout limits (10s free tier, 60s pro)

### Option 2: Railway / Render

#### Railway

1. Truy cập [railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Chọn repository và set **Root Directory** = `backend`
4. Add environment variables
5. Deploy

#### Render

1. Truy cập [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repo
4. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add environment variables
6. Deploy

### Option 3: Traditional VPS

```bash
# SSH vào server
ssh user@your-server.com

# Clone repo
git clone https://github.com/tuantran12/JS.git
cd JS/project/backend

# Install dependencies
npm install

# Setup environment
cp env.example .env
nano .env  # Edit environment variables

# Install PM2
npm install -g pm2

# Start backend
pm2 start src/index.js --name senkai-backend
pm2 save
pm2 startup
```

---

## 🔐 Cấu hình Environment Variables

### Vercel (Frontend)

Trong Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_PRIVY_APP_ID` | `cmjmrxm39022pl10ct4kdn95w` | Production, Preview, Development |
| `NEXT_PUBLIC_BACKEND_URL` | `https://your-backend-url.vercel.app/api` | Production, Preview, Development |
| `NEXT_PUBLIC_SOLANA_RPC` | `https://api.mainnet-beta.solana.com` | Production, Preview, Development |

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret for JWT tokens | Random 32-char string |
| `PRIVY_APP_ID` | Privy App ID | `cmjmrxm39022pl10ct4kdn95w` |
| `PRIVY_APP_SECRET` | Privy App Secret | `privy_app_secret_...` |
| `FRONTEND_URL` | Frontend URL | `https://your-frontend.vercel.app` |
| `COINMARKETCAP_API_KEY` | CoinMarketCap API key | `eaaa6588309f4edf91161769dda94ea9` |
| `BITQUERY_API_KEY` | Bitquery API key | `da30951b-2d82-43e8-b488-996a447a4961` |

---

## 📤 Push code lên GitHub

### Bước 1: Initialize Git (nếu chưa có)

```bash
cd project
git init
git branch -M main
```

### Bước 2: Tạo .gitignore

Đã được tạo sẵn trong `.gitignore`:
- `node_modules/`
- `.env` files
- `.next/`
- `*.db`
- etc.

### Bước 3: Commit và Push

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit: SENKAI Web3 Platform"

# Add remote (nếu chưa có)
git remote add origin https://github.com/tuantran12/JS.git

# Push to GitHub
git push -u origin main
```

### Bước 4: Verify trên GitHub

- Truy cập: https://github.com/tuantran12/JS
- Kiểm tra các files đã được push:
  - ✅ `project/frontend/`
  - ✅ `project/backend/`
  - ✅ `project/.gitignore`
  - ✅ `project/README.md`
  - ✅ `project/DEPLOY.md`

---

## 🔧 Troubleshooting

### Build Error trên Vercel

**Error:** `Module not found: Can't resolve '@privy-io/react-auth'`

**Fix:**
```bash
# Ensure dependencies are installed
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build  # Test locally first
```

### Environment Variables không hoạt động

**Issue:** `NEXT_PUBLIC_*` variables không được load

**Fix:**
1. Trong Vercel Dashboard → Settings → Environment Variables
2. Đảm bảo variables có prefix `NEXT_PUBLIC_`
3. Redeploy sau khi thêm/sửa variables
4. Clear browser cache và hard refresh

### Backend API không kết nối được

**Error:** `CORS error` hoặc `Network error`

**Fix:**
1. Kiểm tra `FRONTEND_URL` trong backend `.env`
2. Kiểm tra CORS settings trong `backend/src/index.js`
3. Đảm bảo `NEXT_PUBLIC_BACKEND_URL` trong frontend đúng

### Vercel Deployment Failed

**Error:** Build timeout hoặc memory limit

**Fix:**
- Tăng build timeout trong Vercel Settings
- Hoặc upgrade lên Vercel Pro plan
- Optimize dependencies (loại bỏ unused packages)

### Database Connection Error

**Error:** `Can't reach database server`

**Fix:**
1. **SQLite (Dev):** Đảm bảo `DATABASE_URL="file:./dev.db"`
2. **PostgreSQL (Prod):** 
   - Sử dụng managed database (Supabase, Neon, Railway)
   - Update `DATABASE_URL` với connection string
   - Run migrations: `npm run db:push`

---

## ✅ Checklist sau khi Deploy

- [ ] Frontend deploy thành công trên Vercel
- [ ] Backend deploy thành công (Railway/Render/Vercel)
- [ ] Environment variables đã được cấu hình
- [ ] Test tất cả pages:
  - [ ] `/` - Home page
  - [ ] `/copy` - Copy trading
  - [ ] `/wallet` - Wallet management
  - [ ] `/token` - Subscription packages
  - [ ] `/stake` - Staking
  - [ ] `/referral` - Referral program
- [ ] Privy wallet connection hoạt động
- [ ] API calls từ frontend tới backend thành công
- [ ] No console errors trong browser
- [ ] Responsive design hoạt động trên mobile

---

## 🎉 Hoàn thành!

Sau khi hoàn tất các bước trên, bạn sẽ có:

- ✅ Frontend live tại: `https://your-project.vercel.app`
- ✅ Backend API tại: `https://your-backend-url.com/api`
- ✅ Code trên GitHub: `https://github.com/tuantran12/JS`

**Next Steps:**
- Setup custom domain trong Vercel
- Setup monitoring (Sentry, LogRocket)
- Setup CI/CD pipelines
- Database backup strategy

---

## 📞 Support

Nếu gặp vấn đề, hãy:
1. Check [Troubleshooting](#troubleshooting) section
2. Check Vercel deployment logs
3. Check browser console errors
4. Open issue trên GitHub: https://github.com/tuantran12/JS/issues

