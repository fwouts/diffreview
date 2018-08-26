import Octokit from "@octokit/rest";

export async function loadDiffFile(
  token: string,
  owner: string,
  repo: string,
  shaDiff: ShaDiff
): Promise<FileDiff> {
  const beforePromise =
    shaDiff.beforeSha !== null
      ? loadFile(token, owner, repo, shaDiff.beforeSha)
      : Promise.resolve(null);
  const afterPromise =
    shaDiff.afterSha !== null
      ? loadFile(token, owner, repo, shaDiff.afterSha)
      : Promise.resolve(null);
  const [before, after] = await Promise.all([beforePromise, afterPromise]);
  return {
    before,
    after
  };
}

export async function loadFile(
  token: string,
  owner: string,
  repo: string,
  fileSha: string
): Promise<string> {
  const octokit = new Octokit();
  octokit.authenticate({
    type: "token",
    token
  });
  const { data } = await octokit.gitdata.getBlob({
    owner,
    repo,
    file_sha: fileSha
  });
  return atob(data.content);
}

export interface ShaDiff {
  beforeSha: string | null;
  afterSha: string | null;
}

export interface FileDiff {
  before: string | null;
  after: string | null;
}
