import {
  GitHubRelease,
  parseGitHubRepoSlug,
  selectLatestReleaseVersion,
} from "../../release/github-releases";

describe("selectLatestReleaseVersion", () => {
  it("selects the highest stable release", () => {
    const releases: GitHubRelease[] = [
      { tag_name: "v1.0.0", draft: false, prerelease: false },
      { tag_name: "v1.2.0", draft: false, prerelease: false },
      { tag_name: "v1.1.5", draft: false, prerelease: false },
    ];

    const version = selectLatestReleaseVersion(releases, false);

    expect(version).toBe("1.2.0");
  });

  it("selects the highest prerelease when enabled", () => {
    const releases: GitHubRelease[] = [
      { tag_name: "v1.2.0", draft: false, prerelease: false },
      { tag_name: "v1.3.0-beta.1", draft: false, prerelease: true },
      { tag_name: "v1.3.0-beta.2", draft: false, prerelease: true },
    ];

    const version = selectLatestReleaseVersion(releases, true);

    expect(version).toBe("1.3.0-beta.2");
  });

  it("ignores drafts", () => {
    const releases: GitHubRelease[] = [
      { tag_name: "v2.0.0", draft: true, prerelease: false },
      { tag_name: "v1.9.0", draft: false, prerelease: false },
    ];

    const version = selectLatestReleaseVersion(releases, false);

    expect(version).toBe("1.9.0");
  });

  it("parses tags with a leading v", () => {
    const releases: GitHubRelease[] = [
      { tag_name: "v3.1.0", draft: false, prerelease: false },
    ];

    const version = selectLatestReleaseVersion(releases, false);

    expect(version).toBe("3.1.0");
  });
});

describe("parseGitHubRepoSlug", () => {
  it("parses repository ssh url", () => {
    const slug = parseGitHubRepoSlug({
      repository: "ssh://git@github.com/segmentio/typewriter.git",
    });

    expect(slug).toBe("segmentio/typewriter");
  });

  it("falls back to homepage", () => {
    const slug = parseGitHubRepoSlug({
      homepage: "https://github.com/segmentio/typewriter",
    });

    expect(slug).toBe("segmentio/typewriter");
  });
});
