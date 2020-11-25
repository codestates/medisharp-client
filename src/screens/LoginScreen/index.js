import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
//import { Linking } from 'expo';

import * as Linking from 'expo-linking';

import { AsyncStorage } from '@react-native-community/async-storage';

//import axios from 'axios';

export default class LoginScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isAuthorized: false,
      auth: '',
    };
  }

  _storeData = async () => {
    await AsyncStorage.setItem('yagOlim', Json.stringify(this.state.auth));
  };

  _retrieveData = async () => {
    const value = await AsyncStorage.getItem('yagOlim');
    if (value !== null) {
      // We have data!!
      console.log(value);
    }
  };

  componentDidMount() {
    Linking.getInitialURL().then((url) => {
      let newURL = Linking.parse(url);
      let auth = newURL.queryParams.authorization;
      this.setState({ auth: auth });
      if (auth !== undefined) {
        this._storeData(this.state.auth);
        console.log(this.state.auth);
        this.setState({ isAuthorized: true });
        console.log(this.state.isAuthorized);
      }
    });
    this._retrieveData();
  }

  //일반 로그인을 위해 필요한 부분. 서버는 아직 구현하지 못했지만, 클라는 소셜로그인 API 진행하는 겸사 구현하겠습니다.
  onEmailChange = (email) => {
    this.setState({ email });
  };

  onPasswordChange = (password) => {
    this.setState({ password });
  };

  // 일반 로그인
  // onPressLogin() {
  //   axios({
  //     method: 'get',
  //     url: 'http://localhost:5000/users',
  //     data: {
  //       email: this.state.email,
  //       password: this.state.password,
  //     },
  //   }).then((data) => {
  //     console.log(data);
  //   });
  //   //.then(onSuccess)
  //   //.catch(onFailure);
  // }

  doLogin() {
    this.props.navigation.replace('TabNavigator');
  }

  render() {
    return (
      <View style={styles.loginContainer}>
        <Image
          style={{
            top: '20%',
            width: 310 * 0.85,
            height: 111 * 0.85,
          }}
          source={require('../../img/loginMain.png')}
        />
        <View style={styles.LoginBox}>
          <Text style={{ color: 'white', fontSize: 16 }}>ID</Text>
          <TextInput
            value={this.state.email}
            autoCompleteType={'email'}
            placeholder={'e-mail'}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={this.onEmailChange}
            underlineColorAndroid="transparent"
            placeholderTextColor="#999"
            style={{
              borderRadius: 10,
              height: 40,
              width: 250,
              marginTop: 5,
              marginBottom: 10,
              backgroundColor: 'white',
              paddingLeft: 10,
            }}
          />
          <Text style={{ color: 'white', fontSize: 16 }}>Password</Text>
          <TextInput
            autoCompleteType={'password'}
            placeholder={'password'}
            keyboardType={'password'}
            secureTextEntry={true}
            onChangeText={this.onPasswordChange}
            underlineColorAndroid="transparent"
            placeholderTextColor="#999"
            style={{
              borderRadius: 10,
              height: 40,
              width: 250,
              marginTop: 5,
              marginBottom: 20,
              backgroundColor: 'white',
              paddingLeft: 10,
            }}
          />
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FFFFFF',
              width: 250,
              borderRadius: 30,
              height: 45,
              padding: 10,
              marginBottom: 30,
            }}
            onPress={this.doLogin.bind(this)}
          >
            <Text
              style={{ color: '#649A8D', fontSize: 18, fontWeight: 'bold' }}
              onPress={this.doLogin}
            >
              들어가기
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FAE301',
              width: 250,
              borderRadius: 20,
              height: 60,
              padding: 10,
              marginBottom: 50,
              flexDirection: 'row',
            }}
            onPress={() => Linking.openURL('http://localhost:5000/oauth/kakao')}
          >
            <Image
              style={{ width: 35, height: 40, marginRight: 30 }}
              source={require('../../img/kakaoLogo.png')}
            />
            <Text style={{ color: '#391B1B', fontSize: 18, fontWeight: 'bold' }}>
              카카오 로그인
            </Text>
          </TouchableOpacity>
        </View>
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
  LoginBox: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: '#8AB3A9',
    alignItems: 'center',
    justifyContent: 'center',
    height: '55%',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    marginTop: 30,
    paddingTop: 30,
  },
});
