window.audioPlayer = (function () {
    var player;
    
    var addSource = function (player, type, src) {
        var source = document.createElement('source');
        source.src = src;
        source.type = 'audio/' + type;
        player.appendChild(source);
    };

    var config = function (c) {
        player = document.createElement('audio');
        player.volume = c.volume || 0.5;
        for (var src in c.files) {
            addSource(player, src, c.files[src]);
        }
    };

    var play = function () {
        player.currentTime = 0;
        player.play();
    };

    return {
        config: config,
        play: play
    };
})();
