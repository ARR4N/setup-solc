import * as fs from 'node:fs/promises'
import * as path from 'node:path';
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";

try {
    const version = core.getInput('version');
    core.info(`Setting up solc version ${version}`);

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

    const build = list.builds.find((build) => build.version == version);
    if (build === undefined) {
        throw Error(`Version ${version} not found`);
    }

    const downloaded = await tc.downloadTool(constructURL(build.path));

    const destDir = path.join(process.cwd(), 'setup-solc_downloads');
    await fs.mkdir(destDir);
    const solc = path.join(destDir, 'solc')
    await fs.rename(downloaded, solc);
    await fs.chmod(solc, 0o555);

    core.addPath(destDir);
    core.setOutput('solc', solc);
    core.info(`solc at ${solc}`);

} catch (error) {
    core.setFailed(error.message)
}
