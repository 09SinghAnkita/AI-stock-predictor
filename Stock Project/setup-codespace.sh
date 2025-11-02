#!/bin/bash
set -e

echo "🚀 Setting up Codespace..."

# Copy env template
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ .env file created from .env.example"
else
  echo "ℹ️ .env already exists, skipping copy."
fi

# Install backend deps
pip install -r requirements.txt

# Install frontend deps
cd frontend
npm install
cd ..

# Run migrations
python manage.py migrate

echo "✅ Setup complete!"
echo "➡️  Run: python manage.py runserver 0.0.0.0:8001"
echo "➡️  And: cd frontend && npm run dev"
