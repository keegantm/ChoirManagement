import React, {useEffect, useState} from 'react'
import NavBar from '../components/NavBar.js'

function testPost() {
    const [newName, setNewName] = useState('')

    const handleSubmit = async () => {
        try {
            const response = fetch("http://localhost:8080/testPost", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    name: newName
                })
            })

            if (!response.ok) {
                throw new Error('Failed to post data');
            }
            
            //const result = response.json()
            //console.log("Response:", result);
        }
        catch (err) {
            console.log(err)
        }
    }

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