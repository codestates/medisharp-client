import React, { Component, useEffect, useState } from 'react';
import react from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { NavigationEvents } from 'react-navigation';

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
    };
  }

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
          });
      })
      .catch((err) => {
        console.error(err);
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
          });
      })
      .catch((err) => {
        console.error(err);
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
        <NavigationEvents
          onDidFocus={(payload) => {
            console.log('deleteCheckScreen onDidFocus Done');
          }}
        />

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
              onPress={this.deleteClickedSchedules}
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
              onPress={this.deleteWholeSchedules}
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
