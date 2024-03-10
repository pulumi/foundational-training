# aws-training

Training materials for SA Enablement training 2024.

## Slides

Each module has slides in the `module-name/slides` directory. Slides are created using [MARP](https://marp.app). The intent behind this choice (as opposed to Google Slides) is for the following reasons:

- Markdown has better support for code blocks.
- Better editing in VS Code or similar: easier to move slides between modules, etc.
- Slides can easily be re-themed for branding based on the presenting entity: Pulumi, AWS, or community groups.
- Text-based diffs more clearly communicate file history versus binary formats.
- Allows export to various formats: PDF, etc.

To install the MARP CLI:

```bash
npm i -g @marp-team/marp-cli
```

To view a preview of the deck, run the following command:

```bash
marp -s .
```

Then open <http://localhost:8080> and browse to the relevant module.

## Known Issues

Some instructions in this repository assume that each attendee is running in their own Pulumi Cloud organization. To adjust for a single, shared org for the class:

1. All pre-existing stacks (that is, those already in this codebase, not created by attendees) will need the following command to avoid a collision on the default `dev` stack: `pulumi stack init dev-your-name`.
1. All new programs will need to be called `program-name-your-name`.
