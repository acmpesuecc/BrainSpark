import express from 'express';
import axios from 'axios';
import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables from .env

// Notion and GitHub setup
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const notionDatabaseId = process.env.NOTION_DATABASE_ID;
const githubApi = axios.create({
  baseURL: 'https://api.github.com/',
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
  },
});

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for serving static files
app.use(express.static('public'));

// Route to serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Route to fetch GitHub issues and sync with Notion
app.get('/sync-github-notion', async (req, res) => {
  try {
    const issues = await githubApi.get(`/repos/${process.env.GITHUB_REPO_OWNER}/${process.env.GITHUB_REPO_NAME}/issues`);
    for (const issue of issues.data) {
      await notion.pages.create({
        parent: { database_id: notionDatabaseId! },
        properties: {
          Name: { title: [{ text: { content: issue.title } }] },
          Description: { rich_text: [{ text: { content: issue.body || 'No description' } }] },
        },
      });
    }
    res.send('GitHub issues synced to Notion successfully!');
  } catch (error) {
    console.error('Error syncing:', error);
    res.status(500).send('Error syncing with Notion');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
