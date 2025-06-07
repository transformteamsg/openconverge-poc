#!/usr/bin/env bash

npm run build
npm run preview -- --host $VITE_ADDITIONAL_ARGS
