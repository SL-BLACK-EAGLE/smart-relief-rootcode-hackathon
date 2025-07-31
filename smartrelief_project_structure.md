# SmartRelief - Complete Project Structure
## 5-Day Sprint with 7 Team Members

```
smartrelief/
├── README.md
├── .gitignore
├── .env.example
├── docker-compose.yml
├── docker-compose.prod.yml
├── package.json
├── lerna.json
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── mobile-build.yml
│       └── backend-deploy.yml
├── docs/
│   ├── API.md
│   ├── DEPLOYMENT.md
│   ├── DEVELOPMENT.md
│   └── USER_GUIDE.md
├── scripts/
│   ├── setup.sh
│   ├── start-dev.sh
│   ├── build-all.sh
│   └── deploy.sh
├── infrastructure/
│   ├── terraform/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── modules/
│   │       ├── database/
│   │       ├── redis/
│   │       └── kubernetes/
│   ├── kubernetes/
│   │   ├── namespace.yaml
│   │   ├── configmap.yaml
│   │   ├── secrets.yaml
│   │   └── deployments/
│   │       ├── backend-deployment.yaml
│   │       ├── ai-service-deployment.yaml
│   │       └── ingress.yaml
│   └── docker/
│       ├── backend.Dockerfile
│       ├── ai-service.Dockerfile
│       └── nginx.Dockerfile
├── packages/
│   ├── shared/
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── index.ts
│   │   │   │   ├── user.types.ts
│   │   │   │   ├── aid-request.types.ts
│   │   │   │   ├── resource.types.ts
│   │   │   │   ├── volunteer.types.ts
│   │   │   │   └── donation.types.ts
│   │   │   ├── schemas/
│   │   │   │   ├── auth.schema.ts
│   │   │   │   ├── aid-request.schema.ts
│   │   │   │   └── validation.schema.ts
│   │   │   ├── constants/
│   │   │   │   ├── api-endpoints.ts
│   │   │   │   ├── user-roles.ts
│   │   │   │   └── error-codes.ts
│   │   │   └── utils/
│   │   │       ├── date.utils.ts
│   │   │       ├── geo.utils.ts
│   │   │       └── validation.utils.ts
│   │   └── tsconfig.json
│   ├── backend/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── .env.example
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── app.ts
│   │   │   ├── config/
│   │   │   │   ├── database.ts
│   │   │   │   ├── redis.ts
│   │   │   │   ├── jwt.ts
│   │   │   │   └── socket.ts
│   │   │   ├── middleware/
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── validation.middleware.ts
│   │   │   │   ├── error.middleware.ts
│   │   │   │   ├── rate-limit.middleware.ts
│   │   │   │   └── cors.middleware.ts
│   │   │   ├── routes/
│   │   │   │   ├── index.ts
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── users.routes.ts
│   │   │   │   ├── aid-requests.routes.ts
│   │   │   │   ├── resources.routes.ts
│   │   │   │   ├── volunteers.routes.ts
│   │   │   │   ├── donations.routes.ts
│   │   │   │   └── notifications.routes.ts
│   │   │   ├── controllers/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── users.controller.ts
│   │   │   │   ├── aid-requests.controller.ts
│   │   │   │   ├── resources.controller.ts
│   │   │   │   ├── volunteers.controller.ts
│   │   │   │   ├── donations.controller.ts
│   │   │   │   └── notifications.controller.ts
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   ├── aid-request.service.ts
│   │   │   │   ├── resource.service.ts
│   │   │   │   ├── volunteer.service.ts
│   │   │   │   ├── donation.service.ts
│   │   │   │   ├── notification.service.ts
│   │   │   │   ├── email.service.ts
│   │   │   │   ├── sms.service.ts
│   │   │   │   └── ai-integration.service.ts
│   │   │   ├── socket/
│   │   │   │   ├── index.ts
│   │   │   │   ├── emergency.socket.ts
│   │   │   │   ├── volunteer.socket.ts
│   │   │   │   └── notifications.socket.ts
│   │   │   ├── utils/
│   │   │   │   ├── logger.ts
│   │   │   │   ├── password.ts
│   │   │   │   ├── jwt.ts
│   │   │   │   ├── geocoding.ts
│   │   │   │   └── file-upload.ts
│   │   │   └── types/
│   │   │       ├── express.d.ts
│   │   │       └── socket.types.ts
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   │   ├── services/
│   │   │   │   └── controllers/
│   │   │   ├── integration/
│   │   │   │   ├── auth.test.ts
│   │   │   │   ├── aid-requests.test.ts
│   │   │   │   └── volunteers.test.ts
│   │   │   ├── fixtures/
│   │   │   │   ├── users.fixture.ts
│   │   │   │   └── aid-requests.fixture.ts
│   │   │   └── setup.ts
│   │   └── Dockerfile
│   ├── ai-service/
│   │   ├── requirements.txt
│   │   ├── Dockerfile
│   │   ├── .env.example
│   │   ├── main.py
│   │   ├── app/
│   │   │   ├── __init__.py
│   │   │   ├── main.py
│   │   │   ├── config/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── database.py
│   │   │   │   └── settings.py
│   │   │   ├── models/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── damage_assessment.py
│   │   │   │   ├── priority_scoring.py
│   │   │   │   ├── resource_prediction.py
│   │   │   │   └── base.py
│   │   │   ├── services/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── cv_service.py
│   │   │   │   ├── ml_service.py
│   │   │   │   ├── analytics_service.py
│   │   │   │   └── geospatial_service.py
│   │   │   ├── api/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── damage_assessment.py
│   │   │   │   ├── priority_scoring.py
│   │   │   │   ├── analytics.py
│   │   │   │   └── charts.py
│   │   │   ├── utils/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── image_processing.py
│   │   │   │   ├── data_preprocessing.py
│   │   │   │   └── validators.py
│   │   │   └── schemas/
│   │   │       ├── __init__.py
│   │   │       ├── damage_assessment.py
│   │   │       ├── analytics.py
│   │   │       └── charts.py
│   │   ├── ml_models/
│   │   │   ├── damage_classifier/
│   │   │   │   ├── model.pkl
│   │   │   │   └── preprocessor.pkl
│   │   │   ├── priority_scorer/
│   │   │   │   └── model.pkl
│   │   │   └── demand_predictor/
│   │   │       └── model.pkl
│   │   ├── data/
│   │   │   ├── training/
│   │   │   ├── validation/
│   │   │   └── test/
│   │   ├── notebooks/
│   │   │   ├── damage_assessment_training.ipynb
│   │   │   ├── priority_scoring_model.ipynb
│   │   │   └── data_analysis.ipynb
│   │   └── tests/
│   │       ├── test_cv_service.py
│   │       ├── test_ml_service.py
│   │       └── test_api.py
│   └── mobile/
│       ├── package.json
│       ├── app.json
│       ├── babel.config.js
│       ├── metro.config.js
│       ├── tailwind.config.js
│       ├── tsconfig.json
│       ├── .env.example
│       ├── assets/
│       │   ├── images/
│       │   │   ├── logo.png
│       │   │   ├── splash.png
│       │   │   └── icons/
│       │   │       ├── emergency.png
│       │   │       ├── volunteer.png
│       │   │       ├── donor.png
│       │   │       └── admin.png
│       │   ├── fonts/
│       │   └── sounds/
│       │       ├── alert.mp3
│       │       └── notification.mp3
│       ├── src/
│       │   ├── App.tsx
│       │   ├── components/
│       │   │   ├── common/
│       │   │   │   ├── Button.tsx
│       │   │   │   ├── Input.tsx
│       │   │   │   ├── Card.tsx
│       │   │   │   ├── LoadingSpinner.tsx
│       │   │   │   ├── ErrorBoundary.tsx
│       │   │   │   └── SafeAreaWrapper.tsx
│       │   │   ├── forms/
│       │   │   │   ├── LoginForm.tsx
│       │   │   │   ├── RegisterForm.tsx
│       │   │   │   ├── AidRequestForm.tsx
│       │   │   │   ├── DonationForm.tsx
│       │   │   │   └── VolunteerSignupForm.tsx
│       │   │   ├── charts/
│       │   │   │   ├── AidDistributionChart.tsx
│       │   │   │   ├── DonationImpactChart.tsx
│       │   │   │   ├── VolunteerActivityChart.tsx
│       │   │   │   └── RegionalStatsChart.tsx
│       │   │   ├── maps/
│       │   │   │   ├── AidRequestMap.tsx
│       │   │   │   ├── VolunteerMap.tsx
│       │   │   │   └── ResourceMap.tsx
│       │   │   └── notifications/
│       │   │       ├── PushNotificationHandler.tsx
│       │   │       ├── EmergencyAlert.tsx
│       │   │       └── NotificationBanner.tsx
│       │   ├── screens/
│       │   │   ├── auth/
│       │   │   │   ├── LoginScreen.tsx
│       │   │   │   ├── RegisterScreen.tsx
│       │   │   │   ├── RoleSelectionScreen.tsx
│       │   │   │   └── ForgotPasswordScreen.tsx
│       │   │   ├── victim/
│       │   │   │   ├── VictimDashboard.tsx
│       │   │   │   ├── CreateAidRequestScreen.tsx
│       │   │   │   ├── AidRequestStatusScreen.tsx
│       │   │   │   └── EmergencyContactsScreen.tsx
│       │   │   ├── donor/
│       │   │   │   ├── DonorDashboard.tsx
│       │   │   │   ├── DonateResourcesScreen.tsx
│       │   │   │   ├── DonationHistoryScreen.tsx
│       │   │   │   └── ImpactTrackingScreen.tsx
│       │   │   ├── volunteer/
│       │   │   │   ├── VolunteerDashboard.tsx
│       │   │   │   ├── AvailableTasksScreen.tsx
│       │   │   │   ├── TaskDetailsScreen.tsx
│       │   │   │   ├── TaskTrackingScreen.tsx
│       │   │   │   └── VolunteerProfileScreen.tsx
│       │   │   ├── admin/
│       │   │   │   ├── AdminDashboard.tsx
│       │   │   │   ├── AidRequestManagement.tsx
│       │   │   │   ├── VolunteerManagement.tsx
│       │   │   │   ├── ResourceManagement.tsx
│       │   │   │   └── AnalyticsScreen.tsx
│       │   │   └── shared/
│       │   │       ├── ProfileScreen.tsx
│       │   │       ├── SettingsScreen.tsx
│       │   │       ├── NotificationsScreen.tsx
│       │   │       └── HelpScreen.tsx
│       │   ├── navigation/
│       │   │   ├── AppNavigator.tsx
│       │   │   ├── AuthNavigator.tsx
│       │   │   ├── VictimNavigator.tsx
│       │   │   ├── DonorNavigator.tsx
│       │   │   ├── VolunteerNavigator.tsx
│       │   │   └── AdminNavigator.tsx
│       │   ├── services/
│       │   │   ├── api/
│       │   │   │   ├── index.ts
│       │   │   │   ├── auth.api.ts
│       │   │   │   ├── aid-requests.api.ts
│       │   │   │   ├── volunteers.api.ts
│       │   │   │   ├── donations.api.ts
│       │   │   │   ├── analytics.api.ts
│       │   │   │   └── notifications.api.ts
│       │   │   ├── location/
│       │   │   │   ├── location.service.ts
│       │   │   │   └── geocoding.service.ts
│       │   │   ├── storage/
│       │   │   │   ├── secure-storage.ts
│       │   │   │   ├── async-storage.ts
│       │   │   │   └── sqlite.service.ts
│       │   │   ├── camera/
│       │   │   │   └── image-capture.service.ts
│       │   │   ├── notifications/
│       │   │   │   ├── push-notifications.service.ts
│       │   │   │   └── local-notifications.service.ts
│       │   │   └── socket/
│       │   │       ├── socket.service.ts
│       │   │       └── realtime.service.ts
│       │   ├── hooks/
│       │   │   ├── useAuth.ts
│       │   │   ├── useLocation.ts
│       │   │   ├── useSocket.ts
│       │   │   ├── useOfflineSync.ts
│       │   │   ├── useNotifications.ts
│       │   │   └── useImagePicker.ts
│       │   ├── store/
│       │   │   ├── index.ts
│       │   │   ├── slices/
│       │   │   │   ├── auth.slice.ts
│       │   │   │   ├── aid-requests.slice.ts
│       │   │   │   ├── volunteers.slice.ts
│       │   │   │   ├── donations.slice.ts
│       │   │   │   ├── notifications.slice.ts
│       │   │   │   └── offline.slice.ts
│       │   │   └── middleware/
│       │   │       ├── api.middleware.ts
│       │   │       └── offline.middleware.ts
│       │   ├── utils/
│       │   │   ├── constants.ts
│       │   │   ├── helpers.ts
│       │   │   ├── validation.ts
│       │   │   ├── formatting.ts
│       │   │   ├── permissions.ts
│       │   │   └── error-handling.ts
│       │   └── types/
│       │       ├── index.ts
│       │       ├── navigation.types.ts
│       │       ├── api.types.ts
│       │       └── component.types.ts
│       ├── __tests__/
│       │   ├── components/
│       │   ├── screens/
│       │   ├── services/
│       │   └── utils/
│       └── .expo/
├── design/
│   ├── figma/
│   │   ├── Design_System.fig
│   │   ├── Mobile_Wireframes.fig
│   │   ├── High_Fidelity_Designs.fig
│   │   └── Data_Visualization_Components.fig
│   ├── assets/
│   │   ├── wireframes/
│   │   │   ├── victim-flow.png
│   │   │   ├── donor-flow.png
│   │   │   ├── volunteer-flow.png
│   │   │   └── admin-dashboard.png
│   │   ├── mockups/
│   │   │   ├── mobile-screens/
│   │   │   └── web-dashboard/
│   │   ├── icons/
│   │   │   ├── svg/
│   │   │   └── png/
│   │   └── illustrations/
│   ├── style-guide/
│   │   ├── colors.json
│   │   ├── typography.json
│   │   ├── spacing.json
│   │   └── components.json
│   └── user-research/
│       ├── personas.md
│       ├── user-journeys.md
│       └── usability-tests/
└── database/
    ├── init/
    │   ├── 01-create-extensions.sql
    │   ├── 02-create-enums.sql
    │   └── 03-initial-data.sql
    ├── backups/
    └── migrations/
        └── manual/
```

---

## 📋 Key Files Breakdown by Team Member

### **Day 1: Foundation Setup**

#### **🎨 Figma Designers (2)**
**Designer 1 - Design System Lead:**
```
design/style-guide/
├── colors.json
├── typography.json
├── spacing.json
└── components.json

design/figma/Design_System.fig
design/assets/icons/
```

**Designer 2 - UX Flow Lead:**
```
design/figma/Mobile_Wireframes.fig
design/wireframes/
├── victim-flow.png
├── donor-flow.png
├── volunteer-flow.png
└── admin-dashboard.png

design/user-research/
├── personas.md
└── user-journeys.md
```

#### **🔧 Backend Engineer - Database & Setup:**
```
packages/backend/prisma/schema.prisma
packages/backend/src/config/
├── database.ts
├── redis.ts
└── jwt.ts

database/init/
├── 01-create-extensions.sql
├── 02-create-enums.sql
└── 03-initial-data.sql

docker-compose.yml
```

#### **🤖 Python Data Analysts (3)**
**Analyst 1 - FastAPI Setup:**
```
packages/ai-service/main.py
packages/ai-service/app/config/
├── database.py
└── settings.py

packages/ai-service/requirements.txt
packages/ai-service/Dockerfile
```

**Analyst 2 - OpenCV Integration:**
```
packages/ai-service/app/services/cv_service.py
packages/ai-service/app/utils/image_processing.py
packages/ai-service/app/api/damage_assessment.py
```

**Analyst 3 - ML Models Foundation:**
```
packages/ai-service/app/models/
├── damage_assessment.py
├── priority_scoring.py
└── base.py

packages/ai-service/notebooks/damage_assessment_training.ipynb
```

#### **📱 Mobile Developer - Project Setup:**
```
packages/mobile/App.tsx
packages/mobile/src/navigation/AppNavigator.tsx
packages/mobile/src/services/api/index.ts
packages/mobile/src/store/index.ts
packages/mobile/tailwind.config.js
```

---

### **Day 2: Core Development**

#### **🎨 Figma Designers**
**Designer 1:**
```
design/figma/High_Fidelity_Designs.fig
design/mockups/mobile-screens/
├── login-screens/
├── dashboard-screens/
└── aid-request-screens/
```

**Designer 2:**
```
design/figma/Data_Visualization_Components.fig
design/mockups/mobile-screens/
├── charts-screens/
├── maps-screens/
└── volunteer-screens/
```

#### **🔧 Backend Engineer - Core APIs:**
```
packages/backend/src/routes/
├── auth.routes.ts
├── users.routes.ts
└── aid-requests.routes.ts

packages/backend/src/controllers/
├── auth.controller.ts
├── users.controller.ts
└── aid-requests.controller.ts

packages/backend/src/services/
├── auth.service.ts
├── user.service.ts
└── aid-request.service.ts

packages/backend/src/middleware/
├── auth.middleware.ts
└── validation.middleware.ts
```

#### **🤖 Python Data Analysts**
**Analyst 1 - Damage Assessment AI:**
```
packages/ai-service/app/models/damage_assessment.py
packages/ai-service/app/services/ml_service.py
packages/ai-service/ml_models/damage_classifier/
```

**Analyst 2 - Priority Scoring:**
```
packages/ai-service/app/models/priority_scoring.py
packages/ai-service/app/api/priority_scoring.py
packages/ai-service/ml_models/priority_scorer/
```

**Analyst 3 - Analytics Pipeline:**
```
packages/ai-service/app/services/analytics_service.py
packages/ai-service/app/api/analytics.py
packages/ai-service/notebooks/data_analysis.ipynb
```

#### **📱 Mobile Developer - Authentication & Navigation:**
```
packages/mobile/src/screens/auth/
├── LoginScreen.tsx
├── RegisterScreen.tsx
└── RoleSelectionScreen.tsx

packages/mobile/src/navigation/
├── AuthNavigator.tsx
├── VictimNavigator.tsx
└── DonorNavigator.tsx

packages/mobile/src/services/api/auth.api.ts
packages/mobile/src/store/slices/auth.slice.ts
```

---

### **Day 3: Feature Development**

#### **🎨 Figma Designers - Finalization:**
```
design/mockups/mobile-screens/ (Complete all screens)
design/assets/icons/ (Export all icons)
design/style-guide/ (Finalize component specs)
```

#### **🔧 Backend Engineer - Advanced Features:**
```
packages/backend/src/routes/
├── resources.routes.ts
├── volunteers.routes.ts
└── donations.routes.ts

packages/backend/src/socket/
├── emergency.socket.ts
├── volunteer.socket.ts
└── notifications.socket.ts

packages/backend/src/services/
├── notification.service.ts
├── email.service.ts
└── sms.service.ts
```

#### **🤖 Python Data Analysts - Advanced AI:**
**Analyst 1 - Integration APIs:**
```
packages/ai-service/app/api/charts.py
packages/ai-service/app/services/geospatial_service.py
```

**Analyst 2 - Visualization Data:**
```
packages/ai-service/app/schemas/charts.py
packages/ai-service/app/utils/data_preprocessing.py
```

**Analyst 3 - Performance Optimization:**
```
packages/ai-service/ml_models/demand_predictor/
packages/ai-service/tests/ (All test files)
```

#### **📱 Mobile Developer - Core Features:**
```
packages/mobile/src/screens/victim/
├── VictimDashboard.tsx
├── CreateAidRequestScreen.tsx
└── AidRequestStatusScreen.tsx

packages/mobile/src/components/maps/
├── AidRequestMap.tsx
└── ResourceMap.tsx

packages/mobile/src/services/
├── location/location.service.ts
├── camera/image-capture.service.ts
└── socket/socket.service.ts
```

---

### **Day 4: Advanced Features & Integration**

#### **🔧 Backend Engineer - Real-time Features:**
```
packages/backend/src/utils/
├── geocoding.ts
├── file-upload.ts
└── logger.ts

packages/backend/tests/integration/
├── auth.test.ts
├── aid-requests.test.ts
└── volunteers.test.ts
```

#### **🤖 Python Data Analysts - Data Visualization:**
```
Complete all visualization endpoints and data processing
Optimize ML models for production
Implement geospatial analysis features
```

#### **📱 Mobile Developer - Charts & Advanced UI:**
```
packages/mobile/src/components/charts/
├── AidDistributionChart.tsx
├── DonationImpactChart.tsx
├── VolunteerActivityChart.tsx
└── RegionalStatsChart.tsx

packages/mobile/src/screens/donor/
├── DonorDashboard.tsx
├── DonateResourcesScreen.tsx
└── ImpactTrackingScreen.tsx

packages/mobile/src/screens/volunteer/
├── VolunteerDashboard.tsx
├── AvailableTasksScreen.tsx
└── TaskTrackingScreen.tsx
```

---

### **Day 5: Integration, Testing & Deployment**

#### **All Team Members - Integration Tasks:**
```
Integration testing between all services
Performance optimization
Bug fixes and polishing
Documentation completion
Deployment setup
```

#### **Deployment Files (Backend Engineer + Analyst 1):**
```
infrastructure/kubernetes/
├── namespace.yaml
├── configmap.yaml
├── secrets.yaml
└── deployments/

infrastructure/docker/
├── backend.Dockerfile
├── ai-service.Dockerfile
└── nginx.Dockerfile

scripts/
├── setup.sh
├── start-dev.sh
├── build-all.sh
└── deploy.sh
```

---

## 🚀 Critical Files for Day 1 Setup

### **Root Configuration Files:**

#### **docker-compose.yml**
```yaml
version: '3.8'
services:
  postgres:
    image: postgis/postgis:15-3.3
    environment:
      POSTGRES_DB: smartrelief
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init:/docker-entrypoint-initdb.d

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build:
      context: ./packages/backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/smartrelief
      REDIS_URL: redis://redis:6379
      JWT_SECRET: your-secret-key
    depends_on:
      - postgres
      - redis

  ai-service:
    build:
      context: ./packages/ai-service
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/smartrelief
    depends_on:
      - postgres

volumes:
  postgres_data:
```

#### **package.json (Root)**
```json
{
  "name": "smartrelief",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "dev": "docker-compose up -d && npm run dev:backend & npm run dev:ai & npm run dev:mobile",
    "dev:backend": "cd packages/backend && npm run dev",
    "dev:ai": "cd packages/ai-service && python main.py",
    "dev:mobile": "cd packages/mobile && expo start",
    "build": "npm run build:backend && npm run build:ai",
    "build:backend": "cd packages/backend && npm run build",
    "build:ai": "cd packages/ai-service && docker build -