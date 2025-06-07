# Contributing to Converge 👋

First off, thank you for your interest in contributing to Converge! We welcome any form of contribution, including but not limited to:

- Reporting bugs
- Suggesting enhancements
- Contributing code (bug fixes, new features)
- Improving documentation
- Answering questions and helping others in the community

## How Can I Contribute?

### Reporting Bugs

If you encounter a bug, please ensure the bug was not already reported by searching on GitHub under [Issues](https://github.com/transformteamsg/openconverge-poc/issues).

If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/transformteamsg/openconverge-poc/issues/new). Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample or an executable test case** demonstrating the expected behavior that is not occurring.

### Suggesting Enhancements

If you have an idea for a new feature or an improvement to an existing one, please ensure it hasn't already been suggested by searching on GitHub under [Issues](https://github.com/transformteamsg/openconverge-poc/issues).

If you're unable to find an open issue discussing the enhancement, [open a new one](https://github.com/transformteamsg/openconverge-poc/issues/new). Provide a **clear and detailed explanation** of the feature, **why it's needed**, and potential **implementation approaches** if you have them.

### Code Contributions (Pull Requests)

We enthusiastically welcome code contributions via Pull Requests (PRs)! If you're planning to contribute, please follow these guidelines:

1.  **Discuss First (for significant changes):** If you're proposing a major change, new feature, or significant refactoring, please [open an issue](https://github.com/transformteamsg/openconverge-poc/issues/new) first to discuss the approach and ensure it aligns with the project's goals. For smaller bug fixes, feel free to go straight to a PR.

2.  **Fork & Branch:**

    - Fork the repository on GitHub.
    - Clone your fork locally.
    - Create a descriptive branch from the `main` branch. Good branch names include the type of change and a short description (e.g., `fix/login-bug`, `feat/add-user-profile`, `docs/update-readme`).
      ```bash
      git switch main
      git pull origin main
      git switch -c feat/your-feature-name
      ```

3.  **Set Up Environment:** Follow the instructions in the [Development Setup](#development-setup) section to prepare your local environment.

4.  **Implement Changes:**

    - Write your code, adhering to the guidelines in the [Code Style Guidelines](#code-style-guidelines) section.
    - Ensure your changes address the intended issue or feature.

5.  **Write Tests:**

    - Add relevant unit or integration tests for any new functionality or bug fixes. We aim for good test coverage to maintain stability.
    - Ensure all tests pass by running:
      ```bash
      pnpm test
      ```

6.  **Update Documentation:** If your changes affect user-facing features, internal APIs, or the development process, please update the relevant documentation (e.g., README, specific docs pages).

7.  **Commit Changes:**

    - Keep your commits logical and atomic.
    - Write clear and concise commit messages. We recommend following the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification (e.g., `fix: correct typo in contribution guide`, `feat: add user authentication`). This helps automate release notes and makes the history easier to understand.
    - Remember that `husky` hooks will run `lint-staged` and potentially other checks (like type checking on push) automatically.

8.  **Push and Open Pull Request:**
    - Push your branch to your fork on GitHub.
    - Open a Pull Request (PR) targeting the `main` branch of the `transformteamsg/converge` repository.
    - Provide a clear title and description for your PR. **The PR title should also follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format.** Explain the "what" and "why" of your changes. Link to any relevant issues (e.g., "Closes #123").
    - Ensure your PR is focused on a single task. If you have multiple unrelated changes, please submit them as separate PRs.

#### Pull Request Process

1.  **Review:** Maintainers will review your PR. Automated checks (CI tests, linting, etc.) must pass.
2.  **Feedback:** Reviewers may provide feedback or request changes. Please address these comments and push updates to your branch (the PR will update automatically). Engage in discussion if clarification is needed.
3.  **Approval & Merge:** Once the PR is approved by the maintainers and all checks have passed, it will be merged into the `main` branch. Congratulations and thank you for your contribution! 🎉

## Development Setup

To contribute code, you'll need to set up your development environment.

**Prerequisites:**

- **Node.js:** Version 22 or 23. You can use a version manager like [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm) to manage Node.js versions.

**Steps:**

1.  **Clone your fork:**
    Replace `YOUR_USERNAME` with your actual GitHub username.

    ```sh
    git clone git@github.com:YOUR_USERNAME/converge.git
    cd converge
    ```

### Frontend

1. **Navigate to the `frontend` folder:**

   ```sh
   cd frontend
   ```

2. **Install dependencies using `npm`:**

   ```sh
   npm install
   ```

### Backend

1. **Navigate to the `backend` folder:**

   ```sh
   cd backend
   ```

2. **Install poetry using pipx:**

   ```sh
   pipx install poetry
   ```

_Refer to [pipx installation guide](https://pipx.pypa.io/stable/installation/) if you do not have `pipx`._

3. **Create a virtual environment:**

   ```sh
   poetry shell
   ```

4. **Install required packages::**

   ```sh
   poetry install
   ```

## AWS Cognito OAuth

This application uses AWS Cognito for authentication. To run the app locally, you need to configure the following environment variables:

`OAUTH_COGNITO_CLIENT_ID`

`OAUTH_COGNITO_CLIENT_SECRET`

`OAUTH_COGNITO_DOMAIN`

**Steps to Set Up AWS Cognito:**

1. Log in to your AWS Management Console.
2. Navigate to Amazon Cognito and create or use an existing user pool.
3. Create an App Client under the user pool settings.
4. Note down the following values:

- App Client ID → OAUTH_COGNITO_CLIENT_ID
- App Client Secret → OAUTH_COGNITO_CLIENT_SECRET
- Cognito Domain → OAUTH_COGNITO_DOMAIN (can be set up in the "App Integration" section).

5. Add these values to your .env file.
   Example .env Configuration:

`OAUTH_COGNITO_CLIENT_ID=your-client-id`

`OAUTH_COGNITO_CLIENT_SECRET=your-client-secret`

`OAUTH_COGNITO_DOMAIN=your-cognito-domain`

Note: Refer to the [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/) for detailed setup instructions.

## Prerequisites: AWS S3 Bucket and IAM Role

Before running the app locally, ensure you have the necessary AWS resources set up:

1. **Set Up an S3 Bucket**

- Go to the [Amazon S3 Getting Started Guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/GetStartedWithS3.html%23creating-bucket) to create a bucket in your AWS account.
- Once the bucket is created, note down the following details:
  - Bucket Name (e.g., your-s3-bucket-name)
  - Region (e.g., us-west-1)

2. **Create an IAM Role with Appropriate Permissions**

- Refer to the [AWS IAM Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html) to create a role.
- Ensure the role has the required permissions for accessing your S3 bucket. You can:
- Use the AmazonS3FullAccess policy.
  - Or create a custom policy with the specific permissions your app requires.
- Note down the following details:
  - Role ARN (e.g., arn:aws:iam::123456789012:role/your-role-name)
  - AWS Profile Name (if using a profile to manage credentials locally).

3. **Update the Environment Variables**

After setting up the S3 bucket and IAM role, update your .env file with the following variables:

`S3_BUCKET_NAME=your-s3-bucket-name`

`AWS_REGION=your-aws-region`

`AWS_ROLE_ARN=your-aws-role-arn`

## Code of Conduct

We expect all contributors and participants to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please ensure you are familiar with its contents and follow the guidelines for reporting any violations.
