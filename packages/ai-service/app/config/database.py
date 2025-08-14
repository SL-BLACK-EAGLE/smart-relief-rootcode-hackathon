from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from ..models.base import Base
import logging

from ..config.settings import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

# Create SQLAlchemy engine with proper configuration
engine = create_engine(
    settings.database_url,
    echo=settings.debug,  # Log SQL queries in debug mode
    pool_pre_ping=True,   # Verify connections before use
    pool_recycle=300      # Recycle connections every 5 minutes
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_database():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_database():
    """Initialize database and create all tables"""
    try:
        logger.info("Starting database initialization...")
        
        # Import all models BEFORE creating tables
        from ..models.damage_assessment import DamageAssessmentModel
        from ..models.priority_scoring import PriorityScoreModel
        from ..models.resource_prediction import ResourcePredictionModel

        model_names = [
            DamageAssessmentModel.__tablename__,
            PriorityScoreModel.__tablename__,
            ResourcePredictionModel.__tablename__
        ]
        logger.info(f"Creating tables for models: {model_names}")

        # Test database connection first
        with engine.connect() as conn:
            logger.info("Database connection successful")
            
            # For PostgreSQL, ensure the schema exists
            if 'postgresql' in str(engine.url):
                conn.execute(text("CREATE SCHEMA IF NOT EXISTS public"))
                conn.commit()
                logger.info("PostgreSQL schema verified")

        # Create all tables
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")

        # Test basic connection
        with engine.connect() as conn:
            if 'postgresql' in str(engine.url):
                result = conn.execute(text("SELECT 1"))
            else:
                result = conn.execute(text("SELECT 1"))
            logger.info("Database connection test successful")

    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise