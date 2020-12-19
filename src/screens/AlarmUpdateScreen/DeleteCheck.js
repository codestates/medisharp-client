import React, { Component, useEffect, useState } from 'react';
import react from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { NavigationEvents } from 'react-navigation';

const window = Dimensions.get('window');

export default class CheckScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

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
              onPress={() => {
                console.log('이 알람만 삭제되었다!');
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
              onPress={() => {
                console.log('모든 알람이 삭제되었다!');
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
