from flask_restx import fields
from db_models import api

test_post_model = api.model("Test Model", {
    "string Input": fields.String,
    "default Test Input": fields.String(default="the default answer"),  #if null, uses this value
    "int Input": fields.Integer
})

#used for login and register
credentials_input_model = api.model("Register Model", {
    "username": fields.String(default=""),
    "password": fields.String(default="")
})
