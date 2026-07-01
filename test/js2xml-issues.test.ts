import { describe, it } from 'node:test';
import { expect } from './expect.js';
import { Script } from 'node:vm';
import * as convert from '../index.js';

describe('Testing js2xml.js:', function () {

  describe('User reported issues:', function () {

    describe('case by Jan T. Sott', function () {
      // see https://github.com/nashwaan/xml-js/issues/2
      const js = {
        _comment: ' Released under The MIT License ',
        snippet: {
          content: {
            _cdata: 'console.log($1)'
          },
          tabTrigger: {
            _text: 'log'
          },
          scope: {
            _text: 'source.js'
          }
        }
      };
      const xml =
        '<!-- Released under The MIT License -->\n' +
        '<snippet>\n' +
        '\v<content><![CDATA[console.log($1)]]></content>\n' +
        '\v<tabTrigger>log</tabTrigger>\n' +
        '\v<scope>source.js</scope>\n' +
        '</snippet>';

      it('should output cdata and text unformatted', function () {
        expect(convert.js2xml(js, {compact: true})).toEqual(xml.replace(/\v|\n/g, ''));
      });

      it('should output cdata and text formatted', function () {
        expect(convert.js2xml(js, {compact: true, spaces: 4})).toEqual(xml.replace(/\v/g, '    '));
      });

    });

    describe('case 1 by Denis Carriere ', function () {
      // see https://github.com/nashwaan/xml-js/issues/5
      const js1 = {
        a: {
          b: {
            _text: 'foo bar'
          }
        }
      };
      const js2 = {
        elements: [{
          type: 'element',
          name: 'a',
          elements: [{
            type: 'element',
            name: 'b',
            elements: [{
              type: 'text',
              text: 'foo bar'
            }]
          }]
        }]
      };
      const xml = '<a>\n' +
        '\v<b>foo bar</b>\n' +
        '</a>';

      it('should output xml of compact js input', function () {
        expect(convert.js2xml(js1, {compact: true, spaces: 4})).toEqual(xml.replace(/\v/g, '    '));
      });

      it('should output xml of extended js input', function () {
        expect(convert.js2xml(js2, {compact: false, spaces: 4})).toEqual(xml.replace(/\v/g, '    '));
      });

    });

    describe('case 2 by Denis Carriere', function () {
      // see https://github.com/nashwaan/xml-js/issues/13
      const json =  {
        "_declaration": {
          "_attributes": {
            "version": "1.0",
            "encoding": "utf-8"
          }
        },
        "ServiceExceptionReport": {
          "_attributes": {
            "version": "1.1.1"
          },
          "_doctype": 'ServiceExceptionReport SYSTEM "http://schemas.opengis.net/wms/1.1.1/exception_1_1_1.dtd"',
          "ServiceException": {
            "_text": "foo"
          }
        }
      };
      const xml =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<ServiceExceptionReport version="1.1.1">\n' +
        '  <!DOCTYPE ServiceExceptionReport SYSTEM "http://schemas.opengis.net/wms/1.1.1/exception_1_1_1.dtd">\n' +
        '  <ServiceException>foo</ServiceException>\n' +
        '</ServiceExceptionReport>';

      it('should output as expected xml', function () {
        expect(convert.js2xml(json, {compact: true, spaces: 2})).toEqual(xml);
      });

    });

    describe('case 1 by Henning Hagmann ', function () {
      // see https://github.com/nashwaan/xml-js/issues/14
      const js = {
        _declaration: {
          _attributes: {
            version: '1.0'
          }
        },
        group: {
          name: {
            _cdata: 'An example name'
          }
        }
      };
      const xml = '<?xml version="1.0"?>\n' +
        '<group>\n' +
        '\v<name><![CDATA[An example name]]></name>\n' +
        '</group>';

      it('should output cdata without proceeding indentation', function () {
        expect(convert.js2xml(js, {compact: true, spaces: 4, fullTagEmptyElement: true})).toEqual(xml.replace(/\v/g, '    '));
      });

    });

    describe('case 2 by Henning Hagmann ', function () {
      // see https://github.com/nashwaan/xml-js/issues/14
      const js = {
        declaration: {
          attributes: {
            version: '1.0'
          }
        },
        elements: [{
          type: 'element',
          name: 'group',
          elements: [{
            type: 'element',
            name: 'name',
            elements: [{
              type: 'text',
              text: 'The url '
            }, {
              type: 'cdata',
              cdata: 'http://www.test.com'
            }, {
              type: 'text',
              text: ' and name '
            }, {
              type: 'cdata',
              cdata: 'examplename'
            }, {
              type: 'text',
              text: ' are wrapped'
            }]
          }]
        }]
      };
      const xml = '<?xml version="1.0"?>\n' +
        '<group>\n' +
        '\v<name>The url <![CDATA[http://www.test.com]]> and name <![CDATA[examplename]]> are wrapped</name>\n' +
        '</group>';

      it('should output cdata without proceeding indentation', function () {
        expect(convert.js2xml(js, {compact: false, spaces: 4})).toEqual(xml.replace(/\v/g, '    '));
      });

    });

    describe('case by John ', function () {
      // see https://github.com/nashwaan/xml-js/issues/20
      // var js = {
      //     request: {
      //         user: 'username',
      //         pass: 'password',
      //         numbers: {
      //             number: 1,
      //             number: 2
      //         }
      //     }
      // };
      const js = {
        request: {
          user: {
            _text: 'username'
          },
          pass: {
            _text: 'password'
          },
          numbers: {
            number: [
              {
                _text: 1
              },
              {
                _text: 2
              }
            ]
          }
        }
      };
      const xml =
        '<request>\n' +
        '\v<user>username</user>\n' +
        '\v<pass>password</pass>\n' +
        '\v<numbers>\n' +
        '\v\v<number>1</number>\n' +
        '\v\v<number>2</number>\n' +
        '\v</numbers>\n' +
        '</request>';

      it('should convert javascript object to xml correctly', function () {
        expect(convert.js2xml(js, {spaces: 4, compact: true})).toEqual(xml.replace(/\v/g, '    '));
        // expect(convert.xml2js(xml, {compact: true, nativeType: true})).toEqual(js);
      });

    });

    describe('case by yverenoir', function () {
      // see https://github.com/nashwaan/xml-js/issues/21
      // var js = {
      //     "vertical": {
      //         "-display_name": "Exercise",
      //         "html": {
      //             "-url_name": "12345"
      //         },
      //         "lti_consumer": {
      //             "-url_name": "12345",
      //             "-xblock-family": "xblock.v1",
      //             "-accept_grades_past_due": "false",
      //             "-weight": "14.0",
      //             "-has_score": "true",
      //             "-display_name": "Exercise",
      //             "-ask_to_send_username": "true",
      //             "-ask_to_send_email": "true",
      //             "-button_text": "Launch Exercise",
      //             "-custom_parameters": "none",
      //             "-lti_id": "id",
      //             "-launch_target": "new_window",
      //             "-launch_url": "url"
      //         }
      //     }
      // };
      const js = {
        "vertical": {
          "_attributes": {
            "-display_name": "Exercise"
          },
          "html": {
            "_attributes": {
              "-url_name": "12345"
            }
          },
          "lti_consumer": {
            "_attributes": {
              "-url_name": "12345",
              "-xblock-family": "xblock.v1",
              "-accept_grades_past_due": "false",
              "-weight": "14.0",
              "-has_score": "true",
              "-display_name": "Exercise",
              "-ask_to_send_username": "true",
              "-ask_to_send_email": "true",
              "-button_text": "Launch Exercise",
              "-custom_parameters": "none",
              "-lti_id": "id",
              "-launch_target": "new_window",
              "-launch_url": "url"
            }
          }
        }
      };
      const xml =
        '<vertical -display_name="Exercise">\n' +
        '\v<html -url_name="12345"/>\n' +
        '\v<lti_consumer -url_name="12345" -xblock-family="xblock.v1" -accept_grades_past_due="false" -weight="14.0" -has_score="true" -display_name="Exercise" -ask_to_send_username="true" -ask_to_send_email="true" -button_text="Launch Exercise" -custom_parameters="none" -lti_id="id" -launch_target="new_window" -launch_url="url"/>\n' +
        '</vertical>';

      it('should convert javascript object to xml correctly', function () {
        expect(convert.js2xml(js, {spaces: 4, compact: true})).toEqual(xml.replace(/\v/g, '    '));
      });

    });

    describe('case by mariotsi ', function () {
      // see https://github.com/nashwaan/xml-js/issues/28
      const js = {
        a: {
          _attributes: {
            num: 123
          }
        }
      };
      const xml = '<a num="123"/>';

      it('should process attribute number without issue', function () {
        expect(convert.js2xml(js, {compact: true})).toEqual(xml);
      });

    });

    describe('case by zaesnet ', function () {
      // see https://github.com/nashwaan/xml-js/issues/30
      const js = {
        a: {_text:'Hi There'}
      };
      const xml = '<a>Hi There</a>';
      it('should convert js object to xml', function () {
        expect(convert.js2xml(js, {spaces: 3, fullTagEmptyElement: true, compact: true})).toEqual(xml);
      });

    });

    describe('case by kolis ', function () {
      // see https://github.com/nashwaan/xml-js/issues/31
      const js = {
        parent: {
          _attributes: {
            bar: 1,
            baz: 'hello'
          },
          child: {
            _attributes: {
              attr1: 'a',
              attr2: 'b'
            }
          }
        }
      };
      const xml =
      '<parent\n' +
      '\vbar=1\n' +
      '\vbaz="hello"\n' +
      '>\n' +
      '\v<child\n' +
      '\v\vattr1="a"\n' +
      '\v\vattr2="b"\n' +
      '\v/>\n' +
      '</parent>';
      it('should be able to indent attributes', function () {
        expect(convert.js2xml(js, {indentAttributes: true, spaces: 2, compact: true})).toEqual(xml.replace(/\v/g, '  ').replace('=1', '="1"'));
      });
      it('should be able to indent attributes and no quotes for native attributes', function () {
        expect(convert.js2xml(js, {indentAttributes: true, spaces: 2, compact: true, noQuotesForNativeAttributes: true})).toEqual(xml.replace(/\v/g, '  '));
      });

    });

    describe('case by techborn ', function () {
      // see https://github.com/nashwaan/xml-js/pull/32
      // var js = {
      //     example: {
      //         _text: 'value'
      //     }
      // };
      const js = {
        example: 'value'
      };
      const xml = '<example>value</example>';
      it('should convert element text without _text property', function () {
        expect(convert.js2xml(js, {compact: true})).toEqual(xml);
      });

    });

    describe('case by silentgert', function() {
      // see https://github.com/nashwaan/xml-js/issues/42
      const context = {
        convert: convert,
        output: undefined,
      };
      const scriptCode =
      '(function() {\n' +
      '  const obj = {\n' +
      '    customers : {\n' +
      '      customer: [\n' +
      '        {\n' +
      '          _text: \'John Doe\',\n' +
      '          _attributes: {\n' +
      '            status: \'silver\'\n' +
      '          }\n' +
      '        },\n' +
      '        {\n' +
      '          _text: \'Alice Allgood\',\n' +
      '          _attributes: {\n' +
      '            status: \'gold\'\n' +
      '          }\n' +
      '        }\n' +
      '      ]\n' +
      '    }\n' +
      '  };\n' +
      '  output = convert.js2xml(obj, { compact: true });\n' +
      '})()\n';

      const executableScript = new Script(scriptCode, {
        displayErrors: true,
      });

      it ('should convert Arrays in a different context', function() {
        executableScript.runInNewContext(context);
        expect(context.output).toEqual('<customers><customer status="silver">John Doe</customer><customer status="gold">Alice Allgood</customer></customers>');
      });
    });

    describe('case by Cy-Tek', function() {
      // see https://github.com/nashwaan/xml-js/issues/59
      const js = {
        textless: {
          calling_offer_code: '',
          mailing_code: '',
          vcpi: '' },
      };
      const xml =
      '<textless>\n' +
      '  <calling_offer_code/>\n' +
      '  <mailing_code/>\n' +
      '  <vcpi/>\n' +
      '</textless>';
      it ('should not create full tag for empty elements', function() {
        expect(convert.js2xml(js, {compact: true, spaces: 2, fullTagEmptyElement: false})).toEqual(xml);
      });
    });

    describe('case by Nathan Perry', function() {
      // see n/a
      const js = {
        container: {
          cdata_section: {
            _cdata: '<p><![CDATA[aaaa, one <bbbb>cccc</bbbb>]]></p>',
          },
        },
      };
      const xml =
      '<container>\n' +
      '  <cdata_section><![CDATA[<p><![CDATA[aaaa, one <bbbb>cccc</bbbb>]]]]><![CDATA[></p>]]></cdata_section>\n' +
      '</container>';
      it ('should handle nested CDATA sections', function() {
        expect(convert.js2xml(js, {compact: true, spaces: 2, fullTagEmptyElement: false})).toEqual(xml);
      });
    });

    describe('attribute value encoding', function() {
      // Attribute values must escape the XML special characters & < > "
      // Regression: unescaped '&' in an attribute (e.g. a CoT callsign) produced
      // malformed XML that downstream parsers (ATAK) rejected.

      it('should escape an ampersand in an attribute value', function() {
        const js = { event: { _attributes: { callsign: 'Alpha & Bravo' } } };
        expect(convert.js2xml(js, {compact: true})).toEqual('<event callsign="Alpha &amp; Bravo"/>');
      });

      it('should escape all special characters in an attribute value', function() {
        const js = { node: { _attributes: { value: 'a & b < c > d " e' } } };
        expect(convert.js2xml(js, {compact: true})).toEqual('<node value="a &amp; b &lt; c &gt; d &quot; e"/>');
      });

      it('should escape special characters in non-compact attributes', function() {
        const js = { elements: [{ type: 'element', name: 'node', attributes: { value: 'a & b < c > d "' } }] };
        expect(convert.js2xml(js, {compact: false})).toEqual('<node value="a &amp; b &lt; c &gt; d &quot;"/>');
      });

      it('should not double-escape an already encoded ampersand', function() {
        const js = { node: { _attributes: { value: 'Tom &amp; Jerry' } } };
        expect(convert.js2xml(js, {compact: true})).toEqual('<node value="Tom &amp; Jerry"/>');
      });

      it('should round-trip attribute values containing special characters', function() {
        const original = '<event callsign="Alpha &amp; Bravo &lt; Charlie &gt; Delta &quot;Echo&quot;"/>';
        const js = convert.xml2js(original, {compact: true});
        expect(convert.js2xml(js, {compact: true})).toEqual(original);
      });

      it('should escape special characters in multiple attributes on one element', function() {
        const js = { node: { _attributes: { a: 'x & y', b: '1 < 2', c: '"quoted"' } } };
        expect(convert.js2xml(js, {compact: true})).toEqual('<node a="x &amp; y" b="1 &lt; 2" c="&quot;quoted&quot;"/>');
      });
    });

  });

});
