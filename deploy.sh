#!/bin/bash
echo "🚀 Starting Automatic Deployment for Super Mentor..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null
then
    echo "❌ gcloud CLI could not be found."
    echo "Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

echo "✅ gcloud found. Using project: $(gcloud config get-value project)"

# Build and Submit
echo "📦 Building container..."
gcloud builds submit --tag gcr.io/$(gcloud config get-value project)/super-mentor

if [ $? -eq 0 ]; then
    echo "✅ Build Successful."
else
    echo "❌ Build Failed."
    exit 1
fi

# Deploy
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy super-mentor \
  --image gcr.io/$(gcloud config get-value project)/super-mentor \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000

echo "✅ Deployment Complete! Check the URL above."
