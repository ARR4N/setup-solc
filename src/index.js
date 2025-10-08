import * as fs from 'node:fs/promises'
import * as path from 'node:path';
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";

try {
    if (process.arch != 'x64') {
        throw Error(`Unsupported architecture ${process.arch}`)
    }

    let pathPrefix;
    switch (process.platform) {
        case 'darwin':
            pathPrefix = 'macosx-amd64';
            break
        case 'linux':
            pathPrefix = 'linux-amd64'
            break
        default:
            throw Error(`Unsupported platform ${process.platform}`);
    }

    const constructURL = (fileName) => `https://binaries.soliditylang.org/${pathPrefix}/${fileName}`;
    const list = await fetch(constructURL('list.json')).then(res => res.json());

    const destDir = path.join(process.cwd(), 'setup-solc_downloads');
    await fs.mkdir(destDir);
    core.addPath(destDir);

    for (const [version, outs] of Object.entries(parseVersionInputs())) {
        core.info(`Setting up solc version ${version}`);

        const build = list.builds.find((build) => build.version == version);
        if (build === undefined) {
            throw Error(`Version ${version} not found`);
        }

        const downloaded = await tc.downloadTool(constructURL(build.path));
        await fs.chmod(downloaded, 0o555);

        await Promise.all(
            outs.map((out) => fs.copyFile(
                downloaded,
                path.join(destDir, out)
            ))
        );
        console.info(`${version} at ${outs}`);
    }

} catch (error) {
    core.setFailed(error.message)
}

function parseVersionInputs() {
    let versions = {};

    const v = core.getInput('version');
    if (v != '') {
        versions[v] = ['solc'];
    }

    const multi = core.getInput('versions');
    if (multi == '') {
        return versions
    }
    multi.split(',').forEach((v) => {
        const out = `solc-v${v}`;
        if (v in versions) {
            versions[v].push(out);
        } else {
            versions[v] = [out];
        }
    })

    return versions;
}