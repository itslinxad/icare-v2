import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import sys

sys.path.insert(0, os.path.dirname(__file__))

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Supabase config
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://elmbgvplnnavvmdnmald.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

# Force mock data for development (bypass Supabase issues)
supabase = None
USE_MOCK_DATA = True
print("Using mock data (Supabase disabled for testing)")

# To enable Supabase, uncomment below:
# if SUPABASE_KEY and len(SUPABASE_KEY) > 10:
#     try:
#         from supabase import create_client, Client
#         supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
#         USE_MOCK_DATA = False
#         print("Connected to Supabase")
#     except Exception as e:
#         print(f"Supabase connection failed: {e}, using mock data")
# else:
#     print("No valid Supabase key, using mock data")

# Mock data for development
MOCK_USERS = [
    {
        "id": "1",
        "email": "student@icare.edu",
        "password_hash": "student123",
        "name": "Student User",
        "role": "student",
    },
    {
        "id": "2",
        "email": "faculty@icare.edu",
        "password_hash": "faculty123",
        "name": "Jane Faculty",
        "role": "faculty",
    },
    {
        "id": "3",
        "email": "admin@icare.edu",
        "password_hash": "admin123",
        "name": "System Admin",
        "role": "admin",
    },
]

MOCK_PATIENTS = [
    {
        "id": "1",
        "name": "Juan dela Cruz",
        "age": 45,
        "gender": "Male",
        "room_number": "Room 101",
        "diagnosis": "Hypertension",
        "vital_signs": {
            "heart_rate": 72,
            "blood_pressure": "140/90",
            "temperature": 36.5,
            "respiratory_rate": 16,
            "oxygen_saturation": 98,
        },
    },
    {
        "id": "2",
        "name": "Maria Santos",
        "age": 32,
        "gender": "Female",
        "room_number": "Room 102",
        "diagnosis": "Post-operative care",
        "vital_signs": {
            "heart_rate": 80,
            "blood_pressure": "120/80",
            "temperature": 37.0,
            "respiratory_rate": 18,
            "oxygen_saturation": 97,
        },
    },
    {
        "id": "3",
        "name": "Pedro Garcia",
        "age": 58,
        "gender": "Male",
        "room_number": "Room 103",
        "diagnosis": "Diabetes Type 2",
        "vital_signs": {
            "heart_rate": 76,
            "blood_pressure": "130/85",
            "temperature": 36.8,
            "respiratory_rate": 15,
            "oxygen_saturation": 96,
        },
    },
    {
        "id": "4",
        "name": "Ana Reyes",
        "age": 28,
        "gender": "Female",
        "room_number": "Room 104",
        "diagnosis": "Prenatal care",
        "vital_signs": {
            "heart_rate": 78,
            "blood_pressure": "110/70",
            "temperature": 36.6,
            "respiratory_rate": 16,
            "oxygen_saturation": 99,
        },
    },
    {
        "id": "5",
        "name": "Carlos Mendoza",
        "age": 65,
        "gender": "Male",
        "room_number": "Room 105",
        "diagnosis": "Pneumonia",
        "vital_signs": {
            "heart_rate": 88,
            "blood_pressure": "125/82",
            "temperature": 38.2,
            "respiratory_rate": 22,
            "oxygen_saturation": 94,
        },
    },
]

MOCK_QUIZZES = [
    {
        "id": "1",
        "title": "Vital Signs Assessment",
        "description": "Test your knowledge on monitoring vital signs",
        "difficulty": "beginner",
        "category": "Nursing Foundations",
    },
    {
        "id": "2",
        "title": "Patient Documentation",
        "description": "Learn proper clinical documentation",
        "difficulty": "intermediate",
        "category": "Clinical Skills",
    },
    {
        "id": "3",
        "title": "Clinical Decision Making",
        "description": "Case-based clinical reasoning",
        "difficulty": "advanced",
        "category": "Critical Thinking",
    },
]

MOCK_QUESTIONS = {
    "1": [
        {
            "id": "q1",
            "quiz_id": "1",
            "content": "What is the normal range for adult heart rate?",
            "options": ["60-100 bpm", "50-80 bpm", "70-120 bpm", "80-140 bpm"],
            "correct_answer": 0,
            "explanation": "Normal adult heart rate ranges from 60 to 100 beats per minute.",
            "competencies": ["Vital Signs", "Assessment"],
        },
        {
            "id": "q2",
            "quiz_id": "1",
            "content": "What is the normal adult respiratory rate?",
            "options": [
                "12-20 breaths/min",
                "8-12 breaths/min",
                "16-24 breaths/min",
                "20-28 breaths/min",
            ],
            "correct_answer": 0,
            "explanation": "Normal adult respiratory rate is 12-20 breaths per minute.",
            "competencies": ["Vital Signs", "Respiratory Assessment"],
        },
        {
            "id": "q3",
            "quiz_id": "1",
            "content": "Which vital sign indicates potential infection?",
            "options": [
                "Elevated temperature",
                "Normal pulse",
                "Low blood pressure",
                "Normal respiratory rate",
            ],
            "correct_answer": 0,
            "explanation": "Fever (elevated temperature) is a common sign of infection.",
            "competencies": ["Vital Signs", "Infection Assessment"],
        },
        {
            "id": "q4",
            "quiz_id": "1",
            "content": "What is the normal blood pressure range?",
            "options": [
                "120/80 mmHg or less",
                "140/90 mmHg or less",
                "100/60 mmHg or less",
                "130/85 mmHg or less",
            ],
            "correct_answer": 0,
            "explanation": "Normal adult blood pressure is less than 120/80 mmHg.",
            "competencies": ["Vital Signs", "Cardiovascular Assessment"],
        },
        {
            "id": "q5",
            "quiz_id": "1",
            "content": "What is the normal oxygen saturation (SpO2) range?",
            "options": ["95-100%", "90-95%", "85-90%", "80-85%"],
            "correct_answer": 0,
            "explanation": "Normal SpO2 is 95-100% in healthy adults.",
            "competencies": ["Vital Signs", "Oxygenation"],
        },
    ],
    "2": [
        {
            "id": "q6",
            "quiz_id": "2",
            "content": "What should be documented in patient notes?",
            "options": [
                "All of the above",
                "Only vital signs",
                "Only medications",
                "Only complaints",
            ],
            "correct_answer": 0,
            "explanation": "Complete documentation includes all relevant patient information.",
            "competencies": ["Documentation", "Clinical Skills"],
        },
        {
            "id": "q7",
            "quiz_id": "2",
            "content": "When should patient vitals be reassessed?",
            "options": [
                "Every 4-6 hours for stable patients",
                "Once a day",
                "Only when symptoms worsen",
                "Every 2 hours",
            ],
            "correct_answer": 0,
            "explanation": "For stable patients, vital signs are typically reassessed every 4-6 hours.",
            "competencies": ["Vital Signs", "Assessment Frequency"],
        },
        {
            "id": "q8",
            "quiz_id": "2",
            "content": "Which is the correct format for documenting vital signs?",
            "options": [
                "HR: 72, BP: 120/80",
                "HR 72 & BP 120/80",
                "HR-72 BP-120/80",
                "HR=72, BP=120/80",
            ],
            "correct_answer": 0,
            "explanation": "Standard format uses colons and commas for clarity.",
            "competencies": ["Documentation", "Clinical Skills"],
        },
    ],
    "3": [
        {
            "id": "q9",
            "quiz_id": "3",
            "content": "What is the priority when a patient shows symptoms?",
            "options": [
                "Assess the patient immediately",
                "Check the chart",
                "Notify the doctor",
                "Document observations",
            ],
            "correct_answer": 0,
            "explanation": "Patient safety is always the priority - assess immediately.",
            "competencies": ["Clinical Decision", "Priority Setting"],
        },
        {
            "id": "q10",
            "quiz_id": "3",
            "content": "A patient has BP 160/95, HR 100, Temp 38.5C. What action is priority?",
            "options": [
                "Notify the nurse/doctor",
                "Give medication",
                "Complete documentation",
                "Take vital signs again",
            ],
            "correct_answer": 0,
            "explanation": "Elevated BP and fever indicate potential deterioration - notify healthcare provider.",
            "competencies": ["Clinical Decision", "Critical Thinking"],
        },
        {
            "id": "q11",
            "quiz_id": "3",
            "content": "What is the first step in clinical decision making?",
            "options": [
                "Assess the patient",
                "Review orders",
                "Administer medication",
                "Document",
            ],
            "correct_answer": 0,
            "explanation": "Assessment is the first step in the nursing process.",
            "competencies": ["Nursing Process", "Clinical Decision"],
        },
    ],
}


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify(
        {
            "status": "healthy",
            "message": "iCARE++ Backend running",
            "mode": "mock" if USE_MOCK_DATA else "supabase",
        }
    )


@app.route("/api/auth/login", methods=["POST"])
def login():
    print(f"Request data: {request.data}")
    data = request.get_json()
    print(f"Parsed JSON: {data}")
    if data is None:
        return jsonify({"error": "Invalid JSON or no data provided"}), 400
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    if USE_MOCK_DATA:
        print(f"USE_MOCK_DATA=True, looking for {email}")
        user = next(
            (
                u
                for u in MOCK_USERS
                if u["email"] == email and u["password_hash"] == password
            ),
            None,
        )
        print(f"Found user: {user}")
        if user:
            try:
                return jsonify(
                    {
                        "success": True,
                        "user": {
                            "id": user["id"],
                            "email": user["email"],
                            "name": user["name"],
                            "role": user["role"],
                        },
                    }
                )
            except Exception as e:
                print(f"JSONify error: {e}")
                raise
        return jsonify({"error": "Invalid credentials"}), 401

    try:
        response = supabase.table("users").select("*").eq("email", email).execute()
        if not response.data:
            return jsonify({"error": "Invalid credentials"}), 401
        user = response.data[0]
        if user.get("password_hash") != password:
            return jsonify({"error": "Invalid credentials"}), 401
        return jsonify(
            {
                "success": True,
                "user": {
                    "id": user["id"],
                    "email": user["email"],
                    "name": user["name"],
                    "role": user["role"],
                },
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")
    role = data.get("role", "student")

    if not email or not password or not name:
        return jsonify({"error": "Email, password, and name required"}), 400

    if USE_MOCK_DATA:
        if any(u["email"] == email for u in MOCK_USERS):
            return jsonify({"error": "Email already registered"}), 400
        new_user = {
            "id": str(len(MOCK_USERS) + 1),
            "email": email,
            "password_hash": password,
            "name": name,
            "role": role,
        }
        MOCK_USERS.append(new_user)
        return jsonify({"success": True, "user": new_user})

    try:
        response = (
            supabase.table("users")
            .insert(
                {"email": email, "password_hash": password, "name": name, "role": role}
            )
            .execute()
        )
        if response.data:
            return jsonify({"success": True, "user": response.data[0]})
        return jsonify({"error": "Failed to create user"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/patients", methods=["GET"])
def get_patients():
    if USE_MOCK_DATA:
        return jsonify({"patients": MOCK_PATIENTS})
    try:
        response = supabase.table("patients").select("*").execute()
        return jsonify({"patients": response.data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/quizzes", methods=["GET"])
def get_quizzes():
    if USE_MOCK_DATA:
        return jsonify({"quizzes": MOCK_QUIZZES})
    try:
        response = supabase.table("quizzes").select("*").execute()
        return jsonify({"quizzes": response.data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/quizzes/<quiz_id>/questions", methods=["GET"])
def get_quiz_questions(quiz_id):
    if USE_MOCK_DATA:
        return jsonify({"questions": MOCK_QUESTIONS.get(quiz_id, [])})
    try:
        response = (
            supabase.table("questions").select("*").eq("quiz_id", quiz_id).execute()
        )
        return jsonify({"questions": response.data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/ml/predict-risk", methods=["POST"])
def predict_student_risk():
    from ml_models import PerformancePredictor

    data = request.get_json()
    student_data = data.get("student_data", {})
    try:
        predictor = PerformancePredictor()
        prediction = predictor.predict_risk(student_data)
        return jsonify({"prediction": prediction})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/ml/analyze-vitals", methods=["POST"])
def analyze_vitals():
    from ml_models import VitalSignsAnalyzer

    data = request.get_json()
    vitals = data.get("vitals", {})
    try:
        analyzer = VitalSignsAnalyzer()
        analysis = analyzer.analyze(vitals)
        return jsonify({"analysis": analysis})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/ml/recommendations", methods=["GET"])
def get_recommendations():
    from ml_models import AdaptiveQuizEngine

    student_id = request.args.get("student_id", "")
    weak_comps = (
        request.args.get("weak_competencies", "").split(",")
        if request.args.get("weak_competencies")
        else None
    )
    try:
        engine = AdaptiveQuizEngine()
        recommendations = engine.get_recommendations(student_id, weak_comps)
        return jsonify({"recommendations": recommendations})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("Starting iCARE++ Backend...")
    app.run(debug=True, port=5000)
