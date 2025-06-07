#!/bin/bash

# Initialize default variables
DETACHED=""
BUILD=""

# Parse command-line options
while getopts ":d-:" opt; do
  case ${opt} in
    d )
      DETACHED="-d"
      ;;
    - )
      case "${OPTARG}" in
        build)
          BUILD="--build"
          ;;
        *)
          echo "Invalid option: --${OPTARG}" >&2
          exit 1
          ;;
      esac
      ;;
    \? )
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
    : )
      echo "Invalid option: -$OPTARG requires an argument" >&2
      exit 1
      ;;
  esac
done

# Shift off the options and optional -- separator
shift $((OPTIND -1))

# Combine the .env files
cat frontend/.env backend/.env > .env.combined

# Run docker-compose with the appropriate options
docker-compose --env-file .env.combined up $DETACHED $BUILD

# Clean up the combined env file after running
rm .env.combined
