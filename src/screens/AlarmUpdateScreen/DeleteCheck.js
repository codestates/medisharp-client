import React, { Component, useEffect, useState } from 'react';
import react from 'react';
import { View, Text, Dimensions, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { NavigationEvents } from 'react-navigation';
import * as Notifications from 'expo-notifications';

import AsyncStorage, { useAsyncStorage } from '@react-native-community/async-storage';
const { getItem } = useAsyncStorage('@yag_olim');

const window = Dimensions.get('window');

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
          url: 'https://hj-medisharp.herokuapp.com/schedules-commons/schedules-dates',
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
          url: 'https://hj-medisharp.herokuapp.com/schedules-commons/schedules-dates',
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
          height: window.height * 0.92 - 1,
          backgroundColor: 'white',
          paddingTop: getStatusBarHeight(),
          paddingLeft: 20,
        }}
      >
        <Text
          style={{
            marginTop: 30,
            fontSize: 24,
            fontWeight: '300',
          }}
        >
          알람 수정
        </Text>
        <View
          style={{
            borderBottomStyle: 'solid',
            borderBottomWidth: 5,
            borderBottomColor: '#6a9c90',
            alignSelf: 'flex-start',
            marginBottom: window.height * 0.02,
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
            알람 삭제하기
          </Text>
        </View>
        {/* -- 상단 복용 여부 버튼 -- */}
        <View
          style={{
            width: window.width - 40,
          }}
        >
          <View
            style={{
              alignItems: 'center',
              marginTop: '30%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <TouchableOpacity
              onPress={async () => {
                await this.deleteClickedPush();
                await this.deleteClickedSchedules();
              }}
              style={{
                marginTop: 10,
                width: window.width * 0.42,
                height: window.width * 0.42,
                backgroundColor: '#6a9c90',
                borderRadius: 30,
                alignContent: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{ fontSize: 20, fontWeight: 'bold', color: 'white', textAlign: 'center' }}
              >
                이 알람만 삭제할래요!
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                await this.deleteWholePush();
                await this.deleteWholeSchedules();
              }}
              style={{
                marginTop: 10,
                width: window.width * 0.42,
                height: window.width * 0.42,
                backgroundColor: '#9a6464',
                borderRadius: 30,
                alignContent: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                전체 알람을 삭제할래요!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
