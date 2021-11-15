(function () {
    let cursor = '',
        place = 0,
        serversSearched = 0,
        speed = 150,
        ping = 30,
        lowGui = document.createElement('div');

    function dragElement(elmnt) {
        var pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;

        elmnt.onmousedown = dragMouseDown

        function dragMouseDown(e) {
            e = e || window.event;
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag
        }

        function elementDrag(e) {
            e = e || window.event;
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px"
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null
        }
    }

    lowGui.id = 'lowGui';
    lowGui.style = 'font-family: \'Source Sans Pro\', sans-serif;border: 3px solid rgb(37, 37, 37); position: absolute; display: block; left: 0px; background-color: #101211; z-index: 2147483647; top: 0;';
    lowGui.innerHTML = '<style>input::placeholder {color: #fff;} </style><link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro&display=swap" rel="stylesheet"><div id="lowGui" style="background-color: rgb(37, 37, 37); cursor: move;"><button id="close" style="color:white;position:absolute;top: 6px;text-align: right;display: inline-block;background-color:transparent;font-family:Arial;font-size: 30px;text-decoration:none;border: none;right: 0px;" onclick="close()">X</button><h3 style=" color: white; margin: 0 auto; text-align: center">low ping finder</h3></div><br><center><p style="color:white; ">place id:</p><input type="text" style="margin: 10px; text-align: center; color: white; background-color: rgb(50, 50, 50); font-size: 25px;" id="place" placeholder="enter it here"><br><br><p style="color:white; ">desired ping:</p><input type="text" style="margin: 10px; text-align: center; color: white; background-color: rgb(50, 50, 50); font-size: 25px;" id="ping" value="30" placeholder="enter it here"><br><br><p style="color:white;" title="if this is too low, the script will break.">speed (in milliseconds):</p><input title="if this is too low, the script will break." type="text" style="margin: 10px; text-align: center; color: white; background-color: rgb(50, 50, 50); font-size: 25px;" id="throttle" value="150" placeholder="enter it here"><br><br><button id="start" style="background-color: #161616;border: none;width: 95%;padding: 10px;color:white;">start</button><br><br></center>';
    document.getElementsByTagName('body')[0].appendChild(lowGui);
    dragElement(document.getElementById(("lowGui")));

    const closeButton = document.getElementById("close"),
        start = document.getElementById('start');

    function find() {
        speed = document.getElementById('throttle').value;
        ping = Number(document.getElementById('ping').value);
        fetch(`https://games.roblox.com/v1/games/${place}/servers/Public?sortOrder=Asc&limit=100&cursor=${cursor}`)
            .then(r => r.json())
            .then(json => {
                let serverList = json.data.filter(server => server.playing < server.maxPlayers - 1),
                best = serverList.filter(server => server.ping < (ping+10))[0];
                cursor = json.nextPageCursor;
                serversSearched += 100
                if (!cursor) {
                    start.innerText = 'try increasing your desired ping.';
                    cursor = '';
                    return setTimeout(function () {
                        start.innerText = 'start'
                    }, 5000);
                };
                start.innerText = `searched ${serversSearched} servers.`
                if (!best) {
                    setTimeout(find, speed);
                } else {
                    console.log(serverList, best);
                    Roblox.GameLauncher.joinGameInstance(place, best.id)
                    start.innerText = `done! ${best.playing} playing, you'll have ~${best.ping}ms`;
                    cursor = '';
                    return setTimeout(function () {
                        start.innerText = 'start'
                    }, 5000);
                }
            });
    }

    if (Number(window.location.pathname.split('/')[2])) {
        document.getElementById('place').value = Number(window.location.pathname.split('/')[2]);
        place = Number(window.location.pathname.split('/')[2]);
    }

    function close() {
        document.getElementById('lowGui').remove()
    };

    start.addEventListener("click", find, false)
    closeButton.addEventListener("click", close, false)
})();