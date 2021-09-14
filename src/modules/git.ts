import simpleGit from 'simple-git';

export async function getLatestCommitMsg(baseDir: string) {
  const git = simpleGit(baseDir);

  const { latest } = await git.log({ n: 1 });
  return latest?.message || '';
}