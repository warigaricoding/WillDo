@echo off

echo Note: Node.js, JDK, and MongoDB need to be installed prior to running this script


:: make sure the database is running
start /b cmd /c mongod


:: make sure the server is running
start /d "%~dp0" /b cmd /c mvnw.cmd spring-boot:run


:: make sure the client is running
cd client
IF NOT EXIST node_modules\.bin\ng.cmd call npm install

call node_modules\.bin\ng.cmd serve --open

pause