import sinon from 'sinon';
import assert from 'assert';
import ResourceManager from '../src/resource-manager';

describe('Resource Manager', function () {
    let origWindowFetch;

    beforeEach(function () {
        origWindowFetch = window.fetch;
        window.fetch = sinon.stub();
    });

    afterEach(function () {
        window.fetch = origWindowFetch;
    });

    it('should load and unload multiple css files', function () {
        let cssPaths = ['test/path/to/css/one', 'test/path/to/second/css'];
        return ResourceManager.loadCss(cssPaths).then(function () {
            let head = document.getElementsByTagName('head')[0];
            assert.equal(head.querySelectorAll('link[href="' + cssPaths[0] + '"]').length, 1, 'calling loadCss() with new css files loads first css path in the head of the document');
            assert.equal(head.querySelectorAll('link[href="' + cssPaths[1] + '"]').length, 1, 'second css path was loaded into the head of the document');
            return ResourceManager.unloadCss(cssPaths).then(function (){
                assert.equal(head.querySelectorAll('link[href="' + cssPaths[0] + '"]').length, 0, 'calling unloadCss() removes first css path from the head of the document');
                assert.equal(head.querySelectorAll('link[href="' + cssPaths[1] + '"]').length, 0, 'second css path is removed from the head of the document');
                ResourceManager.flush();
            });
        });
    });

    it('should add and remove css file from DOM appropriately', function () {
        let path = 'test/path/to/css/single.css';
        return ResourceManager.loadCss(path).then(function () {
            let head = document.getElementsByTagName('head')[0];
            assert.equal(head.querySelectorAll('link[href="' + path + '"]').length, 1, 'calling loadCss(), adds css in the head of the document');
            return ResourceManager.unloadCss(path).then(function () {
                assert.equal(head.querySelectorAll('link[href="' + path + '"]').length, 0, 'calling unloadCss() removes css from head of document');
                ResourceManager.flush();
            });
        });
    });

    it('should NOT load css files that have already been loaded', function () {
        let cssPaths = ['test/path/to/css/one', 'test/path/to/second/css'];
        let head = document.getElementsByTagName('head')[0];
        return ResourceManager.loadCss(cssPaths).then(function () {
            assert.equal(head.querySelectorAll('link[href="' + cssPaths[0] + '"]').length, 1, 'on first loadCss() call, first file gets added to the head of the document once');
            assert.equal(head.querySelectorAll('link[href="' + cssPaths[1] + '"]').length, 1, 'second file gets added to the head of the document once');
            let newPath = 'test/new/third/file';
            cssPaths.push(newPath); // add new path
            return ResourceManager.loadCss(cssPaths).then(function () {
                assert.equal(head.querySelectorAll('link[href="' + cssPaths[0] + '"]').length, 1, 'on second loadCss() call, first file does NOT get added to the head of the document a second time');
                assert.equal(head.querySelectorAll('link[href="' + cssPaths[1] + '"]').length, 1, 'second file does NOT get added to the head of the document a second time');
                assert.equal(head.querySelectorAll('link[href="' + newPath + '"]').length, 1, 'third file gets added to the head of the document because it was the only one of the files that hasnt been added yet');
                ResourceManager.flush();
            });
        });
    });

    it('does not crash when nothing is passed to loadCss()', function () {
        let head = document.getElementsByTagName('head')[0];
        return ResourceManager.loadCss().then(function () {
            assert.ok(true, 'no crash');
            ResourceManager.flush();
        });
    });

    it('loadTemplate() should make fetch request with correct options and return proper text response', function () {
        let path = 'test/path/to/css/single';
        let templateHtml = '<div>mytext</div>';
        let serverResp = {text: sinon.stub().returns(Promise.resolve(templateHtml))};
        window.fetch.returns(Promise.resolve(serverResp));
        return ResourceManager.loadTemplate(path).then(function (html) {
            assert.equal(window.fetch.args[0][0], path);
            assert.equal(html, templateHtml);
            ResourceManager.flush();
        });
    });

    it('does not crash when nothing is passed to loadTemplate()', function () {
        let head = document.getElementsByTagName('head')[0];
        return ResourceManager.loadTemplate().then(function () {
            assert.ok(true, 'no crash');
            ResourceManager.flush();
        });
    });

    it('should inject a javascript file correctly into the DOM when loaded and remove when unloaded', function () {
        let path = 'path/to/my.js';
        let head = document.getElementsByTagName('head')[0];
        let scriptEl = document.createElement('script');
        let createScriptElementStub = sinon.stub(ResourceManager, 'createScriptElement').returns(scriptEl);
        sinon.stub(scriptEl, 'addEventListener').callsArg(1);
        return ResourceManager.loadScript(path).then(function () {
            assert.equal(head.querySelectorAll('script[src="' + path + '"]').length, 1, 'on first loadScript() call, file gets added to the head of the document once');
            return ResourceManager.loadScript(path).then(function () {
                assert.equal(head.querySelectorAll('script[src="' + path + '"]').length, 1, 'attempting to call loadScript() with the same path does not add it to the document a second time');
                return ResourceManager.unloadScript(path).then(function () {
                    assert.equal(head.querySelectorAll('script[src="' + path + '"]').length, 0, 'calling unloadScript() removes the path from the document head');
                    ResourceManager.flush();
                    createScriptElementStub.restore();
                });
            });
        });
    });

    it('should inject multiple javascript files into the DOM when loaded via same load call', function () {
        let paths = ['path/to/my/first/file.js', 'path/to/my/second/file.js'];
        let head = document.getElementsByTagName('head')[0];
        let firstScriptEl = document.createElement('script');
        let secondScriptEl = document.createElement('script');
        let createScriptElementStub = sinon.stub(ResourceManager, 'createScriptElement');
        createScriptElementStub.onFirstCall().returns(firstScriptEl);
        createScriptElementStub.onSecondCall().returns(secondScriptEl);
        sinon.stub(firstScriptEl, 'addEventListener').callsArg(1);
        sinon.stub(secondScriptEl, 'addEventListener').callsArg(1);
        return ResourceManager.loadScript(paths).then(function () {
            assert.equal(head.querySelectorAll('script[src="' + paths[0] + '"]').length, 1, 'on first loadScript() call, first file gets added to the head of the document once');
            assert.equal(head.querySelectorAll('script[src="' + paths[1] + '"]').length, 1, 'second file gets added to the head of the document once');
            return ResourceManager.loadScript(paths[1]).then(function () {
                assert.equal(head.querySelectorAll('script[src="' + paths[0] + '"]').length, 1, 'attempting to call loadScript() for second file again does not add it to the document a second time');
                return ResourceManager.loadScript(paths[0]).then(function () {
                    assert.equal(head.querySelectorAll('script[src="' + paths[1] + '"]').length, 1, 'attempting to call loadScript() for first file again does not add it to the document a second time');
                    return ResourceManager.loadScript(paths).then(function () {
                        assert.equal(head.querySelectorAll('script[src="' + paths[0] + '"]').length, 1, 'attempting to call loadScript() with an array of first and second files again does not add first file to the document a second time');
                        assert.equal(head.querySelectorAll('script[src="' + paths[1] + '"]').length, 1, 'second file was not added to the document a second time');
                        return ResourceManager.unloadScript(paths).then(function () {
                            assert.equal(head.querySelectorAll('script[src="' + paths[0] + '"]').length, 0, 'calling unloadScript() removes the first file from the document head');
                            assert.equal(head.querySelectorAll('script[src="' + paths[1] + '"]').length, 0, 'second file is removed from the document head');
                            ResourceManager.flush();
                            createScriptElementStub.restore();
                        });
                    });
                });
            });
        });
    });

    it('fetchData should make fetch request with correct options and return fetched data object', function () {
        let path = 'test/path/to/css/single';
        let serverResp = {json: sinon.stub().returns(Promise.resolve()), body: true};
        window.fetch.returns(Promise.resolve(serverResp));
        let options = {my: 'opts'};
        return ResourceManager.fetchData(path, options).then(function (resp) {
            assert.deepEqual(window.fetch.args[0], [path, options]);
            assert.deepEqual(resp, serverResp);
            ResourceManager.flush();
        });
    });

    it('setting cache option to true will return the same response as previous requests and will not make additional fetch call', function () {
        let path = 'test/path/to/css/single';
        let resp = {json: sinon.stub().returns(Promise.resolve()), body: true};
        window.fetch.returns(Promise.resolve(resp));
        let options = {opts: 'same', cache: true};
        return ResourceManager.fetchData(path, options).then(function (data) {
            assert.deepEqual(data, resp, 'correct mock data was returned on first call');
            return ResourceManager.fetchData(path, options).then(function (data) {
                assert.deepEqual(window.fetch.callCount, 1, 'fetch called was only made once');
                assert.deepEqual(data, resp, 'second call returned correct data');
                ResourceManager.flush();
            });
        });
    });

    it('setting cache option to false will make fetch call always, even if the request is the same as previous ones', function () {
        let path = 'test/path/to/css/single';
        let mockData = {heres: 'my data'};
        let resp = {json: sinon.stub().returns(mockData), body: true};
        window.fetch.returns(Promise.resolve(resp));
        let options = {opts: 'same', cache: false};
        let fetchCallCount = 0;
        return ResourceManager.fetchData(path, options).then(function (data) {
            fetchCallCount++;
            return ResourceManager.fetchData(path, options).then(function (data) {
                fetchCallCount++;
                assert.equal(window.fetch.callCount, fetchCallCount);
                ResourceManager.flush();
            });
        });
    });

    it('passing no parameters to fetch data will not make an fetch call and resolve promise immediately', function () {
        let path = 'test/path/to/css/single';
        window.fetch.returns(Promise.resolve());
        return ResourceManager.fetchData().then(function () {
            assert.equal(window.fetch.callCount, 0, 'fetch was NOT called');
            ResourceManager.flush();
        });
    });

    it('calling fetchData() for a second time with the same options as previous after the first failure should perform an fetch request again', function () {
        let path = 'test/path/to/css/single';
        window.fetch.returns(Promise.reject());
        let options = {opts: 'same'};
        return ResourceManager.fetchData(path, options).catch(function () {
            assert.equal(window.fetch.callCount, 1, 'fetch was called');
            return ResourceManager.fetchData(path, options).catch(function () {
                assert.equal(window.fetch.callCount, 2, 'fetch was called again after first request failed');
                ResourceManager.flush();
            });
        });
    });

    it('making a consecutive script request before previous one finishes loads correctly', function () {
        let firstPath = 'path/to/my/first/file.js';
        let secondPath = 'path/to/my/second/file.js';
        let head = document.getElementsByTagName('head')[0];
        let firstScriptEl = document.createElement('script');
        let secondScriptEl = document.createElement('script');
        let createScriptElementStub = sinon.stub(ResourceManager, 'createScriptElement');
        createScriptElementStub.onFirstCall().returns(firstScriptEl);
        createScriptElementStub.onSecondCall().returns(secondScriptEl);
        ResourceManager.loadScript(firstPath);
        ResourceManager.loadScript(secondPath);
        assert.equal(head.querySelectorAll('script[src="' + firstPath + '"]').length, 1, 'on first loadScript() call, first file gets added to the head of the document once');
        assert.equal(head.querySelectorAll('script[src="' + secondPath + '"]').length, 1, 'second file gets added to the head of the document once');
        ResourceManager.flush();
        createScriptElementStub.restore();
    });

    it('should reject fetchData() when there is an request failure', function () {
        let path = 'test/path/to/css/single';
        let errorObj = {my: 'error'};
        window.fetch.returns(Promise.reject(errorObj));
        let options = {opts: 'same'};
        return ResourceManager.fetchData(path, options)
            .catch(function (e) {
                assert.deepEqual(e, errorObj);
                ResourceManager.flush();
            });
    });

    it('should inject handlebar file contents into element with updated data', function () {
        let path = 'my.hbs';
        let testEl = document.createElement('div');
        let hbsFileContents = '<div>{{myData}}</div>';
        let serverResp = {text: sinon.stub().returns(Promise.resolve(hbsFileContents))};
        window.fetch.returns(Promise.resolve(serverResp));
        let hbsData = {myData: 'blah'};
        return ResourceManager.loadTemplate(path, testEl, hbsData).then(function () {
            assert.equal(testEl.innerHTML, '<div>blah</div>');
            ResourceManager.flush();
        });
    });

    it('should inject handlebar file contents into element the same way they appear in the original hbs file', function () {
        let testEl = document.createElement('div');
        let templateContents = '<div class="my-template-html"></div><div class="my-second-template-html"></div>';
        let serverResp = {text: sinon.stub().returns(Promise.resolve(templateContents))};
        window.fetch.returns(Promise.resolve(serverResp));
        let hbsData = {myData: 'blah'};
        return ResourceManager.loadTemplate('my.hbs', testEl).then(function () {
            assert.equal(testEl.innerHTML, templateContents);
            ResourceManager.flush();
        });
    });

    it('fetchTemplate() should make fetch request with correct options and return proper text response', function () {
        var path = 'test/path/to/css/single';
        var templateHtml = '<div>mytext</div>';
        var serverResp = {text: sinon.stub().returns(Promise.resolve(templateHtml))};
        window.fetch.returns(Promise.resolve(serverResp));
        return ResourceManager.fetchTemplate(path).then(function (html) {
            assert.equal(window.fetch.args[0][0], path);
            assert.equal(html, templateHtml);
            ResourceManager.flush();
        });
    });
});
