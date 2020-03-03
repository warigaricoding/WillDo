@echo off
echo Note: Node.js needs to be installed prior to running this script

cd /d %~dp0\client

IF NOT EXIST node_modules/.bin/ng.cmd (
	npm i --prefer-offline
)

node_modules/.bin/ng.cmd serve