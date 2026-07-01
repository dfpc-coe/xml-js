import { isArray } from './array-helper.js';
import type { InternalOptions } from './types.js';

export function copyOptions(options: InternalOptions | undefined): InternalOptions {
    let key;
    const copy: InternalOptions = {};
    if (options) {
        for (key in options) {
            if (Object.prototype.hasOwnProperty.call(options, key)) {
                copy[key] = options[key];
            }
        }
    }
    return copy;
}

export function ensureFlagExists(item: string, options: InternalOptions): void {
    if (!(item in options) || typeof options[item] !== 'boolean') {
        options[item] = false;
    }
}

export function ensureSpacesExists(options: InternalOptions): void {
    if (!('spaces' in options) || (typeof options.spaces !== 'number' && typeof options.spaces !== 'string')) {
        options.spaces = 0;
    }
}

export function ensureAlwaysArrayExists(options: InternalOptions): void {
    if (!('alwaysArray' in options) || (typeof options.alwaysArray !== 'boolean' && !isArray(options.alwaysArray))) {
        options.alwaysArray = false;
    }
}

export function ensureKeyExists(key: string, options: InternalOptions): void {
    if (!(key + 'Key' in options) || typeof options[key + 'Key'] !== 'string') {
        options[key + 'Key'] = options.compact ? '_' + key : key;
    }
}

export function checkFnExists(key: string, options: InternalOptions): boolean {
    return key + 'Fn' in options;
}
