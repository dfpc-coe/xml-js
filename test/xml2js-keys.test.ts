import { describe, it } from 'node:test';
import { expect } from './expect.js';
import * as convert from '../index.js';
import testItems from './test-items.js';

describe('Testing xml2js.js:', function () {

  describe('Changing default key names, options = {compact: false}', function () {

    describe('Changing options.declarationKey', function () {

      const options = {compact: false, declarationKey: 'declaration'.slice(0,3)};
      testItems('xml2js', options).forEach(function (test) {
        it(test.desc, function () {
          expect(convert.xml2js(test.xml, options)).toEqual(test.js);
        });
      });

    });

    describe('Changing options.instructionKey', function () {

      const options = {compact: false, instructionKey: 'instruction'.slice(0,3)};
      testItems('xml2js', options).forEach(function (test) {
        it(test.desc, function () {
          expect(convert.xml2js(test.xml, options)).toEqual(test.js);
        });
      });

    });

    describe('Changing options.attributesKey', function () {

      const options = {compact: false, attributesKey: 'attributes'.slice(0,3)};
      testItems('xml2js', options).forEach(function (test) {
        it(test.desc, function () {
          expect(convert.xml2js(test.xml, options)).toEqual(test.js);
        });
      });

    });

    describe('Changing options.textKey', function () {

      const options = {compact: false, textKey: 'text'.slice(0,3)};
      testItems('xml2js', options).forEach(function (test) {
        it(test.desc, function () {
          expect(convert.xml2js(test.xml, options)).toEqual(test.js);
        });
      });

    });

    describe('Changing options.cdataKey', function () {

      const options = {compact: false, cdataKey: 'cdata'.slice(0,3)};
      testItems('xml2js', options).forEach(function (test) {
        it(test.desc, function () {
          expect(convert.xml2js(test.xml, options)).toEqual(test.js);
        });
      });

    });

    describe('Changing options.doctypeKey', function () {

      const options = {compact: false, doctypeKey: 'doctype'.slice(0,3)};
      testItems('xml2js', options).forEach(function (test) {
        it(test.desc, function () {
          expect(convert.xml2js(test.xml, options)).toEqual(test.js);
        });
      });

    });

    describe('Changing options.commentKey', function () {

      const options = {compact: false, commentKey: 'comment'.slice(0,3)};
      testItems('xml2js', options).forEach(function (test) {
        it(test.desc, function () {
          expect(convert.xml2js(test.xml, options)).toEqual(test.js);
        });
      });

    });

    describe('Changing options.parentKey', function () {

      const options = {compact: false, parentKey: 'parent'.slice(0,3)};
      testItems('xml2js', options).forEach(function (test) {
        it(test.desc, function () {
          expect(convert.xml2js(test.xml, options)).toEqual(test.js);
        });
      });

    });

    describe('Changing options.typeKey', function () {

      const options = {compact: false, typeKey: 'type'.slice(0,3)};
      testItems('xml2js', options).forEach(function (test) {
        it(test.desc, function () {
          expect(convert.xml2js(test.xml, options)).toEqual(test.js);
        });
      });

    });

    describe('Changing options.nameKey', function () {

      const options = {compact: false, nameKey: 'name'.slice(0,3)};
      testItems('xml2js', options).forEach(function (test) {
        it(test.desc, function () {
          expect(convert.xml2js(test.xml, options)).toEqual(test.js);
        });
      });

    });

    describe('Changing options.elementsKey', function () {

      const options = {compact: false, elementsKey: 'elements'.slice(0,3)};
      testItems('xml2js', options).forEach(function (test) {
        it(test.desc, function () {
          expect(convert.xml2js(test.xml, options)).toEqual(test.js);
        });
      });

    });

  });

  describe('Changing default key names, options = {compact: true}', function () {

    describe('Changing options.declarationKey', function () {

      const options = {compact: true, declarationKey: 'declaration'.slice(0,3)};
      testItems('xml2js', options).forEach(function (test) {
        it(test.desc, function () {
          expect(convert.xml2js(test.xml, options)).toEqual(test.js);
        });
      });

    });

    describe('Changing options.instructionKey', function () {

      const options = {compact: true, instructionKey: 'instruction'.slice(0,3)};
      testItems('xml2js', options).forEach(function (test) {
        it(test.desc, function () {
          expect(convert.xml2js(test.xml, options)).toEqual(test.js);
        });
      });

    });

    describe('Changing options.attributesKey', function () {

      const options = {compact: true, attributesKey: 'attributes'.slice(0,3)};
      testItems('xml2js', options).forEach(function (test) {
        it(test.desc, function () {
          expect(convert.xml2js(test.xml, options)).toEqual(test.js);
        });
      });

    });

    describe('Changing options.textKey', function () {

      const options = {compact: true, textKey: 'text'.slice(0,3)};
      testItems('xml2js', options).forEach(function (test) {
        it(test.desc, function () {
          expect(convert.xml2js(test.xml, options)).toEqual(test.js);
        });
      });

    });

    describe('Changing options.cdataKey', function () {

      const options = {compact: true, cdataKey: 'cdata'.slice(0,3)};
      testItems('xml2js', options).forEach(function (test) {
        it(test.desc, function () {
          expect(convert.xml2js(test.xml, options)).toEqual(test.js);
        });
      });

    });

    describe('Changing options.doctypeKey', function () {

      const options = {compact: true, doctypeKey: 'doctype'.slice(0,3)};
      testItems('xml2js', options).forEach(function (test) {
        it(test.desc, function () {
          expect(convert.xml2js(test.xml, options)).toEqual(test.js);
        });
      });

    });

    describe('Changing options.commentKey', function () {

      const options = {compact: true, commentKey: 'comment'.slice(0,3)};
      testItems('xml2js', options).forEach(function (test) {
        it(test.desc, function () {
          expect(convert.xml2js(test.xml, options)).toEqual(test.js);
        });
      });

    });

    describe('Changing options.parentKey', function () {

      const options = {compact: true, parentKey: 'parent'.slice(0,3)};
      testItems('xml2js', options).forEach(function (test) {
        it(test.desc, function () {
          expect(convert.xml2js(test.xml, options)).toEqual(test.js);
        });
      });

    });

    describe('Changing options.typeKey', function () {

      const options = {compact: true, typeKey: 'type'.slice(0,3)};
      testItems('xml2js', options).forEach(function (test) {
        it(test.desc, function () {
          expect(convert.xml2js(test.xml, options)).toEqual(test.js);
        });
      });

    });

    describe('Changing options.nameKey', function () {

      const options = {compact: true, nameKey: 'name'.slice(0,3)};
      testItems('xml2js', options).forEach(function (test) {
        it(test.desc, function () {
          expect(convert.xml2js(test.xml, options)).toEqual(test.js);
        });
      });

    });

    describe('Changing options.elementsKey', function () {

      const options = {compact: true, elementsKey: 'elements'.slice(0,3)};
      testItems('xml2js', options).forEach(function (test) {
        it(test.desc, function () {
          expect(convert.xml2js(test.xml, options)).toEqual(test.js);
        });
      });

    });

  });

});
