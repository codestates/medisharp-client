import React, { Component, useEffect, useState } from 'react';
import react from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

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
      form_data: this.props.navigation.getParam('form_data'),
      uri: this.props.navigation.getParam('uri'),
      getImg: '../../img/loginMain.png',
      mediname: this.props.navigation.getParam('mediname'),
      isLoading: true,
    };

    async function get_token() {
      const token = await getItem();
      return token;
    }
    get_token()
      .then((token) => {
        axios
          .post('https://my-medisharp.herokuapp.com/medicines/image', this.state.form_data, {
            headers: {
              'content-type': 'multipart/form-data',
              Authorization: token,
            },
          })
          .then((res) => {
            this.setState({
              mediname: res.data.prediction,
              isLoading: false,
            });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.error(err);
      });
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
    return this.state.isLoading ? (
      <View style={styles.loginContainer}>
        <Image style={{ width: 300, height: 200 }} />
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size={60} color="#6a9c90" />
        </View>
      </View>
    ) : (
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
        <Text>{this.state.mediname}</Text>

        <TouchableOpacity
          onPress={() => {
            // this.changeScreen();
            this.props.navigation.navigate('Alarm', {
              alarmMedicine: this.state.mediname,
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

const styles = StyleSheet.create({
  loginContainer: {
    alignItems: 'center',
    height: '100%',
    position: 'relative',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
