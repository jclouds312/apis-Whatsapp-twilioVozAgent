# APIs Manager: Unified API Management and Orchestration Platform

APIs Manager is a comprehensive administration panel designed to centralize, manage, and automate interactions between various services and APIs. The platform provides a unified console to manage API keys, expose internal APIs, and connect workflows between services, with a primary focus on integrating and orchestrating WhatsApp Business and Twilio Voice APIs. Built with Next.js, Firebase, and Tailwind CSS.

## Project Concept

In today's digital ecosystem, businesses rely on a multitude of SaaS services and internal APIs to operate. Managing these integrations can become complex and difficult to scale. APIs Manager was born as a solution to this problem, offering a unified "command center" that allows technical and business teams to:

-   **Centralize Security**: Manage all API credentials for external services like WhatsApp Business and Twilio in a single secure location powered by Firebase.
-   **Expose and Orchestrate APIs**: Turn internal functionalities into secure, documented APIs ready for consumption by other CRMs, websites, or mobile apps. These exposed APIs can then orchestrate calls to the integrated services.
-   **Automate Business Processes**: Create logical workflows that connect different systems (e.g., a new CRM lead triggers a WhatsApp message).
-   **Gain Visibility and Control**: Monitor system activity through a real-time logging system and manage user access permissions.

## Main Features

-   **Dashboard**: Offers a bird's-eye view of the most important metrics, such as API traffic, active workflows, and recent system errors, all powered by live data from Firestore.
-   **WhatsApp & Twilio Dashboards**: Dedicated sections for managing conversations and monitoring activity for WhatsApp Business and Twilio Voice.
-   **API Key Management**: A centralized and secure repository to store, view, manage, and revoke API keys for integrated services.
-   **Exposed API Console**: A tool to document, secure, and expose internal APIs, controlling their status (published, draft, obsolete) and visibility.
-   **User and Role Management**: Administer team members and assign roles to control access to different platform functionalities.
-   **System Logs**: A detailed, real-time record of all system events to facilitate error debugging and security auditing, stored in Firestore.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Backend & Database**: [Firebase](https://firebase.google.com/) (Firestore, Authentication)
-   **UI**: [React](https://react.dev/), [shadcn/ui](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
-   **Generative AI**: [Google AI & Genkit](https://firebase.google.com/docs/genkit) for intelligent suggestions.

## Deploying on Vercel

This project is configured for a quick and easy deployment on [Vercel](https://vercel.com/).

1.  **Set up Firebase**: Before deploying, ensure you have a Firebase project with Firestore and Authentication enabled. You will need to populate the Firebase configuration in `src/firebase/config.ts` and your environment variables.
2.  **Configure Environment Variables**: In your Vercel project settings, you must add the following environment variables for the WhatsApp integration:
    - `WHATSAPP_VERIFY_TOKEN`: A secret token of your choice for webhook verification.
    - `WHATSAPP_ACCESS_TOKEN`: The permanent access token for the WhatsApp Business API from your Meta App.
    - `WHATSAPP_PHONE_NUMBER_ID`: The Phone Number ID from your Meta App.
3.  **Create a Git Repository**: Push the project code to a GitHub, GitLab, or Bitbucket repository.
4.  **Import the Project in Vercel**: From your Vercel dashboard, import the repository you just created. Vercel will automatically detect that it's a Next.js project.
5.  **Deploy**: Click "Deploy". Vercel will handle the rest and provide you with a URL for your live application. After deployment, use the provided URL to set up your webhook in the Meta Developer portal.
