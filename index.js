const core = require('@actions/core');
const github = require('@actions/github');
const regex = /\n\n<!-- abm_metadata = (.*) -->/

// run async
async function run() {

  try {
    const issue = core.getInput('issue_number') ? core.getInput('issue_number') : github.context.issue;
    const key = core.getInput('key');
    const myToken = core.getInput('myToken');
    const octokit = github.getOctokit(myToken);

    const body = (await octokit.issues.get({owner:issue['owner'],repo:issue['repo'],issue_number:issue['number']})).data.body;


    const match = body.match(regex)

    if (match) {
      const data = JSON.parse(match[1])

      core.setOutput('result', key ? data && data[key] : data)

    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
