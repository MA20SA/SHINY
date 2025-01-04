import { createContext, useContext, useState} from "react";

const RefreshAccount = createContext();

export const useRefreshAccount =()=>useContext(RefreshAccount)

export const RefreshAccountProvider= ({children})=>{
    const [refresh,setRefresh]=useState('')

    return(
        <RefreshAccount.Provider value={{ refresh,setRefresh }}>
            {children}
        </RefreshAccount.Provider>
    )
}