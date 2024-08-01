import React from 'react';
import "./style.css";

function Button({disabled,text,onClick,blue}) {
  return (
    <div className={blue ? "btn btn-blue":"btn"} onClick={onClick} disabled={disabled}>
      {text}
    </div>
  )
}

export default Button;
