[![Build Status](https://travis-ci.org/mkay581/resource-manager-js.svg?branch=master)](https://travis-ci.org/mkay581/resource-manager-js)
[![npm version](https://badge.fury.io/js/resource-manager-js.svg)](https://badge.fury.io/js/resource-manager-js)

# Resource Manager

A library that imports, loads and caches CSS, JavaScript, and HTML template files (and their contents) on-the-fly in a browser.  
Useful for preloading files programmatically (in background), loading and unloading scripts inside
the `<head>` of an html page (avoiding duplicates), or cases when you may want to keep your css, js and templates 
in separate files and only want to import them into an HTML page at different times.

## Installation
 
```
npm i resource-manager-js --save-dev
```

You can also use the dist files in the browser.

```html
<script type="module" src="node_modules/resource-manager-js/dist/resource-manager.min.js"></script>
```


## Usage

### Load CSS files

```javascript
var cssPaths = ['path/to/css/file', 'path/to/another/css/file'];
ResourceManager.loadCss(cssPaths).then(function () {
    // css files have been loaded!
});
```

### Load JavaScript files

You can load script files dynamically by calling the `loadScript()` method. When called, the supplied script
will be loaded into the `<head>` of the DOM and run immediately.

```javascript
ResourceManager.loadScript('path/to/js').then(function () {
    // script has been loaded!
});
```

### Request data endpoints

The `fetchData()` method makes XHR/ajax requests easy.

```javascript
ResourceManager.fetchData('path/to/data', {cache: true}).then(function (response) {
    // response has been retrieved!
    // print out the response
    console.log(response);
});
```


### Load template files

Load HTML file contents into an already-existing DOM element by using the `loadTemplate()` method.


```javascript
ResourceManager.loadTemplate('path/to/html/file', document.body).then(function () {
    // html contents have been loaded into the body element
});
```

