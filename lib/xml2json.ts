import * as helper from './options-helper.js';
import xml2js from './xml2js.js';
import type { InternalOptions, Options } from './types.js';

function validateOptions(userOptions: Options.XML2JSON | undefined): InternalOptions {
    const options = helper.copyOptions(userOptions as InternalOptions);
    helper.ensureSpacesExists(options);
    return options;
}

export default function xml2json(xml: string, userOptions?: Options.XML2JSON): string {
    const options = validateOptions(userOptions);
    const js = xml2js(xml, options as Options.XML2JS);
    const parentKey = 'compact' in options && options.compact ? '_parent' : 'parent';
    // parentKey = ptions.compact ? '_parent' : 'parent'; // consider this
    let json;
    if ('addParent' in options && options.addParent) {
        json = JSON.stringify(js, function (k, v) { return k === parentKey ? '_' : v; }, options.spaces);
    } else {
        json = JSON.stringify(js, null, options.spaces);
    }
    return json.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}
