#!/usr/bin/env bash

# PictaIP Vercel Build Filter
# Purpose: Prevent unwanted deployment spamming on progress commits and non-production branches.
# Vercel Ignore Command Specification:
# - Exit code 1: Proceed with build and deployment.
# - Exit code 0: Skip / cancel build (zero spam, no build minutes used).

echo "=================================================="
echo "🔍 PictaIP Vercel Build Filter"
echo "🌿 Target Branch  : ${VERCEL_GIT_COMMIT_REF:-unknown}"
echo "📝 Commit Message : ${VERCEL_GIT_COMMIT_MESSAGE:-unknown}"
echo "=================================================="

# 1. Skip if commit message explicitly requests to skip or is marked WIP
if [[ "${VERCEL_GIT_COMMIT_MESSAGE}" =~ \[(skip[ -]ci|skip[ -]vercel|skip[ -]deploy)\] ]] || [[ "${VERCEL_GIT_COMMIT_MESSAGE}" =~ ^(wip|progress): ]]; then
  echo "🛑 Build canceled: commit message indicates WIP or explicit skip."
  exit 0
fi

# 2. Always deploy production branch (main or master)
if [[ "${VERCEL_GIT_COMMIT_REF}" == "main" || "${VERCEL_GIT_COMMIT_REF}" == "master" ]]; then
  echo "✅ Production branch detected (${VERCEL_GIT_COMMIT_REF}): proceeding with production deployment."
  exit 1
fi

# 3. Allow manual preview deployment on non-main branches if explicitly tagged in commit message
if [[ "${VERCEL_GIT_COMMIT_MESSAGE}" =~ \[(deploy|preview|build)\] ]]; then
  echo "🚀 Preview deployment explicitly triggered via commit tag: proceeding with build."
  exit 1
fi

# 4. Default for progress pushes on non-main branches: Skip build to prevent spam
echo "🛑 Build skipped: progress push on '${VERCEL_GIT_COMMIT_REF}'."
echo "💡 Tip: Include '[deploy]' or '[preview]' in your commit message if you want to generate a Vercel preview."
exit 0
