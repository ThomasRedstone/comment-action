#!/usr/bin/env node

const core = require("@actions/core");
const { GitHub, context } = require("@actions/github");

const main = async () => {
    const repoName = context.repo.repo;
    const repoOwner = context.repo.owner;
    const githubToken = core.getInput("githubToken", { required: true });

    const githubClient = new GitHub(githubToken);
    const commitPRs = await githubClient.repos.listPullRequestsAssociatedWithCommit(
        {
            repo: repoName,
            owner: repoOwner,
            commit_sha: context.sha
        }
    );
    const prNumber = commitPRs.data[0].number;

    const fileName = process.argv[2];

    const commentBody = fs.readFileSync(fileName, "utf8");

    await githubClient.issues.createComment({
        repo: repoName,
        owner: repoOwner,
        body: commentBody,
        issue_number: prNumber,
    });
};

main().catch(err => core.setFailed(err.message));
