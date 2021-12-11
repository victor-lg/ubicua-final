import React from "react";
import {AiFillDislike, AiFillLike} from "react-icons/ai";

export function RecomendadasD(props) {
    return (
        <div className="Todas">
            <h1>Películas recomendadas</h1>
            <div className="Todas-contenedor">
                <div className="Todas-flecha-izq"><AiFillDislike /></div>
                <div className="Todas-poster-central"><img src={props.dataVideo.poster} alt="" /></div>
                <div className="Todas-flecha-der"><AiFillLike /></div>
            </div>
        </div>
    );
}