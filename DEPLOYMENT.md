# 🚀 DEPLOYMENT GUIDE

## Backend: Render + Neon PostgreSQL

### **Step 1: Setup Neon Database (Free)**

1. Go to **https://neon.tech**
2. Sign up and create a new project
3. Copy your connection string (looks like):
   ```
   postgresql://user:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. Keep this for Step 3

---

### **Step 2: Deploy to Render**

1. Go to **https://render.com**
2. Sign up/Login
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub account
5. Select your repository: **Simba-backend**

---

### **Step 3: Configure Render**

**Build Settings:**
- **Name:** `simba-backend`
- **Environment:** `Node`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Instance Type:** `Free`

**Environment Variables (Click "Advanced"):**
Add these variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your Neon connection string |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |

---

### **Step 4: Deploy**

1. Click **"Create Web Service"**
2. Wait for deployment (2-3 minutes)
3. Once deployed, click **"Shell"** and run:
   ```bash
   npm run db:push
   npm run db:seed
   ```
4. Your backend is live! 🎉

**Your API URL:** `https://simba-backend-xxxx.onrender.com`

---

## Frontend: Vercel

### **Step 1: Prepare Frontend**

In your frontend folder, update the API URL:

**File: `frontend/.env.local`** (or wherever you store API URL)
```env
NEXT_PUBLIC_API_URL=https://simba-backend-xxxx.onrender.com/api
```

Update in your code:
```typescript
// Before
const API_URL = 'http://localhost:5000/api';

// After
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
```

---

### **Step 2: Deploy to Vercel**

1. Go to **https://vercel.com**
2. Sign up/Login with GitHub
3. Click **"Add New"** → **"Project"**
4. Import your frontend repository
5. Vercel auto-detects Next.js settings

**Configure:**
- **Framework Preset:** Next.js
- **Root Directory:** `./` (or `frontend` if in monorepo)
- **Environment Variables:**
  ```
  NEXT_PUBLIC_API_URL=https://simba-backend-xxxx.onrender.com/api
  ```

6. Click **"Deploy"**
7. Wait 2-3 minutes ☕

**Your site is live!** `https://your-app.vercel.app`

---

## 🎯 Post-Deployment

### **Test Your Backend:**
```bash
curl https://simba-backend-xxxx.onrender.com/health
curl https://simba-backend-xxxx.onrender.com/api/products
```

### **Test Your Frontend:**
Visit `https://your-app.vercel.app` and see your 789 products! 🎉

---

## 📝 Important Notes

### **Render Free Tier:**
- Spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- Upgrade to paid plan ($7/month) for always-on

### **Neon Free Tier:**
- 0.5 GB storage
- 1 database
- Perfect for development!

### **Vercel Free Tier:**
- Unlimited deployments
- 100 GB bandwidth/month
- Auto-SSL certificates
- Perfect for production!

---

## 🔄 Update Deployment

**Backend (Render):**
- Just push to GitHub
- Render auto-deploys

**Frontend (Vercel):**
- Just push to GitHub  
- Vercel auto-deploys

---

## 🆘 Troubleshooting

**Backend not starting?**
- Check Render logs
- Verify DATABASE_URL is correct
- Run `npm run db:push` in Render shell

**Frontend can't reach backend?**
- Check CORS settings in backend
- Verify API_URL in frontend
- Check Render deployment logs

**Database errors?**
- Verify Neon connection string
- Check if database was created
- Run migrations in Render shell

---

## ✅ Success Checklist

- [ ] Neon database created
- [ ] Render service deployed
- [ ] Environment variables set
- [ ] Database pushed and seeded
- [ ] Backend API responding
- [ ] Frontend deployed to Vercel
- [ ] Frontend can fetch products
- [ ] All 789 products visible

**You're live! 🚀**
