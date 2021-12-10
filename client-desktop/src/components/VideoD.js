import React from "react";




export function VideoD(props) {

    function loadVideo() {
        (function loadYoutubeIFrameApiScript() {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";

            const firstScriptTag = document.getElementsByTagName("script")[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            tag.onload = setupPlayer;
        })();

        let player = null;

        function setupPlayer() {
            //window.YT.ready(function () {
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
                    events: {
                        'onReady': onPlayerReady,
                        //onStateChange: onPlayerStateChange
                    }
                });
            //});
        }
        function onPlayerReady() {
            console.log("play");
            player.playVideo();
        }

        function onPlayerPause() {
            console.log("pausado");
            player.pauseVideo();
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

        <div className="descubre" id="Video">
            <h1> {props.dataVideo.title}</h1>
            <div id="player"></div>
            {/* <iframe id="iframe" width="1280" height="720" src={props.dataVideo.link} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> */}
        </div>
    );
}