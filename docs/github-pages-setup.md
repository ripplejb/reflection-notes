# GitHub Pages Deployment Guide

This guide walks you through setting up automatic deployment of the Reflection Notes app to GitHub Pages.

## Prerequisites

- GitHub repository for your project
- Admin access to the repository settings

## Setup Steps

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **"GitHub Actions"**

### 2. Push Code with GitHub Actions

The repository already includes the GitHub Actions workflow file (`.github/workflows/deploy.yml`). Simply push your code to the `main` branch:

```bash
git add .
git commit -m "Add GitHub Actions deployment"
git push origin main
```

### 3. Monitor Deployment

1. Go to the **Actions** tab in your GitHub repository
2. You should see a workflow run called "Deploy to GitHub Pages"
3. Click on it to monitor the progress
4. Once completed, your site will be available at:
   ```
   https://yourusername.github.io/reflection-notes/
   ```

## Workflow Details

The GitHub Actions workflow automatically:

1. **Triggers** on every push to `main` branch
2. **Sets up** Node.js environment
3. **Installs** dependencies with `npm ci`
4. **Builds** the application with `npm run build`
5. **Deploys** the `dist` folder to GitHub Pages

## Configuration Files

### `.github/workflows/deploy.yml`
- Defines the deployment workflow
- Uses official GitHub Actions for Pages deployment
- Runs on Ubuntu with Node.js 18

### `vite.config.ts`
- Sets the correct `base` path for GitHub Pages
- Configures build output directory

### `package.json`
- Contains build scripts
- Specifies dependencies for deployment

## Troubleshooting

### Build Fails
- Check the Actions tab for error details
- Ensure all dependencies are listed in `package.json`
- Verify TypeScript compilation passes locally

### Site Not Loading
- Check that GitHub Pages is enabled in repository settings
- Verify the workflow completed successfully
- Ensure the base path in `vite.config.ts` matches your repository name

### File System Access API Warning
- This is normal for GitHub Pages (static hosting)
- The app will show a warning for browsers without File System API support
- Core functionality (localStorage) still works

## Manual Build & Deploy

If you prefer manual deployment:

```bash
# Build the application
npm run build

# The dist folder contains the built application
# Upload the contents of dist/ to your hosting provider
```

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public/` directory with your domain
2. Configure DNS settings with your domain provider
3. Update the `base` path in `vite.config.ts` if needed

## Security Notes

- The deployed app runs entirely in the browser
- No backend server required
- File System Access API only works on HTTPS (GitHub Pages provides this)
- localStorage data stays on the user's device
