import sinon from 'sinon';
import { html, style, script  } from '../src/import';
import chai from 'chai';
const { assert } = chai;

describe('import', function () {
    let origWindowFetch;

    beforeEach(function () {
        origWindowFetch = window.fetch;
        window.fetch = sinon.stub();
    });

    afterEach(function () {
        window.fetch = origWindowFetch;
    });

    describe('style', function() {
        it('should load and unload multiple css files', function () {
            let cssPaths = ['test/path/to/css/one', 'test/path/to/second/css'];
            return style.import(cssPaths).then(function () {
                let head = document.getElementsByTagName('head')[0];
                assert.equal(head.querySelectorAll('link[href="' + cssPaths[0] + '"]').length, 1, 'calling loadCss() with new css files loads first css path in the head of the document');
                assert.equal(head.querySelectorAll('link[href="' + cssPaths[1] + '"]').length, 1, 'second css path was loaded into the head of the document');
                return style.unload(cssPaths).then(function (){
                    assert.equal(head.querySelectorAll('link[href="' + cssPaths[0] + '"]').length, 0, 'calling unloadCss() removes first css path from the head of the document');
                    assert.equal(head.querySelectorAll('link[href="' + cssPaths[1] + '"]').length, 0, 'second css path is removed from the head of the document');
                });
            });
        });

        it('should add and remove css file from DOM appropriately', function () {
            let path = 'test/path/to/css/single.css';
            return style.import(path).then(function () {
                let head = document.getElementsByTagName('head')[0];
                assert.equal(head.querySelectorAll('link[href="' + path + '"]').length, 1, 'calling loadCss(), adds css in the head of the document');
                return style.unload(path).then(function () {
                    assert.equal(head.querySelectorAll('link[href="' + path + '"]').length, 0, 'calling unloadCss() removes css from head of document');
                });
            });
        });

        it('should NOT import css files that have already been imported', function () {
            let cssPaths = ['test/path/to/css/one', 'test/path/to/second/css'];
            let head = document.getElementsByTagName('head')[0];
            return style.import(cssPaths).then(function () {
                assert.equal(head.querySelectorAll('link[href="' + cssPaths[0] + '"]').length, 1, 'on first loadCss() call, first file gets added to the head of the document once');
                assert.equal(head.querySelectorAll('link[href="' + cssPaths[1] + '"]').length, 1, 'second file gets added to the head of the document once');
                let newPath = 'test/new/third/file';
                cssPaths.push(newPath); // add new path
                return style.import(cssPaths).then(function () {
                    assert.equal(head.querySelectorAll('link[href="' + cssPaths[0] + '"]').length, 1, 'on second loadCss() call, first file does NOT get added to the head of the document a second time');
                    assert.equal(head.querySelectorAll('link[href="' + cssPaths[1] + '"]').length, 1, 'second file does NOT get added to the head of the document a second time');
                    assert.equal(head.querySelectorAll('link[href="' + newPath + '"]').length, 1, 'third file gets added to the head of the document because it was the only one of the files that hasnt been added yet');
                });
            });
        });

        it('does not crash when nothing is passed to style import', function () {
            return style.import().then(function () {
                assert.ok(true, 'no crash');
            });
        });
    });

    describe('script', function() {

        it('should inject a javascript file correctly into the DOM when imported and remove when unloaded', function () {
            let path = 'path/to/my.js';
            let head = document.getElementsByTagName('head')[0];
            let scriptEl = document.createElement('script');
            let createScriptElementStub = sinon.stub(document, 'createElement').returns(scriptEl);
            sinon.stub(scriptEl, 'addEventListener').callsArg(1);
            return script.import(path).then(function () {
                assert.equal(head.querySelectorAll('script[src="' + path + '"]').length, 1, 'on first loadScript() call, file gets added to the head of the document once');
                return script.import(path).then(function () {
                    assert.equal(head.querySelectorAll('script[src="' + path + '"]').length, 1, 'attempting to call loadScript() with the same path does not add it to the document a second time');
                    return script.unload(path).then(function () {
                        assert.equal(head.querySelectorAll('script[src="' + path + '"]').length, 0, 'calling unloadScript() removes the path from the document head');
                        createScriptElementStub.restore();
                    });
                });
            });
        });

        it('should inject multiple javascript files into the DOM when imported via same load call', function () {
            let paths = ['path/to/my/first/file.js', 'path/to/my/second/file.js'];
            let head = document.getElementsByTagName('head')[0];
            let firstScriptEl = document.createElement('script');
            let secondScriptEl = document.createElement('script');
            let createScriptElementStub = sinon.stub(document, 'createElement');
            createScriptElementStub.onFirstCall().returns(firstScriptEl);
            createScriptElementStub.onSecondCall().returns(secondScriptEl);
            sinon.stub(firstScriptEl, 'addEventListener').callsArg(1);
            sinon.stub(secondScriptEl, 'addEventListener').callsArg(1);
            return script.import(paths).then(function () {
                assert.equal(head.querySelectorAll('script[src="' + paths[0] + '"]').length, 1, 'on first loadScript() call, first file gets added to the head of the document once');
                assert.equal(head.querySelectorAll('script[src="' + paths[1] + '"]').length, 1, 'second file gets added to the head of the document once');
                return script.import(paths[1]).then(function () {
                    assert.equal(head.querySelectorAll('script[src="' + paths[0] + '"]').length, 1, 'attempting to call loadScript() for second file again does not add it to the document a second time');
                    return script.import(paths[0]).then(function () {
                        assert.equal(head.querySelectorAll('script[src="' + paths[1] + '"]').length, 1, 'attempting to call loadScript() for first file again does not add it to the document a second time');
                        return script.import(paths).then(function () {
                            assert.equal(head.querySelectorAll('script[src="' + paths[0] + '"]').length, 1, 'attempting to call loadScript() with an array of first and second files again does not add first file to the document a second time');
                            assert.equal(head.querySelectorAll('script[src="' + paths[1] + '"]').length, 1, 'second file was not added to the document a second time');
                            return script.unload(paths).then(function () {
                                assert.equal(head.querySelectorAll('script[src="' + paths[0] + '"]').length, 0, 'calling unloadScript() removes the first file from the document head');
                                assert.equal(head.querySelectorAll('script[src="' + paths[1] + '"]').length, 0, 'second file is removed from the document head');
                                createScriptElementStub.restore();
                            });
                        });
                    });
                });
            });
        });

        it('making a consecutive script request before previous one finishes loads correctly', function () {
            let firstPath = 'path/to/my/first/file.js';
            let secondPath = 'path/to/my/second/file.js';
            let head = document.getElementsByTagName('head')[0];
            let firstScriptEl = document.createElement('script');
            let secondScriptEl = document.createElement('script');
            let createScriptElementStub = sinon.stub(document, 'createElement');
            createScriptElementStub.onFirstCall().returns(firstScriptEl);
            createScriptElementStub.onSecondCall().returns(secondScriptEl);
            script.import(firstPath);
            script.import(secondPath);
            assert.equal(head.querySelectorAll('script[src="' + firstPath + '"]').length, 1, 'on first loadScript() call, first file gets added to the head of the document once');
            assert.equal(head.querySelectorAll('script[src="' + secondPath + '"]').length, 1, 'second file gets added to the head of the document once');
            createScriptElementStub.restore();
        });

    });

    describe('html', function() {
        it('should call fetch with proper arguments and return a document fragment that contains the element contents when no destination element is passed a second argument', function () {
            let path = 'test/path/to/css/single';
            let templateHtml = '<div>mytext</div>';
            let serverResp = {text: sinon.stub().returns(Promise.resolve(templateHtml))};
            window.fetch.returns(Promise.resolve(serverResp));
            return html.import(path).then(function (el) {
                let wrapper = document.createElement('section');
                assert.equal(window.fetch.args[0][0], path);
                wrapper.appendChild(el);
                assert.equal(wrapper.innerHTML, templateHtml);
            });
        });

        it('throws and error when nothing is passed to html import', async function () {
            try {
                await html.import();
                assert.ok(false);
            } catch (e) {
                assert.equal(e.message, 'No path provided to html.import()');
            }
        });

    });

});
