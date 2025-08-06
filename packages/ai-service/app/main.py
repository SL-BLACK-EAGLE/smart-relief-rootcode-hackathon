"""
AI Disaster Relief Service - FastAPI Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

# ✅ Fix imports - use app.module_name for absolute imports
from app.config.settings import get_settings
from app.config.database import init_database, engine
from app.api import damage_assessment, priority_scoring, analytics, charts
from sqlalchemy import text

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get settings
settings = get_settings()

# Create FastAPI app
app = FastAPI(
    title="AI Disaster Relief System",
    description="AI-powered disaster relief and damage assessment system",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    """Initialize database tables on application startup"""
    try:
        logger.info("Initializing database...")

        # ✅ Fix model imports - use app.models.module_name
        from app.models.damage_assessment import DamageAssessmentModel
        from app.models.priority_scoring import PriorityScoreModel
        from app.models.resource_prediction import ResourcePredictionModel

        init_database()
        logger.info("Database initialization completed successfully")

        # ✅ Enhanced PostgreSQL table verification
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
                    tables = [row[0] for row in result]

                    logger.info("✅ PostgreSQL Tables Created Successfully:")
                    for table in tables:
                        logger.info(f"  📋 {table}")

                    # Verify required tables
                    required_tables = ['damage_assessments', 'priority_scores', 'resource_predictions']
                    missing = [t for t in required_tables if t not in tables]

                    if missing:
                        logger.error(f"❌ Missing required tables: {missing}")
                    else:
                        logger.info(f"✅ All required tables present: {len(tables)} total")

                else:
                    # SQLite fallback
                    result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table'"))
                    tables = [row[0] for row in result]
                    logger.info(f"SQLite tables created: {tables}")

        except Exception as e:
            logger.warning(f"Table verification failed: {e}")

    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        if not settings.debug:
            raise

# Include API routers
app.include_router(damage_assessment.router, prefix="/api/v1/damage", tags=["Damage Assessment"])
app.include_router(priority_scoring.router, prefix="/api/v1/priority", tags=["Priority Scoring"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])
app.include_router(charts.router, prefix="/api/v1/charts", tags=["Charts"])

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI Disaster Relief System API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "ai-disaster-relief",
        "version": "1.0.0"
    }

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Global exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"message": "Internal server error", "detail": str(exc)}
    )