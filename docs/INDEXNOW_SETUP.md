# IndexNow Setup Instructions

## What is IndexNow?
IndexNow is a Microsoft/Bing protocol that notifies search engines instantly when content is added, updated, or deleted. It helps Bing and Copilot discover and index your content faster.

## Setup Steps

### 1. Get Your API Key
1. Go to https://www.bing.com/indexnow
2. Sign in with your Microsoft account
3. Enter your site URL: `https://www.harbisonstandard.com`
4. Bing will generate a unique API key
5. Download the key file (e.g., `abc123def456.txt`)

### 2. Host the Key on Your Site
Upload the key file to your site's root:
```
public/abc123def456.txt
```

The file should be accessible at:
```
https://www.harbisonstandard.com/abc123def456.txt
```

### 3. Submit URLs
After hosting the key, you can submit URLs via:
- Bing Webmaster Tools URL submission
- IndexNow API (automated via cron job)

### 4. Verify
Check Bing Webmaster Tools → IndexNow section to verify your key is working.

## Automation
Once set up, the site can auto-ping IndexNow when:
- New properties are added
- Property details change
- New blog posts are published
- Content is updated

## Key Files
- Key file location: `public/{key}.txt`
- API endpoint: `https://www.bing.com/indexnow`
- Documentation: https://www.bing.com/webmasters/indexnow
