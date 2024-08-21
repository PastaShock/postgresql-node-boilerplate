#!/bin/bash

# import project vars
source .env

SESSION="pgapi"
EXISTS=$(tmux list-sessions | grep $SESSION)

# If session does not exist already, create it and run the script within it:
if [ "$EXISTS" = "" ]; then
	tmux new-session -d -s $SESSION
	tmux rename-window -t 0 'API ACCESS LOG'
	tmux send-keys -t $SESSION:0 "cd $PROJ" C-m
	tmux send-keys -t $SESSION:0 "npm run $TYPE" C-m
	tmux split-window -v
	tmux select-pane 1
	tmux send-keys "source $PROJ/scripts/.env" C-m
	tmux send-keys "psql -d $DB" C-m
fi

tmux attach-session -t $SESSION:0
