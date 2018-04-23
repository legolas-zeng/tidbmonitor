#!/bin/bash

case $1 in 
	start)
		nohup ./tidb_monitor 2>&1 >> info.log 2>&1 /dev/null &
		echo "服务已启动..."
		sleep 1
	;;
	stop)
		killall tidb_monitor
		echo "服务已停止..."
		sleep 1
	;;
	restart)
		killall tidb_monitor
		sleep 1
		nohup ./tidb_monitor 2>&1 >> info.log 2>&1 /dev/null &
		echo "服务已重启..."
		sleep 1
	;;
	*) 
		echo "$0 {start|stop|restart}"
		exit 4
	;;
esac
