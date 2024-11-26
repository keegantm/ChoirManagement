/*
Page for managing members.
This includes:
    - Managing what roles members have
    - Managing the voice roles of members
    - Adding choir members
*/

import React, {useEffect, useState} from 'react'
import NavBar from '../components/NavBar.js'
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/router'
import RoleManagerComponent from '@/components/RoleManagerComponent.js';
import VoicePartComponent from '@/components/VoicePartComponent.js';
import AddMemberComponent from '@/components/AddMemberComponent.js';
 
function manageMembers() {

    //permissions used to conditionally render elements depending on the logged in user's roles
    const [permissions, setPermissions] = useState({
        canEditMusicalRoles: false,
        canEditBoardRoles: false,
        canAddMembers: false,
    });

    //all active members of the choir
    const [activeMembers, setActiveMembers] = useState([]);
    //the roles this user can manage
    const [roleOptions, setRoleOptions] = useState([]);

    const fetchActiveMembers = async () => {
        try {
            const memberResponse = await fetch('http://localhost:8080/getActiveMembers');
            if (!memberResponse.ok) {
                throw new Error('Failed to fetch active members');
            }

            const memberData = await memberResponse.json();
            setActiveMembers(memberData);
            console.log("FETCHED MEMBER DATA IN PARENT:", memberData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    
    //on page load, retrieve active members 
    useEffect(() => {
        /*
        // Fetch the user's permissions from the backend
        fetch('http://localhost:8080/getUserPermissions')
            .then(response => response.json())
            .then(data => { console.log(data)
                            setPermissions(data)});
        */
        //get the active members of the choir
        fetchActiveMembers();
    }, []);

    
    //on page load, get user authorizations
    useEffect( async () => {
        try {
            /*
            const token = sessionStorage.getItem("token"); // Get token from session storage
            
            //see if the user is logged in
            if (token && token !== "" && token !== undefined) {
                const decoded = jwtDecode(token)
                console.log(decoded);
                
                if (!decoded) {
                    throw Error("Failure to decode token");
                }

                const currentTime = Math.floor(Date.now() * 0.001)
                const exp = decoded.exp;

                //see if the token is expired
                if (currentTime >= exp) {
                    //token is expired
                    console.log("EXPIRED TOKEN")
                    sessionStorage.clear();
                    router.push('/login');
                };

                //get permissions from token
                setPermissions({
                    canEditMusicalRoles: decoded.canEditMusicalRoles,
                    canEditBoardRoles: decoded.canEditBoardRoles,
                    canAddMembers: decoded.canAddMembers,
                });
            }
            else {
                //user not logged in, send to login screen
                router.push('/login');
            }
        }
            */
            if (token && token !== "" && token !== undefined) {
                const decoded = jwtDecode(token)
                console.log(decoded);

                //pass member id to endpoint with the token
                const permissionsResponse = await fetch("http://localhost:8080/permissions", {
                    method: 'POST',
                    headers: {
                        'Authorization': token
                    }
                })
                
                if (!permissionsResponse.ok) {
                    console.log("Error getting user permissions")

                    //give user all False permissions
                    return;
                }

                const data = await permissionsResponse.json()

                setPermissions({
                    canEditMusicalRoles: data.canEditMusicalRoles || False,
                    canEditBoardRoles: data.canEditBoardRoles || False,
                    canAddMembers: data.canAddMembers || False,
                });

                
            }
            else {
                //user not logged in, send to login screen
                router.push('/login');
            }
        }
        catch (Error) {
            console.error("Error retrieving permissions :", Error)
        };

    }, []);
    
    //when the user's permissions are retrieved, set what roles they can manage
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
            updatedRoleOptions = [...updatedRoleOptions, ...boardOptions];
        }

        if (permissions.canEditMusicalRoles) {
            updatedRoleOptions = [...updatedRoleOptions, ...musicalOptions];
        }

        console.log(updatedRoleOptions)
        setRoleOptions(updatedRoleOptions);

    }, [permissions]);

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
    
