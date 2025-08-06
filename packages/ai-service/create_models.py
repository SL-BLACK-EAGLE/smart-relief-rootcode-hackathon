import pickle
import os

# Simple placeholder models that work with the ML service
class PlaceholderDamageClassifier:
    def predict(self, X):
        import numpy as np
        return np.array([1] * len(X))  # Always predict "Moderate"

    def predict_proba(self, X):
        import numpy as np
        return np.array([[0.2, 0.6, 0.2]] * len(X))  # Moderate confidence

class PlaceholderPriorityScorer:
    def predict(self, X):
        import numpy as np
        return np.array([60.0] * len(X))  # Always predict medium priority (60/100)

class PlaceholderDemandPredictor:
    def predict(self, X):
        import numpy as np
        return np.array([[2, 1, 1, 15000]] * len(X))  # [medical_personnel, rescue_teams, vehicles, cost]

# Create damage classifier
os.makedirs('ml_models/damage_classifier', exist_ok=True)
with open('ml_models/damage_classifier/model.pkl', 'wb') as f:
    pickle.dump(PlaceholderDamageClassifier(), f)

# Create priority scorer
os.makedirs('ml_models/priority_scorer', exist_ok=True)
with open('ml_models/priority_scorer/model.pkl', 'wb') as f:
    pickle.dump(PlaceholderPriorityScorer(), f)

# Create demand predictor
os.makedirs('ml_models/demand_predictor', exist_ok=True)
with open('ml_models/demand_predictor/model.pkl', 'wb') as f:
    pickle.dump(PlaceholderDemandPredictor(), f)

print("All placeholder models created successfully!")
