import React, { useEffect, useState } from 'react';

/*
Component for a user to manage the voice parts in the choir
*/
const VoicePartComponent = (props) => {
    const voiceOptions = [
        'Bass',
        'Tenor',
        'Soprano',
        'Alto'
    ]

    //active members of the choir
    const { members } = props;

    //loaded voice parts + member joins
    const [loadedVoiceParts, setLoadedVoiceParts] = useState([]);
    //active choir members
    const [activeMembers, setActiveMembers] = useState([]);

    //when we recieve active members, get voice parts and set our state variables
    useEffect(() => {
        const fetchData = async () => {
            try {
                const voiceResponse = await fetch('http://localhost:8080/getActiveVoiceParts')

                if (!voiceResponse.ok) {
                    console.log(voiceResponse)
                    throw new Error('Failed to fetch voice assignments');
                }

                const voiceData = await voiceResponse.json();
                setLoadedVoiceParts(voiceData);
                
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
    }, [members]);
    

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

                //update displayed voice parts
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

            const handleAddVoicePart = await fetch('http://localhost:8080/addVoicePart', {
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

    //only render if we have all the required info
    if (!loadedVoiceParts || loadedVoiceParts.length === 0) {
        return <div>Loading Voice Parts...</div>;
    }
    if (!activeMembers || activeMembers.length === 0) {
        return <div>Loading Members...</div>
    }

    return (
        <div className="component">
            <h2 className="mb-2">Manage Voice Parts</h2>

            <table className="content-table">
                <thead>
                    <tr>
                        <th className='table-col-header'>Member Name</th>
                        <th className='table-col-header'>Voice Part</th>
                        <th className='table-col-header'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loadedVoiceParts.map(part => (
                        <tr key={part.voice_part_id}>
                            <td className="table-cell">{part.first_name} {part.last_name}</td>
                            <td className="table-cell">
                                <select 
                                    value={part.voice_part}
                                    onChange={(e) => handleVoicePartChange(part.voice_part_id, e.target.value)}
                                >
                                    {voiceOptions.map(option => (
                                        <option key={option+part.voice_part_id} value={option}>{option}</option>
                                    ))}
                                </select>
                            </td>
                            <td className="table-cell">
                                <button  className="table-button" onClick={() => handleDeleteVoicePart(part.voice_part_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <div className="sub-component">
                <h2 className='mt-4 mb-2'>Add a Voice Part Assignment</h2>

                <div className="grid grid-cols-9 grid-flow-col mb-2">
                    <label className='col-span-1'>Member: </label>
                    <select id="voicePartMemberSelect" className='select col-span-5'>
                        {activeMembers.map(member => (
                            <option key={member.member_id} value={member.member_id || "default_id"}>
                                {member.first_name} {member.last_name}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="grid grid-cols-9 grid-flow-col mb-2">
                    <label className="col-span-1">Voice Part: </label>
                    <select id="voicePartSelect" className='select col-span-5'>
                        {voiceOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>    

                <button className="component-button" onClick={() => {
                    
                    const memberId = document.getElementById('voicePartMemberSelect').value
                    const voiceSelection = document.getElementById('voicePartSelect').value;
                    handleAddVoicePart(memberId, voiceSelection);
                }}>Add Role</button>
                
            </div>
        </div>
    );
};

export default VoicePartComponent;