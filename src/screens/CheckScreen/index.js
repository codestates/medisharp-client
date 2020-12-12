import React, { Component, useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system';
import react from 'react';
// import { NavigationActions, StackActions } from 'react-navigation';

const window = Dimensions.get('window');

export default class CheckScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      uri: this.props.navigation.getParam('uri'),
      getImg: '../../img/loginMain.png',
      item_name: '에페드린정',
    };
  }

  async componentDidMount() {
    const getImg = await FileSystem.getInfoAsync(this.state.uri);
    console.log(getImg['uri']);
    this.setState({ getImg: getImg['uri'] });
  }

  // changeScreen(Alarm) {
  //   const resetAction = StackActions.reset({
  //     index: 0,
  //     actions: [NavigationActions.navigate({ routeName: 'Alarm' })],
  //   });
  //   this.props.navigation.dispatch(resetAction);
  // }

  render() {
    return (
      <View
        style={{
          height: window.height * 0.9,
          width: window.width - 40,
          marginLeft: 20,
          alignItems: 'center',
        }}
      >
        <Image
          style={{
            width: window.width - 40,
            height: window.width - 40,
            marginTop: 50,
            borderRadius: 50,
          }}
          source={{ uri: this.state.getImg }}
        />

        <TouchableOpacity
          onPress={() => {
            // this.changeScreen();
            this.props.navigation.navigate('Alarm', {
              alarmMedicine: this.state.item_name,
            });
          }}
        >
          <View
            style={{
              justifyContent: 'center',
              marginTop: 30,
              alignItems: 'center',
              width: window.width * 0.7,
              height: window.height * 0.075,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: '#6a9c90',
              borderStyle: 'solid',
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: '#6a9c90',
              }}
            >
              이 약이 맞아요!
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('FuckMyLife')}>
          <View
            style={{
              justifyContent: 'center',
              marginTop: 10,
              alignItems: 'center',
              width: window.width * 0.7,
              height: window.height * 0.075,
              backgroundColor: '#6a9c90',
              borderRadius: 20,
            }}
          >
            <Text style={{ fontSize: 20, color: 'white' }}>직접 입력할래요!</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
