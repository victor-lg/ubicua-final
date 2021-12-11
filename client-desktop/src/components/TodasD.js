import React from "react";
import { MdArrowBackIosNew, MdArrowForwardIos, } from "react-icons/md";

export function TodasD(props) {

    return (

        <div className="Todas">
            <h1>Todas las películas</h1>
            <h1>{props.dataVideo.title}</h1>
            <div className="Todas-contenedor">
                <div className="Todas-flecha-izq" ><MdArrowBackIosNew /></div>
                <div className="Todas-poster-izq" ><img src={props.dataVideoPrev.poster} /></div>
                <div className="Todas-poster-central" ><img src={props.dataVideo.poster} /></div>
                <div className="Todas-poster-der" ><img src={props.dataVideoNext.poster} /></div>
                <div className="Todas-flecha-der" ><MdArrowForwardIos /></div>
            </div>
        </div>
    );
}