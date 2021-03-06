/*!
 * Dynamic-import v0.1.1
 * https://github.com/mkay581/dynamic-import#readme
 *
 * Copyright (c) 2018 Mark Kennedy
 * Licensed under the MIT license
 */

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const head = document.getElementsByTagName('head')[0];
const cssPaths = {};
const scriptMaps = {};
function ensurePathArray(paths) {
    if (!paths) {
        paths = [];
    }
    else if (typeof paths === 'string') {
        paths = [paths];
    }
    return paths;
}
function loadFile(tagName, path, attributes = {}) {
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
        }
        else {
            element.src = path;
            element.addEventListener('load', () => {
                resolve(element);
            });
            element.addEventListener('error', () => {
                reject(element);
            });
        }
        head.appendChild(element);
    });
}
const script = {
    import(paths) {
        return __awaiter(this, void 0, void 0, function* () {
            let map;
            const loadPromises = [];
            paths = ensurePathArray(paths);
            paths.forEach((path) => {
                map = scriptMaps[path] = scriptMaps[path] || {};
                if (!map.promise) {
                    map.path = path;
                    map.promise = loadFile('script', path, { type: 'text/javascript' });
                }
                loadPromises.push(map.promise);
            });
            return Promise.all(loadPromises);
        });
    },
    unload(paths) {
        return __awaiter(this, void 0, void 0, function* () {
            let file;
            paths = ensurePathArray(paths);
            paths.forEach((path) => {
                file = head.querySelectorAll('script[src="' + path + '"]')[0];
                if (file) {
                    head.removeChild(file);
                    delete scriptMaps[path];
                }
            });
        });
    }
};
const style = {
    import(paths) {
        return __awaiter(this, void 0, void 0, function* () {
            paths = ensurePathArray(paths);
            for (const path of paths) {
                // TODO: figure out a way to find out when css is guaranteed to be loaded,
                // and make this return a truely asynchronous promise
                if (!cssPaths[path]) {
                    cssPaths[path] = yield loadFile('link', path, {
                        rel: 'stylesheet'
                    });
                }
            }
        });
    },
    unload(paths) {
        return __awaiter(this, void 0, void 0, function* () {
            let el;
            paths = ensurePathArray(paths);
            paths.forEach((path) => {
                el = cssPaths[path];
                if (el) {
                    head.removeChild(el);
                    cssPaths[path] = null;
                }
            });
        });
    }
};
const html = {
    import(path, el) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!path) {
                throw new Error('No path provided to html.import()');
            }
            const resp = yield fetch(path);
            const contents = yield resp.text();
            if (el) {
                el.innerHTML = contents;
                return el;
            }
            else {
                const template = document.createElement('template');
                template.innerHTML = contents;
                return template.content;
            }
        });
    }
};

export { script, style, html };
