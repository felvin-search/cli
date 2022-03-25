#!/bin/bash

git config user.name hargup
git config user.email work@hargup.in

yarn version --minor
git add .
git commit -m "Minor version bump;"
git push
