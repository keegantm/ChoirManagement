import React, { useEffect, useState } from 'react';

const VoicePartComponent = () => {
    const voiceOptions = [
        'Bass',
        'Tenor',
        'Soprano',
        'Alto'
    ]

    // State for role assignments and active members
    const [loadedVoiceParts, setLoadedVoiceParts] = useState([]);
    const [activeMembers, setActiveMembers] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch voice assignments
                const voiceResponse = await fetch('http://localhost:8080/getActiveVoiceParts')

                if (!voiceResponse.ok) {
                    throw new Error('Failed to fetch voice assignments');
                }

                const voiceData = await voiceResponse.json();
                setLoadedVoiceParts(voiceData);
                
    
                // Fetch active members
                const memberResponse = await fetch('http://localhost:8080/getActiveMembers');
                if (!memberResponse.ok) {
                    throw new Error('Failed to fetch active members');
                }
    
                const memberData = await memberResponse.json();
                setActiveMembers(memberData);
                console.log(memberData);  // Log the fetched active members if needed
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchData();
    }, []);
    

    // Handle role change
    const handleVoicePartChange = (id, newVoicePart) => {
        const fetchData = async () => {
            try{

                const handleVoicePartChangeResponse = await fetch('http://localhost:8080/updateExistingVoicePart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ voice_part_id: id, voice_part: newVoicePart})
                })

                if (!handleVoicePartChangeResponse.ok) {
                    throw new Error('Failed to handle voice part change');
                }

                const changedData = await handleVoicePartChangeResponse.json();
                console.log(changedData);
                setLoadedVoiceParts(loadedVoiceParts.map(part =>
                    part.voice_part_id === id ? { ...part, voice_part: newVoicePart } : part
                ));
                
                
            }
            catch (error) {
                console.error("Error fetching data in handleVoicePartChange:", error);
            }
        }
        fetchData();
    }
            


    // Handle role deletion
    const handleDeleteVoicePart = async (partId) => {

        try{
            const handleDeleted = await fetch('http://localhost:8080/deleteVoicePart', { 
                method: 'DELETE', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ voice_part_id: partId })
            })

            if (!handleDeleted.ok) {
                throw new Error('Failed to handle deletion');
            }

            const changedData = await handleDeleted.json();
            console.log(changedData);
            setLoadedVoiceParts(loadedVoiceParts.filter(part => part.voice_part_id !== partId));
 
        }
        catch (error) {
            console.error("Error fetching data in handleDeleteVoicePart:", error);
        }

    };

    // Handle adding a new role assignment
    const handleAddVoicePart = async (memberId, newVoicePart) => {
        try{

            const handleAddVoicePart = await fetch('http://localhost:8080/insertVoicePart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ member_id: memberId, voice_part: newVoicePart})
            })

            if (!handleAddVoicePart.ok) {
                throw new Error('Failed to handle adding voice part');
            }
            
            //join of member row and role row
            const result = await handleAddVoicePart.json();
            console.log(result)

            // Fetch voice assignments
            const voiceResponse = await fetch('http://localhost:8080/getActiveVoiceParts')

            if (!voiceResponse.ok) {
                throw new Error('Failed to fetch voice assignments');
            }

            const voiceData = await voiceResponse.json();
            setLoadedVoiceParts(voiceData);
    }
        catch (error){
            console.error("Error adding a voice part assignment:", error);
    }
    };

    // Only render if roleOptions are defined and have items
    if (!loadedVoiceParts || loadedVoiceParts.length === 0) {
        return <div>Loading Voice Parts...</div>;
    }

    if (!activeMembers || activeMembers.length === 0) {
        return <div>Loading Members...</div>
    }

    return (
        <div>
            <h3>Manage Voice Parts</h3>

            <table>
                <thead>
                    <tr>
                        <th>Member Name</th>
                        <th>Voice Part</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loadedVoiceParts.map(part => (
                        <tr key={part.voice_part_id}>
                            <td>{part.first_name} {part.last_name}</td>
                            <td>
                                <select 
                                    value={part.voice_part}
                                    onChange={(e) => handleVoicePartChange(part.voice_part_id, e.target.value)}
                                >
                                    {voiceOptions.map(option => (
                                        <option key={option+voice.voice_part_id} value={option}>{option}</option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <button onClick={() => handleDeleteVoicePart(part.voice_part_id)}>Delete</button>
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
                        <option key={member.member_id} value={member.member_id || "default_id"}>
                            {member.first_name} {member.last_name}
                        </option>
                    ))}
                </select>

                <label>Voice Part: </label>
                <select id="voicePartSelect">
                    {voicePart.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                
                <button onClick={() => {
                    
                    const memberId = document.getElementById('newMemberSelect').value
                    const voiceSelection = document.getElementById('voicePartSelect').value;
                    handleAddVoicePart(memberId, voiceSelection);
                }}>Add Role</button>
            </div>
        </div>
    );
};

export default VoicePartComponent;
