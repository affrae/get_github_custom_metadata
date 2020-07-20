const core = require('@actions/core');
const github = require('@actions/github');
const regex = /\n\n<!-- abm_metadata = (.*) -->/


async function run() {

  try {
    const issue = github.context.issue;
    const key = core.getInput('key');
    const myToken = core.getInput('myToken');
    const octokit = github.getOctokit(myToken);
    console.log(issue['owner']);
    console.log(issue['repo']);
    console.log(issue['number']);

    const body = (await octokit.issues.get({owner:issue['owner'],repo:issue['repo'],issue_number:issue['number']})).data.body;

    console.log(body);

    const match = body.match(regex)

    if (match) {
      console.log("Found key: " + key)
      const data = JSON.parse(match[1])
      return key ? data && data[key] : data
    }
    console.log("Did not find key: " + key)

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
