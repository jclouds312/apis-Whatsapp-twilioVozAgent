#!/bin/bash

# AWS S3 Configuration for Nexus Digital Future Platform
# This script sets up S3 buckets for:
# 1. Recordings (Retell voice calls)
# 2. Embeddings (Widget assets)
# 3. Backups (Database backups)
# 4. Logs (CloudWatch logs export)

AWS_REGION="${AWS_REGION:-us-east-1}"
BUCKET_PREFIX="nexus-digital-future"
STAGE="${STAGE:-prod}"

echo "🚀 Setting up AWS S3 for Nexus Digital Future Platform..."
echo "Region: $AWS_REGION | Stage: $STAGE"

# Create main buckets
echo "📦 Creating S3 buckets..."

aws s3 mb "s3://${BUCKET_PREFIX}-recordings-${STAGE}" --region $AWS_REGION || true
aws s3 mb "s3://${BUCKET_PREFIX}-widgets-${STAGE}" --region $AWS_REGION || true
aws s3 mb "s3://${BUCKET_PREFIX}-backups-${STAGE}" --region $AWS_REGION || true

# Enable versioning
echo "🔄 Enabling versioning..."
aws s3api put-bucket-versioning \
  --bucket "${BUCKET_PREFIX}-recordings-${STAGE}" \
  --versioning-configuration Status=Enabled --region $AWS_REGION

# Enable encryption
echo "🔐 Enabling encryption..."
aws s3api put-bucket-encryption \
  --bucket "${BUCKET_PREFIX}-recordings-${STAGE}" \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }' --region $AWS_REGION

# Set lifecycle policies (delete old recordings after 90 days)
echo "♻️ Setting lifecycle policies..."
aws s3api put-bucket-lifecycle-configuration \
  --bucket "${BUCKET_PREFIX}-recordings-${STAGE}" \
  --lifecycle-configuration '{
    "Rules": [{
      "Id": "DeleteOldRecordings",
      "Status": "Enabled",
      "Expiration": {
        "Days": 90
      },
      "Filter": {
        "Prefix": "calls/"
      }
    }]
  }' --region $AWS_REGION

# Allow public read for widget assets
echo "🌐 Setting public access for widgets..."
aws s3api put-bucket-acl \
  --bucket "${BUCKET_PREFIX}-widgets-${STAGE}" \
  --acl public-read --region $AWS_REGION

echo "✅ AWS S3 Configuration Complete!"
echo ""
echo "Buckets created:"
echo "  📀 Recordings: s3://${BUCKET_PREFIX}-recordings-${STAGE}"
echo "  🎨 Widgets: s3://${BUCKET_PREFIX}-widgets-${STAGE}"
echo "  💾 Backups: s3://${BUCKET_PREFIX}-backups-${STAGE}"
