#!/bin/bash
cp .env.example .env
pip install -r requirements.txt
cd frontend && npm install && cd ..
python manage.py migrate
echo "✅ Codespace setup complete!"
