import JournalCard from "./JournalCard";
import React from "react";

const JournalData=({journals})=>{
    return (
        <>
            <div className="container mt-4">
                {journals.map(journal => (
                    <JournalCard key={journal.id} journal={journal} />
                ))}
            </div>
        </>
    )
}

export default JournalData;