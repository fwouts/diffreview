export function producePath(
  owner: string,
  repo: string,
  pullRequestNumber: number,
  path: string
) {
  if (!path.startsWith("/")) {
    throw new Error(`${path} does not start with a /`);
  }
  return `/${owner}/${repo}/${pullRequestNumber}/${path.substr(1)}`;
}

export function parsePath(path: string) {
  const [, owner, repo, pullRequestNumberStr, ...maybeFilePath] = path.split(
    "/"
  );
  if (!owner || !repo || !pullRequestNumberStr) {
    // TODO: Handle properly.
    throw new Error();
  }
  const pullRequestNumber = parseInt(pullRequestNumberStr);
  if (!pullRequestNumber) {
    // TODO: Handle properly.
    throw new Error();
  }
  const filePath =
    maybeFilePath.length > 0 ? `/${maybeFilePath.join("/")}` : null;
  return {
    owner,
    repo,
    pullRequestNumber,
    filePath
  };
}
