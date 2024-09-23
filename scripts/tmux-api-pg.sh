#!/bin/bash

# Source server environment variables
source /home/george/postgresql-node/scripts/.env

SESSION="pgapi"
EXISTS=$(tmux list-sessions | grep $SESSION)

# tmux -L pgapi

# If session does not exist already, create it and run the script within it:
if [ "$EXISTS" = "" ]; then
	tmux new-session -d -s $SESSION
	tmux rename-window -t 0 'API ACCESS LOG'
	#tmux send-keys "source /home/george/postgresql-node/scripts/.env" C-m
	tmux send-keys -t $SESSION:0 "cd $PROJ" C-m
	tmux send-keys -t $SESSION:0 "npm run $TYPE" C-m
	tmux split-window -v
	tmux select-pane 1
	#tmux send-keys "source /home/george/postgresql-node/scripts/.env" C-m
	tmux send-keys "psql -d $DB" C-m
fi

tmux attach-session -t $SESSION:0
