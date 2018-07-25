#!/bin/bash
pm2 stop explorer
git pull origin master;
pm2 start explorer.js
echo "[+] Node App Started sucessfully";
## E O F ##
