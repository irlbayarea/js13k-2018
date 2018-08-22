## Getting Started

- [Install NodeJS](https://nodejs.org/en/download/)
- _Optional_: [Install VSCode](https://code.visualstudio.com/)
- _Optional_: Enable the _Prettier_ extension for VSCode.
  - Suggested Workspace Settings including _format-on-save_:
    ```js
    {
      "[javascript]": {
        "editor.formatOnSave": true
      },
      "[typescript]": {
        "editor.formatOnSave": true
      }
    },
    "editor.rulers": [
      80
    ]
    ```
- Fork and clone this repository
  - Add an upstrem, i.e. `git remote add upstream git@github.com:irlbayarea/js13k-2018.git`
  - `cd js13k-2018`
  - `npm install`
- Make sure the development server works!
  - `npm run-script serve`
