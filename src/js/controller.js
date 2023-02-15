/*
 * @Author: weiwenhao
 * @Date: 2021-08-05 16:55:12
 * @LastEditTime: 2022-09-02 17:10:07
 * @LastEditors: weiwenhao
 * @Description:
 * @FilePath: /dplayer/src/js/controller.js
 * If you have any questions please @weiwenhao.
 */
import utils from './utils';
import Thumbnails from './thumbnails';
import Icons from './icons';

class Controller {
    constructor(player) {
        this.player = player;

        this.isMoveInController = false;

        this.autoHideTimer = 0;

        this.isFocusMode = false;

        if (!utils.isMobile) {
            this.player.container.addEventListener('mousemove', () => {
                console.log('---mousemove---');
                if (!this.isMoveInController) {
                    this.setAutoHide();
                }
            });
            this.player.container.addEventListener('mouseleave', () => {
                console.log('---mouseleave---');
                const isFullScreen = this.player.fullScreen.isFullScreen('browser');
                if (this.player.video.played.length && !this.player.paused && !this.disableAutoHide && !this.isFocusMode && !isFullScreen) {
                    this.hide();
                }
            });
            this.player.container.querySelector('.dplayer-controller').addEventListener('mousemove', () => {
                console.log('---mousemove 2---');
                this.isMoveInController = true;
                this.show();
                clearTimeout(this.autoHideTimer);
            });
            this.player.container.querySelector('.dplayer-controller').addEventListener('mouseleave', () => {
                console.log('---mouseleave 2---');
                this.isMoveInController = false;
                this.setAutoHide();
            });
            this.player.container.addEventListener('click', () => {
                if (!this.isMoveInController) {
                    this.setAutoHide();
                }
            });
            this.player.on('play', () => {
                if (!this.isMoveInController) {
                    this.setAutoHide();
                }
            });
            this.player.on('pause', () => {
                if (!this.isMoveInController) {
                    this.setAutoHide();
                }
            });
        }

        const progressBar = this.player.options.progressBar || {
            drag: true,
            maxTime: -1, // s
        };

        this.progressBar = progressBar;

        this.initPlayButton();
        this.initThumbnails();
        this.initPlayedBar();
        this.initFullButton();
        this.initClipButton();
        this.initQualityButton();
        this.initScreenshotButton();
        this.initSubtitleButton();
        this.initHighlights();
        this.initAirplayButton();
        if (!utils.isMobile) {
            this.initVolumeButton();
        }
    }

    initPlayButton() {
        this.player.template.playButton.addEventListener('click', () => {
            this.player.toggle();
        });

        this.player.template.mobilePlayButton.addEventListener('click', () => {
            this.player.toggle();
        });

        if (!utils.isMobile) {
            this.player.template.videoWrap.addEventListener('click', () => {
                this.player.toggle();
            });
            this.player.template.controllerMask.addEventListener('click', () => {
                this.player.toggle();
            });
        } else {
            this.player.template.videoWrap.addEventListener('click', () => {
                this.toggle();
            });
            this.player.template.controllerMask.addEventListener('click', () => {
                this.toggle();
            });
        }
    }

    initHighlights() {
        this.player.on('durationchange', () => {
            if (this.player.video.duration !== 1 && this.player.video.duration !== Infinity) {
                if (this.player.options.highlight) {
                    const highlights = document.querySelectorAll('.dplayer-highlight');
                    [].slice.call(highlights, 0).forEach((item) => {
                        this.player.template.playedBarWrap.removeChild(item);
                    });

                    const container = this.player.container;
                    console.log(container);

                    for (let i = 0; i < this.player.options.highlight.length; i++) {
                        const v = this.player.options.highlight[i];

                        if (!v.text || !v.time) {
                            continue;
                        }
                        const dom = document.createElement('div');
                        dom.classList.add('dplayer-highlight');

                        dom.id = `dplayer-highlight-${v.id || i}`;

                        dom.onmouseover = () => {
                            const boxEl = dom.querySelector('.dplayer-highlight-box');
                            const { left: containerLeft, right: containerRight } = container.getBoundingClientRect();
                            const { left: domLeft, right: domRight } = dom.getBoundingClientRect();
                            const left = domLeft - containerLeft;
                            const right = containerRight - domRight;
                            if (!boxEl) {
                                return;
                            }
                            if (left < 135 / 2) {
                                boxEl.style.left = `${135 / 2 - left + 12}px`;
                            }
                            if (right < 135 / 2) {
                                boxEl.style.left = `${right - 135 / 2}px`;
                            }
                            boxEl.style.display = 'flex';
                        };

                        dom.onmouseleave = () => {
                            const boxEl = dom.querySelector('.dplayer-highlight-box');
                            if (!boxEl) {
                                return;
                            }
                            boxEl.style.display = 'none';
                        };

                        dom.style.left = (v.time / this.player.video.duration) * 100 + '%';

                        dom.innerHTML = `
<div class="dplayer-highlight-box" style="background: url(${v.img}) 50% 50% / cover no-repeat;">
    <div class="dplayer-highlight-bg"></div>
    <div class="dplayer-highlight-time">${utils.secondToTime(v.time)}</div>
    <div class="dplayer-highlight-text">${v.text}</div>
</div>
`;

                        dom.setAttribute('data-time', v.time);

                        dom.onclick = () => {
                            // e.stopPropagation();
                            // 上报事件
                            this.player.events.trigger('highlight', v);
                        };

                        dom.remove = () => {
                            dom.parentElement.removeChild(dom);
                        };

                        dom.updateText = (text) => {
                            if (dom.querySelector('.dplayer-highlight-text')) {
                                dom.querySelector('.dplayer-highlight-text').innerHTML = `${text}`;
                            }
                        };

                        // p.innerHTML = '<span class="dplayer-highlight-box">' + v.text + '</span>';

                        this.player.template.playedBarWrap.insertBefore(dom, this.player.template.playedBarTime);
                    }
                }
            }
        });
    }

    initThumbnails() {
        if (this.player.options.video.thumbnails) {
            this.thumbnails = new Thumbnails({
                container: this.player.template.barPreview,
                barWidth: this.player.template.barWrap.offsetWidth,
                url: this.player.options.video.thumbnails,
                events: this.player.events,
            });

            this.player.on('loadedmetadata', () => {
                this.thumbnails.resize(160, (this.player.video.videoHeight / this.player.video.videoWidth) * 160, this.player.template.barWrap.offsetWidth);
            });
        }
    }

    initPlayedBar() {
        // let canDrag = true;

        const thumbMove = (e) => {
            // if (!canDrag) {
            //     return;
            // }

            const maxTime = this.progressBar.maxTime;

            let percentage = ((e.clientX || e.changedTouches[0].clientX) - utils.getBoundingClientRectViewLeft(this.player.template.playedBarWrap)) / this.player.template.playedBarWrap.clientWidth;
            percentage = Math.max(percentage, 0);

            let max = 1;

            if (maxTime > -1) {
                max = maxTime / this.player.video.duration;
            }


            if (max < 0) {
                max = 0;
            }

            if (max > 1) {
                max = 1;
            }

            if (percentage > max) {
                percentage = Math.min(percentage, max);
                this.player.bar.set('played', percentage, 'width');
                const time = maxTime > -1 ? maxTime : percentage * this.player.video.duration;
                this.player.template.ptime.innerHTML = utils.secondToTime(time);
                console.log(`thumbMove progress percentage 1: ${percentage} maxTime: ${maxTime}`);
            } else {
                percentage = Math.min(percentage, max);
                this.player.bar.set('played', percentage, 'width');
                this.player.template.ptime.innerHTML = utils.secondToTime(percentage * this.player.video.duration);
                console.log(`thumbMove progress percentage 2: ${percentage}`);
            }
        };

        const thumbUp = (e) => {
            // canDrag = true;

            // if (e.target && e.target.className === 'dplayer-highlight') {
            //     canDrag = false;
            //     return;
            // }

            const maxTime = this.progressBar.maxTime;

            document.removeEventListener(utils.nameMap.dragEnd, thumbUp);
            document.removeEventListener(utils.nameMap.dragMove, thumbMove);
            let percentage = ((e.clientX || e.changedTouches[0].clientX) - utils.getBoundingClientRectViewLeft(this.player.template.playedBarWrap)) / this.player.template.playedBarWrap.clientWidth;
            percentage = Math.max(percentage, 0);

            let max = 1;

            if (maxTime > -1) {
                max = maxTime / this.player.video.duration;
            }


            if (max < 0) {
                max = 0;
            }

            if (max > 1) {
                max = 1;
            }

            if (percentage > max) {
                percentage = Math.min(percentage, max);
                this.player.bar.set('played', percentage, 'width');
                const time = maxTime > -1 ? maxTime : percentage * this.player.video.duration;
                this.player.seek(time);
                this.player.timer.enable('progress');
                console.log(`thumbUp progress percentage 1: ${percentage} maxTime: ${maxTime}`);
            } else {
                if (e.target && e.target.className === 'dplayer-highlight') {
                    const time = e.target.getAttribute('data-time');
                    percentage = time / this.player.video.duration;
                }
                percentage = Math.min(percentage, max);
                this.player.bar.set('played', percentage, 'width');
                this.player.seek(this.player.bar.get('played') * this.player.video.duration);
                this.player.timer.enable('progress');
                console.log(`thumbUp progress percentage 2: ${percentage}`);
            }
        };

        this.player.template.playedBarWrap.addEventListener(utils.nameMap.dragStart, (e) => {
            const drag = this.progressBar.drag;

            if (!drag) {
                console.log('progress drag false');
                return;
            }

            // if (e.target && e.target.className === 'dplayer-highlight') {
            //     canDrag = false;
            //     return;
            // }

            console.log('progress', e);

            this.player.timer.disable('progress');
            document.addEventListener(utils.nameMap.dragMove, thumbMove);
            document.addEventListener(utils.nameMap.dragEnd, thumbUp);
        });

        // this.player.template.playedBarWrap.addEventListener(utils.nameMap.dragMove, (e) => {
        //     if (this.player.video.duration) {
        //         const px = this.player.template.playedBarWrap.getBoundingClientRect().left;
        //         const tx = (e.clientX || e.changedTouches[0].clientX) - px;
        //         if (tx < 0 || tx > this.player.template.playedBarWrap.offsetWidth) {
        //             return;
        //         }
        //         const time = this.player.video.duration * (tx / this.player.template.playedBarWrap.offsetWidth);
        //         if (utils.isMobile) {
        //             this.thumbnails && this.thumbnails.show();
        //         }
        //         this.thumbnails && this.thumbnails.move(tx);
        //         this.player.template.playedBarTime.style.left = `${tx - (time >= 3600 ? 25 : 20)}px`;
        //         this.player.template.playedBarTime.innerText = utils.secondToTime(time);
        //         this.player.template.playedBarTime.classList.remove('hidden');
        //     }
        // });

        // this.player.template.playedBarWrap.addEventListener(utils.nameMap.dragEnd, () => {
        //     if (utils.isMobile) {
        //         this.thumbnails && this.thumbnails.hide();
        //     }
        // });

        // if (!utils.isMobile) {
        //     this.player.template.playedBarWrap.addEventListener('mouseenter', () => {
        //         if (this.player.video.duration) {
        //             this.thumbnails && this.thumbnails.show();
        //             this.player.template.playedBarTime.classList.remove('hidden');
        //         }
        //     });

        //     this.player.template.playedBarWrap.addEventListener('mouseleave', () => {
        //         if (this.player.video.duration) {
        //             this.thumbnails && this.thumbnails.hide();
        //             this.player.template.playedBarTime.classList.add('hidden');
        //         }
        //     });
        // }
    }

    initFullButton() {
        this.player.template.browserFullButton.addEventListener('click', () => {
            if (this.player.options.onFullscreen) {
                this.player.options.onFullscreen();
                return;
            }
            if (this.player.options.onlyWebFullButton) {
                this.player.fullScreen.toggle('web');
                return;
            }
            this.player.fullScreen.toggle('browser');
        });

        this.player.template.webFullButton.addEventListener('click', () => {
            this.player.fullScreen.toggle('web');
        });
    }

    initClipButton() {
        if (this.player.options.clip) {
            this.player.template.clipButton.addEventListener('click', () => {
                if (this.player.options.onClip) {
                    this.player.options.onClip();
                    return;
                }
                window.open(this.player.options.clip.url);
            });
        }
    }

    initVolumeButton() {
        const vWidth = 50;

        const volumeMove = (event) => {
            const e = event || window.event;
            const percentage = ((e.clientX || e.changedTouches[0].clientX) - utils.getBoundingClientRectViewLeft(this.player.template.volumeBarWrap) - 5.5) / vWidth;
            this.player.volume(percentage);
        };
        const volumeUp = () => {
            document.removeEventListener(utils.nameMap.dragEnd, volumeUp);
            document.removeEventListener(utils.nameMap.dragMove, volumeMove);
            this.player.template.volumeButton.classList.remove('dplayer-volume-active');
        };

        this.player.template.volumeBarWrapWrap.addEventListener('click', (event) => {
            const e = event || window.event;
            const percentage = ((e.clientX || e.changedTouches[0].clientX) - utils.getBoundingClientRectViewLeft(this.player.template.volumeBarWrap) - 5.5) / vWidth;
            this.player.volume(percentage);
        });
        this.player.template.volumeBarWrapWrap.addEventListener(utils.nameMap.dragStart, () => {
            document.addEventListener(utils.nameMap.dragMove, volumeMove);
            document.addEventListener(utils.nameMap.dragEnd, volumeUp);
            this.player.template.volumeButton.classList.add('dplayer-volume-active');
        });
        this.player.template.volumeButtonIcon.addEventListener('click', () => {
            if (this.player.video.muted) {
                this.player.video.muted = false;
                this.player.switchVolumeIcon();
                this.player.bar.set('volume', this.player.volume(), 'width');
            } else {
                this.player.video.muted = true;
                this.player.template.volumeIcon.innerHTML = `<img class="dplayer-icon-img" src="${Icons.volumeOff}"/>`;
                this.player.bar.set('volume', 0, 'width');
            }
        });
    }

    initQualityButton() {
        if (this.player.options.video.quality) {
            this.player.template.qualityList.addEventListener('click', (e) => {
                if (e.target.classList.contains('dplayer-quality-item')) {
                    this.player.switchQuality(e.target.dataset.index);
                }
            });
        }
    }

    initScreenshotButton() {
        if (this.player.options.screenshot) {
            this.player.template.camareButton.addEventListener('click', () => {
                const canvas = document.createElement('canvas');
                canvas.width = this.player.video.videoWidth;
                canvas.height = this.player.video.videoHeight;
                canvas.getContext('2d').drawImage(this.player.video, 0, 0, canvas.width, canvas.height);

                let dataURL;
                canvas.toBlob((blob) => {
                    dataURL = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = dataURL;
                    link.download = 'DPlayer.png';
                    link.style.display = 'none';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(dataURL);
                });

                this.player.events.trigger('screenshot', dataURL);
            });
        }
    }

    initAirplayButton() {
        if (this.player.options.airplay) {
            if (window.WebKitPlaybackTargetAvailabilityEvent) {
                this.player.video.addEventListener(
                    'webkitplaybacktargetavailabilitychanged',
                    function (event) {
                        switch (event.availability) {
                            case 'available':
                                this.template.airplayButton.disable = false;
                                break;

                            default:
                                this.template.airplayButton.disable = true;
                        }

                        this.template.airplayButton.addEventListener(
                            'click',
                            function () {
                                this.video.webkitShowPlaybackTargetPicker();
                            }.bind(this)
                        );
                    }.bind(this.player)
                );
            } else {
                this.player.template.airplayButton.style.display = 'none';
            }
        }
    }

    initSubtitleButton() {
        if (this.player.options.subtitle) {
            this.player.events.on('subtitle_show', () => {
                this.player.template.subtitleButton.classList.remove('dplayer-subtitle-on');
            });
            this.player.events.on('subtitle_hide', () => {
                this.player.template.subtitleButton.classList.add('dplayer-subtitle-on');
            });

            this.player.template.subtitleButton.addEventListener('click', () => {
                if (this.player.options.onSubtitle) {
                    this.player.options.onSubtitle();
                    return;
                }
                this.player.subtitle.toggle();
            });
        }
    }

    setProgressBarDrag(bool) {
        this.progressBar.drag = !!bool;
    }

    setProgressBarMax(value) {
        if (value < 0) {
            value = 0;
        }
        if (value > 1) {
            value = 1;
        }
        this.progressBar.max = value;
    }

    setAutoHide() {
        this.show();
        clearTimeout(this.autoHideTimer);
        this.autoHideTimer = setTimeout(() => {
            if (this.player.video.played.length && !this.player.paused && !this.disableAutoHide && !this.isFocusMode) {
                console.log('---setAutoHide hide---');
                this.hide();
            }
        }, 1500);
    }

    show() {
        this.player.container.classList.remove('dplayer-hide-controller');
    }

    hide() {
        console.log('---hide---');
        this.player.container.classList.add('dplayer-hide-controller');
        this.player.setting.hide();
        this.player.comment && this.player.comment.hide();
    }

    isShow() {
        return !this.player.container.classList.contains('dplayer-hide-controller');
    }

    toggle() {
        console.log('---toggle---');
        if (this.isShow()) {
            this.hide();
        } else {
            this.show();
        }
    }

    destroy() {
        clearTimeout(this.autoHideTimer);
    }

    setFocusMode(bool) {
        console.log('---setFocusMode---');
        this.isFocusMode = bool;

        if (!bool) {
            this.setAutoHide();
        } else {
            this.show();
        }

        if (bool) {
            if (!this.player.container.classList.contains('dplayer-focus-mode')) {
                this.player.container.classList.add('dplayer-focus-mode');
            }
            return;
        }
        this.player.container.classList.remove('dplayer-focus-mode');
    }

    toggleFocusMode() {
        this.setFocusMode(!this.isFocusMode);
    }
}

export default Controller;
