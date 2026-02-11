# Version Control Protocol

This project follows the **Conventional Commits** specification for clear, human-readable, and automated versioning.

## Commit Message Format

Each commit message consists of a **header**, a **body**, and a **footer**.

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature for the user, not a new feature for builds.
- **fix**: A bug fix for the user, not a fix to a build script.
- **docs**: Changes to the documentation.
- **style**: Formatting, missing semi colons, etc; no production code change.
- **refactor**: Refactoring production code, eg. renaming a variable.
- **perf**: Improvements to performance.
- **test**: Adding missing tests, refactoring tests; no production code change.
- **build**: Changes that affect the build system or external dependencies.
- **ci**: Changes to CI configuration files and scripts.
- **chore**: Other changes that don't modify src or test files.
- **revert**: Reverting a previous commit.

### Examples

- `feat(audio): add reactive waveform visualization`
- `fix(header): resolve color inversion on scroll`
- `docs: update project mission in summary`

## Automated Changelog

We use `standard-version` to automate version bumping and `CHANGELOG.md` generation.

To create a new release:
1. Ensure all changes are committed using Conventional Commits.
2. Run `npm run release`.
3. Push the generated tags: `git push --follow-tags`.
