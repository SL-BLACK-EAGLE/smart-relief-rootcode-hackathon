from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from ..models.base import Base
import logging

from ..config.settings import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

# Create SQLAlchemy engine
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

        logger.info("Models imported successfully")

        # Test database connection first
        with engine.connect() as conn:
            logger.info("Database connection successful")
            
            # For PostgreSQL, ensure the schema exists
            if 'postgresql' in str(engine.url):
                conn.execute(text("CREATE SCHEMA IF NOT EXISTS public"))
                conn.commit()
        
        # Create all tables
        logger.info("Creating database tables...")
        Base.metadata.create_all(bind=engine, checkfirst=True)
        
        # Verify tables were created
        with engine.connect() as conn:
            if 'postgresql' in str(engine.url):
                result = conn.execute(text("""
                    SELECT table_name 
                    FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_type = 'BASE TABLE'
                """))
            else:
                result = conn.execute(text("""
                    SELECT name 
                    FROM sqlite_master 
                    WHERE type='table'
                """))
            
            tables = [row[0] for row in result]
            logger.info(f"Tables created successfully: {tables}")
            
            # Verify specific tables exist
            expected_tables = ['damage_assessments', 'priority_scores', 'resource_predictions']
            missing_tables = [t for t in expected_tables if t not in tables]
            if missing_tables:
                logger.error(f"Missing tables: {missing_tables}")
                raise Exception(f"Failed to create tables: {missing_tables}")
            
        logger.info("Database initialization completed successfully")
        
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise