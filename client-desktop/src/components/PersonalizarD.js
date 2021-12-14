import React from "react";
import {AiFillDislike, AiFillLike} from "react-icons/ai";

export function PersonalizarD(props) {
    return (
        <div className="Todas">
            <h1>Personalizar tus gustos</h1>
            <h1>{props.dataRateVideo.title}</h1>
            <div className="Todas-contenedor">
                <div className="Todas-dislike-izq"><AiFillDislike/></div>
                <div className="Todas-poster-central"><img src={props.dataRateVideo.poster}/></div>
                <div className="Todas-like-der"><AiFillLike/></div>
            </div>
        </div>
    );
}