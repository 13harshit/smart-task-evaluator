# Smart Task Evaluator - Submission Guide

## 1. Push to GitHub
You need to push this code to your own GitHub repository.

1.  **Create a New Repo**: Go to [GitHub.com/new](https://github.com/new) and create a repository named `smart-task-evaluator`.
2.  **Push Code**: Run these commands in your terminal:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/smart-task-evaluator.git
    git branch -M main
    git push -u origin main
    ```

## 2. Deploy to Vercel
1.  Go to [Vercel.com](https://vercel.com).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your `smart-task-evaluator` repository.
4.  **Environment Variables**: Add these during deployment:
    *   `NEXT_PUBLIC_SUPABASE_URL`: (Your Supabase URL)
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Your Supabase Key)
    *   `GEMINI_API_KEY`: (Your Gemini Key)
5.  Click **Deploy**.

## 3. Supabase Schema
Go to your Supabase Dashboard -> **Database** -> **Schema Visualizer**.
Take a screenshot of the tables (`profiles`, `tasks`, `evaluations`, `payments`).

## 4. Screen Recording
Upload your screen recording to Google Drive and set access to **"Anyone with the link"**.

## 5. Submit
Fill out the submission form with:
*   **GitHub Repo**: (Your new repo link)
*   **Live App URL**: (Your Vercel link)
*   **Supabase Screenshot**: (The image you took)
*   **Screen Recording**: (Your Drive link)

Good luck!
