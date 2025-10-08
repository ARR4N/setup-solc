# setup-solc

A GitHub action for installing the [Solidity](http://soliditylang.org/) compiler, `solc`.

## Usage

```yaml
jobs:
  example_setup_solc_usage:
    name: print-solc-version
    runs-on: ubuntu-latest
    steps:
        - uses: arr4n/setup-solc@v0.2.0
          with:
            version: 0.8.30 # installed as solc
            versions: '0.8.25,0.8.28' # installed as solc-v0.8.25 and solc-v0.8.28

        - run: |
          solc --version;
          solc-v0.8.25 --version;
          solc-v0.8.28 --version;
```

The specified version(s) MUST be specific semver (without a "v" prefix).
Caret (^), tilde (~) and keyword (e.g. "latest") versions are deliberately unsupported because blockchain development requires precision.

