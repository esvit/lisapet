import { addClass, removeClass } from './helpers/dom.mjs';
import Locale from './Locale.mjs';

export default
class GameDialogs {
    static getField(obj, field) {
        const parts = field.split('.');
        let current = obj;
        for (const part of parts) {
            const key = Array.isArray(current) ? Number(part) : part;
            current = typeof current !== 'undefined' ? current[key] : undefined;
        }
        return current;
    }

    static bindValues(el, values) {
        const els = el.querySelectorAll('[data-bind]');
        for (const elem of els) {
            const key = elem.getAttribute('data-bind');
            const value = GameDialogs.getField(values, key);
            if (typeof value !== 'undefined') {
                elem.innerHTML = value;
            }
        }
    }

    static showDialog(id, values = {}, closeCallback = null) {
        const dialog = document.getElementById(id);
        const backdrop = document.getElementById('dialog-backdrop');
        GameDialogs.bindValues(dialog, values);
        setTimeout(() => {
            dialog.show();
            removeClass(backdrop, 'd-none');
        }, 1); // потрібна затримка, бо коли правою кнопкою клацаєш, то приховується контексне меню, якщо без затримки, то буде відображатись
        const closeBtn = dialog.querySelector('[data-action="close"]');
        const hide = (e) => {
            e.preventDefault();
            closeBtn.removeEventListener('click', hide);
            dialog.close();
            addClass(backdrop, 'd-none');
            if (closeCallback) {
                closeCallback();
            }
        };
        closeBtn.addEventListener('click', hide);
        return dialog;
    }

    static askNameDialog() {
        const nameInput = document.getElementById('nameDialog-name');
        return new Promise((resolve) => {
            nameInput.value = Locale.randomName();
            nameInput.focus();
            nameInput.select();
            GameDialogs.showDialog('nameDialog', {}, () => {
                resolve(nameInput.value);
            });
        });
    }

    static showMissionDialog() {
        return new Promise((resolve) => {
            GameDialogs.showDialog('missionDialog', {}, () => {
                resolve();
            });
        });
    }
}
