import React from 'react';
import { View, Text, Dimensions, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import * as Notifications from 'expo-notifications';

import AsyncStorage, { useAsyncStorage } from '@react-native-community/async-storage';
const { getItem } = useAsyncStorage('@yag_olim');

const window = Dimensions.get('window');
let verticalMargin = window.height * 0.02;

export default class CheckScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      schedules_common_id: this.props.navigation.getParam('schedules_common_id'),
      clickedDate: this.props.navigation.getParam('clickedDate'),
      pushArr: this.props.navigation.getParam('pushArr'),
      push: this.props.navigation.getParam('push'),
    };
  }

  deleteWholePush = async () => {
    if (Platform.OS === 'android') {
      console.log('다 삭제할꺼지롱');
      for (let i = 0; i < this.state.pushArr.length; i++) {
        await Notifications.cancelScheduledNotificationAsync(this.state.pushArr[i]);
      }
    }
  };

  deleteClickedPush = async () => {
    if (Platform.OS === 'android') {
      console.log('이거만 삭제할꺼지롱');
      await Notifications.cancelScheduledNotificationAsync(this.state.push);
    }
  };

  deleteWholeSchedules = () => {
    async function get_token() {
      const token = await getItem();
      return token;
    }
    get_token()
      .then((token) => {
        axios({
          method: 'delete',
          url: 'http://127.0.0.1:5000/schedules-commons/schedules-dates',
          headers: {
            Authorization: token,
          },
          params: {
            schedules_common_id: this.state.schedules_common_id,
          },
        })
          .then((res) => {
            console.log('전체 알람 일정 삭제 완료: ', res.data.message);
            this.props.navigation.navigate('Calendar'); //삭제 후 calendarpage로 리다이렉트
          })
          .catch((err) => {
            console.error(err);
            Alert.alert(
              '에러가 발생했습니다!',
              '다시 시도해주세요',
              [
                {
                  text: '다시시도하기',
                  onPress: () => this.deleteWholeSchedules(),
                },
              ],
              { cancelable: false },
            );
          });
      })
      .catch((err) => {
        console.error(err);
        Alert.alert(
          '에러가 발생했습니다!',
          '다시 시도해주세요',
          [
            {
              text: '다시시도하기',
              onPress: () => this.deleteWholeSchedules(),
            },
          ],
          { cancelable: false },
        );
      });
  };

  deleteClickedSchedules = () => {
    async function get_token() {
      const token = await getItem();
      return token;
    }
    get_token()
      .then((token) => {
        axios({
          method: 'delete',
          url: 'http://127.0.0.1:5000/schedules-commons/schedules-dates',
          headers: {
            Authorization: token,
          },
          params: {
            schedules_common_id: this.state.schedules_common_id,
            date: this.state.clickedDate,
          },
        })
          .then((res) => {
            console.log('해당 날짜 알람 삭제 완료: ', res.data.message);
            this.props.navigation.navigate('Calendar'); //삭제 후 calendarpage로 리다이렉트
          })
          .catch((err) => {
            console.error(err);
            Alert.alert(
              '에러가 발생했습니다!',
              '다시 시도해주세요',
              [
                {
                  text: '다시시도하기',
                  onPress: () => this.deleteClickedSchedules(),
                },
              ],
              { cancelable: false },
            );
          });
      })
      .catch((err) => {
        console.error(err);
        Alert.alert(
          '에러가 발생했습니다!',
          '다시 시도해주세요',
          [
            {
              text: '다시시도하기',
              onPress: () => this.deleteClickedSchedules(),
            },
          ],
          { cancelable: false },
        );
      });
  };

  render() {
    return (
      <View
        style={{
          backgroundColor: 'white',
          paddingTop: getStatusBarHeight() + verticalMargin,
          height: window.height * 0.9,
        }}
      >
        <View
          style={{
            alignSelf: 'flex-start',
            backgroundColor: '#76a991',
            padding: 10,
            paddingLeft: 25,
            paddingRight: 25,
            borderTopRightRadius: 35,
            borderBottomRightRadius: 35,
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: '200',
              color: 'white',
            }}
          >
            알람 수정
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
            알람 삭제하기
          </Text>
        </View>

        {/* -- 삭제 여부 버튼 -- */}
        <View
          style={{
            alignItems: 'center',
            height: '40%',
            width: window.width * 0.7,
            marginTop: '20%',
            marginLeft: window.width * 0.15,
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: window.width * 0.7,
              height: window.height * 0.075,
              borderColor: '#ffaaaa',
              borderStyle: 'solid',
              borderWidth: 2,
              borderRadius: window.height * 0.075,
            }}
          >
            <TouchableOpacity
              onPress={async () => {
                await this.deleteClickedPush();
                await this.deleteClickedSchedules();
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ffaaaa' }}>
                이 알람만 삭제할래요!
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              justifyContent: 'center',
              marginTop: verticalMargin * 2,
              alignItems: 'center',
              width: window.width * 0.7,
              height: window.height * 0.075,
              backgroundColor: '#ffaaaa',
              borderRadius: window.height * 0.075,
            }}
          >
            <TouchableOpacity
              onPress={async () => {
                await this.deleteWholePush();
                await this.deleteWholeSchedules();
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                전체 알람을 삭제할래요!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
