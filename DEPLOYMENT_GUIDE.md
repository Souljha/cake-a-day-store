# 🚀 Cake A Day - Deployment Guide

## Quick Deploy to Netlify (Recommended)

### Option 1: Deploy via Netlify CLI (5 minutes)

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy from this directory**
   ```bash
   netlify deploy --prod --dir=dist
   ```

### Option 2: Deploy via Git Integration (10 minutes)

1. **Create GitHub repository**
   - Go to [github.com/new](https://github.com/new)
   - Repository name: `cake-a-day`
   - Make it public
   - Don't initialize with README (we already have files)

2. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Cake A Day website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/cake-a-day.git
   git push -u origin main
   ```

3. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and authorize
   - Select your `cake-a-day` repository
   - Build settings are auto-detected from `netlify.toml`
   - Click "Deploy site"

## 🔧 Environment Variables Setup

After deployment, you MUST add these environment variables in Netlify:

1. **Go to Site Settings → Environment Variables**
2. **Add these variables:**

```
GEMINI_API_KEY=AIzaSyD_3Bmf36T8yCDsN12zW46_64MiPpjmOSw
PAYFAST_MERCHANT_ID=11771115
PAYFAST_MERCHANT_KEY=ob8ahigaoodmn
PAYFAST_PASSPHRASE=Thank You Lord 26
PAYFAST_TEST_MODE=true
VITE_FIREBASE_API_KEY=AIzaSyCuOdBIjx2tX66IUq2CLe2FwKObNNtYXw
VITE_FIREBASE_AUTH_DOMAIN=cake-a-day.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=cake-a-day
VITE_FIREBASE_STORAGE_BUCKET=cake-a-day.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=426722871791
VITE_FIREBASE_APP_ID=1:426722871791:web:643637d9dd683fe2380e1a
VITE_FIREBASE_MEASUREMENT_ID=G-7KMR4EKYRL
```

3. **Redeploy** after adding variables (Netlify will rebuild automatically)

## 🌟 Going Live Checklist

### Before Launch:
- [ ] Test all features on staging URL
- [ ] Verify admin dashboard works (password: CakeADay2025!)
- [ ] Test WhatsApp notifications (+27 68 300 7158)
- [ ] Verify Firebase orders are saving
- [ ] Change `PAYFAST_TEST_MODE=false` for live payments

### After Launch:
- [ ] Set up custom domain (optional)
- [ ] Update PayFast return URLs to your domain
- [ ] Test end-to-end order flow
- [ ] Monitor Firebase usage

## 🔗 Your Live URLs

After deployment, you'll get:
- **Live Site**: `https://your-site-name.netlify.app`
- **Admin Access**: `your-site-name.netlify.app?admin=brendon2025`
- **Alternative Admin**: Click footer logo 5 times + password

## 📱 Mobile Optimization

Your site is already mobile-optimized with:
- ✅ Responsive design
- ✅ Touch-friendly buttons
- ✅ WhatsApp deep linking
- ✅ Fast loading times

## 🔒 Security Features

- ✅ Environment variables secured in Netlify
- ✅ Admin dashboard password protected
- ✅ PayFast signature verification
- ✅ Firebase security rules active

## 🎯 Next Steps

1. **Deploy now** using Option 1 or 2 above
2. **Test everything** on your live URL
3. **Share your website** with customers!
4. **Monitor orders** in admin dashboard

Your professional cake business website is ready for customers! 🎂✨