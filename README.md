# Diff Review for GitHub

*Warning: this isn't yet ready for prime time!*

## Setting up

```
git clone git@github.com:zenclabs/diffreview
cd diffreview
yarn
```

Create a file called `src/config.ts` defining a GitHub token with the **repo** permission:
```
export const GITHUB_TOKEN = "....";
```

Finally, start the local server with `yarn start` and navigate to the PR you want to view with http://localhost:8080/owner/repo/pull_request_id.

Note: hitting http://localhost:8080 directly does not work yet!
