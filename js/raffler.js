
window.raffle = (function () {
    'use strict';

    /** PRIVATE VARIABLES */
    var names,
        container,
        totalDuration,
        itemDuration,
        itemsCount,
        removeSelected = true;

    /** PRIVATE FUNCTIONS */
    /** creates a HTMLDivElement and add it to the container
        @param n {String} name to display in the new element */
    var createName = function (n) {
        var name = document.createElement('div'),
            span = document.createElement('span');
        name.classList.add('name');
        span.textContent = n;
        name.appendChild(span);
        container.appendChild(name);
        return name;
    };

    /** gets a random value between two numbers
        @param {Number} min: minimum value
        @param {Number} max: maximum value
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#Examples */
    var getRandom = function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };

    /** builds the elements structure to run the raffle.
        This methods gets the random list of names to display, creates one element per item in the container
        and adds the required properties to run the animation. */
    var init = function () {
        var indices = [],
            delay,
            next;
        while (indices.length < itemsCount) {
            next = getRandom(0, names.length);
            if (names.length === 1 || next !== indices[indices.length - 1]) {
                indices.push(next);
            }
        }

        indices.forEach(function (idx, i) {
            delay = itemDuration * i + .5;
            createName(names[idx]).style.animationDelay = delay + 's';
        });
        container.children[container.children.length - 1].classList.add('winner');
    };

    /** hides the displayed item in the container and moves forward to the next function, according to the animation delay.
        @params {Function} callback: following function after hiding the item selected in the previous raffle. */
    var clearContainer = function (callback) {
        container.classList.remove('animated');
        setTimeout(function () {
            container.innerHTML = '';
            callback();
        }, itemDuration * 1000);
    };
    /** PUBLIC FUNCTIONS */
    /** configuration for raffle
        @param {Object} c: contains all of the parameters for the config method:
            @param {HTMLElement} container: element to display names in
            @param {Number} duration: total (in seconds) of the animation
            @param {Number} itemDuration: total (in seconds) of time to show and hide each name during the raffle
            @param {Boolean} removeSelected: indicates if the final element in a raffle will be discarded for the next round
            @param {Array} names: list of values {String} for the raffle */
    var config = function (c) {
        container = c.container;
        totalDuration = c.duration;
        itemDuration = c.itemDuration;
        removeSelected = c.removeSelected;
        names = c.names;
        itemsCount = totalDuration / itemDuration;
    };

    /** runs the raffle according to the configuration already set.
        This method hides the currently displayed item (and removes it from the names list, if indicated by the removeSelected variable).
        After that, the raffle is reset to display a new amount of random items, and then, the animation is started.
        @param {Object} params: contains all of the parameters for the play method:
            @param {Function} start: function to run once the initialization is done and before playing the animation
            @param {Function} end: function to run once the animation is over and the final item is displayed. */
    var play = function (params) {
        if (!names.length) {
            if (params.end) {
                params.end();
            }
        } else {
            var winner;
            if (container.children.length) {
                winner = container.children[container.children.length - 1].textContent;
            }
            clearContainer(function () {
                if (removeSelected && winner) {
                    winner = names.indexOf(winner);
                    names.splice(winner, 1);
                }
                init();
                container.classList.add('animated');
                if (params.start) {
                    params.start();
                }
                if (params.end) {
                    setTimeout(params.end, totalDuration * 1100);
                }
            });
        }
    };
    return {
        config: config,
        play: play
    };
})();
