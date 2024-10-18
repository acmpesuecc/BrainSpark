"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const client_1 = require("@notionhq/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// GitHub and Notion API setup
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER;
const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME;
const notion = new client_1.Client({ auth: process.env.NOTION_TOKEN });
const notionDatabaseId = process.env.NOTION_DATABASE_ID;
const githubApi = axios_1.default.create({
    baseURL: 'https://api.github.com/',
    headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
    },
});
// Express app setup
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware for JSON requests
app.use(express_1.default.json());
// Root route for testing
app.get('/', (req, res) => {
    res.send('Welcome to the GitHub-Notion sync API!');
});
// Function to fetch GitHub issues
const getGitHubIssues = async () => {
    try {
        const response = await githubApi.get(`/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/issues`);
        return response.data;
    }
    catch (error) {
        console.error('Error fetching GitHub issues:', error);
        throw error;
    }
};
// Function to create a page in Notion
const createNotionPage = async (title, description, status, priority) => {
    try {
        await notion.pages.create({
            parent: { database_id: notionDatabaseId },
            properties: {
                Name: {
                    title: [{ text: { content: title } }],
                },
                Description: {
                    rich_text: [{ text: { content: description } }],
                },
                Status: {
                    select: { name: status },
                },
                Priority: {
                    select: { name: priority },
                },
                'GitHub Link': {
                    url: `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/issues/${title}`,
                },
            },
        });
        console.log(`Page created in Notion for issue: ${title}`);
    }
    catch (error) {
        console.error('Error creating Notion page:', error);
        throw error;
    }
};
// Function to get pages from Notion
const getNotionPages = async () => {
    try {
        const response = await notion.databases.query({
            database_id: notionDatabaseId,
        });
        return response.results;
    }
    catch (error) {
        console.error('Error fetching pages from Notion:', error);
        throw error;
    }
};
// Async Handler Helper Function
const asyncHandler = (fn) => {
    return (req, res, next) => {
        return Promise.resolve(fn(req, res, next)).catch(next);
    };
};
// Sync GitHub issues with Notion manually
app.get('/sync-github-notion', asyncHandler(async (req, res) => {
    console.log('Starting GitHub issues sync...');
    const issues = await getGitHubIssues();
    for (const issue of issues) {
        const title = issue.title;
        const description = issue.body || 'No description provided';
        const status = issue.state === 'open' ? 'Open' : 'Closed';
        const priority = 'High'; // For simplicity, we assume all issues are high-priority
        await createNotionPage(title, description, status, priority);
    }
    res.send('GitHub issues synced with Notion successfully!');
}));
// Fetch all synced GitHub issues from Notion
app.get('/get-synced-issues', asyncHandler(async (req, res) => {
    const pages = await getNotionPages();
    if (pages.length === 0) {
        return res.send('No issues synced yet.');
    }
    const issues = pages.map((page) => ({
        title: page.properties.Name.title[0].text.content,
        description: page.properties.Description.rich_text[0].text.content,
        status: page.properties.Status.select.name,
        priority: page.properties.Priority.select.name,
        link: page.properties['GitHub Link'].url,
    }));
    res.json(issues);
}));
// Starting the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
