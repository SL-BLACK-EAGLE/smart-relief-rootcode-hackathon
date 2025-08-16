"""
AI Disaster Relief Service - FastAPI Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
import os

# ✅ Fix imports - use app.module_name for absolute imports
from app.config.settings import get_settings
from app.config.database import init_database, engine
from app.api import damage_assessment, priority_scoring, analytics, charts, weather
from sqlalchemy import text

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get settings
settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager"""
    # Startup
    try:
        logger.info("Initializing database...")

        # ✅ Fix model imports - use app.models.module_name
        from app.models.damage_assessment import DamageAssessmentModel
        from app.models.priority_scoring import PriorityScoreModel
        from app.models.resource_prediction import ResourcePredictionModel

        init_database()
        logger.info("Database initialization completed successfully")

        # ✅ Enhanced database table verification (compatible with both PostgreSQL and SQLite)
        try:
            with engine.connect() as conn:
                if 'postgresql' in str(engine.url):
                    # Check if tables exist in PostgreSQL
                    result = conn.execute(text("""
                        SELECT table_name 
                        FROM information_schema.tables 
                        WHERE table_schema = 'public' 
                        AND table_type = 'BASE TABLE'
                        ORDER BY table_name
                    """))
                else:
                    # SQLite fallback
                    result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"))

                tables = [row[0] for row in result]

                logger.info("✅ Database Tables Created Successfully:")
                for table in tables:
                    logger.info(f"  📋 {table}")

                # Verify required tables
                required_tables = ['damage_assessments', 'priority_scores', 'resource_predictions']
                missing = [t for t in required_tables if t not in tables]

                if missing:
                    logger.error(f"❌ Missing required tables: {missing}")
                else:
                    logger.info(f"✅ All required tables present: {len(tables)} total")

        except Exception as e:
            logger.warning(f"Table verification failed: {e}")

        # ✅ Create required directories
        directories = [
            "uploads",
            "ml_models/damage_classifier",
            "ml_models/priority_scorer",
            "ml_models/demand_predictor",
            "weather_reports",
            "data/training",
            "data/validation",
            "data/test"
        ]

        for directory in directories:
            os.makedirs(directory, exist_ok=True)

        logger.info("✅ Required directories created")

    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        if not settings.debug:
            raise

    yield

    # Shutdown
    logger.info("Application shutting down...")

# Create FastAPI app with lifespan
app = FastAPI(
    title="AI Disaster Relief System",
    description="AI-powered disaster relief and damage assessment system with comprehensive image analysis and weather prediction",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(damage_assessment.router)  # /api/v1/damage
app.include_router(priority_scoring.router)   # /api/v1/priority
app.include_router(analytics.router)          # /api/v1/analytics
app.include_router(charts.router)             # /api/v1/charts
app.include_router(weather.router)            # /api/v1/weather

# Legacy backward compatibility: expose old unversioned paths for a short transition
from fastapi import APIRouter as _LegacyRouter
_legacy_router = _LegacyRouter()

@_legacy_router.post('/analyze-by-url')
async def _legacy_analyze(payload: dict):
    from app.api.damage_assessment import analyze_damage_by_url, AnalyzeByUrlPayload
    from app.config.database import SessionLocal
    model = AnalyzeByUrlPayload(**payload)
    db = SessionLocal()
    try:
        return await analyze_damage_by_url(model, db)
    finally:
        db.close()

app.include_router(_legacy_router)

@app.get("/metrics")
async def metrics():
    return {"service": "ai-service", "status": "ok"}

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to AI Disaster Relief API",
        "version": "1.0.0",
        "features": [
            "Image-based damage assessment",
            "Priority scoring system",
            "Weather-based disaster prediction",
            "DMC report analysis",
            "Real-time analytics"
        ],
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "AI Disaster Relief System",
        "version": settings.app_version,
        "database": "connected"
    }

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler with detailed error information"""
    logger.error(f"Global exception on {request.url}: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": f"Internal server error: {str(exc)}",
            "type": type(exc).__name__,
            "endpoint": str(request.url),
            "method": request.method
        }
    )