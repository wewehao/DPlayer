class Subtitle {
    constructor(container, video, options, events) {
        this.container = container;
        this.video = video;
        this.options = options;
        this.events = events;
        this._subtitles = [];

        this.init();
    }

    init() {
        this.container.style.fontSize = this.options.fontSize;
        this.container.style.bottom = this.options.bottom;
        this.container.style.color = this.options.color;

        if (this.video.textTracks && this.video.textTracks[0]) {
            const track = this.video.textTracks[0];

            track.oncuechange = () => {
                const cue = track.activeCues[0];

                this.container.innerHTML = '';
                if (cue) {
                    const template = document.createElement('div');
                    template.appendChild(cue.getCueAsHTML());
                    const trackHtml = template.innerHTML.split(/\r?\n/).map((item) => `<p>${item}</p>`).join('');
                    this.container.innerHTML = trackHtml;

                    try {
                        const { id, startTime, endTime, text } = cue;

                        this.events.trigger('subtitle_change', {
                            index: Number(id),
                            startTime,
                            endTime,
                            text,
                        });
                    } catch (err) {
                        console.log(err);
                    }
                }
            };
        }
    }

    getSubtitle(index) {
        if (this.video.textTracks && this.video.textTracks[0]) {
            const track = this.video.textTracks[0];
            if (track && track.cues) {
                return track.cues[index];
            }
        }
        return '';
    }

    updateSubtitle(index, text) {
        if (this.video.textTracks && this.video.textTracks[0]) {
            const track = this.video.textTracks[0];
            if (track && track.cues && track.cues[index]) {
                track.cues[index].text = text;
            }
        }
    }

    show() {
        this.container.classList.remove('dplayer-subtitle-hide');
        this.events.trigger('subtitle_show');
    }

    hide() {
        this.container.classList.add('dplayer-subtitle-hide');
        this.events.trigger('subtitle_hide');
    }

    toggle() {
        if (this.container.classList.contains('dplayer-subtitle-hide')) {
            this.show();
        } else {
            this.hide();
        }
    }
}

export default Subtitle;
