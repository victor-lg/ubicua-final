import React from "react";
import {MdArrowBackIosNew, MdArrowForwardIos, } from "react-icons/md";

function doSomething() {
   
    
}

export function DescubreD(props) {

    return (
        
        <div className="descubre">
            <h1>Descubre nuevas películas</h1>
            <h1>{props.dataVideo.title}</h1>
            <div className="descubre-contenedor">
                <div className="descubre-flecha-izq" onClick={doSomething}><MdArrowBackIosNew/></div>
                <div className="descubre-poster-izq" onClick={doSomething}><img src={props.dataVideoPrev.poster} alt="prev"/></div>
                <div className="descubre-poster-central" onClick={doSomething}><img src={props.dataVideo.poster} alt="now"/></div>
                <div className="descubre-poster-der" onClick={doSomething}><img src={props.dataVideoNext.poster} alt="next"/></div>
                <div className="descubre-flecha-der" onClick={doSomething}><MdArrowForwardIos/></div>
            </div>
        </div>
    );
}