import React from "react";


export function Login(props){
    return (
        <div>
        <h1>ESTAS EN MOVIL</h1>
        <button onClick={props.signIn}>Sign-in with Google</button>
        </div>
    );
}

