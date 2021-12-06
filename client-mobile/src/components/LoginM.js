import React from "react";
import logo from './images/logo.png';


export function Login(props) {
    return (
        <div id="mainLogIn">
            <div id="logoLogIn">
                <img src={logo} alt="logo"></img>
            </div>
            <h1>ESTAS EN MOVIL</h1>

            <div class="google-btn">
                <div class="google-icon-wrapper">
                    <img class="google-icon" onClick={props.signIn} src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" />
                </div>
                <p class="btn-text" onClick={props.signIn}><b>Sign in with google</b></p>
            </div>
        </div>
    );
}

