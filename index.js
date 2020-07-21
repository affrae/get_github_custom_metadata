const core = require('@actions/core');
const github = require('@actions/github');
const regex = /\n\n<!-- abm_metadata = (.*) -->/

// run async
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
      const data = JSON.parse(match[1])
      console.log("Found custom metadata")
      console.log("Returning: " + (key ? data && data[key] : data))

      return key ? data && data[key] : data
    }
    console.log("Did not find custom metadata")

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
