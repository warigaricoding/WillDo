@echo off

echo Note: Node.js, JDK, and MongoDB need to be installed prior to running this script


:: make sure the database is running
mongod


:: make sure the server is running
cd %~dp0
mvnw spring-boot:run


:: make sure the client is running
cd client
IF NOT EXIST node_modules/.bin/ng.cmd (
	npm install --prefer-offline
)
node_modules/.bin/ng.cmd serve


:: open the web page
start http://localhost:4200/