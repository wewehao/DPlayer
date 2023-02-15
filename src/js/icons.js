import play from '../assets/play.svg';
import pause from '../assets/pause.svg';
import volumeDown from '../assets/volume-down.png';
import volumeOff from '../assets/volume-off.png';
import full from '../assets/full.png';
import fulled from '../assets/fulled.png';
import fullWeb from '../assets/full-web.svg';
import setting from '../assets/setting.svg';
import right from '../assets/right.svg';
import comment from '../assets/comment.svg';
import commentOff from '../assets/comment-off.svg';
import send from '../assets/send.svg';
import pallette from '../assets/pallette.svg';
import camera from '../assets/camera.svg';
import airplay from '../assets/airplay.svg';
import loading from '../assets/loading.svg';
import clip from '../assets/clip.png';
import mobilePlay from '../assets/mobile-play.svg';
import mobilePause from '../assets/mobile-pause.svg';
import loopOn from '../assets/loop-on.png';
import loopOff from '../assets/loop-off.png';
import subtitleOn from '../assets/subtitle-on.svg';
import subtitleOff from '../assets/subtitle-off.svg';
import subtitleOnZH from '../assets/subtitle-on-zh.svg';
import subtitleOffZH from '../assets/subtitle-off-zh.svg';

import { getLanguage } from './i18n';

const lang = getLanguage();

const Icons = {
    play,
    pause,
    volumeDown,
    volumeOff,
    full,
    fulled,
    fullWeb,
    setting,
    right,
    comment,
    commentOff,
    send,
    pallette,
    camera,
    loading,
    airplay,
    clip,
    loopOn,
    loopOff,
    subtitleOn: lang === 'zh' ? subtitleOnZH : subtitleOn,
    subtitleOff: lang === 'zh' ? subtitleOffZH : subtitleOff,

    mobilePlay,
    mobilePause,
};

export default Icons;
