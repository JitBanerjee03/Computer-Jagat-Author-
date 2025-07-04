import React, { useContext, useState } from "react";
import JournalCard from "../components/JournalCard";
import Loader from "../components/Loader";
import { contextProviderDeclare } from "../store/ContextProvider";
import EmptyAcceptedJournalMessage from "../components/EmptyAcceptedJournalMessage";


const Home = () => {
  
  const getContextObject=useContext(contextProviderDeclare);
  const {journals,loader}=getContextObject;
  return (
    <>
        {!loader ? 
            journals.length===0 ? <EmptyAcceptedJournalMessage/> :
              <div className="container mt-4">
                  {journals.map(journal => (
                      <JournalCard key={journal.id} journal={journal} />
                  ))}
              </div> 
          : <Loader/>
        }
    </>
  );
};

export default Home;
