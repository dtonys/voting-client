import jsdom from 'jsdom';
import chai from 'chai';
import chaiImmutable from 'chai-immutable';

let doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
let win = doc.defaultView;

global.document = doc;
global.window = win;

Object.keys(window).forEach((key) => {
  if (!(key in global)) {
    global[key] = window[key];
  }
});

chai.use(chaiImmutable);
