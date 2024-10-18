import express from 'express';
import axios from 'axios';
import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

// GitHub API setup
const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER!;
const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME!;

const githubApi = axios.create({
  baseURL: 'https://api.github.com/',
  headers: {
    'Authorization': `Bearer ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
  },
});

// Notion API setup
const notion = new Client({ auth: process.env.NOTION_TOKEN! });
const notionDatabaseId = process.env.NOTION_DATABASE_ID!;

// Express app setup
const app = express();
const PORT = 3000;

app.use(express.json());

// Function to fetch GitHub issues
const getGitHubIssues = async () => {
  try {
    const response = await githubApi.get(`/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/issues`);
    return response.data;
  } catch (error) {
    console.error('Error fetching GitHub issues:', error);
    throw error;
  }
};

// Function to create a page in Notion
const createNotionPage = async (title: string, description: string) => {
  try {
    await notion.pages.create({
      parent: { database_id: notionDatabaseId },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
        Description: {
          rich_text: [
            {
              text: {
                content: description,
              },
            },
          ],
        },
      },
    });
    console.log('Page created in Notion successfully!');
  } catch (error) {
    console.error('Error creating Notion page:', error);
    throw error;
  }
};

// Sync GitHub issues with Notion
app.get('/sync-github-notion', async (req, res) => {
  try {
    const issues = await getGitHubIssues();
    for (const issue of issues) {
      const title = issue.title;
      const description = issue.body || 'No description provided';

      await createNotionPage(title, description);
    }
    res.send('GitHub issues synced with Notion successfully!');
  } catch (error) {
    res.status(500).send('Error syncing GitHub with Notion');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
