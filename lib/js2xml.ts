import * as helper from './options-helper.js';
import { isArray } from './array-helper.js';
import type { Element, ElementCompact, InternalOptions, Options } from './types.js';

let currentElement: any;
let currentElementName: any;

function validateOptions(userOptions: Options.JS2XML | undefined): InternalOptions {
    const options = helper.copyOptions(userOptions as InternalOptions);
    helper.ensureFlagExists('ignoreDeclaration', options);
    helper.ensureFlagExists('ignoreInstruction', options);
    helper.ensureFlagExists('ignoreAttributes', options);
    helper.ensureFlagExists('ignoreText', options);
    helper.ensureFlagExists('ignoreComment', options);
    helper.ensureFlagExists('ignoreCdata', options);
    helper.ensureFlagExists('ignoreDoctype', options);
    helper.ensureFlagExists('compact', options);
    helper.ensureFlagExists('indentText', options);
    helper.ensureFlagExists('indentCdata', options);
    helper.ensureFlagExists('indentAttributes', options);
    helper.ensureFlagExists('indentInstruction', options);
    helper.ensureFlagExists('fullTagEmptyElement', options);
    helper.ensureFlagExists('noQuotesForNativeAttributes', options);
    helper.ensureSpacesExists(options);
    if (typeof options.spaces === 'number') {
        options.spaces = Array(options.spaces + 1).join(' ');
    }
    helper.ensureKeyExists('declaration', options);
    helper.ensureKeyExists('instruction', options);
    helper.ensureKeyExists('attributes', options);
    helper.ensureKeyExists('text', options);
    helper.ensureKeyExists('comment', options);
    helper.ensureKeyExists('cdata', options);
    helper.ensureKeyExists('doctype', options);
    helper.ensureKeyExists('type', options);
    helper.ensureKeyExists('name', options);
    helper.ensureKeyExists('elements', options);
    helper.checkFnExists('doctype', options);
    helper.checkFnExists('instruction', options);
    helper.checkFnExists('cdata', options);
    helper.checkFnExists('comment', options);
    helper.checkFnExists('text', options);
    helper.checkFnExists('instructionName', options);
    helper.checkFnExists('elementName', options);
    helper.checkFnExists('attributeName', options);
    helper.checkFnExists('attributeValue', options);
    helper.checkFnExists('attributes', options);
    helper.checkFnExists('fullTagEmptyElement', options);
    return options;
}

function writeIndentation(options: InternalOptions, depth: number, firstLine?: boolean): string {
    return (!firstLine && options.spaces ? '\n' : '') + Array(depth + 1).join(options.spaces);
}

function writeAttributes(attributes: any, options: InternalOptions, depth: number): string {
    if (options.ignoreAttributes) {
        return '';
    }
    if ('attributesFn' in options) {
        attributes = options.attributesFn(attributes, currentElementName, currentElement);
    }
    let key, attr, attrName, quote;
    const result: Array<string> = [];
    for (key in attributes) {
        if (Object.prototype.hasOwnProperty.call(attributes, key) && attributes[key] !== null && attributes[key] !== undefined) {
            quote = options.noQuotesForNativeAttributes && typeof attributes[key] !== 'string' ? '' : '"';
            attr = '' + attributes[key]; // ensure number and boolean are converted to String
            attr = attr.replace(/"/g, '&quot;');
            attrName = 'attributeNameFn' in options ? options.attributeNameFn(key, attr, currentElementName, currentElement) : key;
            result.push((options.spaces && options.indentAttributes ? writeIndentation(options, depth + 1, false) : ' '));
            result.push(attrName + '=' + quote + ('attributeValueFn' in options ? options.attributeValueFn(attr, key, currentElementName, currentElement) : attr) + quote);
        }
    }
    if (attributes && Object.keys(attributes).length && options.spaces && options.indentAttributes) {
        result.push(writeIndentation(options, depth, false));
    }
    return result.join('');
}

function writeDeclaration(declaration: any, options: InternalOptions, depth: number): string {
    currentElement = declaration;
    currentElementName = 'xml';
    return options.ignoreDeclaration ? '' : '<?' + 'xml' + writeAttributes(declaration[options.attributesKey], options, depth) + '?>';
}

function writeInstruction(instruction: any, options: InternalOptions, depth: number): string {
    if (options.ignoreInstruction) {
        return '';
    }
    let key: any;
    for (key in instruction) {
        if (Object.prototype.hasOwnProperty.call(instruction, key)) {
            break;
        }
    }
    const instructionName = 'instructionNameFn' in options ? options.instructionNameFn(key, instruction[key], currentElementName, currentElement) : key;
    if (typeof instruction[key] === 'object') {
        currentElement = instruction;
        currentElementName = instructionName;
        return '<?' + instructionName + writeAttributes(instruction[key][options.attributesKey], options, depth) + '?>';
    } else {
        let instructionValue = instruction[key] ? instruction[key] : '';
        if ('instructionFn' in options) instructionValue = options.instructionFn(instructionValue, key, currentElementName, currentElement);
        return '<?' + instructionName + (instructionValue ? ' ' + instructionValue : '') + '?>';
    }
}

function writeComment(comment: any, options: InternalOptions): string {
    return options.ignoreComment ? '' : '<!--' + ('commentFn' in options ? options.commentFn(comment, currentElementName, currentElement) : comment) + '-->';
}

function writeCdata(cdata: any, options: InternalOptions): string {
    return options.ignoreCdata ? '' : '<![CDATA[' + ('cdataFn' in options ? options.cdataFn(cdata, currentElementName, currentElement) : cdata.replace(']]>', ']]]]><![CDATA[>')) + ']]>';
}

function writeDoctype(doctype: any, options: InternalOptions): string {
    return options.ignoreDoctype ? '' : '<!DOCTYPE ' + ('doctypeFn' in options ? options.doctypeFn(doctype, currentElementName, currentElement) : doctype) + '>';
}

function writeText(text: any, options: InternalOptions): string {
    if (options.ignoreText) return '';
    text = '' + text; // ensure Number and Boolean are converted to String
    text = text.replace(/&amp;/g, '&'); // desanitize to avoid double sanitization
    text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return 'textFn' in options ? options.textFn(text, currentElementName, currentElement) : text;
}

function hasContent(element: any, options: InternalOptions): boolean {
    let i;
    if (element.elements && element.elements.length) {
        for (i = 0; i < element.elements.length; ++i) {
            switch (element.elements[i][options.typeKey]) {
            case 'text':
                if (options.indentText) {
                    return true;
                }
                break; // skip to next key
            case 'cdata':
                if (options.indentCdata) {
                    return true;
                }
                break; // skip to next key
            case 'instruction':
                if (options.indentInstruction) {
                    return true;
                }
                break; // skip to next key
            case 'doctype':
            case 'comment':
            case 'element':
                return true;
            default:
                return true;
            }
        }
    }
    return false;
}

function writeElement(element: any, options: InternalOptions, depth: number): string {
    currentElement = element;
    currentElementName = element.name;
    const xml: Array<string> = [];
    const elementName = 'elementNameFn' in options ? options.elementNameFn(element.name, element) : element.name;
    xml.push('<' + elementName);
    if (element[options.attributesKey]) {
        xml.push(writeAttributes(element[options.attributesKey], options, depth));
    }
    let withClosingTag = element[options.elementsKey] && element[options.elementsKey].length || element[options.attributesKey] && element[options.attributesKey]['xml:space'] === 'preserve';
    if (!withClosingTag) {
        if ('fullTagEmptyElementFn' in options) {
            withClosingTag = options.fullTagEmptyElementFn(element.name, element);
        } else {
            withClosingTag = options.fullTagEmptyElement;
        }
    }
    if (withClosingTag) {
        xml.push('>');
        if (element[options.elementsKey] && element[options.elementsKey].length) {
            xml.push(writeElements(element[options.elementsKey], options, depth + 1));
            currentElement = element;
            currentElementName = element.name;
        }
        xml.push(options.spaces && hasContent(element, options) ? '\n' + Array(depth + 1).join(options.spaces) : '');
        xml.push('</' + elementName + '>');
    } else {
        xml.push('/>');
    }
    return xml.join('');
}

function writeElements(elements: any, options: InternalOptions, depth: number, firstLine?: boolean): string {
    return elements.reduce(function (xml: string, element: any) {
        const indent = writeIndentation(options, depth, firstLine && !xml);
        switch (element.type) {
        case 'element': return xml + indent + writeElement(element, options, depth);
        case 'comment': return xml + indent + writeComment(element[options.commentKey], options);
        case 'doctype': return xml + indent + writeDoctype(element[options.doctypeKey], options);
        case 'cdata': return xml + (options.indentCdata ? indent : '') + writeCdata(element[options.cdataKey], options);
        case 'text': return xml + (options.indentText ? indent : '') + writeText(element[options.textKey], options);
        case 'instruction': {
            const instruction: any = {};
            instruction[element[options.nameKey]] = element[options.attributesKey] ? element : element[options.instructionKey];
            return xml + (options.indentInstruction ? indent : '') + writeInstruction(instruction, options, depth);
        }
        }
    }, '');
}

function hasContentCompact(element: any, options: InternalOptions, anyContent?: boolean): boolean {
    let key;
    for (key in element) {
        if (Object.prototype.hasOwnProperty.call(element, key)) {
            switch (key) {
            case options.parentKey:
            case options.attributesKey:
                break; // skip to next key
            case options.textKey:
                if (options.indentText || anyContent) {
                    return true;
                }
                break; // skip to next key
            case options.cdataKey:
                if (options.indentCdata || anyContent) {
                    return true;
                }
                break; // skip to next key
            case options.instructionKey:
                if (options.indentInstruction || anyContent) {
                    return true;
                }
                break; // skip to next key
            case options.doctypeKey:
            case options.commentKey:
                return true;
            default:
                return true;
            }
        }
    }
    return false;
}

function writeElementCompact(element: any, name: any, options: InternalOptions, depth: number, indent?: boolean): string {
    currentElement = element;
    currentElementName = name;
    const elementName = 'elementNameFn' in options ? options.elementNameFn(name, element) : name;
    if (typeof element === 'undefined' || element === null || element === '') {
        return 'fullTagEmptyElementFn' in options && options.fullTagEmptyElementFn(name, element) || options.fullTagEmptyElement ? '<' + elementName + '></' + elementName + '>' : '<' + elementName + '/>';
    }
    const xml: Array<string> = [];
    if (name) {
        xml.push('<' + elementName);
        if (typeof element !== 'object') {
            xml.push('>' + writeText(element, options) + '</' + elementName + '>');
            return xml.join('');
        }
        if (element[options.attributesKey]) {
            xml.push(writeAttributes(element[options.attributesKey], options, depth));
        }
        let withClosingTag = hasContentCompact(element, options, true) || element[options.attributesKey] && element[options.attributesKey]['xml:space'] === 'preserve';
        if (!withClosingTag) {
            if ('fullTagEmptyElementFn' in options) {
                withClosingTag = options.fullTagEmptyElementFn(name, element);
            } else {
                withClosingTag = options.fullTagEmptyElement;
            }
        }
        if (withClosingTag) {
            xml.push('>');
        } else {
            xml.push('/>');
            return xml.join('');
        }
    }
    xml.push(writeElementsCompact(element, options, depth + 1, false));
    currentElement = element;
    currentElementName = name;
    if (name) {
        xml.push((indent ? writeIndentation(options, depth, false) : '') + '</' + elementName + '>');
    }
    return xml.join('');
}

function writeElementsCompact(element: any, options: InternalOptions, depth: number, firstLine?: boolean): string {
    let i, key, nodes;
    const xml: Array<string> = [];
    for (key in element) {
        if (Object.prototype.hasOwnProperty.call(element, key)) {
            nodes = isArray(element[key]) ? element[key] : [element[key]];
            for (i = 0; i < nodes.length; ++i) {
                switch (key) {
                case options.declarationKey: xml.push(writeDeclaration(nodes[i], options, depth)); break;
                case options.instructionKey: xml.push((options.indentInstruction ? writeIndentation(options, depth, firstLine) : '') + writeInstruction(nodes[i], options, depth)); break;
                case options.attributesKey: case options.parentKey: break; // skip
                case options.textKey: xml.push((options.indentText ? writeIndentation(options, depth, firstLine) : '') + writeText(nodes[i], options)); break;
                case options.cdataKey: xml.push((options.indentCdata ? writeIndentation(options, depth, firstLine) : '') + writeCdata(nodes[i], options)); break;
                case options.doctypeKey: xml.push(writeIndentation(options, depth, firstLine) + writeDoctype(nodes[i], options)); break;
                case options.commentKey: xml.push(writeIndentation(options, depth, firstLine) + writeComment(nodes[i], options)); break;
                default: xml.push(writeIndentation(options, depth, firstLine) + writeElementCompact(nodes[i], key, options, depth, hasContentCompact(nodes[i], options)));
                }
                firstLine = firstLine && !xml.length;
            }
        }
    }
    return xml.join('');
}

export default function js2xml(js: Element | ElementCompact, userOptions?: Options.JS2XML): string {
    const options = validateOptions(userOptions);
    const xml: Array<string> = [];
    currentElement = js;
    currentElementName = '_root_';
    if (options.compact) {
        xml.push(writeElementsCompact(js, options, 0, true));
    } else {
        if ((js as any)[options.declarationKey]) {
            xml.push(writeDeclaration((js as any)[options.declarationKey], options, 0));
        }
        if ((js as any)[options.elementsKey] && (js as any)[options.elementsKey].length) {
            xml.push(writeElements((js as any)[options.elementsKey], options, 0, !xml.length));
        }
    }
    return xml.join('');
}
