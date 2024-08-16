#!/bin/bash
#
# ----- THIS IS UNTESTED AND BASICALLY PSUEDOCODE -----
#
# This script should be made executable with chmod +x
# and then called in the root? crontab.
#
# I could set a vars file that is imported here, maybe from the .env
# import .env or something
#
# set db name
DB="orders-dev-testing"
# set proj dir
PROJ="postgresql-node"
# set filename:
BAKNAME="$DB-backup-$(date +%F).sql"
DEST="/home/$USER/$PROJ/backup/"
# Test if dir exists
if [ ! -d $DEST ]; then
	# make dir
	mkdir $DEST
fi
# I could log the status of this script to a log file
echo "[ $(date) ] : backing up file $BAKNAME to $DEST"
pg_dump -U $USER $DB > "$DEST$BAKNAME"
