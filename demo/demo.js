// stats.js: JavaScript Performance Monitor
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);
function animate() {
    stats.begin();
    stats.end();

    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

initPlayers();
handleEvent();

function handleEvent() {
    document.getElementById('dplayer-dialog').addEventListener('click', (e) => {
        const $clickDom = e.currentTarget;
        const isShowStatus = $clickDom.getAttribute('data-show');

        if (isShowStatus) {
            document.getElementById('float-dplayer').style.display = 'none';
        } else {
            $clickDom.setAttribute('data-show', 1);
            document.getElementById('float-dplayer').style.display = 'block';
        }
    });

    document.getElementById('close-dialog').addEventListener('click', () => {
        const $openDialogBtnDom = document.getElementById('dplayer-dialog');

        $openDialogBtnDom.setAttribute('data-show', '');
        document.getElementById('float-dplayer').style.display = 'none';
    });
}

async function initPlayers() {
    // dp1
    const watermark = '某某某正在观看视频';
    window.dp1 = new DPlayer({
        container: document.getElementById('dplayer1'),
        // preload: 'none',
        // screenshot: true,
        video: {
            url: 'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4',
            pic: 'https://i.loli.net/2019/06/06/5cf8c5d9c57b510947.png',
            thumbnails: 'https://i.loli.net/2019/06/06/5cf8c5d9cec8510758.jpg',
            // type: 'customHls',
            // customType: {
            //   customHls: (video) => {
            //     const hls = new window.Hls();
            //     hls.loadSource(video.src);
            //     hls.attachMedia(video);
            //   },
            // },
        },
        // subtitle: {
        //     open: true,
        //     url: 'https://s-sh-17-dplayercdn.oss.dogecdn.com/hikarunara.vtt'
        // },
        // danmaku: {
        //     id: '9E2E3368B56CDBB4',
        //     api: 'https://api.prprpr.me/dplayer/',
        //     addition: ['https://s-sh-17-dplayercdn.oss.dogecdn.com/1678963.json']
        // },
        clip: {
            url: `/video/clip/test`,
        },
        loop: false,
        report: true, // 是否上报
        clearOnReport: true, // 是否在上报后清除之前的report时间段
        progressBar: { // 是否能拖动进度条
            drag: true,
            max: 0.5, // 拖动最大范围 区间【0, 1】
            maxTime: 131, // s
        },
        onlyWebFullButton: false,
        highlight: [
            {
                id: 1,
                time: 10,
                text: '这是第 20 秒',
                img: 'https://i.loli.net/2019/06/06/5cf8c5d9c57b510947.png',
            },
            {
                id: 2,
                time: 12,
                text: '这是第 12 秒',
                img: 'https://i.loli.net/2019/06/06/5cf8c5d9c57b510947.png',
            },
            {
                id: 3,
                time: 13,
                text: '这是第 13 秒',
                img: 'https://i.loli.net/2019/06/06/5cf8c5d9c57b510947.png',
            },
            {
                id: 4,
                time: 20,
                text: '这是第 20 秒',
                img: 'https://i.loli.net/2019/06/06/5cf8c5d9c57b510947.png',
            },
            {
                id: 5,
                time: 30,
                text: '这是第 20 秒',
                img: 'https://i.loli.net/2019/06/06/5cf8c5d9c57b510947.png',
            },
            {
                id: 6,
                time: 40,
                text: '这是第 20 秒',
                img: 'https://i.loli.net/2019/06/06/5cf8c5d9c57b510947.png',
            },
            {
                id: 7,
                time: 120,
                text: '这是 2 分钟分钟分钟分钟分钟分钟分钟分钟分钟分钟',
                img: 'https://i.loli.net/2019/06/06/5cf8c5d9c57b510947.png',
            },
            {
                id: 8,
                time: 250,
                text: '这是 2 分钟分钟分钟分钟分钟分钟分钟分钟分钟分钟',
                img: 'https://i.loli.net/2019/06/06/5cf8c5d9c57b510947.png',
            },
            {
                id: 9,
                time: 254,
                text: '这是 2 分钟分钟分钟分钟分钟分钟分钟分钟分钟分钟',
                img: 'https://i.loli.net/2019/06/06/5cf8c5d9c57b510947.png',
            },
            {
                id: 10,
                time: 258,
                text: '这是 2 分钟分钟分钟分钟分钟分钟分钟分钟分钟分钟',
                img: 'https://i.loli.net/2019/06/06/5cf8c5d9c57b510947.png',
            },
        ],
        watermark: {
            render: true,
            content: watermark,

            // Web
            // fontSize: 14,
            // gapX: 230,
            // gapY: 200,

            // 手机
            fontSize: 12,
            gapX: 80,
            gapY: 120,
            height: 0,

            rotate: -15,
            fontColor: "rgba(176,196,222, .15)",
        },
    });

    window.dp1.on('subtitle_change', (res) => {
        console.log(res);
    });

    window.dp1.on('loop_change', (res) => {
        console.log(res);
    });

    window.dp1.on('timeupdate', () => {
        console.log('onTimeupdate', window.dp1.video.currentTime);
    });

    window.dp1.on('report', async ({ duration, playTime, ranges }) => {
        // 毫秒 number
        return new Promise(resolve => {
            if (duration && playTime) {
                // 当前进度
                // 当前时间段 播放时长
                console.log(`duration: ${duration} playTime: ${playTime}`, ranges)
                resolve(1);
                return;
            }
            resolve(0);
        });
    })

    window.dp1.on('highlight', async (v) => {
        console.log('highlight: ', v);
    })
}

window.onload = () => {
    document.querySelector('#loadSubtitle').onclick = () => {
        console.log(window.dp1)
        window.dp1.destroy();
        // subtitle: {
        //     open: true,
        //     url: 'https://s-sh-17-dplayercdn.oss.dogecdn.com/hikarunara.vtt'
        //     // url: 'http://localhost/file/test.vtt'
        // },
        window.dp1 = new DPlayer({
            container: document.getElementById('dplayer1'),
            // preload: 'none',
            // screenshot: true,
            video: {
                url: 'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4',
                pic: 'https://i.loli.net/2019/06/06/5cf8c5d9c57b510947.png',
                thumbnails: 'https://i.loli.net/2019/06/06/5cf8c5d9cec8510758.jpg'
            },
            subtitle: {
                open: true,
                url: 'https://s-sh-17-dplayercdn.oss.dogecdn.com/hikarunara.vtt'
                // url: 'http://localhost/file/test.vtt'
            },
            // danmaku: {
            //     id: '9E2E3368B56CDBB4',
            //     api: 'https://api.prprpr.me/dplayer/',
            //     addition: ['https://s-sh-17-dplayercdn.oss.dogecdn.com/1678963.json']
            // },
            clip: {
                url: `/video/clip/test`,
            },
            loop: false,
            report: true, // 是否上报
            clearOnReport: true, // 是否在上报后清除之前的report时间段
            progressBar: { // 是否能拖动进度条
                drag: true,
                maxTime: -1, // s 拖动最大范围时间
            },
            onlyWebFullButton: true,
        });
    }

    document.querySelector('#updateSubtitle').onclick = () => {
        console.log(window.dp1?.video?.textTracks[0])
        if (window.dp1?.video?.textTracks?.[0].cues?.[0]?.text) {
            window.dp1.video.textTracks[0].cues[0].text = '123'
        }
    }

    document.querySelector('#focusMode').onclick = () => {
        window.dp1.controller.toggleFocusMode()
    }
}