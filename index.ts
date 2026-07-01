export { default as xml2js } from './lib/xml2js.js';
export { default as xml2json } from './lib/xml2json.js';
export { default as js2xml } from './lib/js2xml.js';
export { default as json2xml } from './lib/json2xml.js';

export type { Attributes, DeclarationAttributes, Element, ElementCompact } from './lib/types.js';

import xml2js from './lib/xml2js.js';
import xml2json from './lib/xml2json.js';
import js2xml from './lib/js2xml.js';
import json2xml from './lib/json2xml.js';

export default {
    xml2js,
    xml2json,
    js2xml,
    json2xml,
};
