import chalk from 'chalk';
import { CliUx } from '@oclif/core';
import got from "got";
import semver from "semver";
import { BaseCommand } from "../base-command";
import {
  GitHubRelease,
  PackageJsonLike,
  parseGitHubRepoSlug,
  selectLatestReleaseVersion,
} from "../release/github-releases";

export default class Version extends BaseCommand {
  static description = "describe the command here";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  public async run(): Promise<void> {
    let latestVersion: string = "";
    const { name, version } = this.config;

    // Start the spinner while checking versions
    CliUx.ux.action.start(chalk.grey("(checking for new versions)"));

    try {
      const repoSlug = parseGitHubRepoSlug(
        this.config.pjson as PackageJsonLike
      );
      if (repoSlug) {
        const prerelease = semver.prerelease(version);
        const includePrerelease = prerelease !== null && prerelease.length > 0;
        const url = `https://api.github.com/repos/${repoSlug}/releases`;
        const releases = await got(url, {
          headers: {
            accept: "application/vnd.github+json",
            "user-agent": name,
          },
        }).json<GitHubRelease[]>();
        latestVersion =
          selectLatestReleaseVersion(releases, includePrerelease) ?? "";
      }
    } catch {
      // If we can't access GitHub Releases, then ignore this version check.
    }

    // Stop spinner
    CliUx.ux.action.stop();

    // TODO: This isn't even checking if the version is newer!
    const isLatest = latestVersion === "" || latestVersion === version;

    const newVersionText = !isLatest ? `(new! ${latestVersion})` : "";

    CliUx.ux.info(`Version: ${version} ${chalk.yellow(newVersionText)}`);
  }
}
