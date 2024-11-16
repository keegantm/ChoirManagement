import {useState} from 'react'


const AddMemberComponent = () => {
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

            if (!response.ok) {
                throw new Error('Failed to add new member');
            }

            const result = await response.json();
            console.log('Member added:', result);

            // Clear the form after submission
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
        } catch (error) {
            console.error('Error adding new member:', error);
        }
    };

    return (
        <div>
            <h3>Add a New Member</h3>
            <div>
                <label>First Name:</label>
                <input
                    type="text"
                    name="first_name"
                    value={newMember.first_name}
                    onChange={handleInputChange}
                />

                <label>Last Name:</label>
                <input
                    type="text"
                    name="last_name"
                    value={newMember.last_name}
                    onChange={handleInputChange}
                />

                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={newMember.email}
                    onChange={handleInputChange}
                />

                <label>Address Line 1:</label>
                <input
                    type="text"
                    name="address_line_1"
                    value={newMember.address_line_1}
                    onChange={handleInputChange}
                />

                <label>Address Line 2:</label>
                <input
                    type="text"
                    name="address_line_2"
                    value={newMember.address_line_2}
                    onChange={handleInputChange}
                />

                <label>City:</label>
                <input
                    type="text"
                    name="city"
                    value={newMember.city}
                    onChange={handleInputChange}
                />

                <label>State:</label>
                <input
                    type="text"
                    name="state"
                    maxLength="2"
                    value={newMember.state}
                    onChange={handleInputChange}
                />

                <label>Postal Code:</label>
                <input
                    type="text"
                    name="postal_code"
                    maxLength="5"
                    value={newMember.postal_code}
                    onChange={handleInputChange}
                />

                <button onClick={handleSubmit}>Add Member</button>
            </div>
        </div>
    );
};

export default AddMemberComponent;
