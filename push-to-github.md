# 📤 Hướng dẫn Push Code lên GitHub

## Bước 1: Kiểm tra Git Status

```bash
cd "C:\Users\thtua\OneDrive\Desktop\AI AGENT\Web3-Libary-claudekit-ai-vibes-5w7ii\Web3-Libary-claudekit-ai-vibes-5w7ii\project"
git status
```

## Bước 2: Initialize Git (nếu chưa có)

```bash
git init
git branch -M main
```

## Bước 3: Add Remote Repository

```bash
git remote add origin https://github.com/tuantran12/JS.git
```

Hoặc nếu đã có remote, kiểm tra:

```bash
git remote -v
```

Nếu cần update remote:

```bash
git remote set-url origin https://github.com/tuantran12/JS.git
```

## Bước 4: Add và Commit Files

```bash
# Add tất cả files
git add .

# Commit với message
git commit -m "Initial commit: BLOWFI Web3 Platform

- Frontend: Next.js 14 with Privy integration
- Backend: Express.js API server
- Features: Copy trading, staking, referral program
- Ready for Vercel deployment"
```

## Bước 5: Push lên GitHub

```bash
# Push lên main branch
git push -u origin main
```

Nếu gặp lỗi "non-fast-forward", pull trước:

```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

## Bước 6: Verify trên GitHub

Truy cập: https://github.com/tuantran12/JS

Kiểm tra các thư mục:
- ✅ `project/frontend/`
- ✅ `project/backend/`
- ✅ `project/README.md`
- ✅ `project/DEPLOY.md`

## 🚨 Lưu ý

### Files KHÔNG được push:

Các files sau sẽ được ignore (trong `.gitignore`):
- ❌ `node_modules/`
- ❌ `.env` files
- ❌ `.next/`
- ❌ `*.db` files
- ❌ `.vercel/`

### Files CẦN push:

- ✅ Source code (`src/`)
- ✅ Configuration files (`package.json`, `tsconfig.json`, etc.)
- ✅ `.env.example` files
- ✅ `.gitignore`
- ✅ `README.md`
- ✅ `DEPLOY.md`

## 🔄 Update Code (Lần sau)

```bash
# 1. Check status
git status

# 2. Add changes
git add .

# 3. Commit
git commit -m "Your commit message"

# 4. Push
git push origin main
```

## ✅ Checklist

- [ ] Đã tạo `.gitignore`
- [ ] Không có `.env` files trong commit
- [ ] Không có `node_modules/` trong commit
- [ ] Code đã test và build thành công
- [ ] README.md đã cập nhật
- [ ] DEPLOY.md đã tạo
- [ ] Đã push lên GitHub thành công

