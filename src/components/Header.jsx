import React, { useContext } from 'react'
import LoggedHeader from './LoggedHeader';
import NormalHeader from './NormalHeader';
import { contextProviderDeclare } from '../store/ContextProvider';
const Header=()=>{
    const getContextObject=useContext(contextProviderDeclare);
    const {isloggedIn}=getContextObject;

    return(
        <>
            {isloggedIn ? <LoggedHeader/> : <NormalHeader/>}
        </>
    )
}

export default Header;