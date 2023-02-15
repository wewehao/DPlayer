import utils from './utils';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

class Setting {
    constructor(player) {
        this.player = player;

        this.player.template.mask.addEventListener('click', () => {
            this.hide();
        });
        this.player.template.settingButton.addEventListener('click', () => {
            this.show();
        });

        // loop
        this.loop = this.player.options.loop;
        this.player.template.loopToggle.checked = this.loop;
        if (this.loop) {
            this.player.template.loop.classList.toggle('dplayer-loop-on');
        }
        this.player.template.loop.addEventListener('click', () => {
            this.player.template.loopToggle.checked = !this.player.template.loopToggle.checked;
            this.player.template.loop.classList.toggle('dplayer-loop-on');
            if (this.player.template.loopToggle.checked) {
                this.loop = true;
            } else {
                this.loop = false;
            }
            this.hide();
            this.player.events.trigger('loop_change', this.loop);
        });

        if (this.player.template.loop) {
            tippy('.dplayer-loop-on-img', {
                content: `<span style="word-break: keep-all;">${this.player.tran('Close Loop')}</span>`,
                allowHTML: true,
                appendTo: this.player.template.loop,
            });

            tippy('.dplayer-loop-off-img', {
                content: `<span style="word-break: keep-all;">${this.player.tran('Open Loop')}</span>`,
                allowHTML: true,
                appendTo: this.player.template.loop,
            });
        }

        if (this.player.template.clipButton) {
            tippy('.dplayer-clip-img', {
                content: `<span style="word-break: keep-all;">${this.player.tran('Edit')}</span>`,
                allowHTML: true,
                appendTo: this.player.template.clipButton,
            });
        }

        if (this.player.template.subtitleButton) {
            tippy('.dplayer-subtitle-on-img', {
                content: `<span style="word-break: keep-all;">${this.player.tran('Close subtitle')}</span>`,
                allowHTML: true,
                appendTo: this.player.template.subtitleButton,
            });
            tippy('.dplayer-subtitle-off-img', {
                content: `<span style="word-break: keep-all;">${this.player.tran('Open subtitle')}</span>`,
                allowHTML: true,
                appendTo: this.player.template.subtitleButton,
            });
        }

        // show danmaku
        this.showDanmaku = this.player.user.get('danmaku');
        if (!this.showDanmaku) {
            this.player.danmaku && this.player.danmaku.hide();
        }
        this.player.template.showDanmakuToggle.checked = this.showDanmaku;
        this.player.template.showDanmaku.addEventListener('click', () => {
            this.player.template.showDanmakuToggle.checked = !this.player.template.showDanmakuToggle.checked;
            if (this.player.template.showDanmakuToggle.checked) {
                this.showDanmaku = true;
                this.player.danmaku.show();
            } else {
                this.showDanmaku = false;
                this.player.danmaku.hide();
            }
            this.player.user.set('danmaku', this.showDanmaku ? 1 : 0);
            this.hide();
        });

        // unlimit danmaku
        this.unlimitDanmaku = this.player.user.get('unlimited');
        this.player.template.unlimitDanmakuToggle.checked = this.unlimitDanmaku;
        this.player.template.unlimitDanmaku.addEventListener('click', () => {
            this.player.template.unlimitDanmakuToggle.checked = !this.player.template.unlimitDanmakuToggle.checked;
            if (this.player.template.unlimitDanmakuToggle.checked) {
                this.unlimitDanmaku = true;
                this.player.danmaku.unlimit(true);
            } else {
                this.unlimitDanmaku = false;
                this.player.danmaku.unlimit(false);
            }
            this.player.user.set('unlimited', this.unlimitDanmaku ? 1 : 0);
            this.hide();
        });

        // speed
        this.player.template.speed.addEventListener('click', () => {
            this.player.template.mask.classList.add('dplayer-mask-show');
            this.player.controller.disableAutoHide = true;
            this.player.template.speedBox.classList.toggle('dplayer-speed-wrap-open');
        });
        for (let i = 0; i < this.player.template.speedItem.length; i++) {
            this.player.template.speedItem[i].addEventListener('click', () => {
                const speedValue = this.player.template.speedItem[i].dataset.speed;
                this.player.template.speed.querySelector('.dplayer-icon-content').innerHTML = `x${speedValue}`;
                this.player.speed(speedValue);
                this.hide();
            });
        }

        // danmaku opacity
        if (this.player.danmaku) {
            const dWidth = 130;
            this.player.on('danmaku_opacity', (percentage) => {
                this.player.bar.set('danmaku', percentage, 'width');
                this.player.user.set('opacity', percentage);
            });
            this.player.danmaku.opacity(this.player.user.get('opacity'));

            const danmakuMove = (event) => {
                const e = event || window.event;
                let percentage = ((e.clientX || e.changedTouches[0].clientX) - utils.getBoundingClientRectViewLeft(this.player.template.danmakuOpacityBarWrap)) / dWidth;
                percentage = Math.max(percentage, 0);
                percentage = Math.min(percentage, 1);
                this.player.danmaku.opacity(percentage);
            };
            const danmakuUp = () => {
                document.removeEventListener(utils.nameMap.dragEnd, danmakuUp);
                document.removeEventListener(utils.nameMap.dragMove, danmakuMove);
                this.player.template.danmakuOpacityBox.classList.remove('dplayer-setting-danmaku-active');
            };

            this.player.template.danmakuOpacityBarWrapWrap.addEventListener('click', (event) => {
                const e = event || window.event;
                let percentage = ((e.clientX || e.changedTouches[0].clientX) - utils.getBoundingClientRectViewLeft(this.player.template.danmakuOpacityBarWrap)) / dWidth;
                percentage = Math.max(percentage, 0);
                percentage = Math.min(percentage, 1);
                this.player.danmaku.opacity(percentage);
            });
            this.player.template.danmakuOpacityBarWrapWrap.addEventListener(utils.nameMap.dragStart, () => {
                document.addEventListener(utils.nameMap.dragMove, danmakuMove);
                document.addEventListener(utils.nameMap.dragEnd, danmakuUp);
                this.player.template.danmakuOpacityBox.classList.add('dplayer-setting-danmaku-active');
            });
        }
    }

    hide() {
        this.player.template.settingBox.classList.remove('dplayer-setting-box-open');
        this.player.template.mask.classList.remove('dplayer-mask-show');

        setTimeout(() => {
            this.player.template.speedBox.classList.remove('dplayer-speed-wrap-open');
        }, 300);

        this.player.controller.disableAutoHide = false;
    }

    show() {
        this.player.template.settingBox.classList.add('dplayer-setting-box-open');
        this.player.template.mask.classList.add('dplayer-mask-show');

        this.player.controller.disableAutoHide = true;
    }
}

export default Setting;
