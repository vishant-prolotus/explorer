#!/bin/bash
pgrep -af node | while read -r pid cmd ; do     
for col in $cmd
do
echo $col
if [[ $col = *"explorer"* ]]; then
 kill -9 $pid;
 git pull origin master;
 npm start;
 echo "[+] Node App Started sucessfully";
fi
done;
done;
## E O F ##
