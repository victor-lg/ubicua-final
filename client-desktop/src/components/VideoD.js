import React from "react";
import { useEffect, useRef } from "react";

var controller = false;

export function VideoD(props) {
    var player;

    useEffect(() => {
        if (controller) {
            onYouTubeIframeAPIReady();
        }
    }, [props.dataVideo.link]);

    useEffect(() => {
        const tag = document.createElement("script");

        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        //esto sirve para implementar la función onYouTubeIframeAPIReady de las API
        window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
        controller = true;
        props.socket.on("doAction", (data, e) => {
            if (data.gesture === "turn") {
                console.log("mobile " + data.action);
                if (data.action === "down" && player.pauseVideo && player !== undefined) {
                    //pausar video
                    player.pauseVideo();
                    // console.log(pause.current);
                } else if (data.action === "up" && player.playVideo && player !== undefined) {
                    //reaunudar video
                    player.playVideo();

                    // console.log(pause.current);
                }
            }
        })
    }, []);



    //Cuando se ejecute esta función podemos cargar
    function onYouTubeIframeAPIReady() {
        console.log("onYouTubeIframeAPIReady");
        player = new window.YT.Player("player", {
            height: "720",
            width: "1280",
            videoId: props.dataVideo.link,
            events: {
                onReady: onPlayerReady,
                onError: (e) => console.error(e)
            }
        });
    }


    function onPlayerReady(event) {
        if (event.target.playVideo()) {
            event.target.mute();
            event.target.playVideo();
        }
    };

    return (

        <div className="descubre" id="Video">

            <h1> {props.dataVideo.title}</h1>
            <div id="player"></div>
            {/* <iframe id="iframe" width="1280" height="720" src={props.dataVideo.link} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> */}
        </div>
    );
}