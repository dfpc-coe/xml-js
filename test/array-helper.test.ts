import { describe, it, beforeEach, afterEach } from 'node:test';
import { expect } from './expect.js';
import * as helper from '../lib/array-helper.js';

describe('Testing array-helper.js:', function () {

  describe('Helpers:', function () {

    describe('isArray:', function () {

      let nativeIsArray;
      beforeEach(function () {
        nativeIsArray = Array.isArray;
      });

      afterEach(function () {
        Array.isArray = nativeIsArray;
      });

      it('Returns true for an array', function () {
        expect(helper.isArray([])).toBe(true);
        expect(helper.isArray(['one', 'two', 'three'])).toBe(true);
      });

      it('Returns false for none array values', function () {
        expect(helper.isArray({})).toBe(false);
        expect(helper.isArray('[]')).toBe(false);
      });

      it('Returns false for undefined values', function () {
        expect(helper.isArray(undefined)).toBe(false);
        expect(helper.isArray(null)).toBe(false);
      });

      it('Use fallback when isArray is not defined', function () {
        Array.isArray = undefined;
        
        expect(helper.isArray(['one', 'two', 'three'])).toBe(true);
        expect(helper.isArray({})).toBe(false);
      });

    });

  });

});
