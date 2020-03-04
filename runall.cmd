@echo off

echo Note: Node.js, JDK, and MongoDB need to be installed prior to running this script


:: make sure the database is running
start /b cmd /c mongod


:: make sure the server is running
cd %~dp0
start /b cmd /c mvnw.cmd spring-boot:run


:: make sure the client is running
cd client
IF NOT EXIST node_modules\.bin\ng.cmd call npm install

start /b cmd /c node_modules\.bin\ng.cmd serve


:: open the web page
timeout 5
start http://localhost:4200/