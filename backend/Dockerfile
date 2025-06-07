# backend/Dockerfile

# Builder stage for installing dependencies and building backend
FROM python:3.12.3-slim as builder

RUN pip install poetry

# Set unbuffered mode for Python output to help with logging
ENV PYTHONUNBUFFERED=1 \
    POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache

# Set the working directory in the container
WORKDIR /app

# Copy necessary files
COPY poetry.lock .
COPY pyproject.toml .
COPY README.md .

# Install any needed packages specified in poetry
RUN --mount=type=cache,target=$POETRY_CACHE_DIR poetry install --no-root


# Runtime stage: Copy only the necessary artifacts from the builder stage
FROM python:3.12.3-slim as runtime

# Set the working directory in the container
WORKDIR /app

# Define env variables path
ENV VIRTUAL_ENV=/app/.venv \
    PATH="/app/.venv/bin:$PATH"

# Install library required for Postgres
RUN apt-get update && apt-get install -y libpq-dev

# Copy built application from the builder stage
COPY --from=builder ${VIRTUAL_ENV} ${VIRTUAL_ENV}

# Copy necessary source code and files
COPY src src
COPY .chainlit .chainlit

# Copy the launch script into the container
COPY launch.sh .
RUN chmod +x launch.sh

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Run launch.sh when the container launches
ENTRYPOINT ["bash", "launch.sh"]
