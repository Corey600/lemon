#!/bin/sh

echo 'pm2 stop ...'
pm2 stop pm2.json
echo 'pm2 start ...'
pm2 start pm2.json
sleep 3
pm2 list
