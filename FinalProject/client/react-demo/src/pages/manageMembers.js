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
import { fetchPermissions } from '@/utils/fetchPermissions.js';


function manageMembers() {
    const router = useRouter();

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
    
    const fetchPermissionsOld = async () => {
        try {
            const token = sessionStorage.getItem("token");
            if (token && token !== "" && token !== undefined) {

                const decoded = jwtDecode(token)
                console.log(decoded);
    
                //token to backend (contains member_id)
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
                const permissions = data.permissions
                console.log("PERMISSIONS SET :", permissions)

                setPermissions({
                    canEditMusicalRoles: permissions.canEditMusicalRoles || false,
                    canEditBoardRoles: permissions.canEditBoardRoles || false,
                    canAddMembers: permissions.canAddMembers || false,
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
    }
    
    const fetchAndSetPermissions = async () => {
        const token = sessionStorage.getItem("token");
        if (token && token !== "" && token !== undefined) {
            //get permissions
            const permissionsResponse = await fetchPermissions(token, router);
            if (permissionsResponse) {
                setPermissions(permissionsResponse)
            }
            else {
                setPermissions({
                    canEditMusicalRoles: false,
                    canEditBoardRoles: false,
                    canAddMembers: false,
                })
            }
        }
        else {
            router.push("/login")
        }
    }

    //on page load, retrieve active members and permissions
    useEffect(() => {

        fetchAndSetPermissions();
        //get the active members of the choir
        fetchActiveMembers();

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

            <div className="body">

                
                {permissions.canEditBoardRoles || permissions.canEditMusicalRoles ? (
                    activeMembers.length > 0 && (
                        <RoleManagerComponent roleOptions={roleOptions} members={activeMembers} fetchPermissions={fetchAndSetPermissions}/>
                    )
                ) : (
                    <div className="component">
                        <h2>You do not have permission to manage member roles</h2>
                    </div>
                )}

                {permissions.canEditMusicalRoles ? (
                    <VoicePartComponent members={activeMembers}></VoicePartComponent>
                ) : (
                    <div className="component">
                        <h2>You do not have permission to manage potentially inactive members</h2>
                    </div>
                )}

                {permissions.canAddMembers ? (
                    <AddMemberComponent onNewMember={fetchActiveMembers}></AddMemberComponent>
                ) : (
                    <div className="component">
                        <h2>You do not have permission to add new members</h2>
                    </div>
                )}
                
            </div>

        </div>
        
    );

    }

    export default manageMembers;
    
