#!/bin/bash
pgrep -af node | while read -r pid cmd ; do
for col in $cmd
do
if [[ $col = *"explorer"* ]]; then
 kill -9 $pid;
 git pull origin master;
 npm start
 echo "[+] Node App Started sucessfully";
 break;
fi
done;
done;
## E O F ##
