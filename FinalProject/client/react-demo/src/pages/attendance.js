/*
Page for attendance-based actions

Allows the user to manage potentially inactive members,
and to take attendance for today
*/

import ManagePotentiallyInactiveMembers from "@/components/ManagePotentiallyInactiveMembers";
import NavBar from "@/components/NavBar";
import TodayAttendance from "@/components/TodayAttendance";
import { useEffect, useState } from "react";
import { fetchPermissions } from '@/utils/fetchPermissions.js';
import { useRouter } from 'next/router'

function attendance( ) {
    const router = useRouter()

    //permissions used to conditionally render elements depending on the logged in user's roles
    const [permissions, setPermissions] = useState({
        canAddMembers: false,
        isAttendanceManager: false
    });

    //active members of the choir
    const [activeMembers, setActiveMembers] = useState([])
    //list of absence reasons
    const [absenceReasons, setAbsenceReasons] = useState([])
    //potentially inactive choir members
    const [pInactiveMembers, setPInactiveMembers] = useState([])

    //retrieve all active choir members
    const fetchActiveMembers = async () => {
        try {
            const memberResponse = await fetch('http://localhost:8080/getActiveMembers')

            if (!memberResponse.ok) {
                throw Error("Error getting 'ok' response");
            }

            const memberData = await memberResponse.json();
            setActiveMembers(memberData);
            console.log("RETRIEVED ACTIVE MEMBERS :", memberData)
        }
        catch (error) {
            console.error("Error fetching active members", error);
        }
    }

    //retrieve all potentially inactive members, (members who missed all 5 of the most recent practices)
    const fetchPInactiveMembers = async () => {
        try {
            const membersResponse = await fetch('http://localhost:8080/retrievePotentiallyInactiveMembers');

            if (!membersResponse.ok) {
                console.log(membersResponse.json())
                throw new Error('Failed to fetch members');
            }

            const memberData = await membersResponse.json();
            setPInactiveMembers(memberData)
            console.log(memberData)
        } catch (error) {
            console.error("Error fetching potentially inactive members", error)
        }
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
                    canAddMembers: false,
                    isAttendanceManager: false
                })
            }
        }
        else {
            router.push("/login")
        }
    }

    //on page load, retrieve absence reasons, active members, and potentially inactive members
    useEffect(() => {
        fetchAndSetPermissions();

        /*
        //get user permissions
        fetch('http://localhost:8080/getUserPermissions')
            .then(response => response.json())
            .then(data => { console.log(data)
                            setPermissions(data)
            });
        */
        /*
        fetch('http://localhost:8080/getActiveMembers')
            .then(response => response.json())
            .then(data => { console.log(data)
                            setActiveMembers(data)
            })
        */

        fetch('http://localhost:8080/getAbsenceReasons')
            .then(response => response.json())
            .then(data => { console.log(data)
                            setAbsenceReasons(data)
            })
        
        fetchActiveMembers();
        fetchPInactiveMembers();
    }, []);

    return (
        <div>
            <NavBar/>
            <div className="body">

                {permissions.canChangeActiveStatus ? (
                    <ManagePotentiallyInactiveMembers updateActiveMembers={fetchActiveMembers} pInactiveMembers={pInactiveMembers}></ManagePotentiallyInactiveMembers>
                ) : (
                    <div className="component">
                        <h2>You do not have permission to manage potentially inactive members</h2>
                    </div>
                )}

                {activeMembers.length > 0 && absenceReasons.length > 0 && (
                    permissions.isAttendanceManager ? (
                            <TodayAttendance members={activeMembers} reasons={absenceReasons} fetchPInactiveMembers={fetchPInactiveMembers}/>
                        ):  
                        (
                            <div className="component">
                                <h2>You do not have permission to take attendance</h2>
                            </div>
                        )
                )}
                
                
            </div>

        </div>
    )
}

export default attendance