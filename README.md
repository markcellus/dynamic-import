[![Build Status](https://travis-ci.org/mkay581/dynamic-import.svg?branch=master)](https://travis-ci.org/mkay581/dynamic-import)
[![npm version](https://badge.fury.io/js/dynamic-import.svg)](https://badge.fury.io/js/dynamic-import)

# Dynamic Import

A library that allows you to dynamically load (and unload) scripts, CSS, and HTML templates and files in a browser.  
Useful for preloading (in background), loading and unloading scripts inside
the `<head>` of an html page, or cases when you may want to keep your css, js and templates 
in separate files and only want to import them into an HTML page at different times.

## Installation
 
```
npm i dynamic-import
```

You can also use the dist files in the browser.

```html
<script type="module" src="node_modules/dynamic-import/dist/import.min.js"></script>
```


## Usage

### Load CSS files

```javascript
import { style } from 'node_modules/dynamic-import/dist/import.js';
const cssPaths = ['path/to/css/file.css', 'path/to/another/css/file.css'];
style.import(cssPaths).then(function () {
    // css files have been loaded!
});
```

### Load JavaScript files

Load script files dynamically. When called, the supplied script
will be loaded into the `<head>` of the DOM and run immediately.

```javascript
import { script } from 'node_modules/dynamic-import/dist/import.js';
script.import('path/to/file.js').then(function () {
    // script has been loaded into the `<head>` of document!
});
```

### Load HTML files

Load HTML file contents into an already-existing DOM element.


```javascript
import { html } from 'node_modules/dynamic-import/dist/import.js';
html.import('path/to/html/file.html', document.body).then(function () {
    // html contents have been loaded into the body element
});
```

