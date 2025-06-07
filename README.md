# Converge

> [!NOTE]
> This project is a Proof of Concept (POC) chat interface for Converge, focused on rapid prototyping while balancing security and usability.
>
> It is designed to work in conjunction with the API server: [transformteamsg/openconverge-api](https://github.com/transformteamsg/openconverge-api).

## 🚀 Quick Start

Please ensure that you have completed the required [development setup](./CONTRIBUTING.md#development-setup) before proceeding.

### Server

Ensure that you have the necessary environment variables:

#### Frontend

1. **Setup environment variables:**

```sh
cp .env.example .env.local
```

2. **Start the server:**

```sh
cd frontend
npm run dev
```

#### Backend

1. **Setup environment variables:**

```sh
cp .env.example .env
```

2. **Generate the Chainlit JWT secret key:**

```sh
chainlit create-secret
```

_Insert the generated value into .env under CHAINLIT_AUTH_SECRET._

3. **Unset the AWS_VAULT environment variable:**

If AWS_VAULT is already set in your shell session, unset it to avoid conflicts:

```sh
unset AWS_VAULT
```

4. **Set your IAM role using aws-vault:**

Use the `aws-vault` command to assume the IAM role configured for your app. Replace `<profile-name>` with your AWS profile name or role:

```sh
aws-vault exec <profile-name>
```

5. **Start the server:**

```sh
chainlit run src/server.py -h --port 8000
```

### Run ClamAV Locally

To enable virus scanning functionality, you'll need to set up ClamAV and the REST API connector locally:

1. **Download and run the ClamAV Docker image:**

- Visit the [ClamAV Docker Hub page](https://hub.docker.com/r/clamav/clamav/) and pull the image:

```sh
  docker pull clamav/clamav
```

- Start the ClamAV container:

```sh
  docker run -d clamav/clamav
```

2. **Retrieve the network IP of the ClamAV container:**

Run the following command to get the container's network IP:

```sh
  docker inspect {clamav-container-ID}
```

3. **Clone the ClamAV REST API repository:**

```sh
  git clone https://github.com/benzino77/clamav-rest-api
  cd clamav-rest-api
```

4. **Run the ClamAV REST API Docker container:**

From the root of the `clamav-rest-api` repository, execute:

```sh
docker run -d -p 8080:8080 \
-e NODE_ENV=production \
-e APP_PORT=8080 \
-e APP_FORM_KEY=FILES \
-e CLAMD_IP={clamav-docker-container-network-IP} \
-e APP_MAX_FILE_SIZE=31457280 \
benzino77/clamav-rest-api
```

5. **Update your backend configuration:**

In the backend `.env` file, set:

```sh
CLAM_AV_SCAN=true
```

6. **Wait for ClamAV to start:**

- The ClamAV container may take 1-2 minutes to initialize. Ensure the client has fully started before running the REST API connector.

## Contributing

Contributions to Converge are welcome and highly appreciated. However, before you jump right into it, we would like you to review our [Contribution Guidelines](./CONTRIBUTING.md) to make sure you have a smooth experience contributing to Converge.

## Authors & Contributors

- Alex Ng / [@axxng](https://github.com/axxng)
- Kelly Lim / [@kellylimmm](https://github.com/kellylimmm)
- Lai Ho Lim / [@iamlaiho](https://github.com/iamlaiho)
- Chadin Anuwattanaporn / [@chadinwork](https://github.com/chadinwork)
- Yi Ming Peh / [@yimingiscold](https://github.com/yimingiscold)
