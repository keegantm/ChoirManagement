from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from pytz import timezone
from werkzeug.security import generate_password_hash, check_password_hash
from flask_restx import Api

api = Api()
db = SQLAlchemy()

# Define a database model class for the 'Member' table
class Member(db.Model):
    __tablename__ = 'Member'
    member_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)  
    join_date = db.Column(db.Date, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    address_line_1 = db.Column(db.String(30), nullable=False)  
    address_line_2 = db.Column(db.String(30))  
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(2), nullable=False)
    postal_code = db.Column(db.String(5), nullable=False)


# Define a database model class for the 'MembershipHistory' table
class MembershipHistory(db.Model):
    __tablename__ = 'MembershipHistory'
    history_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    member_id = db.Column(db.Integer, db.ForeignKey('Member.member_id'), nullable=False)
    end_date = db.Column(db.Date, nullable=True)
    cancellation_reason_id = db.Column(db.Integer, db.ForeignKey('CancellationReason.cancellation_reason_id'), nullable=False)  
    specific_reason = db.Column(db.Text, nullable=True)
    exit_feedback = db.Column(db.Text, nullable=True)
    is_eligible_for_return = db.Column(db.Boolean, default=True)
    notes = db.Column(db.Text, nullable=True)

# Define a database model class for the 'AbsenceReaso' table
class AbsenceReason(db.Model):
    __tablename__ = 'AbsenceReason'
    absence_reason_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    reason_category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    is_excused = db.Column(db.Boolean, default=False)
    
# Define a database model class for the 'VoicParts' table
class VoiceParts(db.Model):
    __tablename__ = 'VoiceParts'
    voice_part_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    member_id = db.Column(db.Integer, db.ForeignKey('Member.member_id'), nullable=False)
    voice_part = db.Column(db.String(20), nullable=False)

# Define a database model class for the 'CancellationReason' table
class CancellationReason(db.Model):
    __tablename__ = 'CancellationReason'
    cancellation_reason_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    description = db.Column(db.Text, nullable=False)

# Define a database model class for the 'Notifications' table
class NotificationLog(db.Model):
    __tablename__ = 'NotificationLog'
    notification_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    section_leader = db.Column(db.Integer, db.ForeignKey('Member.member_id'), nullable=False)
    section_member = db.Column(db.Integer, db.ForeignKey('Member.member_id'), nullable=False)
    notification_time = db.Column(db.DateTime, nullable=False)
    message = db.Column(db.Text, nullable=False)

# Define a database model class for the 'Role' table
class Role(db.Model):
    __tablename__ = 'Role'
    role_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    member_id = db.Column(db.Integer, db.ForeignKey('Member.member_id'), nullable=False)
    role_type = db.Column(db.String(50), nullable=False)
    salary_amount = db.Column(db.Float, default=0.00)
    role_start_date = db.Column(db.Date, nullable=False)
    role_end_date = db.Column(db.Date)

# Define a database model class for the 'Attendance' table
class Attendance(db.Model):
    __tablename__ = 'PracticeAttendance'
    practice_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    member_id = db.Column(db.Integer, db.ForeignKey('Member.member_id'), nullable=False)
    practice_date = db.Column(db.Date, nullable=False)
    present = db.Column(db.Boolean, nullable=False)
    absence_reason_id = db.Column(db.Integer, db.ForeignKey('AbsenceReason.absence_reason_id'), nullable=True)  
    specific_reason = db.Column(db.String(255), nullable=True)
    record_time = db.Column(db.DateTime, default=lambda: datetime.now(timezone('EST')).replace(tzinfo=None))
    notified_in_advance = db.Column(db.Boolean, default=False)
    notes = db.Column(db.String(255), nullable=True)

# Define a database model class for the 'Payment' table
class Payment(db.Model):
    __tablename__ = 'Payment'
    payment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    member_id = db.Column(db.Integer, db.ForeignKey('Member.member_id'), nullable=False)
    payment_date = db.Column(db.DateTime, default=lambda: datetime.datetime.now(timezone('EST')), nullable=False)
    payment_amount = db.Column(db.Numeric(10, 2), nullable=False)
    payment_method = db.Column(db.String(50))


# Define a database model class for the 'Budget' table
class Budget(db.Model):
    __tablename__ = 'Budget'
    budget_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    budget_date_set = db.Column(db.Date, nullable=False)
    budget_amount = db.Column(db.Numeric(12, 2), nullable=False)  


# Define a User model 
class User(db.Model):
    __tablename__ = 'User'  
    # Table columns
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(100), unique=True, nullable=False)  # Email as the username
    password_hash = db.Column(db.String(255), nullable=False)  # Store hashed passwords

    def __init__(self, username, password):
        """
        create a new User object.
        Automatically hashes the provided password.
        Args:
            username (str): The user's email address.
            password (str): The user's plaintext password.
        """
        hashed_password = generate_password_hash(password)

        self.username = username
        self.password_hash = hashed_password # Securely hash the password

    def verify_password(self, password):
        """
        Verifies if the provided password matches the stored hashed password.
        Args:
            password (str): The plaintext password to verify.
        Returns:
            bool: True if the password matches, False otherwise.
        """
        return check_password_hash(self.password_hash, password)