# SmartRelief Development Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- Git
- Expo CLI (for mobile development)

### Quick Setup
```bash
# Clone the repository
git clone <repository-url>
cd smart-relief

# Run setup script
chmod +x scripts/setup.sh
./scripts/setup.sh

# Start development servers
npm run dev
```

## 📁 Project Structure

```
smartrelief/
├── packages/
│   ├── shared/          # Shared types and utilities
│   ├── backend/         # Node.js API server
│   ├── ai-service/      # Python AI/ML service
│   └── mobile/          # React Native mobile app
├── infrastructure/      # Docker and K8s configs
├── design/             # Figma files and assets
├── database/           # Database initialization scripts
├── scripts/            # Development and deployment scripts
└── docs/              # Documentation
```

## 🔧 Development Workflow

### Daily Development Process
1. **Start containers**: `npm run docker:up`
2. **Install dependencies**: `npm install`
3. **Run migrations**: `npm run db:migrate`
4. **Start services**: `npm run dev`

### Available Scripts
- `npm run dev` - Start all services in development mode
- `npm run build` - Build all packages
- `npm run test` - Run all tests
- `npm run lint` - Lint all code
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## 🏗️ Architecture Overview

### Backend Service (packages/backend)
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with role-based access control
- **Real-time**: Socket.io for live updates
- **File Upload**: Multer with AWS S3 integration

### AI Service (packages/ai-service)
- **Framework**: FastAPI with Python
- **Computer Vision**: OpenCV for image processing
- **Machine Learning**: TensorFlow/PyTorch for damage assessment
- **Data Processing**: Pandas, NumPy for analytics

### Mobile App (packages/mobile)
- **Framework**: React Native with Expo
- **Styling**: NativeWind (Tailwind for RN)
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation 6
- **Maps**: React Native Maps
- **Offline**: SQLite with sync capability

## 🔌 API Integration

### Backend API Endpoints
```typescript
// Authentication
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/profile

// Aid Requests
GET    /api/aid-requests
POST   /api/aid-requests
PUT    /api/aid-requests/:id
DELETE /api/aid-requests/:id

// Resources
GET  /api/resources
POST /api/resources
PUT  /api/resources/:id/allocate

// Volunteers
GET  /api/volunteers/tasks
POST /api/volunteers/tasks/:id/accept
PUT  /api/volunteers/tasks/:id/complete
```

### AI Service Endpoints
```python
# Damage Assessment
POST /ai/api/assess-damage
POST /ai/api/calculate-priority

# Analytics
GET  /ai/api/charts/aid-distribution
GET  /ai/api/charts/donor-impact
GET  /ai/api/analytics/dashboard
```

## 🧪 Testing Strategy

### Unit Tests
```bash
# Backend tests
cd packages/backend
npm test

# AI service tests
cd packages/ai-service
python -m pytest

# Mobile tests
cd packages/mobile
npm test
```

### Integration Tests
```bash
# API integration tests
npm run test:integration

# End-to-end tests
npm run test:e2e
```

## 🚀 Deployment

### Development Deployment
```bash
# Build all services
npm run build

# Start with Docker Compose
docker-compose up -d
```

### Production Deployment
```bash
# Build production images
npm run build:prod

# Deploy to Kubernetes
kubectl apply -f infrastructure/kubernetes/
```

## 🔧 Environment Configuration

### Required Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/smartrelief
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-secret-key

# External Services
AWS_ACCESS_KEY_ID=your-aws-key
TWILIO_AUTH_TOKEN=your-twilio-token
```

## 📱 Mobile Development

### Running on Device
```bash
# Start Expo development server
cd packages/mobile
npm start

# Scan QR code with Expo Go app
# Or run on simulator:
npm run ios    # iOS Simulator
npm run android # Android Emulator
```

### Building for Production
```bash
# Build APK
expo build:android

# Build IPA
expo build:ios
```

## 🤖 AI Model Training

### Damage Assessment Model
```python
# Train damage classification model
cd packages/ai-service
python scripts/train_damage_model.py

# Test model accuracy
python scripts/test_model.py
```

### Data Preparation
- Place training images in `ml_models/data/training/`
- Organize by damage categories: `severe/`, `moderate/`, `minor/`
- Run preprocessing script: `python scripts/preprocess_data.py`

## 🔍 Debugging

### Common Issues

#### Database Connection
```bash
# Check PostgreSQL status
docker-compose ps postgres

# View logs
docker-compose logs postgres

# Reset database
npm run db:reset
```

#### AI Service Issues
```bash
# Check Python dependencies
pip list

# Reinstall packages
pip install -r requirements.txt

# Check OpenCV installation
python -c "import cv2; print(cv2.__version__)"
```

#### Mobile App Issues
```bash
# Clear Expo cache
expo start -c

# Reset Metro bundler
npx react-native start --reset-cache

# Check device connection
adb devices
```

## 📊 Monitoring & Logging

### Application Logs
```bash
# View all service logs
docker-compose logs -f

# Backend logs only
docker-compose logs -f backend

# Database performance
npm run db:studio
```

### Performance Monitoring
- API response times in backend logs
- Memory usage in Docker stats
- Database query performance in Prisma Studio

## 🤝 Contributing

### Code Style
- TypeScript for all JavaScript code
- Python Black formatting for Python code
- ESLint configuration in `.eslintrc.js`
- Prettier for code formatting

### Git Workflow
1. Create feature branch: `git checkout -b feature/aid-request-system`
2. Make changes and commit: `git commit -m "feat: add aid request creation"`
3. Push and create PR: `git push origin feature/aid-request-system`
4. Code review and merge

### Commit Message Format
```
type(scope): description

feat(backend): add user authentication
fix(mobile): resolve map rendering issue
docs(readme): update setup instructions
```

## 🆘 Support

### Getting Help
- Check documentation in `docs/` folder
- Review issue tracker in GitHub
- Ask questions in team chat
- Schedule pair programming session

### Emergency Contacts
- Backend Issues: Node.js Engineer
- AI/ML Issues: Data Analysis Team
- Mobile Issues: Mobile Developer
- Design Issues: Design Team

This development guide should help you get started with SmartRelief development. Update this document as the project evolves!
