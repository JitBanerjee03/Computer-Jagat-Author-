import { useContext, useEffect, useState } from "react";
import AuthorProfile from "../components/AuthorProfile"
import { contextProviderDeclare } from "../store/ContextProvider"

const Account=()=>{
    const getContextObject=useContext(contextProviderDeclare);
    const {author}=getContextObject;
    const [authorDetails,setAuthorDetails]=useState({});
    
    useEffect(()=>{
        if (!author?.id) return; //check if author is available before making the API call
        const getUserProfileDetails=async()=>{
            const authorResponse=await fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/author/detail/${author.id}`,{
                method:"GET",
                headers:{
                    "content-type":"application/json"
                }
            })

            const authorData=await authorResponse.json();
            console.log(authorData);
            setAuthorDetails(authorData);
        }

        getUserProfileDetails();
    },[])
    
    return(
        <AuthorProfile author={authorDetails}/>
    )
}

export default Account;