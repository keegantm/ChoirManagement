# Filename - Server.py

# Import necessary modules
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import datetime
from sqlalchemy.sql import text
from pytz import timezone

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Configuring the SQLAlchemy Database URI 
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/ChoirDatabase'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

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
    record_time = db.Column(db.DateTime, default=lambda: datetime.datetime.now(timezone('EST')), nullable=False)
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


# Endpoints 
@app.route('/', methods=['GET'])
def return_home():
    return jsonify({'message': 'Welcome to the Choir Home Page!'}) # Return a welcome message for the home page


# Adds a new member to the choir database.
@app.route('/addMember', methods=['POST'])
def add_member():
    try:
        data = request.json # Extract data from the incoming JSON request
        new_member = Member(
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            email=data.get('email'),
            join_date=datetime.datetime.strptime(data.get('join_date'), '%Y-%m-%d').date(), # Convert string date to a date object
            is_active=data.get('is_active', True), # Set default value for is_active if not provided
            address_line_1=data.get('address_line_1'),
            address_line_2=data.get('address_line_2', ''), # Set default empty string for optional address field
            city=data.get('city'),
            state=data.get('state'),
            postal_code=data.get('postal_code')
        )
        db.session.add(new_member) # Add new member to the database snessio
        db.session.commit() # Commit changes to the database
        return jsonify({"message": "Member added successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500 # Return error message if exception occurs


# Adds a voice part assignment for a specified member.
@app.route('/addVoicePart', methods=['POST'])
def add_voice_part():
    try:
        data = request.json
        new_voice_part = VoiceParts( 
            member_id=data.get('member_id'), # Get member ID for association
            voice_part=data.get('voice_part') # Set the voice part
        )
        db.session.add(new_voice_part) # Add new voice part record
        db.session.commit() # Commit changes to the database
        return jsonify({"message": "Voice part added successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500 # Handle errors 


# Assigns a role with optional salary details to a member.
@app.route('/assignRole', methods=['POST'])
def assign_role():
    try:
        data = request.json
        new_role = Role(
            member_id=data.get('member_id'),
            role_type=data.get('role_type'),
            salary_amount=data.get('salary_amount', 0.00), # Set default salary amount as zero
            role_start_date=datetime.datetime.strptime(data.get('role_start_date'), '%Y-%m-%d').date(),
            role_end_date=datetime.datetime.strptime(data.get('role_end_date'), '%Y-%m-%d').date() if data.get('role_end_date') else None
        )
        db.session.add(new_role)
        db.session.commit()
        return jsonify({"message": "Role assigned successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500 # Handle error


# Records an attendance entry for a member's practice session.
@app.route('/addAttendance', methods=['POST'])
def add_attendance():
    try:
        data = request.json
        new_attendance = Attendance(
            member_id=data.get('member_id'),
            practice_date=datetime.datetime.strptime(data.get('practice_date'), '%Y-%m-%d').date(), # Convert date to a date object
            present=data.get('present'),
            absence_reason_id=data.get('absence_reason_id'),
            specific_reason=data.get('specific_reason', ''), # Set default for specific reason
            notified_in_advance=data.get('notified_in_advance', False), # Set default for notified flag
            notes=data.get('notes', '') # Set default for notes
        )
        db.session.add(new_attendance)
        db.session.commit()
        return jsonify({"message": "Attendance record added successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Sets a budget record with a specified amount and date.
@app.route('/setBudget', methods=['POST'])
def set_budget():
    try:
        data = request.json
        new_budget = Budget(
            budget_date_set=datetime.datetime.strptime(data.get('budget_date_set'), '%Y-%m-%d').date(),
            budget_amount=data.get('budget_amount') # Set budget amount
        )
        db.session.add(new_budget)
        db.session.commit()
        return jsonify({"message": "Budget set successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Retrieves a list of members who receive a salary.
@app.route('/getSalariedMembers', methods=['GET'])
def get_salaried_members():
    try:
        roles = Role.query.filter(Role.salary_amount > 0).all() # Query members with salaries
        salaried_members = [{"role_id": r.role_id, "member_id": r.member_id, "role_type": r.role_type, "salary_amount": r.salary_amount} for r in roles]
        return jsonify(salaried_members)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Retrieves budget entries for the current year.
@app.route('/getCurrentBudget', methods=['GET'])
def get_current_budget():
    try:
        current_year = datetime.datetime.now().year # Get current year for filtering
        # Query budgets that are set for the current year
        budgets = Budget.query.filter(Budget.budget_date_set.year == current_year).order_by(Budget.budget_date_set.desc()).all()
        budget_list = [{"budget_id": b.budget_id, "amount": b.budget_amount, "date_set": b.budget_date_set.strftime('%Y-%m-%d')} for b in budgets]
        return jsonify(budget_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Provides a summary of payments made within a specified date range.
@app.route('/getPaymentsSummary', methods=['POST'])
def get_payments_summary():
    try:
        date_1 = datetime.datetime.strptime(request.json.get('date_1'), '%Y-%m-%d').date()
        date_2 = datetime.datetime.strptime(request.json.get('date_2'), '%Y-%m-%d').date()
        payments = db.session.execute(text('SELECT SUM(payment_amount) as total FROM Payment WHERE payment_date BETWEEN :date1 AND :date2'), {'date1': date_1, 'date2': date_2}).fetchone()
        total = payments.total if payments else 0
        return jsonify({"total_payments": total})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the app
if __name__ == '__main__':
    app.run(debug=True, port=8080)
