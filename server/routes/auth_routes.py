from flask import Blueprint, request, jsonify, current_app as app, send_from_directory
from models import db, User, Profile
from werkzeug.utils import secure_filename
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
# from utils import generate_password_reset_token, send_email  
import os
from sqlalchemy.exc import SQLAlchemyError
import os

auth_bp = Blueprint('auth', __name__)

# Signup Route
@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        print("⚙️ Signup Request Received")
        print("Request form data:", request.form.to_dict())
        print("Request files:", request.files)

        email = request.form['email']
        password = request.form['password']
        raw_role = request.form['role'].strip().lower()

        # Normalize the role
        role_map = {
            "admin": "admin",
            "mom": "mum",
            "mother": "mum",
            "mum": "mum",
            "health professional": "health_pro",
            "health_pro": "health_pro"
        }
        role = role_map.get(raw_role, raw_role)

        if role == "admin":
            return jsonify({"error": "Cannot signup as admin"}), 403

        # Check for duplicate email
        if User.query.filter_by(email=email).first():
            return jsonify({"error": "Email already registered"}), 400

        # Create and flush user to get ID
        user = User(email=email, role=role)
        user.set_password(password)
        db.session.add(user)
        db.session.flush()  # ✅ get user.id before creating profile

        # Create profile with correct FK
        profile_data = {
            "full_name": f"{request.form.get('first_name', '')} {request.form.get('middle_name', '')} {request.form.get('last_name', '')}".strip(),
            "bio": request.form.get('bio', ''),
            "region": request.form.get('county'),
            "role": role
        }

        if role == 'health_pro' and 'license_number' in request.form:
            profile_data["license_number"] = request.form['license_number']

        profile = Profile(**profile_data, user_id=user.id)
        db.session.add(profile)

        # Handle avatar upload
        if 'avatar' in request.files:
            avatar = request.files['avatar']
            if avatar.filename:
                filename = secure_filename(avatar.filename)
                upload_folder = app.config.get('UPLOAD_FOLDER', 'uploads')
                os.makedirs(upload_folder, exist_ok=True)
                avatar_path = os.path.join(upload_folder, filename)
                avatar.save(avatar_path)
                profile.profile_picture = f"/uploads/{filename}"

        db.session.commit()
        print("✅ Signup successful for:", email)
        return jsonify({"message": "User registered. Please check email to verify."}), 201

    except SQLAlchemyError as e:
        db.session.rollback()
        import traceback
        print("❌ SQLAlchemyError:", traceback.format_exc())
        return jsonify({"error": "Database error.", "details": str(e)}), 500

    except Exception as e:
        import traceback
        print("❌ General Exception:", traceback.format_exc())
        return jsonify({"error": "Signup failed.", "details": str(e)}), 500


# Login Route
@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        print("⚙️ Login Request Received")
        print("Raw request data:", request.data)

        data = request.get_json()
        print("Parsed JSON:", data)

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400

        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            access_token = create_access_token(
                identity=str(user.id),
                additional_claims={"role": user.role}
            )
            print("✅ Login successful for:", email)
            return jsonify(access_token=access_token), 200

        print("❌ Invalid credentials for:", email)
        return jsonify({"error": "Invalid credentials"}), 401

    
    except SQLAlchemyError as e:
        db.session.rollback()
        import traceback
        print("❌ SQLAlchemyError:", traceback.format_exc())  # shows full trace
        return jsonify({"error": "Database error.", "details": str(e)}), 500

    except Exception as e:
        import traceback
        print("❌ General Exception:", traceback.format_exc())  # full trace
        return jsonify({"error": "Login failed.", "details": str(e)}), 500



# me Route
@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return jsonify({"error": "User not found"}), 404

    profile = user.profile
    full_name = profile.full_name if profile and profile.full_name else ""
    parts = full_name.split()

    return jsonify({
        "user_id": user.id,
        "email": user.email,
        "role": user.role,
        "created_at": user.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        "profile": {
            "full_name": full_name,
            "title": profile.role if profile else "",
            "first_name": parts[0] if len(parts) > 0 else "",
            "middle_name": parts[1] if len(parts) > 2 else "",
            "last_name": parts[-1] if len(parts) > 1 else "",
            "bio": profile.bio if profile else "",
            "region": profile.region if profile else "",
            "license_number": profile.license_number if profile else "",
            "profile_picture": profile.profile_picture if profile else ""
        }
    })


# Update Profile
@auth_bp.route('/profile/update', methods=['PATCH'])
@jwt_required()
def update_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get_or_404(user_id)

        data = request.get_json()
        profile = user.profile
        if not profile:
            return jsonify({"error": "Profile not found"}), 404

        # Rebuild full_name from parts
        first = data.get("first_name", "").strip()
        middle = data.get("middle_name", "").strip()
        last = data.get("last_name", "").strip()
        profile.full_name = " ".join(filter(None, [first, middle, last]))

        # Update other fields
        profile.bio = data.get("bio", profile.bio)
        profile.region = data.get("region", profile.region)
        profile.role = data.get("title", profile.role)

        db.session.commit()
        return jsonify({"message": "Profile updated successfully"}), 200

    except Exception as e:
        print("❌ Error updating profile:", e)
        return jsonify({"error": "Server error", "details": str(e)}), 500


# Serve uploaded files (images, videos, etc.)
@auth_bp.route('/uploads/<path:filename>')
def serve_uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Flask route example
# @auth_bp.route('/reset-password', methods=['POST'])
# def send_password_reset():
#     email = request.json.get('email')
#     user = User.query.filter_by(email=email).first()
#     if not user:
#         return jsonify({"error": "User not found"}), 404

#     token = generate_password_reset_token(user)  # You must implement this
#     reset_url = f"{FRONTEND_URL}/reset-password/{token}"
#     send_email(user.email, "Reset Your Password", f"Click here: {reset_url}")

#     return jsonify({"message": "Reset email sent"})
