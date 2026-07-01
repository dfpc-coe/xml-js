import { describe, it } from 'node:test';
import { expect } from './expect.js';
import * as helper from '../lib/options-helper.js';

describe('Testing options.js:', function () {

  describe('Helpers:', function () {

    describe('Copy options:', function () {

      it('Copy unprovided options', function () {
        expect(helper.copyOptions()).toEqual({});
      });

      it('Copy provided options', function () {
        const options = {ignoreText: true, textKey: true};
        expect(helper.copyOptions(options)).toEqual(options);
      });

    });

    describe('Ensure flag existance:', function () {

      it('New flag', function () {
        const options = {};
        helper.ensureFlagExists('foo', options);
        expect(options).toEqual({foo: false});
      });

      it('Existing flag, not boolean', function () {
        const options = {foo: 123};
        helper.ensureFlagExists('foo', options);
        expect(options).toEqual({foo: false});
      });

      it('Existing flag', function () {
        const options = {foo: true};
        helper.ensureFlagExists('foo', options);
        expect(options).toEqual({foo: true});
      });

    });

    describe('Ensure key existance:', function () {

      it('New key', function () {
        const options = {};
        helper.ensureKeyExists('foo', options);
        expect(options).toEqual({fooKey: 'foo'});
      });

      it('Existing key, not string', function () {
        const options = {fooKey: 123};
        helper.ensureKeyExists('foo', options);
        expect(options).toEqual({fooKey: 'foo'});
      });

      it('Existing key, string', function () {
        const options = {fooKey: 'baa'};
        helper.ensureKeyExists('foo', options);
        expect(options).toEqual({fooKey: 'baa'});
      });

    });

  });

});
