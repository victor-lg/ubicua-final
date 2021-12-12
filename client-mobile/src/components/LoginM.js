import React from "react";
import logo from './images/logo.png';


export function Login(props) {
    return (
        <div id="mainLogIn">
            <div id="logoLogIn">
                <img src={logo} alt="logo"/>
            </div>
            <h1>Bienvenido a la version movil<br></br>Para entrar inicie sesión con <br></br>su cuenta de Google</h1>


            <div className="google-btn">
                <div className="google-icon-wrapper">
                    <img className="google-icon" onClick={props.signIn}
                         src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                         alt="google-logo"/>
                </div>
                <p className="btn-text" onClick={props.signIn}><b>Sign in with google</b></p>
            </div>
        </div>
    );
}

