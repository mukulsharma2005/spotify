function setAll(content, clas) {
    let items = document.querySelectorAll(clas);
    items.forEach((item) => {
        item.innerHTML = content
    })
}
async function getSongs(playlist) {
    let data = await fetch(`https://api.github.com/repos/mukulsharma2005/spotify/contents/assets/music/${playlist}?ref=master`)
    data = await data.json()
    let songnames = data.map((song) => {
        return song.name
    })
    let song_list = new Object;
    for (const songname of songnames) {
        song_list[songname.slice(0, songname.length - 4)] = `https://mukulsharma2005.github.io/spotify/assets/music/${playlist}/${songname}`
    }
    // console.log(song_list)
    return song_list
}
async function glow(name) {
    let lib_box = document.querySelector(".library .box")
    let lib_box_child = Array.from(lib_box.children);
    // let lib_box = document.querySelector(".library ")
    lib_box_child.forEach(element => {
        if (element.innerHTML == name) {
            if (!element.className.includes("glow")) {
                element.classList.add("glow")
                element.focus()
                element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
        else {
            if (element.className.includes("glow")) {
                element.classList.remove("glow")
            }
        }
    });
}
async function get_playlists() {
    let data = await fetch("https://api.github.com/repos/mukulsharma2005/spotify/contents/assets/music?ref=master");
    data = await data.json();
    let names = data.map((playlist) => {
        return playlist.name
    })
    // console.log(names)
    return names;
}
get_playlists()
async function fill_playlist() {
    let names = await get_playlists();
    let playlists = document.querySelector(".playlist-cards");
    names.forEach((name) => {
        let div = document.createElement("div")
        div.setAttribute("class", "playlist playlist-to-select")
        div.innerHTML = `<div class="image">
                            <img class="playlist-image" src="assets/images/music.png" alt="">
                            <div class="play-playlist all-center">
                                <img src="assets/icons/play2.svg" alt="">
                            </div>
                        </div>
                        <div class="name"> ${name}</div>
                        <div class="singer">By Chief</div>`
        div.addEventListener("click", () => {
            // audio.pause()
            main(name)
        })
        div.dataset.playlist = name;
        playlists.appendChild(div)
        // console.log("hello")

    })
    // playlists.style.color = "yellow"
}
let player_open = false;
async function glow_playlist(playlist) {
    let playlists = document.querySelectorAll(".playlist");
    // console.log(playlists)
    playlists.forEach((e) => {
        // console.log(e.dataset.playlist == playlist)
        if (e.dataset.playlist == playlist) {

            e.classList.add("playlist-selected")
            e.classList.remove("playlist-to-select")
        }
        else {
            e.classList.add("playlist-to-select")
            e.classList.remove("playlist-selected")
        }
    })
}
let audio; let play_state = false; let first = true; var playlist = "breakup songs"

async function main(playlist) {
    if (first) {
        await fill_playlist()
    }
    glow_playlist(playlist);
    let song_list = await getSongs(playlist);
    let songnames = Object.keys(song_list);
    let songs = Object.values(song_list);
    let lib_box = document.querySelector(".library .box");
    let play = document.querySelector(".controls .play");
    let song_info_name = document.querySelector(".song-info .name");
    let song_info_name2 = document.querySelector(".player .name");
    song_info_name.setAttribute("data-playlist", playlist);
    play.src = "assets/icons/play.svg"
    let i = 0;
    try {
        audio.pause();
        audio.removeAttribute('src');
        audio.load()
    }
    catch {
    }
    // audio.pause();
    //     audio.removeAttribute('src');
    //     audio.load()

    play_state = false;
    async function changeSong(i) {
        let playlist = song_info_name.dataset.playlist
        let song_list = await getSongs(playlist);
        let songnames = Object.keys(song_list);
        let songs = Object.values(song_list);
        let n = songs.length;
        let name = songnames[i]
        let track = songs[i]
        if (i < n && i >= 0) {
            audio.src = track;
            // console.log("Loading...")
            await audio.load();
            // audio.addEventListener('loadstart', () => {
            //     console.log("load start")
            // });
            // audio.addEventListener("canplay",()=>{
            //     console.log("Play")
            // })
            console.log("Loaded.")
            play_state = true;
            play_song()
            glow(name);
            song_info_name.dataset.i = i
            song_info_name.innerHTML = name;
            song_info_name2.innerHTML = name;
        }

    }
    async function fill_lib() {
        lib_box.innerHTML = "";
        for (let t = 0; t < Object.keys(song_list).length; t++) {
            const name = Object.keys(song_list)[t];
            let div = document.createElement("div");
            div.innerHTML = name;

            div.addEventListener("click", () => {
                changeSong(t);
            });
            lib_box.appendChild(div);
        }
    }
    fill_lib()
    let play_song = (i) => {
        let play = document.querySelector(".controls .play")
        let play2 = document.querySelector(".player .play")
        audio.play()
        play_state = true;
        play.src = "assets/icons/pause.svg"
        play2.src = "assets/icons/pause.svg"
        glow(songnames[i])
    }
    let pause_song = (i) => {
        let play = document.querySelector(".controls .play")
        let play2 = document.querySelector(".player .play")
        audio.pause()
        play_state = false;
        play.src = "assets/icons/play.svg"
        play2.src = "assets/icons/play.svg"
    }
    audio = new Audio(songs[i]);
    glow(songnames[i])
    let miniPlayer = document.querySelector(".mini-player")
    let player = document.querySelector(".player")
    let up_funct = async (e) => {
        if (!player_open) {
            player.style.display = "flex"
            miniPlayer.style.display = "none"
            player_open = true;
        }
        else {
            miniPlayer.style.display = "flex"
            player.style.display = "none"
            player_open = false
        }
    }
    async function controls() {
        let song_info_name = document.querySelector(".song-info .name");
        let song_info_name2 = document.querySelector(".player .name");

        song_info_name.setAttribute("data-playlist", playlist);
        let play = document.querySelector(".play")
        let next = document.querySelector(".controls .next")
        let prev = document.querySelector(".controls .prev")
        //     let song_list = await getSongs(playlist);
        // let songnames = Object.keys(song_list);
        // let songs = Object.values(song_list);

        song_info_name.innerHTML = songnames[i];
        song_info_name2.innerHTML = songnames[i];
        song_info_name.setAttribute("data-i", i)


        if (first) {
            play.addEventListener("click", () => {
                let play = document.querySelector(".controls .play")
                let play2 = document.querySelector(".player .play")

                if (!play_state) {
                    audio.play()
                    play_state = true;
                    play.src = "assets/icons/pause.svg"
                    play2.src = "assets/icons/pause.svg"
                    // console.log(song_info_name.innerHTML)
                    glow(song_info_name.innerHTML)
                }
                else {
                    audio.pause();
                    play_state = false;
                    play.src = "assets/icons/play.svg"
                    play2.src = "assets/icons/play.svg"
                }
                // console.log(play_state)
            })

            next.addEventListener('click', async (e) => {
                let i = song_info_name.dataset.i;
                i++;
                changeSong(i)
            })
            prev.addEventListener('click', async () => {
                let i = song_info_name.dataset.i;
                i--;
                changeSong(i)
            })
            let seekbar = document.querySelector(".seekbar")
            seekbar.addEventListener("mousedown", (e) => {
                let part = (e.offsetX / seekbar.getBoundingClientRect().width);
                // console.log(part, e.OffsetX, e)
                audio.currentTime = part * audio.duration;
            })
            seekbar.addEventListener("mousemove", (e) => {
                let part = (e.offsetX / seekbar.getBoundingClientRect().width);
                let now = part * audio.duration;
                let sec = String(Math.floor(now % 60)).padStart(2, "0");
                let min = now / 60; min = String(Math.floor(min)).padStart(2, "0");
                seekbar.setAttribute("title", `${min}:${sec}`)
            })
            seekbar.addEventListener("mouseleave", (e) => {
                seekbar.setAttribute("title", "")
            })

        }
        audio.addEventListener("ended", () => {
            let i = song_info_name.dataset.i;
            i++;
            changeSong(i)
        })

        let current = document.querySelector(".duration .current");
        let full = document.querySelector(".duration .full");
        let filled = document.querySelector(".seekbar .filled")
        let disk = document.querySelector(".song-disk")
        let filled2 = document.querySelector(".player .seekbar .filled")
        let disk2 = document.querySelector(".player .song-disk")
        setInterval(() => {
            let now = audio.currentTime;
            let full_time = audio.duration;
            let sec = String(Math.floor(now % 60)).padStart(2, "0");
            let min = now / 60; min = String(Math.floor(min)).padStart(2, "0");
            if (min != "NaN" && sec != "NaN") {
                setAll(`${min}:${sec}`, ".current")
            }
            else {
                setAll(`00:00`, ".current")
            }
            let full_sec = String(Math.floor(full_time % 60)).padStart(2, "0");
            let full_min = String(Math.floor(full_time / 60)).padStart(2, "0");
            if (full_min != 'NaN' && full_sec != 'NaN') {
                setAll(`${full_min}:${full_sec}`, ".full")
            }
            else {
                setAll(`00:00`, ".full")
            }
            let percent = now / full_time * 100 + "%";
            filled.style.width = percent;
            filled2.style.width = percent;
            // console.log(play_state)
            if (play_state) {
                disk.style.animationPlayState = "running"
                disk2.style.animationPlayState = "running"
                // console.log("k")
            }
            else {
                disk.style.animationPlayState = "paused"
                disk2.style.animationPlayState = "paused"
            }
        }, 250)


    }
    let up = document.querySelector(".up")
    let up2 = document.querySelector(".player .up")
    if (first) {
        up.addEventListener("click", up_funct)
        up2.addEventListener("click", up_funct)
        document.body.addEventListener("keydown", (e) => {
            let play = document.querySelector(".controls .play")
            let play2 = document.querySelector(".player .play")
            if (e.key == "k") {
                if (!play_state) {
                    audio.play()
                    play_state = true;
                    play.src = "assets/icons/pause.svg"
                    play2.src = "assets/icons/pause.svg"
                    glow(song_info_name.innerHTML)
                }
                else {
                    audio.pause();
                    play_state = false;
                    play.src = "assets/icons/play.svg"
                    play2.src = "assets/icons/play.svg"
                }
            }
            else if (e.key == "ArrowRight") {
                let i = song_info_name.dataset.i;
                i++;
                changeSong(i)
            }
            else if (e.key == "ArrowLeft") {
                let i = song_info_name.dataset.i;
                i--;
                changeSong(i)
            }
        })
    }
    controls()
    async function PlayerControls() {

        let play = document.querySelector(".player .play")
        let next = document.querySelector(".player .controls .next")
        let prev = document.querySelector(".player .controls .prev")
        let forward = document.querySelector(".player .forward")
        let backward = document.querySelector(".player .backward")
        play.src = "assets/icons/play.svg"



        if (first) {
            play.addEventListener("click", () => {
                let play = document.querySelector(" .controls .play")
                let play2 = document.querySelector(".player .play")
                if (!play_state) {
                    audio.play()
                    play_state = true;
                    play.src = "assets/icons/pause.svg"
                    play2.src = "assets/icons/pause.svg"
                    // console.log(song_info_name.innerHTML)
                    // glow(song_info_name.innerHTML)
                }
                else {
                    audio.pause();
                    let play = document.querySelector(" .controls .play")
                    play_state = false;
                    play.src = "assets/icons/play.svg"
                    play2.src = "assets/icons/play.svg"
                }
                // console.log(play_state)
            })

            next.addEventListener('click', async (e) => {
                let i = song_info_name.dataset.i;
                i++;
                changeSong(i)
            })
            prev.addEventListener('click', async () => {
                let i = song_info_name.dataset.i;
                i--;
                changeSong(i)
            })
            forward.addEventListener("click", async () => {
                if (audio.currentTime <= (audio.duration - 10)) {
                    audio.currentTime = audio.currentTime + 10
                }
                else {
                    audio.currentTime = audio.duration
                }
            })
            backward.addEventListener("click", async () => {
                if (audio.currentTime >= 10) {
                    audio.currentTime = audio.currentTime - 10
                }
                else {
                    audio.currentTime = 0
                }
            })
            let seekbar = document.querySelector(".player .seekbar")
            seekbar.addEventListener("click", (e) => {
                let part = (e.offsetX / seekbar.getBoundingClientRect().width);
                // console.log(part, e.OffsetX, e)
                audio.currentTime = part * audio.duration;
            })
            seekbar.addEventListener("mousemove", (e) => {
                let part = (e.offsetX / seekbar.getBoundingClientRect().width);
                let now = part * audio.duration;
                let sec = String(Math.floor(now % 60)).padStart(2, "0");
                let min = now / 60; min = String(Math.floor(min)).padStart(2, "0");
                seekbar.setAttribute("title", `${min}:${sec}`)
            })
            seekbar.addEventListener("mouseleave", (e) => {
                seekbar.setAttribute("title", "")
            })

        }


    }
    PlayerControls()
    first = false;
}
main(playlist)
let hamburger = document.querySelector(".hamburger");
let lib = document.querySelector(".library");
let open = false;
hamburger.addEventListener("click", () => {
    if (!open) {
        lib.style.transform = "translateX(0%)"
        open = true;
    }
    else {
        lib.style.transform = "translateX(-200%)"
        open = false;
    }
})
