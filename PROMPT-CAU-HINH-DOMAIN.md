# PROMPT CẤU HÌNH DOMAIN CHO SENKAI PLATFORM

## 📋 Hướng dẫn sử dụng
Copy prompt bên dưới và thay thế `[DOMAIN-CUA-BAN]` bằng domain thực tế của bạn, sau đó gửi cho AI.

---

## 🤖 PROMPT MẪU

```
Tôi cần bạn giúp cấu hình lại toàn bộ source code SENKAI platform với domain chính thức của tôi.

THÔNG TIN DOMAIN:
- Domain chính: [DOMAIN-CUA-BAN]
- Subdomain app (nếu có): app.[DOMAIN-CUA-BAN]
- Email contact: support@[DOMAIN-CUA-BAN]
- Email noreply: noreply@[DOMAIN-CUA-BAN]

YÊU CẦU:
1. Xác định TẤT CẢ các file trong source code có chứa domain cũ "senkai.xyz"
2. Thay thế tất cả references của domain cũ bằng domain mới
3. Cập nhật các file cấu hình:
   - .env và .env.example
   - middleware.ts (domain routing)
   - next.config.js (image domains)
   - vercel.json (nếu có)
   - Tất cả file documentation (.md)

4. Cập nhật các URLs trong:
   - Environment variables (NEXT_PUBLIC_APP_URL, NEXTAUTH_URL, SMTP_FROM)
   - API routes (stripe webhooks, callbacks)
   - Marketing pages (CTAs, links)
   - Footer và navigation components
   - Email templates

5. Kiểm tra và cập nhật:
   - Hardcoded URLs trong React components
   - Redirect rules trong middleware
   - CORS configurations
   - OAuth callback URLs

HÀNH ĐỘNG CẦN THỰC HIỆN:
1. Tìm kiếm (grep) tất cả occurrences của "senkai.xyz"
2. Liệt kê tất cả files cần thay đổi
3. Thực hiện thay thế domain trong từng file
4. Commit changes với message rõ ràng
5. Push code lên branch hiện tại

OUTPUT MONG MUỐN:
- Danh sách đầy đủ các files đã được cập nhật
- Tóm tắt các thay đổi chính
- Hướng dẫn cập nhật DNS records cho domain mới
- Checklist các bước cần làm trên các services (Vercel, Supabase, Stripe)
```

---

## 📝 VÍ DỤ PROMPT CỤ THỂ

### Ví dụ 1: Domain riêng
```
Tôi cần bạn giúp cấu hình lại toàn bộ source code SENKAI platform với domain chính thức của tôi.

THÔNG TIN DOMAIN:
- Domain chính: cryptotrading.io
- Subdomain app: app.cryptotrading.io
- Email contact: support@cryptotrading.io
- Email noreply: noreply@cryptotrading.io

[Sử dụng phần YÊU CẦU và HÀNH ĐỘNG như trên...]
```

### Ví dụ 2: Vercel domain
```
Tôi cần bạn giúp cấu hình lại toàn bộ source code SENKAI platform với domain chính thức của tôi.

THÔNG TIN DOMAIN:
- Domain chính: my-crypto-app.vercel.app
- Subdomain app: (không dùng subdomain, chỉ dùng /dashboard route)
- Email contact: support@my-crypto-app.com
- Email noreply: noreply@my-crypto-app.com

[Sử dụng phần YÊU CẦU và HÀNH ĐỘNG như trên...]
```

---

## 🎯 CHI TIẾT CẤU HÌNH THEO SERVICE

Sau khi AI thay đổi source code, bạn cần cập nhật thủ công:

### 1. VERCEL
- Settings > Domains > Add domain mới
- Xóa hoặc giữ domain cũ
- Đợi DNS propagation (~5-10 phút)

### 2. SUPABASE
```
Dashboard > Settings > API > URL Configuration
- Site URL: https://[DOMAIN-CUA-BAN]
- Redirect URLs:
  * https://[DOMAIN-CUA-BAN]/**
  * https://app.[DOMAIN-CUA-BAN]/**
```

### 3. STRIPE
```
Dashboard > Webhooks > Update endpoint
- Old: https://senkai.xyz/api/webhooks/stripe
- New: https://[DOMAIN-CUA-BAN]/api/webhooks/stripe
```

### 4. DNS RECORDS (Nếu dùng custom domain)
```
Thêm vào domain registrar của bạn:

A Record:
Name: @
Value: 76.76.21.21 (Vercel IP)

CNAME Record:
Name: app
Value: cname.vercel-dns.com
```

---

## ✅ CHECKLIST SAU KHI AI HOÀN THÀNH

- [ ] Tất cả files đã được cập nhật với domain mới
- [ ] .env file có NEXT_PUBLIC_APP_URL đúng
- [ ] middleware.ts routing logic đúng
- [ ] Marketing pages links đúng
- [ ] API webhooks URLs cập nhật
- [ ] Documentation files cập nhật
- [ ] Code đã được commit và push
- [ ] Vercel domain đã add
- [ ] Supabase URLs đã update
- [ ] Stripe webhook endpoint đã update
- [ ] DNS records đã cấu hình (nếu custom domain)
- [ ] Test website hoạt động: https://[DOMAIN-CUA-BAN]
- [ ] Test app routing: https://app.[DOMAIN-CUA-BAN] hoặc /dashboard

---

## 🚨 LƯU Ý QUAN TRỌNG

1. **Backup trước khi thay đổi**: Tạo branch mới hoặc commit code hiện tại
2. **Environment variables**: Sau khi AI cập nhật .env.example, bạn cần tự cập nhật .env local
3. **Vercel env vars**: Phải update manual trên Vercel Dashboard
4. **DNS propagation**: Có thể mất 24-48 giờ để domain mới hoạt động hoàn toàn
5. **HTTPS certificates**: Vercel tự động tạo, đợi 5-10 phút sau khi add domain

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề sau khi cấu hình:
1. Kiểm tra Vercel deployment logs
2. Test API endpoints: `curl https://[DOMAIN-CUA-BAN]/api/health`
3. Kiểm tra DNS: `dig [DOMAIN-CUA-BAN]`
4. Xem browser console cho errors
