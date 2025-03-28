from flask_restx import fields
from extensions import api

test_post_model = api.model("Test Model", {
    "string Input": fields.String,
    "default Test Input": fields.String(default="the default answer"),  #if null, uses this value
    "int Input": fields.Integer()
})

#used for login and register
credentials_input_model = api.model("Register Model", {
    "username": fields.String(default=""),
    "password": fields.String(default="")
})

#used for updating a role assignment type
role_update_input_model = api.model("Role Change", {
    "role_type": fields.String(default="")
})

#NOTE: may need date to be str
#used for assigning a new role
role_add_input_model = api.model("Role Add", {
    "role_type": fields.String(default=""),
    "role_start_date": fields.Date()
})

#used to add a new voice part assignment
voice_part_add_input_model = api.model("Voice Part Add", {
    "member_id" : fields.Integer(),
    "voice_part" : fields.String()
})

voice_part_add_input_model = api.model("Voice Part Change", {
    "voice_part_id" : fields.Integer(),
    "voice_part" : fields.String()
})

payments_input_model = api.model("Payments", {
    "date_1" : fields.String(),
    "date_2" : fields.String()
})

add_member_input_model = api.model("Add Member", {
    "first_name" : fields.String(),
    "last_name" :fields.String(),
    "email" :fields.String(),
    "join_date" :fields.String(),
    "address_line_1" :fields.String(),
    "address_line_2" :fields.String(),
    "city" :fields.String(),
    "state" :fields.String(),
    "postal_code" :fields.String()
})

#NOTE: may need Date() instead
attendance_input_model = api.model("Attendance", {
    "member_id" : fields.Integer(),
    "practice_date" : fields.String(),
    "present" : fields.Boolean(),
    "absence_reason_id" : fields.Integer(),
    "specific_reason" : fields.String(),
    "notified_in_advance" : fields.Boolean(),
    "notes" : fields.String()
})