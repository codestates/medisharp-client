import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import {
  View,
  Text,
  Dimensions,
  FlatList,
  StyleSheet,
  ScrollView,
  Button,
  Platform,
  Alert,
} from 'react-native';
import CountdownTimer from '../../components/CountdownTimer';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Alarm from '../../components/Alarm';
import { useAsyncStorage } from '@react-native-community/async-storage';
import { NavigationEvents } from 'react-navigation';
const { getItem } = useAsyncStorage('@yag_olim');
const window = Dimensions.get('window');
const answer = [{ result: '타이레놀', detail: '약먹을 시간이야' }];

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
  const [fakeGetTodayChecked, setfakeGetTodayChecked] = useState([]);
  const [alarmList, setTodayAlarm] = useState([]);
  const [expoPushToken, setExpoPushToken] = useState('');
  const useEffectForToday = () => {
    async function get_token() {
      const token = await getItem();
      return token;
    }
    get_token().then((token) => {
      axios({
        method: 'get',
        url: 'https://hj-medisharp.herokuapp.com/schedules-dates/check/today',
        headers: {
          Authorization: token,
        },
        params: {
          start_day: moment().subtract(8, 'd').format('YYYY-MM-DD'),
          end_day: moment().subtract(1, 'd').format('YYYY-MM-DD'),
        },
      })
        .then((data) => {
          setfakeGetTodayChecked(data.data.results);
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
      get_token().then((token) => {
        axios({
          method: 'get',
          url: `https://hj-medisharp.herokuapp.com/schedules-dates/schedules-commons/alarm`,
          headers: {
            Authorization: token,
          },
          params: {
            date: moment().format('YYYY-MM-DD'), //2020-11-22
          },
        })
          .then((data) => {
            setTodayAlarm(data.data.results); //변경 후 상태를 axios 응답결과로 변경해줍니다.
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
    });
  };
  useEffect(() => {
    useEffectForToday();
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);
  const totalCount = fakeGetTodayChecked.length;
  const checkCounting = function () {
    let cnt = 0;
    fakeGetTodayChecked.forEach(function (el) {
      cnt += el.check ? 1 : 0;
    });
    return cnt;
  };
  const checkCount = checkCounting();
  return (
    <View
      style={{
        height: window.height,
        backgroundColor: 'white',
        paddingTop: getStatusBarHeight(),
      }}
    >
      <NavigationEvents
        onDidFocus={(payload) => {
          useEffectForToday();
        }}
      />
      <View
        style={{
          paddingLeft: 20,
          height: window.height * 0.92 - 1,
          backgroundColor: 'white',
        }}
      >
        <Text
          style={{
            marginTop: 30,
            fontSize: 24,
            fontWeight: '300',
          }}
        >
          약올림
        </Text>
        <View
          style={{
            borderBottomStyle: 'solid',
            borderBottomWidth: 5,
            borderBottomColor: '#6a9c90',
            alignSelf: 'flex-start',
          }}
        >
          <Text
            style={{
              alignSelf: 'center',
              marginTop: 5,
              fontSize: 20,
              fontWeight: 'bold',
              paddingBottom: 5,
            }}
          >
            오늘도 잘 챙겨먹고 있나요?
          </Text>
        </View>
        <Text
          style={{
            width: window.width * 0.85,
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          {'지난 7일 간 총 ' + totalCount + '회 중 ' + checkCount + '회 복용하셨군요 :)'}
        </Text>
        <View
          style={{
            borderColor: '#6a9c90',
            borderStyle: 'solid',
            borderWidth: 10,
            width: window.height * 0.3,
            height: window.height * 0.3,
            marginLeft: -20,
            marginTop: 10,
            marginBottom: 10,
            borderRadius: window.height * 0.3,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* <CountdownTimer upcomingAlarm={fakeGetAlarmList[1]} /> */}
          <CountdownTimer upcomingAlarm={alarmList} />
        </View>
        <View>
          <Text style={{ fontSize: 18, fontWeight: '300', marginBottom: 10, marginTop: 10 }}>
            오늘의 알람
          </Text>
          {/* <FlatList
            horizontal={true}
            style={styles.HomeAlarmList}
            keyExtractor={(item) => item.toString()}
            data={fakeAlarmListArry}
            ListHeaderComponentStyle={true}
            renderItem={({ item }) => <Alarm alarm={item} />}
          ></FlatList> */}
          <View
            style={{
              backgroundColor: '#D7E4E1',
              borderTopLeftRadius: 30,
              borderBottomLeftRadius: 30,
              height: window.height * 0.25,
              paddingLeft: 15,
            }}
          >
            <ScrollView horizontal={true}>
              <View style={styles.HomeAlarmList}>
                {alarmList.map((item, index) => (
                  <View
                    key={index}
                    style={[
                      styles.HomeAlarm,
                      index === 0 && { color: 'white', backgroundColor: '#6a9c90' },
                    ]}
                  >
                    <Text style={[styles.firstItemInAlarm, index === 0 && { color: 'white' }]}>
                      {item['title']}
                    </Text>
                    <Text style={[styles.secondItemInAlarm, index === 0 && { color: 'white' }]}>
                      {item['memo']}
                    </Text>
                    <Text style={[styles.thirdItemInAlarm, index === 0 && { color: 'white' }]}>
                      {item['cycle']}일 마다
                    </Text>
                    <Text style={[styles.fourthItemInAlarm, index === 0 && { color: 'white' }]}>
                      {item['time']}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
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
  HomeAlarmList: {
    flex: 1,
    flexDirection: 'row',
  },
  HomeAlarm: {
    padding: 10,
    paddingTop: 20,
    width: window.height * 0.2,
    height: window.height * 0.2,
    borderRadius: 30,
    backgroundColor: '#e9efee',
    margin: 15,
    marginLeft: 0,
    shadowColor: '#313131',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  firstItemInAlarm: { fontSize: 20, fontWeight: '600', color: '#313131' },
  secondItemInAlarm: { marginTop: 10, marginBottom: 10, fontWeight: '400', color: '#313131' },
  thirdItemInAlarm: {
    position: 'absolute',
    left: 15,
    bottom: 20,
    fontWeight: '400',
    color: '#313131',
  },
  fourthItemInAlarm: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    fontWeight: '400',
    color: '#313131',
  },
});
export default HomeScreen;
