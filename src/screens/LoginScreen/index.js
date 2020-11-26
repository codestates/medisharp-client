import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

//import * as Linking from 'expo-linking';

import { useAsyncStorage } from '@react-native-community/async-storage';
import SocialWebviewModal from './SocialWebviewModal';
const { getItem, setItem } = useAsyncStorage('@yag_olim');

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
      socialModalVisible: false,
      source: undefined,
    };
  }

  // _storeData = async (auth) => {
  //   await setItem(auth);
  //   console.log('success');
  //   this.props.navigation.replace('TabNavigator');
  // };

  // read = async () => {
  //   try {
  //     const value = await getItem();
  //     if (value) {
  //       console.log('success');
  //       this.props.navigation.replace('TabNavigator');
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // componentDidMount() {
  //   this.read();
  //   this._storeData('auth');
  // Linking.getInitialURL().then((url) => {
  //   let newURL = Linking.parse(url);
  //   let auth = newURL.queryParams.authorization;
  //   if (auth !== undefined) {
  //     this._storeData(auth);
  //   }
  // });
  //}

  //일반 로그인을 위해 필요한 부분. 서버는 아직 구현하지 못했지만, 클라는 소셜로그인 API 진행하는 겸사 구현하겠습니다.
  onEmailChange(email) {
    this.setState({ email });
  }

  onPasswordChange(password) {
    this.setState({ password });
  }

  //소셜 로그인
  onPressSocial = async (social) => {
    this.setState({
      socialModalVisible: !this.state.socialModalVisible,
      source: `https://gentle-anchorage-17372.herokuapp.com/oauth/${social}`,
    });
  };

  closeSocialModal = () => {
    this.setState({
      socialModalVisible: !this.state.socialModalVisible,
    });
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
          <View>
            {this.state.source !== undefined ? (
              <SocialWebviewModal
                visible={this.state.socialModalVisible}
                source={this.state.source}
                closeSocialModal={this.closeSocialModal}
              />
            ) : null}
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
              onPress={() => this.onPressSocial('kakao')}
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
