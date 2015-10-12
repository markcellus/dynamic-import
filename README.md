[![Build Status](https://travis-ci.org/mkay581/resource-manager.svg?branch=master)](https://travis-ci.org/mkay581/resource-manager)

# Resource Manager

A library that loads and caches files (and their contents) on-the-fly. Which is extremely helpful when preloading files
in a browser, for instance. All different file types are supported including CSS, JavaScript, and HTML templates.


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
var body = document.body;
ResourceManager.loadTemplate('path/to/html/file', body).then(function () {
    // html contents have been loaded into the body element
});
```