import React from "react";
import { useEffect, useRef } from 'react';


export function VideoD(props) {

    const videoState = useRef(1); //    playing = 0  |  pausa = 1

    var player = null;

    useEffect(() => {
        if (videoState.current === 0 && player !== null) {
            player.pauseVideo();
            console.log("video en pausa");
            videoState.current = 1;

        } else if (videoState.current === 1 && player !== null) {
            player.playVideo();
            console.log("video reproduciendo");
            videoState.current = 0;
        }
    }, [props.pause]);

    function loadVideo() {
        (function loadYoutubeIFrameApiScript() {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";

            const firstScriptTag = document.getElementsByTagName("script")[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            tag.onload = setupPlayer;
        })();

        function setupPlayer() {
                player = new window.YT.Player("player", {
                    height: "720",
                    width: "1280",
                    videoId: props.dataVideo.link,
                    playerVars: {
                        'modestbranding': 1,
                        'iv_load_policy': 3,
                        'fs': 0,
                        'controls':0,
                        'rel': 0,
                        'showinfo': 0,
                        'cc_load_policy': 0
                    },
                });
                
                document.getElementById('resume').onclick = function() {
                    player.playVideo();
                };
                document.getElementById('pause').onclick = function() {
                    player.pauseVideo();
                };
        }

        function onPlayerStateChange(event) {
            var videoStatuses = Object.entries(window.YT.PlayerState);
            console.log(videoStatuses.find(status => status[1] === event.data)[0]);
        }
    }

    if (document.readyState !== "loading") {
        console.info(`document.readyState ==>`, document.readyState);
        loadVideo();
    } else {
        document.addEventListener("DOMContentLoaded", function () {
            console.info(`DOMContentLoaded ==>`, document.readyState);
            loadVideo();
        });
    }

    return (

        <div className="Todas" id="Video">
            <h1> {props.dataVideo.title}</h1>
            <div id="player"></div>
            <a href="#" id="pause">Pause</a>
            <a href="#" id="resume">Resume</a>
            {/* <iframe id="iframe" width="1280" height="720" src={props.dataVideo.link} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> */}
        </div>
    );
}