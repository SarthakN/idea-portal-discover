 # 🚀 Idea Portal Discover

Turn unstructured customer feedback into actionable product insights.

---

## 📌 Overview

Customer ideas are one of the most valuable—but underutilized—sources of product insight. As volume grows, these ideas become fragmented, duplicated, and difficult to act on.

**Idea Portal Discover** helps product teams:
- Organize large volumes of customer ideas  
- Identify high-impact opportunities  
- Close the loop with customers  

---

## ❗ Problem

Customer-submitted ideas often:
- Get buried due to **high volume**
- Lack **structure and categorization**
- Are **duplicated across users**
- Have **no clear linkage to roadmap or releases**

This leads to missed opportunities and poor customer communication.

---

## 💡 Solution

### 1. 🔁 Deduplicate & Cluster Ideas
Identify similar ideas using semantic similarity and group them into unified themes.
- Reduces noise  
- Surfaces true demand signals  

### 2. 🎯 Map Ideas to Roadmap + ARR Impact
Connect customer ideas to planned features and estimate their business impact.
- Prioritize based on **revenue potential (ARR)**  
- Validate roadmap decisions with real customer demand  

### 3. 🔄 Close the Feedback Loop
Match shipped features (release notes) back to customer ideas.
- Notify relevant customers  
- Improve engagement and trust  

---

## 🏗️ Architecture

### High-Level Flow

```text
Customer Inputs → Embeddings → Vector DB → Processing Engine → Insights → UI
```

### System Components

1. **Ingestion Layer**
   - Sources: CSV, Forms, APIs  
   - Normalizes and prepares idea data  

2. **Embedding Layer**
   - Converts ideas into vector representations  
   - Enables semantic understanding  

3. **Vector Database**
   - Stores embeddings for fast similarity search  
   - Powers deduplication and clustering  

4. **Processing Engine (n8n Workflows)**
   - Orchestrates:
     - Vector search  
     - OpenAI agents (NLP + reasoning)  
     - scikit-learn (ML processing)  

5. **Insights Layer**
   - Outputs:
     - Themes  
     - Clusters  
     - Impact scores  
     - Mappings to roadmap/release notes  

6. **API Layer**
   - Serves processed insights to UI  

7. **User Interface**
   - Search and analyze ideas  
   - Explore themes and impact  

---

### 🔄 Architecture Diagram

```text
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
|     n8n Workflow Engine     |
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
|   Processed Insights        |
| (Themes, Scores, Mapping)   |
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
|   (Search / Analysis UI)    |
+-----------------------------+
```

---

## 🔗 Project

- 🌐 Live Project: https://lovable.dev/projects/63ca8c8d-9631-4e9a-80c2-2e6b61fa1e10  

---

## 🛠️ Getting Started

### Option 1: Use Lovable (Recommended)

1. Open the project on Lovable  
2. Start prompting to make changes  
3. Changes auto-sync to this repo  

👉 https://lovable.dev/projects/63ca8c8d-9631-4e9a-80c2-2e6b61fa1e10  

---

### Option 2: Run Locally

#### Prerequisites
- Node.js (recommended via nvm)

#### Setup

```bash
# Clone the repo
git clone <YOUR_GIT_URL>

# Navigate to project
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Run dev server
npm run dev
```

---

### Option 3: Edit in GitHub

- Open any file  
- Click ✏️ Edit  
- Commit changes  

---

### Option 4: Use GitHub Codespaces

- Click **Code → Codespaces → New Codespace**  
- Edit and push changes directly  

---

## ⚙️ Tech Stack

- **Frontend**: React, TypeScript, Vite  
- **UI**: shadcn-ui, Tailwind CSS  
- **AI/ML**:
  - OpenAI (embeddings + agents)  
  - scikit-learn  
- **Workflow Orchestration**: n8n  
- **Storage**: Vector Database  

---

## 🚀 Deployment

Deploy instantly via Lovable:

1. Open project  
2. Click **Share → Publish**  

---

## 🌐 Custom Domain

You can connect your own domain:

1. Go to **Project → Settings → Domains**  
2. Click **Connect Domain**  

📖 Guide: https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide  

---

## ✨ Why This Project Matters

This isn’t just a feedback tool—it’s a **decision intelligence layer for product teams**:
- Bridges **customer voice → roadmap decisions**  
- Adds **quantification (ARR impact)** to qualitative feedback  
- Enables **closed-loop product
