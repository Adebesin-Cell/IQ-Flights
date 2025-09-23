# Contributing to the AI Travel Agent Project

First off, thank you for considering contributing! We welcome any help, from fixing typos to implementing major new features. This document provides a set of guidelines for contributing to this project.

## Code of Conduct

This project and everyone participating in it is governed by a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior. (Note: You may need to create this file).

## How Can I Contribute?

-   **Reporting Bugs**: If you find a bug, please open an issue and provide as much detail as possible.
-   **Suggesting Enhancements**: Have an idea for a new feature or an improvement? Open an issue to discuss it.
-   **Pull Requests**: Ready to contribute some code? We'd love to see it!

Check out our [TODO.md](TODO.md) for a list of tasks that need attention.

## Setting Up Your Development Environment

To get started with development, you'll need to set up the project on your local machine.

### 1. Fork & Clone

First, fork the repository to your own GitHub account and then clone it to your local machine:

```bash
git clone https://github.com/YOUR_USERNAME/iq-flights.git
cd iq-flights
```

### 2. Install Dependencies

This project uses `pnpm` for package management. To install the dependencies listed in `package.json`, run:

```bash
pnpm install
```

### 3. Configure Environment Variables

The project requires API keys and other configuration values to run. These are managed through a `.env` file.

1.  Create a copy of the example file:
    ```bash
    cp .env.example .env
    ```
2.  Open the new `.env` file and add your credentials. You will need to get a `GOOGLE_API_KEY` from Google AI Studio.

### 4. Run the Project

To start the development server with live-reloading, use the `dev` script from `package.json`:

```bash
pnpm dev
```

You are now ready to start making changes!

## Submitting a Pull Request

1.  Create a new branch for your feature: `git checkout -b feature/your-feature-name`.
2.  Make your changes and commit them with a clear message.
3.  Push your branch to your fork: `git push origin feature/your-feature-name`.
4.  Open a pull request from your fork to the main repository.
5.  Provide a clear title and description for your pull request, linking to any relevant issues.

Thank you for your contribution!