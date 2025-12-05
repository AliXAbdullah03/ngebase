# Deployment Guide for Next Global Express

This guide will help you deploy the Next Global Express application to Vercel.

## Prerequisites

- A GitHub, GitLab, or Bitbucket account
- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Node.js 18+ installed locally (for testing)

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to a Git repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**
   - In the Vercel project settings, go to "Environment Variables"
   - Add any required variables from `.env.example`
   - Common variables:
     - `DATABASE_URL` (if using a database)
     - `NEXTAUTH_SECRET` (if using authentication)
     - Email/SMS service credentials

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - For production: `vercel --prod`

## Build Configuration

The project includes a `vercel.json` file with optimal settings:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

Vercel will automatically:
- Detect Next.js framework
- Run `npm install` to install dependencies
- Run `npm run build` to build the application
- Deploy to the edge network

## Environment Variables

Set these in your Vercel project settings:

### Required (if using features)
- `DATABASE_URL` - Database connection string
- `NEXTAUTH_SECRET` - Secret for authentication (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL` - Your production URL

### Optional (for notifications)
- `SMTP_HOST` - Email server host
- `SMTP_PORT` - Email server port
- `SMTP_USER` - Email username
- `SMTP_PASSWORD` - Email password
- `SMS_API_KEY` - SMS service API key
- `SMS_API_URL` - SMS service endpoint

## Post-Deployment

1. **Test your deployment**
   - Visit your Vercel URL
   - Test the tracking functionality
   - Verify admin panel access

2. **Set up custom domain** (optional)
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

3. **Monitor performance**
   - Use Vercel Analytics (if enabled)
   - Check build logs for any issues
   - Monitor function execution times

## Troubleshooting

### Build Fails

1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version (should be 18+)
4. Check for TypeScript errors locally: `npm run build`

### Runtime Errors

1. Check function logs in Vercel dashboard
2. Verify environment variables are set correctly
3. Ensure database connections are configured (if using)

### Image Loading Issues

- Verify `next.config.js` has correct `remotePatterns` for external images
- Check that image URLs are accessible

## Local Testing Before Deploy

1. **Build locally**
   ```bash
   npm run build
   npm run start
   ```

2. **Test production build**
   - Visit `http://localhost:3000`
   - Test all features
   - Check for console errors

## Continuous Deployment

Vercel automatically deploys:
- Every push to `main` branch → Production
- Every push to other branches → Preview deployment
- Pull requests → Preview deployment with unique URL

## Performance Optimization

- Images are automatically optimized by Next.js Image component
- Static assets are served from CDN
- API routes are serverless functions
- Pages are statically generated when possible

## Support

For deployment issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Review build logs in Vercel dashboard
- Contact Vercel support if needed

---

Happy deploying! 🚀


