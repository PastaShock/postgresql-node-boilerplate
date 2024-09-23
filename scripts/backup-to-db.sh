#!/bin/bash
#
# Install into crontab with crontab -e with:
# 0 0 * * * sh /home/$USER/$PROJ/scripts/backup-to-db.sh
#
# This script should be made executable with chmod +x
# and then called in the root? crontab.
#
# check where the cronjob is running from:
echo $PWD >> /dev/pts/2
# 
# I could set a vars file that is imported here, maybe from the .env
. $PWD/postgresql-node/scripts/config.sh
#
# set filename:
BAKNAME="$DB-backup-$(date +%F).sql"
USER="$(users | cut -f 1 -d ' ')"
DEST="$PWD/$PROJ"
echo "vars are: DB: $DB PROJ: $PROJ BAKNAME: $BAKNAME USER: $USER DEST: $DEST" >> /dev/pts/2
# Test if dir exists
if [ ! -d $DEST ]; then
	# make dir
	mkdir $DEST
fi
# check if any variables are empty
if [ $BAKNAME ]; then
	echo "var BAKNAME:$BAKNAME" >> /dev/pts/2
	# I could log the status of this script to a log file
	echo "[ $(date) ] : backing up file $BAKNAME to $DEST/backup/" >> $DEST/logs/backup.log
	pg_dump -U $USER $DB > "$DEST/backup/$BAKNAME"
	else
	echo "var BAKNAME:$BAKNAME is empty" >> /dev/pts/2
fi
