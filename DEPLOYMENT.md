# Deployment Guide — GitHub Pages

**How to deploy and maintain CINIS NEXUS on GitHub Pages**

---

## 🚀 Initial Setup (One Time)

### Requirements
- GitHub account (you have: mikecomplexai-7)
- Git installed locally (or GitHub Desktop)
- Your HTML, CSS, JS files ready

### Step 1: Create Repository

1. Go to **github.com/mikecomplexai-7**
2. Click **"New"** (under Repositories)
3. Fill in:
   - **Repository name**: `cortex-platform`
   - **Description**: "CINIS NEXUS — AI Intelligence Platform"
   - **Public** (so it's visible)
   - **Initialize with README** (optional)
4. Click **"Create repository"**

### Step 2: Enable GitHub Pages

1. Go to your repo → **Settings** (gear icon)
2. Scroll to **"Pages"** section (left sidebar)
3. Under "Build and deployment":
   - **Source**: Select `Deploy from a branch`
   - **Branch**: Select `main` and `/root` folder
4. Click **"Save"**
5. You'll see: "Your site is published at https://mikecomplexai-7.github.io/cortex-platform/"

---

## 📁 Repository Structure

```
cortex-platform/
├── index.html              # Main platform file
├── README.md               # Documentation
├── LICENSE                 # MIT or your choice
├── docs/
│   ├── PAYSTACK_SETUP.md
│   ├── DEPLOYMENT.md       # This file
│   ├── FEATURES.md
│   └── ROADMAP.md
└── .gitignore              # Files to ignore (optional)
```

---

## 🔄 Updating Your Platform

### Via GitHub Web Interface (Easiest)

1. Go to your repo: `github.com/mikecomplexai-7/cortex-platform`
2. Click on `index.html`
3. Click the **pencil icon** (Edit)
4. Make your changes
5. Scroll down → **"Commit changes"**
6. Write a message: `"Update: [what changed]"`
7. Click **"Commit"**
8. **Wait 1-2 minutes** → Changes live ✅

### Via Git Command Line (Faster for multiple files)

```bash
# Clone the repo locally
git clone https://github.com/mikecomplexai-7/cortex-platform.git
cd cortex-platform

# Edit your files
# (use your editor — VS Code, Sublime, etc)

# Check what changed
git status

# Add all changes
git add .

# Commit with message
git commit -m "Update: Add new features, fix styling"

# Push to GitHub
git push

# Done! Changes live in 1-2 minutes
```

---

## 🔧 Common Updates

### Update Paystack Key
```bash
# Open index.html, find line ~1100:
# const PAYSTACK_PUBLIC_KEY = "pk_live_...";
# Change the key value, save, commit
git add index.html
git commit -m "Update: New Paystack public key"
git push
```

### Add New Section
1. Edit `index.html`
2. Find the relevant section
3. Copy-paste a similar card/section
4. Customize content
5. Commit & push

### Fix Typos / Styling
1. Edit `index.html`
2. Find the text/style
3. Update it
4. Commit & push

### Add New Page
For a separate page (e.g., `/about.html`):
1. Create `about.html` in your repo
2. Link from main nav: `<a href="about.html">About</a>`
3. Commit & push
4. Page accessible at: `https://mikecomplexai-7.github.io/cortex-platform/about.html`

---

## 📊 Monitoring & Maintenance

### Check Deployment Status

1. Go to repo → **"Actions"** tab
2. You'll see recent deployments
3. Green ✅ = successful
4. Red ❌ = failed (usually HTML syntax error)

If deployment fails:
- Click the failed workflow
- See error message
- Fix the issue in `index.html`
- Commit again

### View Site Traffic

1. Go to repo → **Settings** → **Pages**
2. Scroll to "GitHub Pages"
3. Click **"View traffic"**
4. See:
   - Visitors per day
   - Top pages
   - Referrers

### Performance Check

**Site speed**: https://pagespeed.web.dev/  
- Enter: `https://mikecomplexai-7.github.io/cortex-platform/`
- Get performance score
- See optimization suggestions

---

## 🌐 Custom Domain (Optional)

Want `cortexnexus.com` instead of the long GitHub URL?

### Step 1: Buy Domain
- **Namecheap** (recommended)
- **GoDaddy**
- **Google Domains**
- **Any registrar**

Cost: ₦2,000-10,000/year depending on domain

### Step 2: Point Domain to GitHub

1. Go to your domain registrar
2. Find **DNS Settings**
3. Add these **DNS records**:

```
Type      Name              Value
A         @                 185.199.108.153
A         @                 185.199.109.153
A         @                 185.199.110.153
A         @                 185.199.111.153
CNAME     www               mikecomplexai-7.github.io
```

Wait **30 minutes** for DNS to propagate.

### Step 3: Enable on GitHub

1. Repo → **Settings** → **Pages**
2. Under "Custom domain"
3. Enter: `cortexnexus.com`
4. Click **"Save"**
5. GitHub auto-creates an SSL certificate (HTTPS) ✅

Now site is live at: **https://cortexnexus.com**

---

## 🔐 SSL/HTTPS (Always Enabled)

GitHub Pages automatically provides:
- ✅ **Free SSL certificate** (Let's Encrypt)
- ✅ **HTTPS enabled** by default
- ✅ **Auto-renewal** (no maintenance)
- ✅ **Padlock icon** in browser

Your site is secure out of the box.

---

## 🚨 Troubleshooting

### Site shows 404 error

**Solution**:
- Check filename: must be exactly `index.html` (lowercase)
- Check path: file must be at root of repo (not in a subfolder)
- Wait 2 minutes and refresh

### Changes not appearing

**Solution**:
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache
- Check Actions tab — deployment may still be running
- Wait 2 minutes, refresh again

### HTML syntax error breaks page

**Solution**:
1. Check Actions tab for error
2. Find line number in error message
3. Open `index.html`
4. Go to that line
5. Look for unclosed tags, missing quotes, typos
6. Fix it
7. Commit & push

**Quick HTML checks**:
- Every `<` must have matching `>`
- Every `"` must be closed
- Every `<div>` needs `</div>`
- No special characters in attributes

### Payment buttons not working

**Solution**:
- Check Paystack key is correct (no typos)
- Test with `pk_test_` key first (test mode)
- Check browser console for errors (F12 → Console)
- Email cortexnexus@proton.me if persists

### Mobile layout broken

**Solution**:
- Check CSS media queries in `index.html`
- Test on real device or DevTools (F12 → toggle device toolbar)
- Ensure viewport meta tag: `<meta name="viewport"...>`
- Update CSS for smaller screens

---

## 🔄 Backup & Version Control

### Why Git is Important

Every commit is a **backup**. If you break something:

```bash
# See all previous versions
git log

# Go back to a previous version
git checkout <commit-hash>

# Or revert the last commit
git revert HEAD
```

### Always Commit With Messages

```bash
# Good message
git commit -m "Add new education section with 6 tracks"

# Bad message
git commit -m "update"
```

Good messages help you find what changed and why.

---

## 📈 Scaling the Platform

### Current Approach (Single File)
- ✅ Simple to manage
- ✅ Fast load time (all in one)
- ✅ Easy to understand
- ✅ Perfect for MVP

### Future: Multi-File Structure
If you add lots of features later:

```
cortex-platform/
├── index.html         # Home page
├── products.html      # Products only
├── education.html     # Education hub only
├── blog.html          # Blog articles
├── directory.html     # Community directory
├── assets/
│   ├── style.css      # Shared CSS
│   ├── main.js        # Shared JS
│   └── images/        # Images, logos
└── docs/
    ├── api.md         # API docs
    └── faq.md         # FAQ
```

For now: **keep it simple** (one file).

---

## 🎯 Deployment Checklist

Before going live, verify:

- [ ] `index.html` valid (no syntax errors)
- [ ] **Paystack public key** added (not secret key!)
- [ ] **Contact email** updated
- [ ] All links work (test each section)
- [ ] Mobile responsive (test on phone)
- [ ] Payment buttons tested
- [ ] Contact form tested
- [ ] Meta tags accurate (OG tags for social)
- [ ] README.md filled out
- [ ] Repository is **public**
- [ ] GitHub Pages enabled in Settings
- [ ] Site live and accessible

Once all checked ✅ → **you're ready to ship**

---

## 📞 Support & Questions

**Issue?**
1. Check Actions tab for deployment errors
2. Hard refresh your browser (Ctrl+Shift+R)
3. Wait 2-3 minutes
4. Email: cortexnexus@proton.me

**Want to add a feature?**
1. Edit `index.html`
2. Test locally (run simple HTTP server)
3. Commit & push
4. Verify on live site

**Need help?**
- GitHub Docs: https://docs.github.com/en/pages
- Paystack Docs: https://paystack.com/docs
- CINIS Support: cortexnexus@proton.me

---

## 🚀 You're Set!

Your platform is now:
- ✅ Live on GitHub Pages
- ✅ Auto-deployed (no build step)
- ✅ HTTPS secured
- ✅ Backed up in Git
- ✅ Ready for payments

**Ship it. Monitor it. Scale it.** 🎯

---

*Last updated: June 2026*  
*Platform: CINIS NEXUS INDUSTRY OGOJA*  
*Built by: MikeComplex AI*
