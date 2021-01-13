import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { View, Text, Dimensions, StyleSheet, FlatList, Alert } from 'react-native';
import CountdownTimer from '../../components/CountdownTimer';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { useAsyncStorage } from '@react-native-community/async-storage';
import { NavigationEvents } from 'react-navigation';
const { getItem } = useAsyncStorage('@yag_olim');

const window = Dimensions.get('window');
let verticalMargin = window.height * 0.02;

//푸쉬 설정해줄때
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
const HomeScreen = ({ navigation }) => {
  const [GetTodayChecked, setGetTodayChecked] = useState([]);
  const [alarmList, setTodayAlarm] = useState([]);
  const useEffectForToday = () => {
    async function get_token() {
      const token = await getItem();
      return token;
    }
    get_token().then((token) => {
      axios({
        method: 'get',
        url: 'http://127.0.0.1:5000/schedules-dates/today',
        headers: {
          Authorization: token,
        },
        params: {
          startDay: moment().subtract(8, 'd').format('YYYY-MM-DD'),
          endDay: moment().subtract(1, 'd').format('YYYY-MM-DD'),
          date: moment().format('YYYY-MM-DD'), //2020-11-22
        },
      })
        .then((data) => {
          setGetTodayChecked(data.data.results.today_check);
          setTodayAlarm(data.data.results.today_alarm);
        })
        .catch((err) => {
          console.error(err);
          Alert.alert(
            '에러가 발생했습니다!',
            '다시 시도해주세요',
            [
              {
                text: '다시시도하기',
                onPress: () => useEffectForToday(),
              },
            ],
            { cancelable: false },
          );
        });
    });
  };
  useEffect(() => {
    useEffectForToday();
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);
  const totalCount = GetTodayChecked.length;
  const checkCounting = function () {
    let cnt = 0;
    GetTodayChecked.forEach(function (el) {
      cnt += el.check ? 1 : 0;
    });
    return cnt;
  };
  const checkCount = checkCounting();
  if (alarmList.length > 0) {
    return (
      <View
        style={{
          backgroundColor: '#fafafa',
          height: window.height,
        }}
      >
        <NavigationEvents
          onDidFocus={(payload) => {
            useEffectForToday();
          }}
        />
        {/* -- title -- */}
        <View
          style={{
            backgroundColor: '#76a991',
            width: '100%',
            height: window.height * 0.38,
            borderBottomRightRadius: 50,
            borderBottomLeftRadius: 50,
            paddingTop: getStatusBarHeight() + window.height * 0.06,
            paddingLeft: 25,
          }}
        >
          <Text
            style={{
              fontSize: 34,
              fontWeight: '200',
              color: 'white',
            }}
          >
            약올림
          </Text>
          <Text
            style={{
              color: 'white',
              marginTop: 5,
              fontSize: 24,
              fontWeight: 'bold',
              paddingBottom: 5,
            }}
          >
            오늘도 잘 챙겨먹고 있나요?
          </Text>
        </View>

        {/* -- status -- */}
        <View
          style={{
            borderRadius: 30,
            backgroundColor: 'white',
            elevation: 5,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: '28%',
            marginLeft: 20,
            width: window.width * 0.9,
            height: window.height * 0.24,
          }}
        >
          <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#76a991' }}>
            {'7일 간 ' + totalCount + '회 중 ' + checkCount + '회 복용하셨어요.'}
            {'\n'}
          </Text>
          <CountdownTimer upcomingAlarm={alarmList} />
        </View>

        {/* -- todayAlarm -- */}
        <View
          style={{
            position: 'absolute',
            bottom: window.height * 0.1,
            width: window.width,
            height: window.height * 0.35,
          }}
        >
          <View style={{ width: window.width - 20, flexDirection: 'row' }}>
            <Text
              style={{
                flex: 1,
                fontSize: 16,
                fontWeight: '200',
                padding: 10,
                paddingLeft: 20,
                color: '#76a991',
              }}
            >
              오늘의 알람
            </Text>
            <Text
              style={{
                flex: 1,
                fontSize: 14,
                textAlign: 'right',
                paddingTop: 17,
                fontWeight: '200',
                color: '#76a991',
              }}
            >
              + 더 보기
            </Text>
          </View>
          <View
            style={{
              height: window.height * 0.3,
            }}
          >
            <FlatList
              horizontal={true}
              keyExtractor={(item) => item}
              data={alarmList}
              renderItem={({ item }) => (
                <View style={styles.HomeAlarm}>
                  <Text numberOfLines={1} style={styles.firstItemInAlarm}>
                    {item['title']}
                  </Text>
                  <Text numberOfLines={3} style={styles.secondItemInAlarm}>
                    {item['memo']}
                  </Text>
                  <View style={{ flexDirection: 'row', paddingTop: 25 }}>
                    <Text style={styles.thirdItemInAlarm}>{item['cycle']}일 마다</Text>
                    <Text style={styles.fourthItemInAlarm}>{item['time']}</Text>
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <View
        style={{
          backgroundColor: '#fafafa',
          height: window.height,
        }}
      >
        <NavigationEvents
          onDidFocus={(payload) => {
            useEffectForToday();
          }}
        />
        {/* -- title -- */}
        <View
          style={{
            backgroundColor: '#76a991',
            width: '100%',
            height: window.height * 0.38,
            borderBottomRightRadius: 50,
            borderBottomLeftRadius: 50,
            paddingTop: getStatusBarHeight() + window.height * 0.06,
            paddingLeft: 25,
          }}
        >
          <Text
            style={{
              fontSize: 34,
              fontWeight: '200',
              color: 'white',
            }}
          >
            약올림
          </Text>
          <Text
            style={{
              color: 'white',
              marginTop: 5,
              fontSize: 24,
              fontWeight: 'bold',
              paddingBottom: 5,
            }}
          >
            오늘도 잘 챙겨먹고 있나요?
          </Text>
        </View>

        {/* -- status -- */}
        <View
          style={{
            borderRadius: 30,
            backgroundColor: 'white',
            elevation: 5,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: '28%',
            marginLeft: 20,
            width: window.width * 0.9,
            height: window.height * 0.24,
          }}
        >
          <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#76a991' }}>
            {'7일 간 ' + totalCount + '회 중 ' + checkCount + '회 복용하셨어요.'}
          </Text>
        </View>
        <View
          style={{
            borderRadius: 30,
            backgroundColor: 'white',
            elevation: 5,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: '55%',
            marginLeft: 20,
            width: window.width * 0.9,
            height: window.height * 0.24,
          }}
        >
          <CountdownTimer upcomingAlarm={alarmList} />
        </View>
      </View>
    );
  }
};

async function registerForPushNotificationsAsync() {
  if (Constants.isDevice) {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    console.log('status: ', status);
    if (status !== 'granted') {
      alert('설정에서 push 알람 권한을 허용해주세요.');
    }
  } else {
    alert('푸쉬알람은 모바일 기기에서만 가능합니다.');
  }
  return;
}
const styles = StyleSheet.create({
  HomeAlarm: {
    padding: 20,
    width: window.height * 0.26,
    height: window.height * 0.26,
    borderRadius: 30,
    backgroundColor: 'white',
    margin: 15,
    marginTop: 0,
    elevation: 10,
  },
  firstItemInAlarm: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#76a991',
    width: window.height * 0.22,
  },
  secondItemInAlarm: {
    marginTop: 20,
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '200',
    color: '#626262',
  },
  thirdItemInAlarm: {
    flex: 1,
    fontSize: 16,
    fontWeight: '200',
    color: '#626262',
  },
  fourthItemInAlarm: {
    flex: 1,
    fontSize: 16,
    fontWeight: '200',
    color: '#626262',
    textAlign: 'right',
  },
});
export default HomeScreen;
