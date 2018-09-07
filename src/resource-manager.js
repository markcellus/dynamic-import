/**
 * Makes sure that a path is converted to an array.
 * @param paths
 * @returns {*}
 */
let ensurePathArray = function (paths) {
    if (!paths) {
        paths = [];
    } else if (typeof paths === 'string') {
        paths = [paths];
    }
    return paths;
};

/**
 The Resource Manager.
 @class ResourceManager
 @description Represents a manager that loads any CSS and Javascript Resources on the fly.
 */
class ResourceManager {

    /**
     * Upon initialization.
     * @memberOf ResourceManager
     */
    constructor () {
        this._head = document.getElementsByTagName('head')[0];
        this._cssPaths = {};
        this._scriptMaps = {};
        this._dataPromises = {};
    }

    /**
     * Loads a javascript file.
     * @param {string|Array} paths - The path to the view's js file
     * @memberOf ResourceManager
     * @return {Promise} Returns a promise that resolves when all scripts have been loaded
     */
    async loadScript (paths) {
        let script,
            map,
            loadPromises = [];
        paths = ensurePathArray(paths);
        paths.forEach((path) => {
            map = this._scriptMaps[path] = this._scriptMaps[path] || {};
            if (!map.promise) {
                map.path = path;
                map.promise = new Promise((resolve) => {
                    script = this.createScriptElement();
                    script.setAttribute('type','text/javascript');
                    script.src = path;
                    script.addEventListener('load', resolve);
                    this._head.appendChild(script);
                });
            }
            loadPromises.push(map.promise);
        });
        return Promise.all(loadPromises);
    }

    /**
     * Removes a script that has the specified path from the head of the document.
     * @param {string|Array} paths - The paths of the scripts to unload
     * @memberOf ResourceManager
     */
    async unloadScript (paths) {
        let file;
        return new Promise((resolve) => {
            paths = ensurePathArray(paths);
            paths.forEach((path) => {
                file = this._head.querySelectorAll('script[src="' + path + '"]')[0];
                if (file) {
                    this._head.removeChild(file);
                    delete this._scriptMaps[path];
                }
            });
            resolve();
        });
    }

    /**
     * Creates a new script element.
     * @returns {HTMLElement}
     */
    createScriptElement () {
        return document.createElement('script');
    }

    /**
     * Makes a request to get data and caches it.
     * @param {string} url - The url to fetch data from
     * @param [reqOptions] - options to be passed to fetch call
     * @returns {*}
     */
    async fetchData (url, reqOptions = {}) {
        let cacheId = url + JSON.stringify(reqOptions);

        reqOptions.cache = reqOptions.cache === undefined ? true : reqOptions.cache;

        if (!url) {
            return Promise.resolve();
        }
        if (!this._dataPromises[cacheId] || !reqOptions.cache) {
            try {
                this._dataPromises[cacheId] = await fetch(url, reqOptions)
            } catch (e) {
                // if failure, remove cache so that subsequent
                // requests will trigger new ajax call
                this._dataPromises[cacheId] = null;
                throw e;
            }
        }
        return this._dataPromises[cacheId];
    }

    /**
     * Loads css files.
     * @param {Array|String} paths - An array of css paths files to load
     * @memberOf ResourceManager
     * @return {Promise}
     */
    async loadCss (paths) {
        return new Promise((resolve) => {
            paths = ensurePathArray(paths);
            paths.forEach((path) => {
                // TODO: figure out a way to find out when css is guaranteed to be loaded,
                // and make this return a truely asynchronous promise
                if (!this._cssPaths[path]) {
                    let el = document.createElement('link');
                    el.setAttribute('rel','stylesheet');
                    el.setAttribute('href', path);
                    this._head.appendChild(el);
                    this._cssPaths[path] = el;
                }
            });
            resolve();
        });
    }

    /**
     * Unloads css paths.
     * @param {string|Array} paths - The css paths to unload
     * @memberOf ResourceManager
     * @return {Promise}
     */
    async unloadCss (paths) {
        let el;
        return new Promise((resolve) => {
            paths = ensurePathArray(paths);
            paths.forEach((path) => {
                el = this._cssPaths[path];
                if (el) {
                    this._head.removeChild(el);
                    this._cssPaths[path] = null;
                }
            });
            resolve();
        });
    }

    /**
     * Parses a template into a DOM element, then returns element back to you.
     * @param {string} path - The path to the template
     * @param {HTMLElement} [el] - The element to attach template to
     * @returns {Promise} Returns a promise that resolves with contents of template file
     */
    async loadTemplate (path, el) {
        if (!path) {
            return Promise.resolve();
        }
        const contents = await this.fetchTemplate(path);
        if (el) {
            el.innerHTML = contents;
            return el;
        }
        return contents;

    }

    /**
     * Fetches a template file from the server.
     * @param [templatePath] - The file path to the template file
     * @returns {Promise} Returns a promise that is resolved with the contents of the template file when retrieved
     */
    async fetchTemplate(templatePath) {
        const resp = await fetch(templatePath);
        return await resp.text();
    }

    /**
     * Removes all cached resources.
     * @memberOf ResourceManager
     */
    async flush () {
        await this.unloadCss(Object.getOwnPropertyNames(this._cssPaths));
        this._cssPaths = {};
        for (let s in this._scriptMaps) {
            if (this._scriptMaps.hasOwnProperty(s)) {
                let map = this._scriptMaps[s];
                await this.unloadScript(map.path);
            }
        }
        this._scriptMaps = {};
        this._dataPromises = {};
    }

}
const resourceManager = new ResourceManager();

export default resourceManager;
