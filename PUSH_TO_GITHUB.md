# Instructions to Push to GitHub

## Step 1: Install Git (if not installed)
Download and install from: https://git-scm.com/download/win

## Step 2: Create a GitHub Repository
1. Go to https://github.com
2. Click the "+" icon in the top right
3. Select "New repository"
4. Name it (e.g., "campus" or "campus-app")
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

## Step 3: Initialize and Push Your Code

Open terminal in the Campus folder and run these commands:

```bash
# Initialize git repository
git init

# Add all files (respecting .gitignore)
git add .

# Create initial commit
git commit -m "Initial commit"

# Add remote repository (replace YOUR_USERNAME and YOUR_REPO with your actual values)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Note
- Replace `YOUR_USERNAME` with your GitHub username
- Replace `YOUR_REPO` with the repository name you created
- If you created the repository as "campus", then use: `git remote add origin https://github.com/YOUR_USERNAME/campus.git`

## Alternative: Using GitHub Desktop
If you prefer a GUI:
1. Install GitHub Desktop from https://desktop.github.com
2. Open your project in GitHub Desktop
3. Click "Publish repository"

