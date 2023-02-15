/*
 * @Author: your name
 * @Date: 2021-09-18 09:54:00
 * @LastEditTime: 2021-11-01 09:36:08
 * @LastEditors: weiwenhao
 * @Description: In User Settings Edit
 * @FilePath: /dplayer/src/js/info-panel.js
 */
/* global DPLAYER_VERSION GIT_HASH */

class InfoPanel {
    constructor(player) {
        this.container = player.template.infoPanel;
        this.template = player.template;
        this.video = player.video;
        this.player = player;

        this.template.infoPanelClose.addEventListener('click', () => {
            this.hide();
        });
    }

    show() {
        this.beginTime = Date.now();
        this.update();
        this.player.timer.enable('info');
        this.player.timer.enable('fps');
        this.container.classList.remove('dplayer-info-panel-hide');
    }

    hide() {
        this.player.timer.disable('info');
        this.player.timer.disable('fps');
        this.container.classList.add('dplayer-info-panel-hide');
    }

    triggle() {
        if (this.container.classList.contains('dplayer-info-panel-hide')) {
            this.show();
        } else {
            this.hide();
        }
    }

    update() {
        this.template.infoVersion.innerHTML = `v${DPLAYER_VERSION} ${GIT_HASH}`;
        this.template.infoType.innerHTML = this.player.type;
        if (this.player.options.video.showUrl && this.template.infoUrl) {
            this.template.infoUrl.innerHTML = this.player.options.video.url;
        }
        this.template.infoResolution.innerHTML = `${this.player.video.videoWidth} x ${this.player.video.videoHeight}`;
        this.template.infoDuration.innerHTML = this.player.video.duration;
        if (this.player.options.danmaku) {
            this.template.infoDanmakuId.innerHTML = this.player.options.danmaku.id;
            this.template.infoDanmakuApi.innerHTML = this.player.options.danmaku.api;
            this.template.infoDanmakuAmount.innerHTML = this.player.danmaku.dan.length;
        }
    }

    fps(value) {
        this.template.infoFPS.innerHTML = `${Math.floor(value)}`;
    }
}

export default InfoPanel;
