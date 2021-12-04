import React from "react";

export function Home(props){
    return(
        <div>
          <h1>Welcome, {props.userName}</h1>
          <input type="button" value="&#129094;" id="msg_button" onClick={props.sendMessage}></input>
        </div>
    );
}