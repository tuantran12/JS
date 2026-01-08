# 🚀 Hướng dẫn Deploy BLOWFI lên Vercel và GitHub

## 📋 Tổng quan

Hướng dẫn này sẽ giúp bạn:
1. ✅ Push code lên GitHub
2. ✅ Deploy frontend lên Vercel
3. ✅ Cấu hình environment variables
4. ✅ Test và verify deployment

---

## 🔧 Bước 1: Chuẩn bị

### 1.1 Kiểm tra files cần thiết

Đảm bảo các files sau đã tồn tại:

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
├── DEPLOY.md                ✅
└── push-to-github.ps1       ✅
```

### 1.2 Test build frontend

```bash
cd frontend
npm install
npm run build
```

Nếu build thành công → ✅ Sẵn sàng deploy!

---

## 📤 Bước 2: Push Code lên GitHub

### Method 1: Dùng PowerShell Script (Khuyến nghị)

```powershell
# Chạy script tự động
cd project
.\push-to-github.ps1
```

Script sẽ:
- ✅ Kiểm tra git initialization
- ✅ Add remote repository
- ✅ Add và commit files
- ✅ Push lên GitHub

### Method 2: Manual Commands

```bash
cd project

# Initialize git (nếu chưa có)
git init
git branch -M main

# Add remote
git remote add origin https://github.com/tuantran12/JS.git

# Add và commit
git add .
git commit -m "Initial commit: BLOWFI Web3 Platform"

# Push
git push -u origin main
```

### 1.3 Verify trên GitHub

Truy cập: https://github.com/tuantran12/JS

Kiểm tra:
- ✅ Code đã được push
- ✅ Các thư mục `frontend/` và `backend/` có đầy đủ
- ✅ Không có `node_modules/` hoặc `.env` files

---

## 🌐 Bước 3: Deploy Frontend lên Vercel

### 3.1 Tạo Vercel Account

1. Truy cập: https://vercel.com/signup
2. Đăng ký với GitHub account (khuyến nghị)
3. Authorize Vercel access GitHub repositories

### 3.2 Import Project

1. Vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Chọn repository: `tuantran12/JS`
5. Click **"Import"**

### 3.3 Cấu hình Project Settings

⚠️ **QUAN TRỌNG:** Phải cấu hình đúng!

**Project Settings:**
- **Framework Preset:** `Next.js` (auto-detect)
- **Root Directory:** `frontend` ⚠️ **ĐỔI TỪ `./` SANG `frontend`**
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

**Cách đổi Root Directory:**
1. Click **"Edit"** ở phần Root Directory
2. Nhập: `frontend`
3. Click **"Continue"**

### 3.4 Thêm Environment Variables

Trong phần **"Environment Variables"**, thêm:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_PRIVY_APP_ID` | `cmjmrxm39022pl10ct4kdn95w` | Production, Preview, Development |
| `NEXT_PUBLIC_BACKEND_URL` | `http://localhost:3001` (tạm thời) | Development |
| `NEXT_PUBLIC_BACKEND_URL` | `https://your-backend-url.vercel.app/api` | Production |
| `NEXT_PUBLIC_SOLANA_RPC` | `https://api.mainnet-beta.solana.com` | Production, Preview, Development |

**Cách thêm:**
1. Click **"Add"** hoặc **"Environment Variables"**
2. Nhập Name: `NEXT_PUBLIC_PRIVY_APP_ID`
3. Nhập Value: `cmjmrxm39022pl10ct4kdn95w`
4. Chọn Environments: Production, Preview, Development
5. Click **"Save"**
6. Lặp lại cho các variables khác

### 3.5 Deploy

1. Click **"Deploy"**
2. Đợi build hoàn tất (2-5 phút)
3. Sau khi deploy xong, Vercel sẽ cung cấp URL:
   - Production: `https://your-project.vercel.app`
   - Preview: `https://your-project-git-branch.vercel.app`

### 3.6 Verify Deployment

✅ Test các pages:
- `/` - Home page
- `/copy` - Copy trading
- `/wallet` - Wallet management
- `/token` - Subscription packages
- `/stake` - Staking
- `/referral` - Referral program

✅ Kiểm tra Console (F12):
- Không có errors
- Privy initialization thành công
- API calls hoạt động

---

## 🔧 Bước 4: Cấu hình Backend URL

Sau khi backend được deploy (Railway/Render/Vercel):

1. Vào Vercel Dashboard → Project Settings → Environment Variables
2. Update `NEXT_PUBLIC_BACKEND_URL` cho Production:
   ```
   https://your-backend-url.railway.app/api
   ```
3. Redeploy để áp dụng thay đổi

---

## ✅ Checklist

Sau khi hoàn tất, kiểm tra:

- [ ] Code đã push lên GitHub
- [ ] Frontend deploy thành công trên Vercel
- [ ] Environment variables đã được cấu hình
- [ ] Build không có errors
- [ ] Tất cả pages load được
- [ ] Privy wallet connection hoạt động
- [ ] API calls từ frontend tới backend thành công
- [ ] Responsive design hoạt động trên mobile

---

## 🐛 Troubleshooting

### Build Error: "Module not found"

**Fix:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build  # Test locally
```

### Root Directory Error

**Error:** Build failed vì không tìm thấy `package.json`

**Fix:**
- Trong Vercel Settings → Root Directory: Đổi thành `frontend`
- Redeploy

### Environment Variables không hoạt động

**Fix:**
1. Đảm bảo variables có prefix `NEXT_PUBLIC_`
2. Redeploy sau khi thêm/sửa variables
3. Clear browser cache

### CORS Error

**Error:** Frontend không gọi được backend API

**Fix:**
1. Kiểm tra `FRONTEND_URL` trong backend `.env`
2. Update `NEXT_PUBLIC_BACKEND_URL` trong Vercel
3. Redeploy frontend

---

## 🎉 Hoàn thành!

Sau khi hoàn tất tất cả các bước:

- ✅ **Frontend:** https://your-project.vercel.app
- ✅ **Backend:** https://your-backend-url.com/api
- ✅ **GitHub:** https://github.com/tuantran12/JS

**Next Steps:**
- Setup custom domain
- Deploy backend (Railway/Render)
- Setup monitoring
- Database migration

---

## 📞 Support

Nếu gặp vấn đề:
1. Check [DEPLOY.md](./DEPLOY.md) để xem chi tiết
2. Check Vercel deployment logs
3. Check browser console errors
4. Open issue trên GitHub

