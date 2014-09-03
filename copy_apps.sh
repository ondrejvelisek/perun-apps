#!/bin/bash

#####################################################
#
#  Copy PERUN-APPS presentation to required destination
#
#  Require 2 params:
#
#  DESTINATION = "user@host" where to deploy
#  TARGET = target folder on destination to copy/deploy files to
#
#####################################################

DESTINATION=$1
TARGET=$2

if [ "X$DESTINATION" = "X" ]; then
	echo "[ERROR] Destination must be specified like 'user@host': $0 [destination target]"
	exit 1
fi
if [ "X$TARGET" = "X" ]; then
	# If target folder is not specified, use default: ~/perun-apps/
	echo "[INFO] Target folder not specified, using default '~/perun-apps/'. You can specify target folder like: $0 [destination target]"
	TARGET=perun-apps/
fi

# Copy the JAR
ssh $DESTINATION rm -r -f $TARGET/*
scp -r $WORKSPACE/* $DESTINATION:$TARGET