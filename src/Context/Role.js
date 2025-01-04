import {createContext, useContext, useEffect, useState} from "react";
import axios from "axios";

const RoleContext = createContext();

export const useRole =()=>useContext(RoleContext)

export const RoleProvider= ({children})=>{
    const [Role,setRole]=useState();
    const currentRole = localStorage.getItem("authRole");

    const id = localStorage.getItem("userID");

    useEffect(()=>{
        if(currentRole && id && currentRole==="user"){
        const checkRoleInterval = setInterval(() => {
            const fetchRole = async () => {
                try {
                    const response = await axios.get(`https://shinyproject.onrender.com/user/getUserRoleById/${id}`);
                    if (response.data) {
                       if(response.data.role === "owner" && currentRole === "user"){
                           setRole(response.data.role);
                       }
                    }
                } catch (e) {
                    console.error('Error fetching role:', e);
                }
            };
            fetchRole();
        }, 1000);
        return () => clearInterval(checkRoleInterval);
        }
    },[Role])

    return(
        <RoleContext.Provider value={{ Role,setRole }}>
            {children}
        </RoleContext.Provider>
    )
}