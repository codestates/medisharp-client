import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import moment from 'moment';

function getRecentAlarm(AlarmListArry) {
  //time이 정렬되어있는 fakeAlarmListArray가 인자로 넘어와서 AlarmListArry가 됨
  for (let time of AlarmListArry) {
    let now = moment();
    let then = moment(time[1], 'hh:mm:ss');
    let term = moment.duration(then.diff(now));
    if (term.hours() >= 0 && term.minutes() >= 0 && term.seconds() >= 0) {
      return time[1];
    }
  }
}

class CountdownTimer extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.timeTillDate = getRecentAlarm(this.props.upcomingAlarm);
    this.timeFormat = 'hh:mm:ss';
    this.then = moment(this.timeTillDate, this.timeFormat);
    this.now = moment();
    this.hours = moment.duration(this.then.diff(this.now)).hours();
    this.minutes = moment.duration(this.then.diff(this.now)).minutes();
    this.seconds = moment.duration(this.then.diff(this.now)).seconds();
    this.state = {
      hours: this.hours,
      minutes: this.minutes,
      seconds: this.seconds,
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      const timeTillDate = getRecentAlarm(this.props.upcomingAlarm);
      const then = moment(timeTillDate, this.timeFormat);
      const now = moment();
      const hours = moment.duration(then.diff(now)).hours();
      const minutes = moment.duration(then.diff(now)).minutes();
      const seconds = moment.duration(then.diff(now)).seconds();
      this.setState({ hours, minutes, seconds });
    }, 1000);
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  render() {
    const { hours, minutes, seconds } = this.state;

    if (hours === 0 && minutes === 0 && seconds === 0) {
      return (
        <div>
          <Text>약 복용하실 시간입니다~</Text>
        </div>
      );
    } else if (!hours && !minutes && hours !== 0 && minutes !== 0) {
      return (
        <div>
          <Text>오늘은 복용할 약이 없습니다. 내일도 오늘 같기를!</Text>
        </div>
      );
    } else {
      return (
        <div>
          <Text>
            <h3>다음 알람까지</h3>
          </Text>
          <div className="countdown-wrapper">
            {
              <div className="countdown-item">
                {hours}
                <span> 시간</span>
              </div>
            }
            {
              <div className="countdown-item">
                {minutes}
                <span> 분</span>
              </div>
            }
            {
              <div className="countdown-item">
                {seconds}
                <span> 초</span>
              </div>
            }
          </div>
          <Text>
            <h3>남았습니다.</h3>
          </Text>
        </div>
      );
    }
  }
}
export default CountdownTimer;
