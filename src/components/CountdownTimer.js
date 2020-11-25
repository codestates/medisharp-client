import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import moment from 'moment';

class CountdownTimer extends React.Component {
  constructor(props) {
    super(props);
    const fakeAlarmListArry = this.props.upcomingAlarm;
    // console.log('fake: ', fakeAlarmListArry); // [[false, '13:00:00', { 1: '비염약', 2: '0', 3: '환절기만 되면 이러네 에라이...' }],[false, '18:30:00', { 1: '밀키천식약', 2: '2', 3: '밀키약 너무 비싸다..ㅠ' }],];

    const getRecentAlarm = () => {
      for (let time of fakeAlarmListArry) {
        //time이 정렬되어있는 fakeAlarmListArray.
        let now = moment();
        let then = moment(time[1], 'hh:mm');
        let term = moment.duration(then.diff(now));
        if (term.hours() >= 0 && term.minutes() >= 0) {
          return time[1];
        }
      }
    };
    //이러고 있다가 0시간 0분 차이가 되면 '약 복용 시간입니다'를 잠깐 보여주고 다시 리로딩되면서
    //getRecentAlarm이 다시 실행되어야함. 그래서 그 다음번 알람이 주어져야 한다.
    this.props = props;
    this.timeTillDate = getRecentAlarm();
    this.timeFormat = 'hh:mm';
    this.then = moment(this.timeTillDate, this.timeFormat);
    this.now = moment();
    this.hours = moment.duration(this.then.diff(this.now)).hours();
    this.minutes = moment.duration(this.then.diff(this.now)).minutes();
    this.state = {
      hours: this.hours,
      minutes: this.minutes,
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      const then = moment(this.timeTillDate, this.timeFormat);
      const now = moment();
      const hours = moment.duration(then.diff(now)).hours();
      const minutes = moment.duration(then.diff(now)).minutes();

      this.setState({ hours, minutes });
    }, 1000);
  }
  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
  render() {
    const { hours, minutes } = this.state;

    if (minutes < 0) {
      return (
        <div>
          <Text>오늘은 복용할 약이 없습니다. 내일도 오늘 같기를!</Text>
        </div>
      );
    } else if (hours == 0 && minute == 0) {
      return (
        <div>
          <Text>약 복용하실 시간입니다~</Text>
        </div>
      );
    }
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
        </div>
        <Text>
          <h3>남았습니다.</h3>
        </Text>
      </div>
    );
  }
}
export default CountdownTimer;
