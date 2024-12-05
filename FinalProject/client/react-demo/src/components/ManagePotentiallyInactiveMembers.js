import React, { useEffect, useState } from 'react';

/* 
Component for viewing members who may be inactive, and setting them to inactive
*/
const ManagePotentiallyInactiveMembers = (props) => {

    //updateActiveMembers is callback to parent, when a member is set as inactive
    //pInactiveMembers is a list of potentially inactive members
    const { updateActiveMembers, pInactiveMembers} = props;

    //members displayed by this prop
    const [displayedMembers, setDisplayedMembers] = useState([])

    /*
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
    */

    //on page load, display the potentially inactive members
    useEffect( () => {
        setDisplayedMembers(pInactiveMembers)
    }, [pInactiveMembers])
    
    const handleSetInactive = async (member_id) => {
        try {
            //change member to be inactive
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
            updateActiveMembers()
        } catch (error) {
            console.error("Error setting a member as inactive");
        }
    }

    if (displayedMembers.length === 0) {
        return (
            <div className="component">
                <h2>No members are flagged as potentially inactive.</h2>
            </div>
        )
    }

    return (
        <div className="component">
            <h2>Potentially Inactive Choir Members</h2>
            <p className="mb-2">These members have not attended the last five practices.</p>
            <table className="content-table">
                <thead>
                    <tr>
                        <th className='table-col-header'>Member Name</th>
                        <th className='table-col-header'>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {displayedMembers.map(member => (
                        <tr key={member.member_id}>
                            <td className="table-cell">
                                {member.first_name} {member.last_name}
                            </td>
                            <td className="table-cell">
                                <button className="table-button" onClick={() => handleSetInactive(member.member_id)}>Set Inactive</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ManagePotentiallyInactiveMembers;