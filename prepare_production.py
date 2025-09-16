#!/usr/bin/env python3
"""
KnowLex Production Preparation Script
Run this script to prepare your site for production deployment.
"""
import os
import secrets
from pathlib import Path

def generate_secret_key():
    """Generate a secure Django SECRET_KEY"""
    return secrets.token_urlsafe(50)

def create_env_file():
    """Create .env file from template if it doesn't exist"""
    env_example = Path('.env.example')
    env_file = Path('.env')
    
    if env_file.exists():
        print("✅ .env file already exists")
        return
    
    if env_example.exists():
        # Read template and replace placeholder
        content = env_example.read_text()
        secret_key = generate_secret_key()
        content = content.replace('your-super-secret-production-key-generate-a-new-one', secret_key)
        
        # Write to .env
        env_file.write_text(content)
        print("✅ Created .env file with secure SECRET_KEY")
    else:
        print("❌ .env.example not found")

def create_logs_directory():
    """Create logs directory if it doesn't exist"""
    logs_dir = Path('logs')
    if not logs_dir.exists():
        logs_dir.mkdir()
        print("✅ Created logs directory")
    else:
        print("✅ Logs directory already exists")

def check_requirements():
    """Check if requirements.txt exists"""
    req_file = Path('requirements.txt')
    if req_file.exists():
        print("✅ requirements.txt found")
    else:
        print("❌ requirements.txt not found")

def main():
    print("🚀 KnowLex Production Preparation")
    print("=" * 40)
    
    # Check current directory
    if not Path('manage.py').exists():
        print("❌ Error: Run this script from the Django project root directory")
        return
    
    # Run preparation steps
    create_env_file()
    create_logs_directory()
    check_requirements()
    
    print("\n🎉 Production preparation complete!")
    print("\n📋 Next steps:")
    print("1. Edit .env file with your actual domain and database settings")
    print("2. Test with: python manage.py check --deploy --settings=notizie_legali.settings_production")
    print("3. Choose a hosting platform (Railway, Render, or VPS)")
    print("4. Deploy your code!")
    print("\n📖 See PRODUCTION_CHECKLIST.md for detailed instructions")

if __name__ == '__main__':
    main()
