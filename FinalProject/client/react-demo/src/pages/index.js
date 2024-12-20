/*
Home page of the website
*/

import React, {useEffect, useState} from 'react'
import NavBar from '../components/NavBar.js'


function index() {

  //message displayed, from backend
  const [message, setMessage] = useState("Loading");
  
  useEffect(() => {
    //connect to python server, hosted on 8080
    fetch("http://localhost:8080/").then( //once there's a response:
      //turn the data recieved into a json
      (response) => response.json()
      //log the json
        .then((data) => {
          console.log(data)
          
          //use the json to display a msg
          setMessage(data.message)
        })
    )}, []) //use the empty array to only make this run when the page loads


  return (
    <div>
      <NavBar></NavBar>
      <div className='body'>
        <div className='component'>
          <h2>Welcome to the Choir Management Portal!</h2>
        </div>
      </div>
    </div>
  )
}

export default index

