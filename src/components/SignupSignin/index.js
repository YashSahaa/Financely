import React, { useState } from 'react';
import "./style.css";
import Input from '../Input';
import Button from '../Button';
import { toast } from 'react-toastify';
import {createUserWithEmailAndPassword ,GoogleAuthProvider,signInWithEmailAndPassword, signInWithPopup} from "firebase/auth";
import { auth , db, provider } from '../../firebase';
import {doc,getDoc,setDoc} from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

function Signupsignin() {
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [loginForm,setLoginForm] = useState(false);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  function signupWithEmail(){
    setLoading(true);
    console.log("Name" , name);
    console.log("Email" , email);
    console.log("Password" , password);
    console.log("ConfirmPassword" , confirmPassword);

    if(name!=="" && email!=="" && password!=="" && confirmPassword!==""){
      if(password===confirmPassword){
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up 
          const user = userCredential.user;
          console.log("User>>>>" , user);
          toast.success("User Created");
          setLoading(false);
          setName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          createDoc(user);
          navigate("/dashboard");
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
          setLoading(false);
          // ..
        });
      }else{
        toast.error("Password and confirm password don't match");
        setLoading(false);
      } 
    }else{
      toast.error("All Fields are mandatory");
      setLoading(false);
    }  
  }

  function loginUsingEmail(){
    setLoading(true);
    console.log("Email" , email);
    console.log("Password" , password);

    if(email!=="" && password!==""){
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        toast.success("User logged in");
        console.log("User logged in" , user);
        setLoading(false);
        setEmail("");
        setPassword("");
        navigate("/dashboard");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
        setLoading(false);
      });
    }else{
      toast.error("All Fields are mandatory");
      setLoading(false);
    } 
    
  }

  async function createDoc(user){
    setLoading(true);
    if(!user) return ;
    

    const userRef = doc(db,"users",user.uid);
    const userData = await getDoc(userRef);

    if(!userData.exists()){
      
      try{
        await setDoc(doc(db,"users",user.uid),{
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL:user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
        });
        toast.success("Doc created");
        setLoading(false);
      }catch(e){
        toast.error(e);
        setLoading(false);
      }
    }else{
      // toast.error("Doc Already Exists");
      setLoading(false);
    }
  }

  function googleAuth(){
    setLoading(true);
    try {
      signInWithPopup(auth,provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log("User--->" , user);
        createDoc(user);
        setLoading(false);
        navigate("/dashboard");
        toast.success("User Authenticated");
        
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        console.log(error);
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        toast.error(errorMessage);
        setLoading(false);
        // ...
      });
    } catch (e) {
      toast.error(e.message);
      setLoading(false);
    } 
  }

  return (
    <>
      {loginForm ? (
        <div className='signup-wrapper'>
          <h2 className='title'>Log Into <span style={{color:"var(--theme"}}>Financely.</span></h2>
          <form>
            <Input type={"email"} label={"Email"} state={email} setState={setEmail} placeholder={"JhonDoe@gmail.com"}/>
            <Input type={"password"} label={"Password"} state={password} setState={setPassword} placeholder={"Example@123"}/>
            <Button disabled={loading} text={loading?"Loading...":"Login using Email and Password"} onClick={loginUsingEmail}/>
            <p className='p-login'>or</p>
            <Button onClick={googleAuth} text={loading?"Loading...":"Login using Google"} blue={true}/>
            <p className='p-login' style={{cursor:"pointer"}} >Or Don't Have An Account ?<span onClick={()=>setLoginForm(!loginForm)} style={{color:"blue",fontWeight:"normal"}}>Click Here</span> </p>
          </form>
        </div>
      ) : (
        <div className='signup-wrapper'>
          <h2 className='title'>SignUp on <span style={{color:"var(--theme"}}>Financely.</span></h2>
          <form>
            <Input type={"text"} label={"Full Name"} state={name} setState={setName} placeholder={"Jhon Doe"}/>
            <Input type={"email"} label={"Email"} state={email} setState={setEmail} placeholder={"JhonDoe@gmail.com"}/>
            <Input type={"password"} label={"Password"} state={password} setState={setPassword} placeholder={"Example@123"}/>
            <Input type={"password"} label={"ConfirmPassword"} state={confirmPassword} setState={setConfirmPassword} placeholder={"Example@123"}/>
            <Button disabled={loading} text={loading?"Loading...":"SignUp using Email and Password"} onClick={signupWithEmail}/>
            <p className='p-login'>or</p>
            <Button onClick={googleAuth} text={loading?"Loading...":"SignUp using Google"} blue={true}/>
            <p className='p-login' style={{cursor:"pointer"}} >Or Have An Account Already? <span onClick={()=>setLoginForm(!loginForm)} style={{color:"blue",fontWeight:"normal"}}>Click Here</span></p>
          </form>
        </div>
      )};
    </>
  )
}

export default Signupsignin;
