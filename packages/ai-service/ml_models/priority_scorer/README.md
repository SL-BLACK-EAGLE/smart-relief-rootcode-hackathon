# Priority Scorer Model Directory
This directory contains the trained priority scoring model for disaster response prioritization.

## Files:
- `model.pkl`: Trained priority scoring model
- `preprocessor.pkl`: Data preprocessor for model input

## Usage:
The model takes features like damage level, confidence score, population density, accessibility score, and weather risk to predict priority scores (0-100).

## Training:
Use the notebook `notebooks/priority_scoring_model.ipynb` to retrain the model with new data.
