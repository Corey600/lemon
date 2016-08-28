#!/bin/sh

echo 'pm2 stop ...'
pm2 stop pm2.json
echo 'pm2 delete ...'
pm2 delete pm2.json
