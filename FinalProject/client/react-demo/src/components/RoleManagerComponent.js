import React, { useEffect, useState } from 'react';

/*
Component for managing what roles members of the chorus have
*/
const RoleManagerComponent = (props) => {
    //roleOptions is a list of roles this user can manage
    //members is a list of active members of the choir
    const { roleOptions, members, fetchPermissions } = props;

    console.log("IN ROLE MANAGER members are :", members)
    console.log("IN ROLE MANAGER role options are:", roleOptions)

    // State for role assignments and active members
    const [loadedRoles, setLoadedRoles] = useState([]);
    const [activeMembers, setActiveMembers] = useState([]);
    
    //when get props, populate state variables
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch role assignments based on roleOptions
                if (roleOptions && roleOptions.length > 0) {
                    const roleResponse = await fetch('http://localhost:8080/getRoleAssignmentsByType', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ role_types: roleOptions }) // Pass role options as the filter
                    });
    
                    if (!roleResponse.ok) {
                        throw new Error('Failed to fetch role assignments');
                    }
    
                    const roleData = await roleResponse.json();
                    setLoadedRoles(roleData);
                }
                
                /*
                // Fetch active members
                const memberResponse = await fetch('http://localhost:8080/getActiveMembers');
                if (!memberResponse.ok) {
                    throw new Error('Failed to fetch active members');
                }
    
                const memberData = await memberResponse.json();
                setActiveMembers(memberData);
                console.log(memberData);  // Log the fetched active members if needed
                */
               setActiveMembers(members)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchData();
    }, [roleOptions, members]);
    

    //handle role change
    const handleRoleChange = async (roleId, newRoleType) => {
        try{

            const handleRoleChangeResponse = await fetch('http://localhost:8080/updateExistingRole', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role_id: roleId, role_type: newRoleType})
            })

            if (!handleRoleChangeResponse.ok) {
                throw new Error('Failed to handle role change');
            }

            const changedData = await handleRoleChangeResponse.json();
            console.log(changedData);

            //update displayed role
            setLoadedRoles(loadedRoles.map(role =>
                role.role_id === roleId ? { ...role, role_type: newRoleType } : role
            ));

            fetchPermissions()
            
        }
        catch (error) {
            console.error("Error fetching data in handleRoleChange::", error);
        }
        
    };
            
    //handle role deletion
    const handleDeleteRole = async (roleId) => {

        try{
            const handleDeleted = await fetch('http://localhost:8080/deleteRoleRow', { 
                method: 'DELETE', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role_id: roleId })
            })

            if (!handleDeleted.ok) {
                throw new Error('Failed to handle deletion');
            }

            const changedData = await handleDeleted.json();
            console.log(changedData);
            setLoadedRoles(loadedRoles.filter(role => role.role_id !== roleId));
            
            fetchPermissions()
        }
        catch (error) {
            console.error("Error fetching data in handleDeleteRole:", error);
        }

    };

    // Handle adding a new role assignment
    const handleAddRole = async (memberId, newRoleType) => {
        try{
            let current_date = new Date()
            let formattedDate = current_date.toISOString().split('T')[0]
            console.log(formattedDate)

            const handleAddRole = await fetch('http://localhost:8080/assignNewRole', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ member_id: memberId, role_type: newRoleType, role_start_date: formattedDate })
            })

            if (!handleAddRole.ok) {
                throw new Error('Failed to handle adding role');
            }
            
            //join of member row and role row
            const result = await handleAddRole.json();
            console.log(result)

            //update the display role table
            const roleResponse = await fetch('http://localhost:8080/getRoleAssignmentsByType', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role_types: roleOptions }) // Pass role options as the filter
            });

            if (!roleResponse.ok) {
                throw new Error('Failed to fetch role assignments');
            }

            const roleData = await roleResponse.json();
            setLoadedRoles(roleData);

            fetchPermissions()
        }
        catch (error){
            console.error("Error adding a role assignment:", error);
        }
    };

    //only render if roleOptions are defined and have items
    if (!roleOptions || roleOptions.length === 0) {
        return <div>Loading Roles...</div>;
    }

    //only render if we have active members to assign to roles
    if (!activeMembers || activeMembers.length === 0) {
        return <div>Loading Members</div>
    }

    return (
        <div className="component">
            <h2 className="mb-2">Manage Role Assignments</h2>

            <table className="content-table">
                <thead>
                    <tr>
                        <th className='table-col-header'>Member Name</th>
                        <th className='table-col-header'>Role</th>
                        <th className='table-col-header'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loadedRoles.map(role => (
                        <tr key={role.role_id}>
                            <td className="table-cell">{role.first_name} {role.last_name}</td>
                            <td className="table-cell">
                                <select 
                                    value={role.role_type}
                                    onChange={(e) => handleRoleChange(role.role_id, e.target.value)}
                                >
                                    {roleOptions.map(option => (
                                        <option key={option+role.role_id} value={option}>{option}</option>
                                    ))}
                                </select>
                            </td>
                            <td className="table-cell">
                                <button className="table-button" onClick={() => handleDeleteRole(role.role_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="sub-component">
                <h2 className='mt-4 mb-2'>Add a New Role Assignment</h2>
                
                <div className="grid grid-cols-9 grid-flow-col mb-2">
                    <label className='col-span-1'>Member: </label>
                    <select id="newMemberSelect" className='select col-span-5'>
                        {activeMembers.map(member => (
                            <option key={member.member_id} value={member.member_id || "default_id"}>
                                {member.first_name} {member.last_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-9 grid-flow-col mb-2">
                    <label className="col-span-1">Role: </label>
                    <select id="newRoleSelect" className='select col-span-5'>
                        {roleOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                
                <button className="component-button " onClick={() => {
                    
                    console.log(document.getElementById('newMemberSelect').value)
                    const memberId = document.getElementById('newMemberSelect').value
                    const roleType = document.getElementById('newRoleSelect').value;
                    console.log(memberId)
                    handleAddRole(memberId, roleType);
                }}>Add Role</button>
            </div>
        </div>
    );
};

export default RoleManagerComponent;
