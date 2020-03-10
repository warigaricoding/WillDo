@echo off
echo Note: Node.js needs to be installed prior to running this script

cd /d %~dp0

IF NOT EXIST node_modules\.bin\ng.cmd call npm install

node_modules\.bin\ng.cmd serve