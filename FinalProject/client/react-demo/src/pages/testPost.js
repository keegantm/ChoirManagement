import React, {useEffect, useState} from 'react'
import NavBar from '../components/NavBar.js'

function testPost() {
    const [newName, setNewName] = useState('')

    const handleSubmit = async () => {
        try {
            const response = await fetch("http://localhost:8080/testPost", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: newName
                })
            });
    
            if (!response.ok) {
                throw new Error('Failed to post data');
            }
            
            const result = await response.json();  // Add this line to parse the response
            console.log("Response:", result);      // Log the response if needed
        }
        catch (err) {
            console.log("Error:", err);            // Log the error if it occurs
        }
    };
    

    const handleInputChange = (event) => {
        const target = event.target
        setNewName(target.value)
      }

    return(
        <div>
            <NavBar></NavBar>

            name: <input 
            value={newName}
            onChange={handleInputChange}></input>

            <button type="submit" onClick={handleSubmit}>add</button>

        </div>
    )
}

export default testPost