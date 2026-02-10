import semver from "semver";

export interface GitHubRelease {
  tag_name: string;
  draft: boolean;
  prerelease: boolean;
}

export interface PackageJsonLike {
  repository?: string | { url?: string };
  homepage?: string;
}

const extractRepoSlug = (value: string): string | null => {
  const match = value.match(/github\.com[/:]([^/]+)\/([^/.]+)(?:\.git)?/i);
  if (!match) {
    return null;
  }
  return `${match[1]}/${match[2]}`;
};

const repositoryUrl = (repository?: string | { url?: string }): string | null => {
  if (typeof repository === "string") {
    return repository;
  }
  return repository?.url ?? null;
};

export const parseGitHubRepoSlug = (
  pjson: PackageJsonLike
): string | null => {
  const fromRepo = repositoryUrl(pjson.repository);
  const repoSlug = fromRepo ? extractRepoSlug(fromRepo) : null;
  if (repoSlug) {
    return repoSlug;
  }
  return pjson.homepage ? extractRepoSlug(pjson.homepage) : null;
};

export const normalizeTagToVersion = (tag: string): string | null => {
  const trimmed = tag.startsWith("v") ? tag.slice(1) : tag;
  return semver.valid(trimmed);
};

export const selectLatestReleaseVersion = (
  releases: GitHubRelease[],
  includePrerelease: boolean
): string | null => {
  const versions = releases
    .filter((release) => !release.draft)
    .filter((release) => includePrerelease || !release.prerelease)
    .map((release) => normalizeTagToVersion(release.tag_name))
    .filter((version): version is string => version !== null);

  if (versions.length === 0) {
    return null;
  }

  return versions.sort(semver.rcompare)[0];
};
