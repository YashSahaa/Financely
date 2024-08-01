import React, { useEffect } from 'react'
import "./style.css"
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { toast } from 'react-toastify';

function Header() {

  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(()=>{
    if(user){
      navigate("/dashboard");
    }
  },[user,loading]);

  function logoutFunc(){
    try{
      signOut(auth).then(() => {
        // Sign-out successful.
        toast.success("logout successfully")
        navigate("/")
      }).catch((error) => {
        // An error happened.
        toast.error(error.message);
      });
    }catch(e){
      toast.error(e);
    }
    
  }

  return (
    <div className='navbar'>
      <p className='logo '>Financely.</p>
      {user && (<p onClick={logoutFunc} className='logo link'>Logout</p>)}
    </div>
  )
}

export default Header
