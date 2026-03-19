# Idea Portal Discover

## Problem Statement

Submitted ideas by customers as feedback for products get lost due to lack of structure, volume, and no way to organize.

## Solutions

1. **Find duplicate ideas**: Identify and group similar customer-submitted ideas to reduce redundancy and focus on unique feedback.

2. **Find ideas that match the product roadmap and their impact in terms of ARR**: Discover customer ideas that align with planned product features and assess their potential revenue impact (Annual Recurring Revenue).

3. **Find ideas that match a release note to revert back to the customers**: Locate customer ideas that correspond to recent product releases, enabling targeted follow-up and communication with customers.

## Architecture

1. **Loads all the ideas to a vector database**: Customer ideas are ingested and stored in a vector database for efficient semantic search and similarity matching.

2. **Gets requests from UI**: The system receives queries and requests from a user interface, allowing users to search and analyze customer ideas.

3. **Processes requests by using n8n supported by: scikit learn, OpenAI agents, and Vector db searches**: Requests are processed through n8n workflows that leverage scikit-learn for machine learning tasks, OpenAI agents for natural language processing, and vector database searches for semantic similarity matching.

                +-----------------------------+
                |   Customer Idea Sources     |
                | (CSV, Forms, APIs, etc.)   |
                +-------------+---------------+
                              |
                              v
                +-----------------------------+
                |      Ingestion Layer        |
                +-------------+---------------+
                              |
                              v
                +-----------------------------+
                |   Embedding Generation      |
                | (OpenAI / ML Models)        |
                +-------------+---------------+
                              |
                              v
                +-----------------------------+
                |      Vector Database        |
                |   (Semantic Storage)        |
                +-------------+---------------+

                              ^
                              |
                +-------------+---------------+
                |       n8n Workflow Engine   |
                +------+------+--------------+
                       |      | 
                       |      |
                       v      v
        +----------------+   +----------------------+
        | Vector Search  |   |  OpenAI Agents       |
        | (Similarity)   |   | (NLP / Reasoning)    |
        +----------------+   +----------------------+
                       |
                       v
              +----------------------+
              |   scikit-learn       |
              | (ML Processing)      |
              +----------+-----------+
                         |
                         v
                +-----------------------------+
                |   Processed Results         |
                | (Themes, Scores, Insights)  |
                +-------------+---------------+
                              |
                              v
                +-----------------------------+
                |        API Layer            |
                +-------------+---------------+
                              |
                              v
                +-----------------------------+
                |      User Interface         |
                |   (Search / Analysis UI)   |
                +-----------------------------+

## Project info

**URL**: https://lovable.dev/projects/63ca8c8d-9631-4e9a-80c2-2e6b61fa1e10

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/63ca8c8d-9631-4e9a-80c2-2e6b61fa1e10) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/63ca8c8d-9631-4e9a-80c2-2e6b61fa1e10) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
