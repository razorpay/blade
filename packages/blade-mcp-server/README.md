# Blade MCP Server

A server implementation for the Model Context Protocol (MCP) used with the Blade design system.

## Overview

This package provides an MCP server implementation using Anthropic's Model Context Protocol SDK to integrate AI assistants with the Blade design system.

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- Yarn package manager

### Installation

```bash
# From the root of the monorepo
yarn install
```

### Environment Setup

Copy the example environment file and update with your credentials:

```bash
cp .env.example .env
```

Update the `.env` file with your Anthropic API key.

### Development

To start the development server:

```bash
yarn dev
```

The server will run on http://localhost:3000 (or the port specified in your environment).

### Building

To build the package:

```bash
yarn build
```

### Running in Production

To run the built server:

```bash
yarn start
```

## API Endpoints

- `GET /v1/assistants`: List all available assistants
- `POST /v1/assistants/{assistant_id}/messages`: Send a message to an assistant

## License

MIT 