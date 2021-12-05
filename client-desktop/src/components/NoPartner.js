import React from "react";

export function NoPartner(props){
    return(
        <div>
          <h1>NO HAY MOVIL, {props.userName}</h1>
          {/* <input type="button" id="signOut_button" onClick={props.disconnect} value="disconnect"/> */}
        </div>
    );
}