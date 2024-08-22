Here's a simple Node.js application that uses the GitLab API to pull a project's information, including the README and slug, based on a GitLab project URL.

### Prerequisites
- You need a GitLab Personal Access Token (PAT) to authenticate API requests.
- The `gitlab` package for GitLab API interactions.

### Steps

1. Install the required package:
   ```bash
   npm install @gitbeaker/node
   ```

2. Create the following Node.js script:

```javascript
const { Gitlab } = require('@gitbeaker/node');
const axios = require('axios');
require('dotenv').config();

// Set your GitLab personal access token in an environment variable
const api = new Gitlab({
  token: process.env.GITLAB_TOKEN,
});

// Function to extract the project ID or slug from the GitLab URL
function getProjectPathFromUrl(url) {
  const regex = /gitlab\.com\/(.+?)(\.git)?$/;
  const match = url.match(regex);
  if (match) {
    return match[1]; // This will return the project path, e.g., 'group/project'
  }
  return null;
}

async function fetchProjectDetails(url) {
  try {
    const projectPath = getProjectPathFromUrl(url);

    if (!projectPath) {
      throw new Error('Invalid GitLab URL');
    }

    // Fetch project information
    const project = await api.Projects.show(projectPath);

    console.log('Project Information:');
    console.log(`Name: ${project.name}`);
    console.log(`Slug: ${project.path}`);
    console.log(`Description: ${project.description}`);

    // Fetch README content
    const readmeFile = await api.RepositoryFiles.showRaw(projectPath, 'README.md', project.default_branch);

    console.log('\nREADME Content:');
    console.log(readmeFile);

  } catch (error) {
    console.error('Error fetching project details:', error);
  }
}

// Example usage
const gitlabUrl = 'https://gitlab.com/your-group/your-project'; // Replace with the actual GitLab project URL
fetchProjectDetails(gitlabUrl);
```

### Explanation

1. **GitLab API Client**: The script uses `@gitbeaker/node`, a GitLab API client, to fetch project details and files from GitLab.
2. **Personal Access Token**: It uses a GitLab personal access token for authentication. Store it securely in a `.env` file.
3. **Fetching Project Information**: The `Projects.show()` method fetches the project's details like name, slug, and description.
4. **Fetching README**: It fetches the `README.md` file from the repository.

### `.env` Example
```plaintext
GITLAB_TOKEN=your_personal_access_token
```

This script will output the project's name, slug, description, and README content in the console.

You can customize this further to save the data or handle different file types.
