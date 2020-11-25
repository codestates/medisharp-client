import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import moment from 'moment';
// import RNMomentCountDown from 'react-native-moment-countdown';
/*
src/screens/HomeScreen/index.js에서 
const fakeGetAlarmList = {
  1: [false, '13:00:00', { 1: '비염약', 2: '0', 3: '환절기만 되면 이러네 에라이...' }],
  2: [false, '18:30:00', { 1: '밀키천식약', 2: '2', 3: '밀키약 너무 비싸다..ㅠ' }],
};
을 중 
<CountdownTimer upcomingAlarm={fakeGetAlarmList[1]} />
이렇게 내려주고 있으므로 나는 
[false, '13:00:00', { 1: '비염약', 2: '0', 3: '환절기만 되면 이러네 에라이...' }]을 기준으로 시간 countdown을 구현하면 된다. 
*/
class CountdownTimer extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.timeTillDate = this.props.upcomingAlarm[1];
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

    if (minutes <= 0) {
      return (
        <div>
          <Text>오늘은 복용할 약이 없습니다. 내일도 오늘 같기를!</Text>
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
