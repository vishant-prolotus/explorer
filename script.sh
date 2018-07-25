#!/bin/bash
pm2 stop explorer
git pull origin master;
npm start
echo "[+] Node App Started sucessfully";
## E O F ##
