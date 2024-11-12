import React, {useEffect, useState} from 'react'
import NavBar from '../components/NavBar.js'

function members() {

    const [choirMembers, setChoirMembers] = useState([]);


    useEffect(() => {
    //connect to python server, hosted on 8080
    fetch("http://localhost:8080/testDb").then( //once there's a response:
        //turn the data recieved into a json
        (response) => response.json()
        //log the json
        .then((data) => {
            console.log(data)
            //use the json to display a msg
            setChoirMembers(data)
        })
    )}, [])

    return(
        <div>
            <NavBar></NavBar>

            <p>Here are all the members : </p>
            {choirMembers.map((member, i) => <p key={i}>Member Id: {member.memberId} Member Name :{member.name}</p>)}
        </div>
    )
}

export default members
