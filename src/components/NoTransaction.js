import React from 'react'

function NoTransaction() {
  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",width:"100%",flexDirection:"column",marginBottom:"2rem"}}>
        <img src="https://cdni.iconscout.com/illustration/premium/thumb/payment-unsuccessful-4790938-3989291.png" style={{width:"450px",margin:"0rem"}}/>
        <p style={{textAlign:"center",fontSize:"1.2rem",margin:"0.5rem"}}>You Have No Transaction Currently</p>
    </div>
  )
}

export default NoTransaction
