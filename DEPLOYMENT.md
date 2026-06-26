Deployment Guide — GitHub Pages
How to deploy and maintain CINIS NEXUS on GitHub Pages
🚀 Initial Setup (One Time)
Requirements
GitHub account (you have: mikecomplexai-7)
Git installed locally (or GitHub Desktop)
Your HTML, CSS, JS files ready
Step 1: Create Repository
Go to github.com/mikecomplexai-7
Click "New" (under Repositories)
Fill in:
Repository name: cortex-platform
Description: "CINIS NEXUS — AI Intelligence Platform"
Public (so it's visible)
Initialize with README (optional)
Click "Create repository"
Step 2: Enable GitHub Pages
Go to your repo → Settings (gear icon)
Scroll to "Pages" section (left sidebar)
Under "Build and deployment":
Source: Select Deploy from a branch
Branch: Select main and /root folder
Click "Save"
You'll see: "Your site is published at https://mikecomplexai-7.github.io/cortex-platform/"
📁 Repository Structure
Code
🔄 Updating Your Platform
Via GitHub Web Interface (Easiest)
Go to your repo: github.com/mikecomplexai-7/cortex-platform
Click on index.html
Click the pencil icon (Edit)
Make your changes
Scroll down → "Commit changes"
Write a message: "Update: [what changed]"
Click "Commit"
Wait 1-2 minutes → Changes live ✅
Via Git Command Line (Faster for multiple files)
Bash
🔧 Common Updates
Update Paystack Key
Bash
Add New Section
Edit index.html
Find the relevant section
Copy-paste a similar card/section
Customize content
Commit & push
Fix Typos / Styling
Edit index.html
Find the text/style
Update it
Commit & push
Add New Page
For a separate page (e.g., /about.html):
Create about.html in your repo
Link from main nav: <a href="about.html">About</a>
Commit & push
Page accessible at: https://mikecomplexai-7.github.io/cortex-platform/about.html
📊 Monitoring & Maintenance
Check Deployment Status
Go to repo → "Actions" tab
You'll see recent deployments
Green ✅ = successful
Red ❌ = failed (usually HTML syntax error)
If deployment fails:
Click the failed workflow
See error message
Fix the issue in index.html
Commit again
View Site Traffic
Go to repo → Settings → Pages
Scroll to "GitHub Pages"
Click "View traffic"
See:
Visitors per day
Top pages
Referrers
Performance Check
Site speed: https://pagespeed.web.dev/
Enter: https://mikecomplexai-7.github.io/cortex-platform/
Get performance score
See optimization suggestions
🌐 Custom Domain (Optional)
Want cortexnexus.com instead of the long GitHub URL?
Step 1: Buy Domain
Namecheap (recommended)
GoDaddy
Google Domains
Any registrar
Cost: ₦2,000-10,000/year depending on domain
Step 2: Point Domain to GitHub
Go to your domain registrar
Find DNS Settings
Add these DNS records:
Code
Wait 30 minutes for DNS to propagate.
Step 3: Enable on GitHub
Repo → Settings → Pages
Under "Custom domain"
Enter: cortexnexus.com
Click "Save"
GitHub auto-creates an SSL certificate (HTTPS) ✅
Now site is live at: https://cortexnexus.com
🔐 SSL/HTTPS (Always Enabled)
GitHub Pages automatically provides:
✅ Free SSL certificate (Let's Encrypt)
✅ HTTPS enabled by default
✅ Auto-renewal (no maintenance)
✅ Padlock icon in browser
Your site is secure out of the box.
🚨 Troubleshooting
Site shows 404 error
Solution:
Check filename: must be exactly index.html (lowercase)
Check path: file must be at root of repo (not in a subfolder)
Wait 2 minutes and refresh
Changes not appearing
Solution:
Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
Clear browser cache
Check Actions tab — deployment may still be running
Wait 2 minutes, refresh again
HTML syntax error breaks page
Solution:
Check Actions tab for error
Find line number in error message
Open index.html
Go to that line
Look for unclosed tags, missing quotes, typos
Fix it
Commit & push
Quick HTML checks:
Every < must have matching >
Every " must be closed
Every <div> needs </div>
No special characters in attributes
Payment buttons not working
Solution:
Check Paystack key is correct (no typos)
Test with pk_test_ key first (test mode)
Check browser console for errors (F12 → Console)
Email cortexnexus@proton.me if persists
Mobile layout broken
Solution:
Check CSS media queries in index.html
Test on real device or DevTools (F12 → toggle device toolbar)
Ensure viewport meta tag: <meta name="viewport"...>
Update CSS for smaller screens
🔄 Backup & Version Control
Why Git is Important
Every commit is a backup. If you break something:
Bash
Always Commit With Messages
Bash
Good messages help you find what changed and why.
📈 Scaling the Platform
Current Approach (Single File)
✅ Simple to manage
✅ Fast load time (all in one)
✅ Easy to understand
✅ Perfect for MVP
Future: Multi-File Structure
If you add lots of features later:
Code
For now: keep it simple (one file).
🎯 Deployment Checklist
Before going live, verify:
[ ] index.html valid (no syntax errors)
[ ] Paystack public key added (not secret key!)
[ ] Contact email updated
[ ] All links work (test each section)
[ ] Mobile responsive (test on phone)
[ ] Payment buttons tested
[ ] Contact form tested
[ ] Meta tags accurate (OG tags for social)
[ ] README.md filled out
[ ] Repository is public
[ ] GitHub Pages enabled in Settings
[ ] Site live and accessible
Once all checked ✅ → you're ready to ship
📞 Support & Questions
Issue?
Check Actions tab for deployment errors
Hard refresh your browser (Ctrl+Shift+R)
Wait 2-3 minutes
Email: cortexnexus@proton.me
Want to add a feature?
Edit index.html
Test locally (run simple HTTP server)
Commit & push
Verify on live site
Need help?
GitHub Docs: https://docs.github.com/en/pages
Paystack Docs: https://paystack.com/docs
CINIS Support: cortexnexus@proton.me
🚀 You're Set!
Your platform is now:
✅ Live on GitHub Pages
✅ Auto-deployed (no build step)
✅ HTTPS secured
✅ Backed up in Git
✅ Ready for payments
Ship it. Monitor it. Scale it. 🎯
Last updated: June 2026
Platform: CINIS NEXUS INDUSTRY OGOJA
Built by: MikeComplex AI
