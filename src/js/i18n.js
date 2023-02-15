/*
W3C def language codes is :
    language-code = primary-code ( "-" subcode )
        primary-code    ISO 639-1   ( the names of language with 2 code )
        subcode         ISO 3166    ( the names of countries )

NOTE: use lowercase to prevent case typo from user!
Use this as shown below..... */

const userLanguage = () => {
    const lang = navigator.language;
    return lang.substring(0, 2).toLowerCase();
};

export function getLanguage() {
    return userLanguage() === 'zh' ? 'zh' : 'en';
};

function i18n(lang) {
    this.lang = lang;
    this.tran = (text) => {
        if (tranTxt[this.lang] && tranTxt[this.lang][text]) {
            return tranTxt[this.lang][text];
        } else {
            return text;
        }
    };
}

// add translation text here
const tranTxt = {
    'zh-cn': {
        'Danmaku is loading': '弹幕加载中',
        Top: '顶部',
        Bottom: '底部',
        Rolling: '滚动',
        'Input danmaku, hit Enter': '输入弹幕，回车发送',
        'About author': '关于作者',
        'DPlayer feedback': '播放器意见反馈',
        'About DPlayer': '关于 DPlayer 播放器',
        loop: '循环播放',
        'Open Loop': '打开循环播放',
        'Close Loop': '关闭循环播放',
        Edit: '视频编辑',
        Speed: '倍速',
        'Opacity for danmaku': '弹幕透明度',
        Normal: '1',
        'Please input danmaku content!': '要输入弹幕内容啊喂！',
        'Set danmaku color': '设置弹幕颜色',
        'Internet connecting...please wait': '网络连接中...请稍候',
        'Set danmaku type': '设置弹幕类型',
        'Show danmaku': '显示弹幕',
        'Video load failed': '视频加载失败',
        'Danmaku load failed': '弹幕加载失败',
        'Danmaku send failed': '弹幕发送失败',
        'Switching to': '正在切换至',
        'Switched to': '已经切换至',
        quality: '画质',
        FF: '快进',
        REW: '快退',
        'Unlimited danmaku': '海量弹幕',
        'Send danmaku': '发送弹幕',
        Setting: '设置',
        'Full screen': '全屏',
        'Web full screen': '页面全屏',
        Send: '发送',
        Screenshot: '截图',
        AirPlay: '无线投屏',
        s: '秒',
        'Open subtitle': '显示字幕',
        'Close subtitle': '隐藏字幕',
        Volume: '音量',
        Live: '直播',
        'Video info': '视频统计信息',
    },
};

export default i18n;
