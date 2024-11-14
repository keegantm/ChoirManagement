import React, { useEffect, useState } from 'react';

const RoleManagerComponent = (props) => {
    const { roleOptions } = props;

    // State for role assignments and active members
    const [loadedRoles, setLoadedRoles] = useState([]);
    const [activeMembers, setActiveMembers] = useState([]);

    // Fetch role assignments and active members when the component loads
    useEffect(() => {
        if (roleOptions && roleOptions.length > 0) {
            // Fetch role assignments based on roleOptions
            fetch('/getRoleAssignmentsByType', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role_types: roleOptions }) // Pass role options as the filter
            })
            .then(response => response.json())
            .then(data => setLoadedRoles(data))
            .catch(error => console.error("Error fetching role assignments:", error));
        }

        // Fetch active members
        fetch('/getActiveMembers')
            .then(response => response.json())
            .then(data => setActiveMembers(data))
            .catch(error => console.error("Error fetching active members:", error));
    }, [roleOptions]);

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
        .then(() => {
            setLoadedRoles(loadedRoles.map(role =>
                role.role_id === roleId ? { ...role, role_type: newRoleType } : role
            ));
        })
        .catch(error => console.error("Error updating role:", error));
    };

    // Handle role deletion
    const handleDeleteRole = (roleId) => {
        fetch('/deleteRoleRow', { 
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role_id: roleId })
        })
        .then(() => {
            setLoadedRoles(loadedRoles.filter(role => role.role_id !== roleId));
        })
        .catch(error => console.error("Error deleting role:", error));
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
        })
        .catch(error => console.error("Error adding role:", error));
    };

    // Only render if roleOptions are defined and have items
    if (!roleOptions || roleOptions.length === 0) {
        return null;
    }

    return (
        <div>
            <h3>Manage Musical Roles</h3>

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

export default RoleManagerComponent;
