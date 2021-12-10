import React from "react";







export function VideoD(props) {

    var tag = document.createElement('script');
tag.src = "http://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    function onYouTubePlayerAPIReady() {
        var player = new window.Player('player', {
          height: '315',
          width: '560',
          videoId: 'bpOR_HuHRNs',
        });
        document.getElementById('resume').onclick = function () {
          player.playVideo();
        };
        function pausarVideo(){
          player.pauseVideo();
        };
      }

    return (

        <div className="descubre" id="Video">

            <h1>VIDEO</h1>
            <div id="player">asdf</div>
            <a href="#" id="pause">Pause</a>
            <a href="#" id="resume">Resume</a>
            {/* <iframe id="iframe" width="1280" height="720" src={props.dataVideo.link} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> */}
        </div>
    );
}