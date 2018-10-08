const head = document.getElementsByTagName('head')[0];
const cssPaths = {};
const scriptMaps = {};

function ensurePathArray(paths): [] {
    if (!paths) {
        paths = [];
    } else if (typeof paths === 'string') {
        paths = [paths];
    }
    return paths;
}

interface ElementAttributes {
    type?: 'text/javascript',
    rel?: 'stylesheet';
    href?: string
}

function loadFile(tagName, path, attributes: ElementAttributes = {}): Promise<HTMLElement> {
    return new Promise((resolve, reject) => {
        const element = document.createElement(tagName);
        for (const key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                element.setAttribute(key, attributes[key]);
            }
        }
        if (attributes.rel && attributes.rel === 'stylesheet') {
            element.setAttribute('href', path);
            // stylesheets dont seem to trigger onload events in all browsers
            const timerId = setTimeout(() => {
                resolve(element);
                clearTimeout(timerId);
            }, 1);
        } else {
            element.src = path;
            element.addEventListener('load', () => {
                resolve(element);
            });
            element.addEventListener('error', () => {
                reject(element);
            });
        }
        head.appendChild(element);
    })
}

export const script = {
    async import (paths: string | string[]): Promise<any[]>  {
        let map;
        const loadPromises = [];
        paths = ensurePathArray(paths);
        paths.forEach((path) => {
            map = scriptMaps[path] = scriptMaps[path] || {};
            if (!map.promise) {
                map.path = path;
                map.promise = loadFile('script', path, {type: 'text/javascript'});
            }
            loadPromises.push(map.promise);
        });
        return Promise.all(loadPromises);
    },

    async unload (paths: string | string[]): Promise<void> {
        let file;
        paths = ensurePathArray(paths);
        paths.forEach((path) => {
            file = head.querySelectorAll('script[src="' + path + '"]')[0];
            if (file) {
                head.removeChild(file);
                delete scriptMaps[path];
            }
        });
    }
};


export const style = {

    async import (paths: string | string[]): Promise<void> {
        paths = ensurePathArray(paths);
        for (const path of paths) {
            // TODO: figure out a way to find out when css is guaranteed to be loaded,
            // and make this return a truely asynchronous promise
            if (!cssPaths[path]) {
                cssPaths[path] = await loadFile('link', path,{
                    rel: 'stylesheet'
                });
            }
        }
    },

    async unload (paths: string | string[]): Promise<void> {
        let el;
        paths = ensurePathArray(paths);
        paths.forEach((path) => {
            el = cssPaths[path];
            if (el) {
                head.removeChild(el);
                cssPaths[path] = null;
            }
        });
    }
};

export const html = {
    async import (path: string, el?: HTMLElement): Promise<HTMLElement | DocumentFragment> {
        if (!path) {
            throw new Error('No path provided to html.import()');
        }
        const resp = await fetch(path);
        const contents = await resp.text();
        if (el) {
            el.innerHTML = contents;
            return el;
        } else {
            const template = document.createElement('template');
            template.innerHTML = contents;
            return template.content;
        }
    }
};
