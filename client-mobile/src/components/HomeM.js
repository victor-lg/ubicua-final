import React from "react";
import { RecomendadasM } from "./RecomendadasM";
import { FavoritasM } from './FavoritasM';
import { DescubreM } from './DescubreM';

export function Home(props) {
  return (
    <div>
      {props.screen === "Home" &&
        <div>
          <h1>Welcome, {props.userName}</h1>
          <input type="button" id="signOut_button" onClick={props.disconnect} value="disconnect"/>
          <div id="container">
            <input type="button" value="Descubre" className="msg_button" onClick={() => props.sendAction("Descubre")}></input>
            <input type="button" value="Favoritas" className="msg_button" onClick={() => props.sendAction("Favoritas")}></input>
            <input type="button" value="Recomendadas" className="" onClick={() => props.sendAction("Recomendadas")}></input>
          </div>
        </div>
      }

      {props.screen === "Recomendadas" &&
        <RecomendadasM sendAction={props.sendAction}/>
      }

      {props.screen === "Favoritas" &&
        <FavoritasM sendAction={props.sendAction}/>
      }

      {props.screen === "Descubre" &&
        <DescubreM sendAction={props.sendAction}/>
      }
    </div>
  );
}