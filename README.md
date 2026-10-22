# CodePawl skills

Agent skills we use to build things with Claude Code. Each skill is a folder with a `SKILL.md` entry point and the
references it reads.

## visualize-in-3d

Some things are hard to understand from text, a spreadsheet or a two-hour documentary. How does an airport turn a plane
around in 45 minutes? What does an ER do with ten arrivals at once? How does a metro keep trains two minutes apart, or
a toll gantry charge a truck at full speed? Why did a reactor explode at 01:23?

This skill has your agent turn questions
like these into a 3D world you can watch or click through. The world is built from researched facts and from models
made to real dimensions.

It has two modes:

- **Live app**: a three.js app with a dashboard around a 3D world of the place. A seeded simulation moves the units and
  the numbers. The agent records a 30 s film by driving the app with real clicks on a virtual clock.
- **Documentary film**: a 2 to 4 minute film of an event, told in order. It is built from a sourced fact file, a map,
  block-built scenes and flat glowing figures. Captions are timed for reading, and the score changes with the story.

There are four looks: toy isometric, point-cloud survey, photoreal terrain and dark documentary.

### Install

In Claude Code, add this repository as a plugin marketplace and install the plugin:

```text
/plugin marketplace add codepawl/viz3d
/plugin install visualize-in-3d@codepawl
```

From a shell, the same two steps are:

```bash
claude plugin marketplace add codepawl/viz3d
claude plugin install visualize-in-3d@codepawl
```

For Claude Code, Codex, Cursor and other agents that read skill folders, use the [skills CLI](https://github.com/vercel-labs/skills):

```bash
npx skills add codepawl/viz3d
```

To install by hand, copy `plugins/visualize-in-3d/skills/visualize-in-3d` into your agent's skills folder (for Claude
Code, `~/.claude/skills/`).

### Use

Ask for what you want to see, for example:

- "Visualize how a container port works."
- "Show how a city metro keeps its trains apart."
- "Make a documentary-style 3D film of the 1906 San Francisco earthquake."

The agent writes a topic file first, then builds the models, then the app or the film. It checks its own film on
contact sheets before it shows you anything.

### What you need

- Node 20 or later, with Playwright and Chromium for recording.
- ffmpeg on your PATH.
- A GPU that runs WebGL2 at 1080p.
- [Blender](https://www.blender.org/download/) 5.x is optional. It gives much better models. Without it the skill builds
  the models in three.js and tells you the quality is lower.

The skill asks before it downloads anything, such as elevation data, map data or reference images.

## License

MIT
