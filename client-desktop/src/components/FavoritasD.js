import React from "react";
import {MdArrowBackIosNew, MdArrowForwardIos} from "react-icons/md";


function doSomething() {
    console.log("test");
}

export function FavoritasD(props) {
    return (
        <div className="descubre">
            <h1>Películas favoritas</h1>
            <div className="descubre-contenedor">
                <div className="descubre-flecha-izq" onClick={doSomething}><MdArrowBackIosNew/></div>
                <div className="descubre-poster-izq" onClick={doSomething}><img src="" alt=""/></div>
                <div className="descubre-poster-central" onClick={doSomething}><img src="" alt=""/></div>
                <div className="descubre-poster-der" onClick={doSomething}><img src="" alt=""/></div>
                <div className="descubre-flecha-der" onClick={doSomething}><MdArrowForwardIos/></div>
            </div>
        </div>
    );
}