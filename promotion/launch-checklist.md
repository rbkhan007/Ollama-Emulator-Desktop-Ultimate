# OllamoMUI – Launch Checklist

## Pre-Launch

### Infrastructure
- [ ] Buy `ollamomui.com` from Namecheap/GoDaddy
- [ ] Add domain to Cloudflare (free tier)
- [ ] Deploy backend with Docker + Cloudflare Tunnel
- [ ] Deploy frontend to Cloudflare Pages
- [ ] Set up SSLCommerz live credentials (not sandbox)
- [ ] Set up SMTP for license emails
- [ ] Verify: `curl https://api.ollamomui.com/api/version`

### Product
- [ ] Build and upload EXE to GitHub Releases
- [ ] Build and submit Android APK to Play Store
- [ ] Test payment flow end-to-end with real credit card
- [ ] Test license key activation in EXE
- [ ] Test license key email delivery
- [ ] Test mobile app connects to API

### Content
- [ ] Screenshots of desktop GUI (4-6 images)
- [ ] Screenshots of mobile app (4-6 images)
- [ ] Screen recording of chat streaming (15-30 seconds, GIF or MP4)
- [ ] Social media banner image (1500×500)
- [ ] Profile picture / logo (500×500)

---

## Launch Day

### Product Hunt
- [ ] Schedule launch for Tuesday 12:01 AM PT (best day)
- [ ] Prepare maker comment (see product-hunt.md)
- [ ] Prepare first comment
- [ ] Prepare GIF/video demo
- [ ] Share on Maker's Twitter/X

### Reddit
- [ ] r/LocalLLaMA — technical post (see reddit-posts.md)
- [ ] r/SideProject — "I built this" post
- [ ] r/selfhosted — deployment-focused post
- [ ] r/opensource — open-source appreciation

### Twitter/X
- [ ] Post launch thread (10 tweets, see twitter-thread.md)
- [ ] Tag relevant accounts (@ProductHunt, @GitHub)
- [ ] Use hashtags: #OllamoMUI #opensource #AI #selfhosted

### Email
- [ ] Send welcome email to existing signups
- [ ] Send announcement to mailing list
- [ ] Post on Dev.to / Medium

---

## Post-Launch (First Week)

### Monitoring
- [ ] Watch server logs for errors
- [ ] Monitor Cloudflare Tunnel uptime
- [ ] Check SSLCommerz dashboard for payments
- [ ] Check email delivery rate
- [ ] Set up Google Analytics on frontend

### Community
- [ ] Reply to every comment on Product Hunt
- [ ] Reply to every Reddit comment
- [ ] Monitor GitHub Issues
- [ ] Post weekly update on Twitter

### Iteration
- [ ] Fix bugs reported by early users
- [ ] Add Stripe as alternative payment method
- [ ] Write documentation for popular integrations
- [ ] Create Docker Compose for easier setup
- [ ] Add "What's new" popup to desktop app

---

## Revenue Tracking

| Tier | Price | Target Users | Monthly Revenue |
|------|-------|-------------|-----------------|
| Desktop Pro | $4.99 | 80 | $399.20 |
| Mobile Ultimate | $2.99 | 100 | $299.00 |
| Web Pro | $9.99 | 25 | $249.75 |
| **Total** | | **205** | **$947.95** |
