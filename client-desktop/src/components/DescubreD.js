import React from "react";
import iron1 from "./images/IronMan(2008).jpeg"
import iron2 from "./images/IronMan2(2010).jpeg"
import iron3 from "./images/IronMan3(2013).jpeg"
import { MdArrowBackIosNew } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";


export function DescubreD(props) {
  return (
    <div className="descubre">
      <h1>Descubre nuevas películas</h1>
      <div class="descubre-contenedor">
        <div class="descubre-flecha-izq"><MdArrowBackIosNew/></div>
        <div class="descubre-poster-izq"><img src={iron1} alt=""></img></div>
        <div class="descubre-poster-central"><img src={iron2} alt=""></img></div>
        <div class="descubre-poster-der"><img src={iron3} alt=""></img></div>
        <div class="descubre-flecha-der"><MdArrowForwardIos/></div>
      </div>
    </div>
  );
}