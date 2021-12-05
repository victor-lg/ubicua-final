import React from "react";
import "../App.css";

export function DescubreM(props) {
    return (
        <div>
            <h1>Películas descubre</h1>
            <div className="recomendados-contenedor">
                <div className="recomendados-anterior">
                    <p>Película anterior</p>
                </div>
                <div className="recomendados-info">
                    <p>Inclina</p>
                </div>
                <div className="recomendados-siguiente">
                    <p>Película siguiente</p>
                </div>
            </div>
            <input type="button" value="Home" onClick={() => props.sendAction("Home")}/>
        </div>
    );
}