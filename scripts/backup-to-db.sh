#!/bin/bash
#
# Install into crontab with crontab -e with:
# 0 0 * * * sh /home/$USER/$PROJ/scripts/backup-to-db.sh
#
# This script should be made executable with chmod +x
# and then called in the root? crontab.
#
# I could set a vars file that is imported here, maybe from the .env
source /home/$USER/postgresql-node/scripts/.env
#
# set filename:
BAKNAME="$DB-backup-$(date +%F).sql"
USER="$(users | cut -f 1 -d ' ')"
DEST="/home/$USER/$PROJ"
# echo "vars are:\nDB: $DB\nPROJ: $PROJ\nBAKNAME: $BAKNAME\nUSER: $USER\nDEST: $DEST" >> /dev/pts/5
# Test if dir exists
if [ ! -d $DEST ]; then
	# make dir
	mkdir $DEST
fi
# I could log the status of this script to a log file
echo "[ $(date) ] : backing up file $BAKNAME to $DEST/backup/" >> $DEST/logs/backup.log
pg_dump -U $USER $DB > "$DEST/backup/$BAKNAME"
