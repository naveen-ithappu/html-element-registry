#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Get release type from argument, default to minor
RELEASE_TYPE=${1:-minor}

# Validate release type
if [[ ! "$RELEASE_TYPE" =~ ^(patch|minor|major)$ ]]; then
  echo "Error: Invalid release type '$RELEASE_TYPE'"
  echo "Usage: ./release.sh [patch|minor|major]"
  echo "Default: minor"
  exit 1
fi

echo "🚀 Starting release process: $RELEASE_TYPE"

# Run checks and build
echo "🧹 Cleaning..."
npm run clean

echo "🔍 Type checking..."
npm run typecheck || { echo "❌ Type check failed"; exit 1; }

echo "🧪 Running tests..."
npm run test || { echo "❌ Tests failed"; exit 1; }

echo "📦 Building..."
npm run build || { echo "❌ Build failed"; exit 1; }

# Bump version
echo "📝 Bumping version ($RELEASE_TYPE)..."
npm version $RELEASE_TYPE

# Create release tag
echo "🔖 Creating release tag..."
git tag -a "v$(npm show . version)" -m "Release v$(npm show . version)"
git push origin "v$(npm show . version)"

# Push with tags
echo "⬆️  Pushing to remote..."
git push --follow-tags

# Clean package.json for publishing
echo "🧼 Cleaning package.json..."
clean-package

# Publish to npm
echo "📦 Publishing to npm..."
npm publish --dry-run

# Restore package.json
echo "♻️  Restoring package.json..."
clean-package restore

echo "✅ Release complete!"