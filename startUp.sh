#!/bin/bash
# Startup script for the RoseWeather
#
# Designed to be started from RoseWeather.desktop (autostart)
#
# or alternatively from crontab as follows
#@reboot sh /home/pi/RoseWeather/startup.sh

#
cd $HOME/RoseWeather

#
if [ "$DISPLAY" = "" ]
then
	export DISPLAY=:0
fi

# wait for Xwindows and the desktop to start up
MSG="echo Waiting 45 seconds before starting"
DELAY="sleep 45"
if [ "$1" = "-n" -o "$1" = "--no-sleep" -o "$1" = "--no-delay" ]
then
	MSG=""
	DELAY=""
	shift
fi
if [ "$1" = "-d" -o "$1" = "--delay" ]
then
	MSG="echo Waiting $2 seconds before starting"
	DELAY="sleep $2"
	shift
	shift
fi
if [ "$1" = "-m" -o "$1" = "--message-delay" ]
then
	MSG="echo Waiting $2 seconds for response before starting"
	#DELAY="xmessage -buttons Now:0,Cancel:1 -default Now -timeout $2 Starting RoseWeather in $2 seconds"
	DELAY='zenity --question --title RoseWeather --ok-label=Now --cancel-label=Cancel --timeout '$2' --text "Starting RoseWeather in '$2' seconds" >/dev/null 2>&1'
	shift
	shift
fi

$MSG
eval $DELAY
if [ $? -eq 1 ]
then

	echo "RoseWeather Cancelled"
	exit 0
fi

#xmessage -timeout 5 Starting RoseWeather....... &
zenity --info --timeout 3 --text "Starting RoseWeather......." >/dev/null 2>&1 &

# stop screen blanking
echo "Disabling screen blanking...."
xset s off
xset -dpms
xset s noblank

# get rid of mouse cursor
pgrep unclutter >/dev/null 2>&1
if [ $? -eq 1 ]
then
	unclutter >/dev/null 2>&1 &
fi

echo "Setting sound to max (assuming Monitor Tv controls volume)...."
# push sound level to maximum
amixer cset numid=1 -- 400 >/dev/null 2>&1


# the main app
cd Display
if [ "$1" = "-s" -o "$1" = "--screen-log" ]
then
  echo "Starting RoseWeather.... logging to screen."
  python -u RoseWeather.py
else
  # create a new log file name, max of 7 log files
  echo "Rotating log files...."
  rm RoseWeather.7.log >/dev/null 2>&1
  mv RoseWeather.6.log RoseWeather.7.log >/dev/null 2>&1
  mv RoseWeather.5.log RoseWeather.6.log >/dev/null 2>&1
  mv RoseWeather.4.log RoseWeather.5.log >/dev/null 2>&1
  mv RoseWeather.3.log RoseWeather.4.log >/dev/null 2>&1
  mv RoseWeather.2.log RoseWeather.3.log >/dev/null 2>&1
  mv RoseWeather.1.log RoseWeather.2.log >/dev/null 2>&1
  echo "Starting RoseWeather.... logging to Clock/RoseWeather.1.log "
  python -u RoseWeather.py >RoseWeather.1.log 2>&1
fi
