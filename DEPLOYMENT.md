# Deploying Your Agentic AI Assistant Frontend

This guide provides the necessary steps and configuration to deploy the static React frontend of your Agentic AI Assistant to a modern hosting platform like Render, Vercel, or Netlify.

## Hosting Provider

A service like **Render** is an excellent choice because it provides a simple workflow for static sites and can later host all the backend components (API server, background workers, database) that this application is designed for.

## Deployment Configuration

When setting up a new **"Static Site"** on your hosting provider, use the following settings.

| Setting               | Value                                 | Rationale                                                                                                                         |
| --------------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Name**              | `Agentic-system`                      | A unique, descriptive name for your project.                                                                                      |
| **Branch**            | `main`                                | This is the primary Git branch that will be automatically deployed when you push changes.                                         |
| **Root Directory**    | *(Leave Blank)*                       | Your project's configuration and source files are located in the root of the repository, not a subdirectory.                      |
| **Build Command**     | `npm install && npm run build`        | This standard command first installs all the project's dependencies and then executes the build script to compile the React app.    |
| **Publish Directory** | `dist`                                | The build process will generate all the final, optimized static assets (`index.html`, JavaScript, CSS) into the `dist` directory. |

---

### **CRITICAL: Environment Variable Setup**

To enable the AI planning features, you **must** configure the Gemini API key. If this is not set, the application will fall back to using mock data and will not be able to generate new plans.

1.  In your hosting provider's dashboard, find the section for **Environment Variables**.
2.  Click **"Add Environment Variable"**.
3.  Set the following values:
    *   **NAME / KEY**: `API_KEY`
    *   **VALUE**: Paste your actual Google Gemini API key here.

#### Where to Find Your API Key
You can generate a free API key from the **[Google AI Studio](https://aistudio.google.com/app/apikey)**.

---

## Final Steps

Once you have entered all the configuration details and added the `API_KEY` environment variable, you can proceed to create the site. The hosting service will then pull your code from GitHub/GitLab, run the build command, and deploy the contents of the `dist` directory to a live URL.

## Next Steps: The Backend

Remember, this process only deploys the **frontend UI**. To make the application fully functional with real tool execution, you will need to build and deploy the backend services (API Server, Orchestrator, Database, etc.) as outlined in the `ARCHITECTURE.md` file.
