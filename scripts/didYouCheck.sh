#!/bin/bash

echo "!!! EXTREMELY IMPORTANT WARNINGS !!!"
echo "Before building/deploying your application you should check"
echo "this important things: "
echo " * did you changed version number in app.example.json?"
echo " * did you changed version number in package.json?"
echo " * did you changed version code in app.example.json (build-only)?"

read -p "Are you sure you want to continue? [yN]: " -r

if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    # Abort execution if response was NO
    echo "Aborting ..."
    exit 1
fi

echo "Hope you know what you are doing :)"
exit 0