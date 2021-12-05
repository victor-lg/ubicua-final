import React from "react";


export function Login(props){
    return (
        <div>
            <h1>Estas en desktop</h1>
        <button onClick={props.signIn}>Sign-in with Google</button>
        </div>
    );
}

