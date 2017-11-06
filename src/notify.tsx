import * as Notify from 'notifyjs';

const logo = require('./theme/img/prooph-logo@0.5x.png');

function onPermissionGranted() {
    console.log('Permission has been granted by the user');
}

function onPermissionDenied() {
    console.warn('Permission has been denied by the user');
}

export const doNotification = (title: string, body: string, link ?: string) => {
    const notify = new Notify(title, {
        body,
        icon: logo,
        notifyClick: function () {
            if (link) {
                window.location.href=link;
            }
            notify.close();
        }
    });
    notify.show();
};

export const doNotificationWithPageReload = (title: string, body: string) => {
    const notify = new Notify(title, {
        body,
        icon: logo,
        notifyClick: function () {
            location.reload();
            notify.close();
        },
    });
    notify.show();
};

export default function notify() {
    if (!Notify.needsPermission) {
    } else if (Notify.isSupported()) {
        Notify.requestPermission(onPermissionGranted, onPermissionDenied);
    }
};
