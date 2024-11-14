import React, { useEffect, useState } from 'react';

const MusicalRolesComponent = () => {
    // Define role options
    const roleOptions = [
        'Accompanist', 
        'Director', 
        'BassSectionLeader', 
        'TenorSectionLeader', 
        'AltoSectionLeader', 
        'SopranoSectionLeader'
    ];

    // State for role assignments and active members
    const [loadedRoles, setLoadedRoles] = useState([]);
    const [activeMembers, setActiveMembers] = useState([]);

    // Fetch role assignments and active members when the component loads
    useEffect(() => {
        // Fetch role assignments
        fetch('/getMusicalRoleAssignments')
            .then(response => response.json())
            .then(data => setLoadedRoles(data));

        // Fetch active members
        fetch('/getActiveMembers')
            .then(response => response.json())
            .then(data => setActiveMembers(data));
    }, []);

    // Handle role change
    const handleRoleChange = (roleId, newRoleType) => {
        fetch('/updateExistingRole', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role_id: roleId, role_type: newRoleType })
        })
        .then(response => response.json())
        .then(updatedRole => {  //update this row in the loadedRoles, so change is accurate though changes
            setLoadedRoles(loadedRoles.map(role =>
                role.role_id === roleId ? { ...role, role_type: newRoleType } : role
            ));
        });
    };

    // Handle role deletion
    const handleDeleteRole = (roleId) => {
        fetch('/deleteRoleRow', { 
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role_id: roleId }) // Send roleId in the JSON body
        })
        .then(() => {
            setLoadedRoles(loadedRoles.filter(role => role.role_id !== roleId));
        });
    };

    // Handle adding a new role assignment
    const handleAddRole = (memberId, newRoleType) => {
        fetch('/assignNewRole', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ member_id: memberId, role_type: newRoleType })
        })
        .then(response => response.json())
        .then(newRole => {
            setLoadedRoles([...loadedRoles, newRole]);
        });
    };

    return (
        <div>
            <h3>Manage Member Roles</h3>

            <table>
                <thead>
                    <tr>
                        <th>Member Name</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loadedRoles.map(role => (
                        <tr key={role.role_id}>
                            <td>{role.first_name} {role.last_name}</td>
                            <td>
                                <select 
                                    value={role.role_type}
                                    onChange={(e) => handleRoleChange(role.role_id, e.target.value)}
                                >
                                    {roleOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <button onClick={() => handleDeleteRole(role.role_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Add a New Role Assignment</h3>
            <div>
                <label>Member: </label>
                <select id="newMemberSelect">
                    {activeMembers.map(member => (
                        <option key={member.member_id} value={member.member_id}>
                            {member.first_name} {member.last_name}
                        </option>
                    ))}
                </select>

                <label>Role: </label>
                <select id="newRoleSelect">
                    {roleOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                
                <button onClick={() => {
                    const memberId = document.getElementById('newMemberSelect').value;
                    const roleType = document.getElementById('newRoleSelect').value;
                    handleAddRole(memberId, roleType);
                }}>Add Role</button>
            </div>
        </div>
    );
};

export default MusicalRolesComponent;
