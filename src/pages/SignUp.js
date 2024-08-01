import React from 'react';
import Signupsignin from '../components/SignupSignin';
import Header from '../components/Header';


function SignUp() {
  return (
    <div>
      <Header/>
      <div className='wrapper'><Signupsignin/></div>
    </div>
  )
}

export default SignUp;