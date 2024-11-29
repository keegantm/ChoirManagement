/*
Component for adding a new member to the choir
*/

import {useState} from 'react'

const AddMemberComponent = ({onNewMember}) => {

    //success/fail msg
    const [message, setMessage] = useState(null);

    //form to send to backend
    const [newMember, setNewMember] = useState({
        first_name: '',
        last_name: '',
        email: '',
        join_date: new Date().toISOString().split('T')[0],
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        postal_code: ''
    });

    //on submit, reset the form
    const resetForm = () => {
        setNewMember({
            first_name: '',
            last_name: '',
            email: '',
            join_date: new Date().toISOString().split('T')[0],
            address_line_1: '',
            address_line_2: '',
            city: '',
            state: '',
            postal_code: ''
        });
    }

    //update form when the user types
    const handleInputChange = (e) => {
        //name is name of the input field
        //value is what the user typed
        const { name, value } = e.target;
        setNewMember((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    
    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:8080/addMember', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMember),
            });

            const result = await response.json();
            
            //notify the user if the Member was added successfully
            if (!response.ok) {
                setMessage({ type: 'error', text: result.message || 'An error occurred' });
                console.log(result.message)
            } else {
                setMessage({ type: 'success', text: result.message });
                console.log(result.message)
                resetForm();
                //update the parent component about a new member
                onNewMember();
            }

        } catch (error) {
            console.error('Error adding new member:', error);
        }
    };

    return (
        <div className="component">
            <h2 className="mb-2">Add a New Member</h2>
            {message && (
                <div className={`alert ${message.type}`}>
                    {message.text}
                </div>
            )}
            <div className="grid grid-cols-2 mb-2 gap-2">
                <input
                    type="text"
                    name="first_name"
                    value={newMember.first_name}
                    onChange={handleInputChange}
                    placeholder='First Name'
                    className="member-input"
                />
            
                <input
                    type="text"
                    name="last_name"
                    value={newMember.last_name}
                    onChange={handleInputChange}
                    placeholder='Last Name'
                    className="member-input"

                />

                <input
                    type="email"
                    name="email"
                    value={newMember.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="member-input col-span-2"
                />


                <input
                    type="text"
                    name="address_line_1"
                    value={newMember.address_line_1}
                    onChange={handleInputChange}
                    placeholder="Address Line 1"
                    className="member-input"

                />


                <input
                    type="text"
                    name="address_line_2"
                    value={newMember.address_line_2}
                    onChange={handleInputChange}
                    placeholder="Address Line 2"
                    className="member-input"

                />

    
                <input
                    type="text"
                    name="city"
                    value={newMember.city}
                    onChange={handleInputChange}
                    placeholder='City'
                    className="member-input"

                />

                <input
                    type="text"
                    name="state"
                    maxLength="2"
                    value={newMember.state}
                    onChange={handleInputChange}
                    placeholder='State Code'
                    className="member-input"

                />

                <input
                    type="text"
                    name="postal_code"
                    maxLength="5"
                    value={newMember.postal_code}
                    onChange={handleInputChange}
                    placeholder='Postal Code'
                    className="member-input"

                />

            </div>

            <button className="component-button" onClick={handleSubmit}>Add Member</button>

        </div>
    );
};

export default AddMemberComponent;
