import React from "react";
import { useEffect, useState } from "react";
import { IoMdVolumeHigh, IoMdVolumeOff } from "react-icons/io";

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
                if (data.action === "down" && player !== undefined && player.pauseVideo) {
                    //pausar video
                    player.pauseVideo();
                } else if (data.action === "up" && player !== undefined && player.playVideo) {
                    //reaunudar video
                    player.playVideo();
                }
            } else if (data.gesture === "volume") {
                if (data.action === "mute" && player !== undefined) {
                    player.mute();
                    player.playVideo();
                } else if (data.action === "unmute" && player !== undefined) {
                    player.unMute();
                    player.playVideo();
                } else {
                    if (player !== undefined) {
                        player.setVolume(data.action);
                        console.log(data.action);
                        document.getElementById("volume").innerHTML = data.action;
                    }
                }

            } else if (data.gesture === "swipe") {
                if (data.action === "down" && player !== undefined) {
                    player.seekTo(0, true);
                } else if (data.action === "right" && player !== undefined) {
                    var nowTime = player.getCurrentTime();
                    nowTime = nowTime + 30;
                    player.seekTo(nowTime, true);
                    console.log("act:", nowTime, "desp;", nowTime + 30);
                } else if (data.action === "left" && player !== undefined) {
                    var nowTime = player.getCurrentTime();
                    nowTime = nowTime - 10;
                    player.seekTo(nowTime, true);
                    console.log("act:", nowTime, "desp;", nowTime - 10);
                }
            }
        });
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
            <div id="mute">{props.volIcon}</div>
            <div id="volume">50</div>
            {/* <iframe id="iframe" width="1280" height="720" src={props.dataVideo.link} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> */}
        </div>
    );
}