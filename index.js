const core = require('@actions/core');
const github = require('@actions/github');
const regex = /<!-- abm_metadata = (.*) -->/

// run async
async function run() {

  try {
    const issue = github.context.issue;
    const issue_number = core.getInput('issue_number') ? core.getInput('issue_number') : github.context.issue['number'];
    const key = core.getInput('key');
    const myToken = core.getInput('myToken');
    const octokit = github.getOctokit(myToken);

    console.log("key: " + key);
    console.log("issue_number: " + issue_number);


    let body = (await octokit.issues.get({owner:issue['owner'],repo:issue['repo'],issue_number:issue_number})).data.body;

    const match = body.match(regex)

    if (match) {
      data = JSON.parse(match[1])
    } else {
      data = JSON.parse('{}')
    }

    console.log("result: " + key ? data && data[key] : data)
    core.setOutput('result', key ? data && data[key] : data)

  } catch (error) {
    console.log("There has been an error")
    core.setFailed(error.message);
  }
}

run();
