import js2xml from './js2xml.js';
import type { Element, ElementCompact, Options } from './types.js';

export default function json2xml(json: string, options?: Options.JS2XML): string {
    let input: any = json;
    if (input instanceof Buffer) {
        input = input.toString();
    }
    let js: Element | ElementCompact | null;
    if (typeof input === 'string') {
        try {
            js = JSON.parse(input);
        } catch {
            throw new Error('The JSON structure is invalid');
        }
    } else {
        js = input;
    }
    return js2xml(js as Element | ElementCompact, options);
}
