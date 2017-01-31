#!/bin/bash
#Usage: ./sshmx.sh SSH_KEY_DIR USERNAME INSTANCE_NAME

if [ -z $MXIPDIR ] #if the mxip directory isn't defined
    then
    echo "Required environment variable \"MXIPDIR\" missing."
    echo "Please define this in your environment as the directory (but not the script itself)"
    echo "where mxip.js lives, then try again."
    echo "Hint: add \"export MXIPDIR=/path/to/mxip/\" to either ~/.bashrc or ~/.zshrc, depending on"
    echo "your shell, then restart your shell."
    exit
fi

if [ ! -d $MXIPDIR/node_modules ] #if mxip directory is defined, but npm install was not run on it.
    then
    cd $MXIPDIR
    npm install
    cd -
fi

sftp -i $1 $2@`node $MXIPDIR/mxip.js $3`
