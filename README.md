# setup-solc

A GitHub action for installing the [Solidity](http://soliditylang.org/) compiler, `solc`.

## Usage

```yaml
jobs:
  example_setup_solc_usage:
    name: print-solc-version
    runs-on: ubuntu-latest
    steps:
        - uses: arr4n/setup-solc@main
          with:
            version: 0.8.30

        - run: solc --version
```

The specified version MUST be a specific semver (without a "v" prefix).
Caret (^), tilde (~) and keyword (e.g. "latest") versions are deliberately unsupported because blockchain development requires precision.

