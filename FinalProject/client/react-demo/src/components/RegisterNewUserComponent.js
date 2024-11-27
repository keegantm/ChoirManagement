import {useState} from 'react'
import { useRouter } from 'next/router'

/*
Component for registering a new User of the site
*/
const RegisterNewUserComponent = () => {
    const router = useRouter()

    const [newUser, setNewUser] = useState({
        username: '',
        password: ''
    });

    const [message, setMessage] = useState(null);

    const handleInputChange = (e) => {
        //name is name of the input field
        //value is what the user typed
        const { name, value } = e.target;
        setNewUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:8080/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            const result = await response.json();

            if (!response.ok) {
                if (response.status === 400) {
                    
                    setMessage({ type: 'error', text: result.error });
                    return;
                }
                else {
                    throw new Error('Failed to add new member');
                }
            }

            console.log('User registered:', result);

            setMessage({ type: 'success', text: 'User registered successfully!' });
            
            // Clear the form after submission
            setNewUser({
                username: '',
                password: ''
            });

            router.push('/login');
        } catch (error) {
            console.error('Error registering:', error);
            setMessage({ type: 'error', text: error.message || 'An error occurred.' });
        }
    };

    return (
        <div className="shadow-lg rounded bg-slate-100 border slate-700 grid justify-center gap-4 mx-16 my-8 min px-8 py-8 max-w-4xl ">
            <h2>Create your account</h2>
            {message && (
                <div className={`alert ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="flex flex-grow flex-col justify-start w-full">
                <label>Email</label>
                <input
                    type="email"
                    name="username"
                    value={newUser.username}
                    onChange={handleInputChange}
                    className="border slate-700"

                />

                <label className='mt-2'>Password:</label>
                <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    className="border slate-700"

                />

                <button onClick={handleSubmit} className="border slate-700 bg-gradient-to-r from-cyan-100 to-blue-100 mt-4" >Register</button>
            </div>
        </div>
    );
};

export default RegisterNewUserComponent;
