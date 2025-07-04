import { useContext, useState,useEffect } from "react";
import { contextProviderDeclare } from "../store/ContextProvider";
import AuthorJournalEmptyMessage from "../components/AuthorJournalEmptyMessage";
import JournalsByAuthor from "../components/JournalsByAuthor";

const ArticlesByAuthor=()=>{
    const {author}=useContext(contextProviderDeclare);
    const [authorArticles,setAuthorArticles]=useState([]);

    console.log(authorArticles);
    
    useEffect(()=>{
        const fetchArticlesByAuthor=async()=>{
            try{
                const response=await fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/journal/by-corresponding-author/${author.id}`,{
                    method:'GET',
                    headers:{
                        'Authorization':`Bearer ${author.token}`
                    }
                })

                if(!response.ok){
                    throw new Error("Failed to fetch articles by author");
                }else{
                    const data=await response.json();
                    setAuthorArticles(data);
                }
            }catch(error){
                console.error("Error fetching articles by author:",error);
            }
        }

        fetchArticlesByAuthor();
    },[])
    return (
        <>
            {authorArticles.length===0 ? <AuthorJournalEmptyMessage/> : <JournalsByAuthor authorArticles={authorArticles}/>}
        </>
    )
}

export default ArticlesByAuthor;