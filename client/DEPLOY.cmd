@ECHO off
cd /d %~dp0
"%~dp0node_modules\.bin\ng.cmd" serve
	## above is the long form of `ng serve`