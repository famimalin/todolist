import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';

// set dayjs locale
dayjs.locale('zh-tw');

/**
 * Variables
 */
export const FORMAT_TYPE = {
  TIME_AGO: 'timeAgo',
  SIMPLE_TIME_AGO: 'simpleTimeAgo',
  SIMPLE_FULL_TIME: 'simpleFullTime',
  FORMAT_MEDIA_PLAY_TIME: 'formatMediaPlayTime',
  TIME_STRING: 'timeString',
  TIME_DASH_STRING: 'timeDashString',
  FULLTIME_DASH_STRING: 'fulltimeDashString',
  TIME_SLASH_STRING: 'timeSlashString',
  TIME_CHINESE_STRING: 'timeChineseString',
  SIMPLE_MEDIA_PLAY_TIME: 'simpleMediaPlayTime',
};

export const ForamtMethod = {
  formatLongToDatetimeLocal: (time) => {
    return dayjs(time).format('YYYY-MM-DDTHH:mm');
  } 
}

/**
 * Main Component
 */
const TimeFormat = props => {

  const formatTime = () => {
    const time = props.time;
    const aDay = 86400000;
    const date = new Date(time);
    const now = new Date();

    switch (props.format) {
      case FORMAT_TYPE.TIME_AGO: {
        if (date.getFullYear() === now.getFullYear()) {
          if (now.getTime() - date.getTime() >= aDay) {
            return dayjs(time).format('L');
          } else {
            return dayjs(time).fromNow();
          }
        } else {
          return dayjs(time).format('LL');
        }
      }
      case FORMAT_TYPE.SIMPLE_TIME_AGO: {
        if(date.getFullYear() === now.getFullYear()){
            if (now.getTime() - date.getTime() >= aDay) {
                return dayjs(time).format('YYYY-MM-DD');
            } else{
                return dayjs(time).fromNow();
            }
        } else{
            return dayjs(time).format('YYYY-MM-DD');
        }
      }
      case FORMAT_TYPE.SIMPLE_FULL_TIME: {
        return dayjs(time).format('YYYY/MM/DD HH:mm');
      }
      case FORMAT_TYPE.FORMAT_MEDIA_PLAY_TIME: {

        if (!isNaN(time) && time > 0) {
          var minutes = Math.floor(time / 60);
          var seconds = Math.round(time % 60);
          var hours = Math.floor(time / 3600);

          if(hours < 1) {
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            return minutes + ":" + seconds;
          } else {
            minutes = Math.round(minutes % 60);
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            return hours + ":" + minutes + ":" + seconds;
          }
          
        }

        return "--:--";
      }
      case FORMAT_TYPE.TIME_STRING: {
        return dayjs(time).format('YYYY.MM.DD');
      }
      case FORMAT_TYPE.TIME_DASH_STRING: {
        return dayjs(time).format('YYYY-MM-DD');
      }
      case FORMAT_TYPE.FULLTIME_DASH_STRING: {
        return dayjs(time).format('YYYY-MM-DD HH:mm');
      }
      case FORMAT_TYPE.TIME_SLASH_STRING: {
        return dayjs(time).format('YYYY / MM / DD');
      }
      case FORMAT_TYPE.TIME_CHINESE_STRING: {
        return dayjs(time).format('YYYY年MM月DD日');
      }
      case FORMAT_TYPE.SIMPLE_MEDIA_PLAY_TIME: {
        if (!isNaN(time) && time > 0) {
          var isHour = time / 3600 > 0;
          
          if(isHour) {
            return ' ' + Math.floor(time / 3600 * 10) / 10 + ' hr';
          } else {
            return ' ' + Math.floor(time / 60 * 10) / 10 + ' min';
          }
        }
        return 0;
      }
      default: 
        return '';
    }
  };

  const formatted = formatTime();
    
  return <span>{formatted}</span>;
};

TimeFormat.propTypes = {
  time: PropTypes.number.isRequired,
  format: PropTypes.oneOf([
    FORMAT_TYPE.TIME_AGO,
    FORMAT_TYPE.SIMPLE_TIME_AGO,
    FORMAT_TYPE.SIMPLE_FULL_TIME,
    FORMAT_TYPE.FORMAT_MEDIA_PLAY_TIME,
    FORMAT_TYPE.TIME_STRING,
    FORMAT_TYPE.TIME_DASH_STRING,
    FORMAT_TYPE.FULLTIME_DASH_STRING,
    FORMAT_TYPE.TIME_SLASH_STRING,
    FORMAT_TYPE.TIME_CHINESE_STRING,
    FORMAT_TYPE.SIMPLE_MEDIA_PLAY_TIME,
  ]).isRequired,
};

TimeFormat.defaultProps = {
  format: FORMAT_TYPE.FORMAT_TYPE,
};

export default React.memo(TimeFormat);