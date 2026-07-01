import { describe, it } from 'node:test';
import { expect } from './expect.js';
import { exec as execCb } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

// Resolve with stdout regardless of the process exit code, mirroring the
// original callback-style tests which ignored the `error` argument.
function exec(cmd: string): Promise<string> {
    return new Promise((resolve) => {
        execCb(cmd, (_error, stdout) => resolve(stdout));
    });
}

const dirname = import.meta.dirname;
const packageInfo = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

// Run the TypeScript CLI source directly through the tsx loader.
const command = process.execPath + ' --import tsx ' + JSON.stringify(path.join(dirname, '../bin/cli.ts'));

describe('Testing cli.js:', function () {

    describe('Getting version and help on usage:', function () {

        it('Get version --version', async function () {
            const stdout = await exec(command + ' --version');
            expect(stdout).toEqual(packageInfo.version + '\n');
        });

        it('Get version -v', async function () {
            const stdout = await exec(command + ' -v');
            expect(stdout).toEqual(packageInfo.version + '\n');
        });

        it('Get help --help', async function () {
            const stdout = await exec(command + ' --help');
            expect(stdout.substr(0, 13)).toEqual('Usage: xml-js');
        });

        it('Get help -h', async function () {
            const stdout = await exec(command + ' -h');
            expect(stdout.substr(0, 13)).toEqual('Usage: xml-js');
        });

        it('Get help when no arguments supplied', async function () {
            const stdout = await exec(command);
            expect(stdout.substr(0, 13)).toEqual('Usage: xml-js');
        });

    });

    describe('Convert XML:', function () {

        it('should convert xml file', async function () {
            const stdout = await exec(command + ' ' + JSON.stringify(path.join(dirname, '../bin/test.xml')));
            expect(stdout).toEqual('{"elements":[{"type":"element","name":"a","attributes":{"x":"1"},"elements":[{"type":"element","name":"b","elements":[{"type":"text","text":"bye!"}]}]}]}' + '\n');
        });

        it('should convert xml file, --compact', async function () {
            const stdout = await exec(command + ' ' + JSON.stringify(path.join(dirname, '../bin/test.xml')) + ' --compact');
            expect(stdout).toEqual('{"a":{"_attributes":{"x":"1"},"b":{"_text":"bye!"}}}' + '\n');
        });

    });

});
