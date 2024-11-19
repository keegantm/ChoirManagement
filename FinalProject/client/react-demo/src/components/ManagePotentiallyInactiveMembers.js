import members from '@/pages/members';
import React, { useEffect, useState } from 'react';


const ManagePotentiallyInactiveMembers = () => {

    const [displayedMembers, setDisplayedMembers] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const membersResponse = await fetch('http://localhost:8080/retrievePotentiallyInactiveMembers');

                if (!membersResponse.ok) {
                    console.log(membersResponse.json())
                    throw new Error('Failed to fetch members');
                }

                const memberData = await membersResponse.json();
                setDisplayedMembers(memberData)
                console.log(memberData)
            } catch (error) {
                console.error("Error fetching potentially inactive members", error)
            }
        }
        fetchData();
    }, [])

    const handleSetInactive = async (member_id) => {
        try {
            const setInactive = await fetch('http://localhost:8080/setInactiveMember', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({member_id:member_id})
            });


            if (!setInactive.ok) {
                throw new Error('Failed to set the member as inactive');
            }
            
            const changedData = await setInactive.json();
            console.log(changedData)
            console.log("Displayed members:", displayedMembers);

            setDisplayedMembers(displayedMembers.filter(member => member.member_id != changedData.member_id));
        } catch (error) {
            console.error("Error setting a member as inactive");
        }
    }

    return (
        <div>
            <h3>Members Who May Be Inactive</h3>
            <p>As of this page loading, these members have not been to the last five practices</p>
            <table>
                <thead>
                    <tr>
                        <th>Member Name</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {displayedMembers.map(member => (
                        <tr key={member.member_id}>
                            <td>
                                {member.first_name} {member.last_name}
                            </td>
                            <td>
                                <button onClick={() => handleSetInactive(member.member_id)}>Set Inactive</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ManagePotentiallyInactiveMembers;