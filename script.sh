#!/bin/bash
pgrep -af node | while read -r pid cmd ; do     
for col in $cmd
do
echo $col
if [[ $col = *"explorer"* ]]; then
  kill -9 $pid
fi
done;
done;
cd /home/explorer;
git pull origin master;
sleep 1;
npm start;
echo "[+] Node App Started sucessfully";
## E O F ##
