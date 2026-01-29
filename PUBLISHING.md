# Publishing Troubleshooting Guide

This guide helps resolve common issues when publishing to npm via GitHub Actions.

## Common Errors

### Error: 403 Forbidden - Two-factor authentication required

```
npm error 403 403 Forbidden - PUT https://registry.npmjs.org/@shafeh%2ftanach
- Two-factor authentication or granular access token with bypass 2fa enabled is required
```

**Solution:**

**Option 1: Granular Access Token (Recommended)**
1. Go to https://www.npmjs.com/settings/[username]/tokens
2. Click "Generate New Token" → "Granular Access Token"
3. Configure:
   - **Token name**: `github-actions-publish`
   - **Expiration**: 90 days (maximum)
   - **Packages and scopes**: Select your package (@shafeh/tanach)
   - **Permissions**: Read and Write
   - ✅ **Enable "Bypass 2FA requirement when publishing"**
4. Generate and copy the token
5. Update the `NPM_TOKEN` secret in GitHub

**Option 2: Automation Token**
1. Enable 2FA on your npm account first
2. Go to https://www.npmjs.com/settings/[username]/tokens
3. Click "Generate New Token" → "Automation"
4. Copy the token
5. Update the `NPM_TOKEN` secret in GitHub

**Option 3: Use npm Provenance with OIDC** (No token needed!)
1. Enable automation access in npm account settings
2. Update workflow to use `provenance: true` (already configured)
3. This uses GitHub's OIDC to authenticate

### Error: Token Expired

```
npm error 401 Unauthorized - PUT https://registry.npmjs.org/@shafeh%2ftanach
```

**Solution:**
- Granular tokens expire after 90 days
- Generate a new token and update the GitHub secret

### Error: Cannot publish over existing version

```
npm error 403 403 Forbidden - PUT https://registry.npmjs.org/@shafeh%2ftanach
- You cannot publish over the previously published versions
```

**Solution:**
```bash
# Update version in package.json before publishing
npm version patch   # 0.2.0 → 0.2.1
npm version minor   # 0.2.0 → 0.3.0
npm version major   # 0.2.0 → 1.0.0
```

Or manually trigger the workflow with a version input.

### Error: Package name already exists

```
npm error 403 403 Forbidden - PUT https://registry.npmjs.org/@shafeh%2ftanach
- You do not have permission to publish
```

**Solution:**
- Ensure you're a maintainer of the `@shafeh` organization
- Or change the package name in `package.json`

## Verifying Token Permissions

Test your token locally:

```bash
# Set the token
export NPM_TOKEN="your-token-here"

# Configure npm
npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN

# Try to publish (dry run)
npm publish --dry-run --access public

# If successful, publish for real
npm publish --access public
```

## Manual Publishing (Bypass GitHub Actions)

If GitHub Actions publishing fails, publish manually:

```bash
# 1. Ensure you're logged in to npm
npm login

# 2. Build the package
npm run build

# 3. Bump version
npm version patch

# 4. Publish
npm publish --access public

# 5. Push the version tag
git push --tags
```

## GitHub Actions Debugging

View detailed logs:
1. Go to your repository → Actions tab
2. Click on the failed "Publish to npm" workflow
3. Expand the "Publish to npm" step
4. Check for specific error messages

Enable debug logging:
1. Repository Settings → Secrets and variables → Actions
2. Add secret: `ACTIONS_STEP_DEBUG` = `true`
3. Re-run the workflow

## Need Help?

- Check npm status: https://status.npmjs.org
- npm documentation: https://docs.npmjs.com/creating-and-publishing-scoped-public-packages
- GitHub Actions docs: https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages

## Quick Checklist

Before publishing, verify:
- [ ] npm account has 2FA enabled
- [ ] Valid npm token (not expired)
- [ ] Token has "Bypass 2FA" enabled OR is an Automation token
- [ ] Token has write permissions for the package
- [ ] `NPM_TOKEN` secret is set in GitHub repository
- [ ] Package version is incremented (not already published)
- [ ] Tests are passing (`npm test`)
- [ ] Build succeeds (`npm run build`)
