/**
 * Minimal Jasmine/Jest-compatible `expect` helper backing the ported test
 * suite when running under `node:test`. It implements exactly the matchers the
 * suite relies on (`toEqual`, `toBe`, `toContain`) with the same semantics the
 * original Jasmine/Jest runners provided:
 *
 *   - `toEqual`   recursive structural equality that ignores `undefined`
 *                 valued properties and treats `NaN` as equal to `NaN`.
 *   - `toBe`      strict (`===`) equality.
 *   - `toContain` deep-membership check of the first argument within an
 *                 array / array-like / string (matching Jest's `toContainEqual`
 *                 override that the original suite installed).
 */

function deepEqual(a: any, b: any, aStack: Array<any> = [], bStack: Array<any> = []): boolean {
    if (a === b) {
        return true;
    }
    if (typeof a === 'number' && typeof b === 'number') {
        // Only remaining number case is NaN, which is not === to itself.
        return a !== a && b !== b;
    }
    if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
        return false;
    }
    if (a instanceof Date || b instanceof Date) {
        return a instanceof Date && b instanceof Date && a.getTime() === b.getTime();
    }
    if (a instanceof RegExp || b instanceof RegExp) {
        return a instanceof RegExp && b instanceof RegExp && a.toString() === b.toString();
    }
    // Break circular references (e.g. the `addParent` option) the same way the
    // original Jasmine/Jest `toEqual` did: if we are already comparing `a` and
    // `b`, assume equality for this branch.
    let length = aStack.length;
    while (length--) {
        if (aStack[length] === a) {
            return bStack[length] === b;
        }
    }
    aStack.push(a);
    bStack.push(b);
    let result = true;
    const aIsArray = Array.isArray(a);
    const bIsArray = Array.isArray(b);
    if (aIsArray !== bIsArray) {
        result = false;
    } else if (aIsArray) {
        if (a.length !== b.length) {
            result = false;
        } else {
            for (let i = 0; i < a.length; i++) {
                if (!deepEqual(a[i], b[i], aStack, bStack)) {
                    result = false;
                    break;
                }
            }
        }
    } else {
        const aKeys = Object.keys(a).filter((k) => a[k] !== undefined);
        const bKeys = Object.keys(b).filter((k) => b[k] !== undefined);
        if (aKeys.length !== bKeys.length) {
            result = false;
        } else {
            for (const key of aKeys) {
                if (!Object.prototype.hasOwnProperty.call(b, key) || !deepEqual(a[key], b[key], aStack, bStack)) {
                    result = false;
                    break;
                }
            }
        }
    }
    aStack.pop();
    bStack.pop();
    return result;
}

function contains(collection: any, value: any): boolean {
    if (typeof collection === 'string') {
        return typeof value === 'string' && collection.indexOf(value) !== -1;
    }
    if (collection === null || typeof collection !== 'object') {
        return false;
    }
    const items = Array.from(collection as ArrayLike<any>);
    return items.some((item) => deepEqual(item, value));
}

function stringify(value: any): string {
    try {
        return JSON.stringify(value);
    } catch {
        return String(value);
    }
}

interface Matchers {
    toEqual(expected: any): void;
    toBe(expected: any): void;
    toContain(expected: any, ..._ignored: Array<any>): void;
}

interface Expectation extends Matchers {
    not: Matchers;
}

export function expect(actual: any): Expectation {
    return {
        toEqual(expected: any): void {
            if (!deepEqual(actual, expected)) {
                throw new Error('Expected ' + stringify(actual) + ' to equal ' + stringify(expected));
            }
        },
        toBe(expected: any): void {
            if (actual !== expected) {
                throw new Error('Expected ' + stringify(actual) + ' to be ' + stringify(expected));
            }
        },
        toContain(expected: any): void {
            if (!contains(actual, expected)) {
                throw new Error('Expected ' + stringify(actual) + ' to contain ' + stringify(expected));
            }
        },
        not: {
            toEqual(expected: any): void {
                if (deepEqual(actual, expected)) {
                    throw new Error('Expected ' + stringify(actual) + ' not to equal ' + stringify(expected));
                }
            },
            toBe(expected: any): void {
                if (actual === expected) {
                    throw new Error('Expected ' + stringify(actual) + ' not to be ' + stringify(expected));
                }
            },
            toContain(expected: any): void {
                if (contains(actual, expected)) {
                    throw new Error('Expected ' + stringify(actual) + ' not to contain ' + stringify(expected));
                }
            }
        }
    };
}
