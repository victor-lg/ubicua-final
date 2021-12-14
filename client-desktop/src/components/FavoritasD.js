import React from "react";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";


export function FavoritasD(props) {
    return (
        <div className="Todas">
            <h1>Películas favoritas</h1>
            <h1>{props.dataFavVideo.title}</h1>
            <div className="Todas-contenedor">
                <div className="Todas-flecha-izq" ><MdArrowBackIosNew /></div>
                <div className="Todas-poster-central" ><img src={props.dataFavVideo.poster} /></div>
                <div className="Todas-flecha-der" ><MdArrowForwardIos /></div>
            </div>
        </div>
    );
}