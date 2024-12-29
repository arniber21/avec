# Avec: University Carpool Platform

## Overview

Avec is an innovative carpool platform designed specifically for university students, making transportation more sustainable, affordable, and community-driven.

## Tech Stack

- **Frontend**: Next.js
- **Backend**: tRPC
- **Authentication**: NextAuth
- **Database ORM**: Prisma
- **Styling**: Tailwind CSS

## Features

- Seamless ride matching for university students
- Secure authentication
- Location-based ride sharing
- In-app communication
- Sustainability tracking

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A university email address

### Installation

1. Clone the repository

    ```bash
    git clone https://github.com/your-username/avec.git
    cd avec
    ```

2. Install dependencies

    ```bash
    npm install
    ```

3. Set up environment variables

    ```bash
    cp .env.example .env
    ```

4. Run database migrations

    ```bash
    npx prisma migrate dev
    ```

5. Start the development server
    ```bash
    npm run dev
    ```

## Contributing

We welcome contributions! Please see `CONTRIBUTING.md` for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## Support

For support, please open an issue in the GitHub repository or contact our team at support@avec.com.
