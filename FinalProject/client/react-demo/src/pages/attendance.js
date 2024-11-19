import ManagePotentiallyInactiveMembers from "@/components/ManagePotentiallyInactiveMembers";
import NavBar from "@/components/NavBar";
import TodayAttendance from "@/components/TodayAttendance";
import { useEffect, useState } from "react";

function attendance() {
    const [permissions, setPermissions] = useState({
        canEditMusicalRoles: false,
        canEditBoardRoles: false,
        canAddMembers: false,
        canChangeActiveStatus: false
    });

    const [activeMembers, setActiveMembers] = useState([])
    const [absenceReasons, setAbsenceReasons] = useState([])

    useEffect(() => {
        //get user permissions
        fetch('http://localhost:8080/getUserPermissions')
            .then(response => response.json())
            .then(data => { console.log(data)
                            setPermissions(data)
            });

        fetch('http://localhost:8080/getActiveMembers')
            .then(response => response.json())
            .then(data => { console.log(data)
                            setActiveMembers(data)
            })
        

        fetch('http://localhost:8080/getAbsenceReasons')
            .then(response => response.json())
            .then(data => { console.log(data)
                            setAbsenceReasons(data)
            })
        
    }, []);

    return (
        <div>
            <NavBar/>
            
            <h2>Attendance</h2>

            {permissions.canChangeActiveStatus && (
                <ManagePotentiallyInactiveMembers></ManagePotentiallyInactiveMembers>
            )}

            {activeMembers.length > 0 && absenceReasons.length > 0 ? (
                <TodayAttendance members={activeMembers} reasons={absenceReasons} />
                ):(
                    <div>Loading Active Members and Absence Reasons...</div>
                )}

        </div>
    )
}

export default attendance