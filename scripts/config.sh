#!/usr/bin/bash
# DEFINE PROJECT VARIABLES:
# Establish if this is a DEV or PROD server
export TYPE="dev"
# Project Name:
export PROJ="postgresql-node"
# linux user
export USER="george"
# location of project
export DIR="/home/george/postgresql-node"
# machine's IP and hostname
export IP="192.168.1.91"
export HOST="database"
export PORT=3000
# database name
export DB="snap-wh-db-$TYPE"
export DBPORT=''

echo "starting $TYPE server on $IP aka HTTP://$(hostname):$PORT"
echo "with user:$USER and DB:$DB"
