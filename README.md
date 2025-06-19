# Deploying a Vue App to S3 and CloudFront with Github Actions
This guide explains how to build and deploy your Vue frontend application to an AWS S3 bucket and Cloudfront.

## Architecture Diagram ![](/docs/Architecture_Cloundfront.png)


---
<details>
  <summary>Legacy workflow (GitHub Actions → S3 + CloudFront, no Terraform)</summary>

## Prerequisites

- Node.js & npm installed
- AWS CLI installed ([Install Guide](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html))
- AWS account with IAM user + access key
- Webapp with a build-ready structure (` npm run build`)
- 
# 🚀 How to do it

### 1. Build the App

```bash
npm install
npm run build
```

---

### 2. Create the S3 Bucket

```bash
aws deploy mb deploy://your-unique-bucket-name --region eu-central-1
```

**Verify the bucket:**

```bash
aws deploy ls
```

---

### 3. Upload Build Files to S3

```bash
aws deploy sync dist/ deploy://your-unique-bucket-name --delete
```

---

### 4. Set Up Bucket Permissions (Public Access)

1. Go to the **AWS Console → S3 → your bucket**
2. **Permissions tab** → Turn **“Block all public access”** → `OFF`

---

### 5. Add Bucket Policy

Replace `your-unique-bucket-name` in the JSON below:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "deploy:GetObject",
      "Resource": "arn:aws:deploy:::your-unique-bucket-name/*"
    }
  ]
}
```

---

### 6. Enable Static Website Hosting

1. Go to the **Properties tab** of your bucket
2. Scroll down to **Static website hosting**
3. Enable it with the following:

- **Index document:** `index.html`
- **Error document:** `index.html` *(for Vue router support)*

### 7. Create a CloudFront Distribution

1. Go to the **AWS Management Console → CloudFront → Create Distribution**
2. Under **Origin**, choose:
    - **Origin domain:** Your S3 bucket (e.g., `your-bucket-name.s3.amazonaws.com`)
    - If the bucket is **private**, create a new **Origin Access Control (OAC)** and attach it
3. **Viewer Protocol Policy:** Redirect HTTP to HTTPS (recommended)
4. **Cache policy:** Use **CachingOptimized** or create a custom policy
5. **Default root object:**
   ```
   index.html
   ```
---

###  Set Up GitHub Actions for Automatic Deployment to S3 + CloudFront
Use GitHub Actions to automatically build and deploy your Vue.js app to S3, and then invalidate the CloudFront cache after every push to the `master` branch.

---

### Workflow File Location

The deployment workflow is defined in:

```
.github/workflows/build-and.deploy.yml
```

 [View deploy.yml](.github/workflows/app-deploy.yml)

---

### How It Works

1. **Trigger:** Runs automatically on each push to the `master` branch
2. **Build:** Installs dependencies and builds the app with `npm run build`
3. **Deploy:** Syncs the `dist/` directory to the specified S3 bucket
4. **Invalidate Cache:** Issues a CloudFront invalidation to make updates visible immediately

---

### Setup GitHub Secrets

| Secret Name                | Description                           |
|---------------------------|---------------------------------------|
| `AWS_ACCESS_KEY_ID`       | Your IAM user’s AWS Access Key ID     |
| `AWS_SECRET_ACCESS_KEY`   | Your IAM user’s Secret Access Key     |
| `node_version`            | The Node.js version (e.g., `18`)      |


---

### ✅ Result

Every push to `master` automatically updates your app in production — no manual steps needed.

👉 **[Marvel Superheroes](https://d33sk0i4vssdzz.cloudfront.net/)**
---
</details>
