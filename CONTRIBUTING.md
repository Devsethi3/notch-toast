# Contributing to Notch Toast

Thank you for improving Notch Toast. Contributions to the React package, the
documentation site, tests, examples, and developer guidance are welcome.

Please read and follow the [Code of Conduct](./CODE_OF_CONDUCT.md) in all
project spaces.

## Before you start

- Search existing [issues](https://github.com/Devsethi3/notch-toast/issues) and
  pull requests to avoid duplicate work.
- Open an issue before beginning a large feature, API change, or visual redesign
  so the direction can be agreed on first.
- Keep pull requests focused. Separate refactors from behavior changes when
  practical.

## Development setup

You need Node.js 20+ and pnpm 9+.

```bash
git clone https://github.com/YOUR-USERNAME/notch-toast.git
cd notch-toast
pnpm install
pnpm dev
```

## Keeping a fork current

Configure the original repository once after cloning:

```bash
git remote add upstream https://github.com/Devsethi3/notch-toast.git
git fetch upstream
```

Before starting a change, update your local default branch and create a focused
branch from it:

```bash
git checkout main
git pull upstream main
git push origin main
git checkout -b feat/short-description
```

If the default branch is renamed in the future, substitute that branch name in
these commands.

## Making a change

1. Create a descriptive branch, such as `fix/dismiss-button-focus` or
   `docs/promise-example`.
2. Make the smallest change that solves the problem.
3. Add or update tests for changed package behavior.
4. Update documentation when public behavior, installation, or API changes.
5. Run the checks below before opening a pull request.

## Quality checks

Run the relevant commands from the repository root:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test:package
pnpm build
```

For package-only work, these commands are also useful:

```bash
pnpm --filter ./packages/notch-toast run build
pnpm --filter ./packages/notch-toast run pack:check
```

`test:package` runs the library tests and a consumer smoke test. `pack:check`
shows the files that would be published to npm.

## Code guidelines

- Use TypeScript and preserve the existing public API unless a breaking change
  has been explicitly discussed.
- Format changed TypeScript and TSX files with Prettier.
- Prefer accessible native controls and retain keyboard/reduced-motion support.
- Do not add a second mounted `NotchToaster`; it is intentionally a singleton.
- Keep dependencies minimal, especially in the published package.
- Do not commit generated output, local `.env` files, or unrelated formatting
  changes.

## Pull requests

Open your pull request against the repository's default branch. A good pull
request includes:

- A clear title and short summary of the user-facing change.
- Linked issue(s), if applicable.
- Tests or an explanation of why tests are not needed.
- Screenshots or a short recording for visible site or animation changes.
- Documentation updates for public API or installation changes.

Maintainers may request changes, split unrelated work, or ask for an issue
before accepting a large feature. Please be patient and keep the discussion
constructive.

## Reporting bugs

Use the bug-report template and include the package version, React version,
browser, a minimal reproduction, expected behavior, and actual behavior. Do
not report security vulnerabilities in public issues; follow the
[security policy](./SECURITY.md) instead.

## License

By contributing, you agree that your contributions are licensed under the
[MIT License](./LICENSE).
