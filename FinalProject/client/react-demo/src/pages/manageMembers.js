import React, {useEffect, useState} from 'react'
import NavBar from '../components/NavBar.js'
import RoleManagerComponent from '@/components/RoleManagerComponent.js';
import VoicePartComponent from '@/components/VoicePartComponent.js';
import AddMemberComponent from '@/components/AddMemberComponent.js';

function manageMembers() {

    const [permissions, setPermissions] = useState({
        canEditMusicalRoles: false,
        canEditBoardRoles: false,
        canAddMembers: false,
        canChangeActiveStatus: false
    });

    const [activeMembers, setActiveMembers] = useState([]);
    const [roleOptions, setRoleOptions] = useState([]);

    const fetchActiveMembers = async () => {
        try {
            // Fetch active members
            const memberResponse = await fetch('http://localhost:8080/getActiveMembers');
            if (!memberResponse.ok) {
                throw new Error('Failed to fetch active members');
            }

            const memberData = await memberResponse.json();
            setActiveMembers(memberData);
            console.log("FETCHED MEMBER DATA IN PARENT:", memberData);  // Log the fetched active members if needed
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        // Fetch the user's permissions from the backend
        fetch('http://localhost:8080/getUserPermissions')
            .then(response => response.json())
            .then(data => { console.log(data)
                            setPermissions(data)});
        
        //get the active members of the choir
        fetchActiveMembers();
    }, []);


    useEffect(() => {
        // Update roleOptions based on permissions
        const musicalOptions = [
            'Accompanist', 
            'Director', 
            'BassSectionLeader', 
            'TenorSectionLeader', 
            'AltoSectionLeader', 
            'SopranoSectionLeader'
        ];

        const boardOptions = [
            'BoardMember', 
            'Treasurer', 
            'President'
        ];

        let updatedRoleOptions = [];

        if (permissions.canEditBoardRoles) {
            console.log("CAN edit board")
            updatedRoleOptions = [...updatedRoleOptions, ...boardOptions];
        }

        if (permissions.canEditMusicalRoles) {
            console.log("CAN edit musical")

            updatedRoleOptions = [...updatedRoleOptions, ...musicalOptions];
        }
        console.log(updatedRoleOptions)
        setRoleOptions(updatedRoleOptions);

    }, [permissions]);

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

            <h2>Manage Member Roles:</h2>

            {activeMembers.length > 0 && (
                <RoleManagerComponent roleOptions={roleOptions} members={activeMembers} />
            )}
            
            {permissions.canEditMusicalRoles && (
                <VoicePartComponent members={activeMembers}></VoicePartComponent>
            )}

            {permissions.canAddMembers && (
                <AddMemberComponent onNewMember={fetchActiveMembers}></AddMemberComponent>
            )}

        </div>
        
    );

    }

    export default manageMembers
    
