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
import medisharpLogo from '../../img/medisharpLogo.png';
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
      token: null,
      imgS3Uri: null,
      camera: false,
      //카메라 촬영여부 표시 위한 state입니다. 직접등록의 경우, 다음 화면에서 해당 부분을 false로 해서 전달하면 될거 같아요
    };
  }

  async componentDidMount() {
    const getImg = await FileSystem.getInfoAsync(this.state.uri);
    console.log(getImg['uri']);
    this.setState({ getImg: getImg['uri'] });
  }

  uploadToS3Camera() {
    axios
      .post('http://localhost:5000/medicines/upload', this.state.form_data, {
        headers: {
          'content-type': 'multipart/form-data',
          Authorization: this.state.token,
        },
      })
      .then((res) => {
        this.setState({
          imgS3Uri: res.data.results,
          camera: true,
        });
      })
      .then(() => {
        console.log('S3 uri:', this.state.imgS3Uri);
        this.props.navigation.navigate('Alarm', {
          alarmMedicine: {
            name: this.state.mediname,
            image_dir: this.state.imgS3Uri,
            camera: this.state.camera,
            title: null,
            effect: null,
            capacity: null,
            validity: null,
          },
        });
      })
      .catch((err) => console.log(err));
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
        <Text
          style={{
            fontSize: 20,
            color: '#313131',
            fontWeight: 'bold',
            marginTop: '5%',
          }}
        >
          {this.state.mediname}
        </Text>

        <TouchableOpacity
          onPress={() => {
            this.uploadToS3Camera();
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
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('SelfInputScreen', {
              uri: this.state.uri,
            });
          }}
        >
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
