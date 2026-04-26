"""
iCARE++ Machine Learning Module
Student Performance Prediction using Random Forest and Logistic Regression
"""

import os
import json
import joblib
import numpy as np
from datetime import datetime


class PerformancePredictor:
    """
    ML-based student performance prediction model.
    Uses Random Forest and Logistic Regression to identify at-risk students.
    """

    def __init__(self):
        self.model_path = os.path.join(os.path.dirname(__file__), "models")
        self.model = None
        self.scaler = None
        self.feature_names = [
            "quiz_attempts",
            "average_score",
            "time_spent_minutes",
            "completion_rate",
            "recent_trend",
            "competency_scores",
        ]
        self._load_or_create_model()

    def _load_or_create_model(self):
        """Load pre-trained model or create baseline."""
        model_file = os.path.join(self.model_path, "performance_model.pkl")

        if os.path.exists(model_file):
            try:
                self.model = joblib.load(model_file)
                return
            except:
                pass

        self.model = self._create_baseline_model()

    def _create_baseline_model(self):
        """Create a simple baseline model for demonstration."""
        from sklearn.ensemble import RandomForestClassifier
        from sklearn.preprocessing import StandardScaler

        model = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)

        scaler = StandardScaler()

        X_train = np.array(
            [
                [5, 85, 120, 0.8, 0.9, 75],
                [3, 65, 90, 0.5, 0.6, 55],
                [8, 92, 200, 0.95, 0.95, 88],
                [2, 45, 60, 0.3, 0.4, 35],
                [6, 78, 150, 0.7, 0.75, 70],
                [1, 55, 45, 0.25, 0.3, 40],
                [4, 70, 100, 0.6, 0.65, 60],
                [7, 88, 180, 0.9, 0.88, 82],
            ]
        )
        y_train = np.array([0, 1, 0, 1, 0, 1, 1, 0])

        scaler.fit(X_train)
        X_scaled = scaler.transform(X_train)
        model.fit(X_scaled, y_train)

        os.makedirs(self.model_path, exist_ok=True)
        joblib.dump(model, model_file)

        self.scaler = scaler
        return model

    def predict_risk(self, student_data: dict) -> dict:
        """
        Predict if a student is at risk.

        Args:
            student_data: Dictionary with student metrics
                - quiz_attempts: int
                - average_score: float
                - time_spent_minutes: int
                - completion_rate: float (0-1)
                - recent_trend: float (0-1)
                - competency_scores: float

        Returns:
            dict with risk prediction and confidence
        """
        features = np.array(
            [
                [
                    student_data.get("quiz_attempts", 0),
                    student_data.get("average_score", 0),
                    student_data.get("time_spent_minutes", 0),
                    student_data.get("completion_rate", 0),
                    student_data.get("recent_trend", 0),
                    student_data.get("competency_scores", 0),
                ]
            ]
        )

        if self.scaler:
            features = self.scaler.transform(features)

        prediction = self.model.predict(features)[0]
        probabilities = self.model.predict_proba(features)[0]

        risk_level = "high" if prediction == 1 else "low"
        confidence = float(max(probabilities)) * 100

        return {
            "at_risk": bool(prediction == 1),
            "risk_level": risk_level,
            "confidence": round(confidence, 1),
            "probability_high_risk": round(probabilities[1] * 100, 1),
            "probability_low_risk": round(probabilities[0] * 100, 1),
            "timestamp": datetime.now().isoformat(),
        }

    def batch_predict(self, students: list) -> list:
        """Predict risk for multiple students."""
        return [self.predict_risk(s) for s in students]


class AdaptiveQuizEngine:
    """
    Content-based filtering for adaptive quiz recommendations.
    """

    def __init__(self):
        self.question_db = self._load_question_bank()
        self.student_performance = {}

    def _load_question_bank(self) -> dict:
        """Load question bank with competencies."""
        return {
            "vital_signs": {
                "Heart Rate": ["normal", "tachycardia", "bradycardia"],
                "Blood Pressure": ["normal", "hypertension", "hypotension"],
                "Temperature": ["normal", "fever", "hypothermia"],
                "Respiratory Rate": ["normal", "tachypnea", "bradypnea"],
                "Oxygen Saturation": ["normal", "hypoxia"],
            },
            "documentation": {
                "SOAP Notes": ["subjective", "objective", "assessment", "plan"],
                "Flow Sheets": ["intake", "output", "vitals"],
                "Medication Records": ["dosage", "route", "time"],
            },
            "clinical-decision": {
                "Priority Setting": ["ABCDE", "urgent", "emergent"],
                "Case Analysis": ["assessment", "diagnosis", "planning"],
            },
        }

    def get_recommendations(
        self, student_id: str, weak_competencies: list = None
    ) -> list:
        """
        Get personalized quiz recommendations based on performance.

        Args:
            student_id: Unique student identifier
            weak_competencies: List of competencies needing improvement

        Returns:
            List of recommended quiz topics
        """
        if not weak_competencies:
            weak_competencies = ["vital-signs", "documentation"]

        recommendations = []

        for comp in weak_competencies:
            if comp in self.question_db:
                recommendations.append(
                    {
                        "topic": comp,
                        "priority": "high",
                        "reason": f"Strengthen {comp} competencies",
                    }
                )

        for topic in self.question_db:
            if topic not in weak_competencies:
                recommendations.append(
                    {"topic": topic, "priority": "medium", "reason": f"Review {topic}"}
                )

        return recommendations

    def get_adaptive_difficulty(self, average_score: float) -> str:
        """Determine appropriate difficulty based on performance."""
        if average_score >= 85:
            return "advanced"
        elif average_score >= 70:
            return "intermediate"
        elif average_score >= 50:
            return "beginner"
        else:
            return "foundational"


class VitalSignsAnalyzer:
    """
    Rule-based vital signs anomaly detection.
    Note: Upgrade to ML-based model planned for future iteration.
    """

    NORMAL_RANGES = {
        "heart_rate": {"min": 60, "max": 100, "unit": "bpm"},
        "blood_pressure_systolic": {"min": 90, "max": 120, "unit": "mmHg"},
        "blood_pressure_diastolic": {"min": 60, "max": 80, "unit": "mmHg"},
        "temperature": {"min": 36.1, "max": 37.2, "unit": "°C"},
        "respiratory_rate": {"min": 12, "max": 20, "unit": "breaths/min"},
        "oxygen_saturation": {"min": 95, "max": 100, "unit": "%"},
    }

    def analyze(self, vitals: dict) -> dict:
        """
        Analyze vital signs for abnormalities.

        Args:
            vitals: Dictionary with vital sign values

        Returns:
            dict with analysis results
        """
        results = {"status": "normal", "alerts": [], "values": {}}

        alert_count = 0

        if vitals.get("heart_rate"):
            hr = vitals["heart_rate"]
            status = self._check_range(hr, "heart_rate")
            results["values"]["heart_rate"] = {"value": hr, "status": status}
            if status != "normal":
                alert_count += 1
                results["alerts"].append(f"Heart rate {status}: {hr} bpm")

        if vitals.get("temperature"):
            temp = vitals["temperature"]
            status = self._check_range(temp, "temperature")
            results["values"]["temperature"] = {"value": temp, "status": status}
            if status != "normal":
                alert_count += 1
                results["alerts"].append(f"Temperature {status}: {temp}°C")

        if vitals.get("respiratory_rate"):
            rr = vitals["respiratory_rate"]
            status = self._check_range(rr, "respiratory_rate")
            results["values"]["respiratory_rate"] = {"value": rr, "status": status}
            if status != "normal":
                alert_count += 1
                results["alerts"].append(f"Respiratory rate {status}: {rr}")

        if vitals.get("oxygen_saturation"):
            spo2 = vitals["oxygen_saturation"]
            status = self._check_range(spo2, "oxygen_saturation")
            results["values"]["oxygen_saturation"] = {"value": spo2, "status": status}
            if status != "normal":
                alert_count += 1
                results["alerts"].append(f"SpO2 {status}: {spo2}%")

        if alert_count >= 2:
            results["status"] = "critical"
        elif alert_count == 1:
            results["status"] = "warning"

        return results

    def _check_range(self, value: float, vital_type: str) -> str:
        """Check if value is within normal range."""
        if vital_type not in self.NORMAL_RANGES:
            return "unknown"

        range_dict = self.NORMAL_RANGES[vital_type]

        if value < range_dict["min"]:
            return "low"
        elif value > range_dict["max"]:
            return "high"
        return "normal"


if __name__ == "__main__":
    predictor = PerformancePredictor()
    analyzer = VitalSignsAnalyzer()

    test_student = {
        "quiz_attempts": 5,
        "average_score": 72,
        "time_spent_minutes": 120,
        "completion_rate": 0.7,
        "recent_trend": 0.65,
        "competency_scores": 68,
    }
    print("Student Risk Prediction:", predictor.predict_risk(test_student))

    test_vitals = {
        "heart_rate": 110,
        "temperature": 38.5,
        "respiratory_rate": 22,
        "oxygen_saturation": 93,
    }
    print("Vital Signs Analysis:", analyzer.analyze(test_vitals))
