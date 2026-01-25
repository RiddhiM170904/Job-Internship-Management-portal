#!/bin/bash

echo "========================================"
echo "Job Portal - Setup Script"
echo "========================================"
echo ""

echo "Installing Backend Dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "Backend installation failed!"
    exit 1
fi
echo "✓ Backend dependencies installed"
echo ""

echo "Installing Frontend Dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "Frontend installation failed!"
    exit 1
fi
echo "✓ Frontend dependencies installed"
echo ""

echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Next Steps:"
echo "1. Configure backend/.env with MongoDB URI"
echo "2. Configure frontend/.env (default should work)"
echo "3. Run backend: cd backend && npm run dev"
echo "4. Run frontend: cd frontend && npm run dev"
echo ""
echo "See QUICKSTART.md for detailed instructions"
echo ""
