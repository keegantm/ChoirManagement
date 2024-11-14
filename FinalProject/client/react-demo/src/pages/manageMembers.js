import React, {useEffect, useState} from 'react'
import NavBar from '../components/NavBar.js'

function manageMembers() {

    const [permissions, setPermissions] = useState({
        canEditVoiceRoles: false,
        canEditBoardRoles: false,
    });

    useEffect(() => {
        // Fetch the user's permissions from the backend
        fetch('/getUserPermissions')
            .then(response => response.json())
            .then(data => setPermissions(data));
    }, []);

    //First, retrieve the user's permissions

    //We will have permission the options like a json:
    /*
    
    {
    canEditMusicalRoles: True/False,  //can they assign SectionLeaders, Accompanist, Director.
    canEditBoardRoles: True/False,  //Assign BoardRoles. These are BoardMember, Treasurer, and President
    }

    */

    return (
        <div>
            <NavBar />

            <p>Manage Member Roles:</p>

            {/* Conditionally render based on permissions */}
            {permissions.canEditMusicalRoles && (
                <div>
                    <h3>Edit Musical Roles</h3>
                    <MusicalRolesComponent />
                </div>
            )}

            {permissions.canEditBoardRoles && (
                <div>
                    <h3>Edit Board Roles</h3>
                    <BoardRolesComponent />
                </div>
            )}
        </div>
        
    );

    }
