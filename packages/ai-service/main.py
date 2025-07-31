import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import damage_assessment, priority_scoring, analytics, charts
from app.config.settings import settings

app = FastAPI(
    title="SmartRelief AI Service",
    description="AI/ML services for disaster relief coordination",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(damage_assessment.router, prefix="/api/damage-assessment", tags=["Damage Assessment"])
app.include_router(priority_scoring.router, prefix="/api/priority-scoring", tags=["Priority Scoring"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(charts.router, prefix="/api/charts", tags=["Data Visualization"])

@app.get("/")
async def root():
    return {"message": "SmartRelief AI Service", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-service"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )
