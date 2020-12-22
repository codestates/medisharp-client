import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

import SocialWebviewModal from './SocialWebviewModal';
import { useAsyncStorage } from '@react-native-community/async-storage';
const { setItem, getItem, removeItem } = useAsyncStorage('@yag_olim');

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

  set = async (data) => {
    try {
      console.log('success token');
      await setItem(data);
    } catch (e) {
      console.log(e);
    }
  };

  read = async () => {
    try {
      const value = await getItem();
      if (value) {
        console.log('success');
        console.log(value);
        this.props.navigation.replace('TabNavigator');
      }
    } catch (e) {
      console.log(e);
    }
  };

  componentDidMount = async () => {
    await this.read();
    // await setItem(
    //   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0.UgGrWBSBD2t1PHbjRRr3kSqWr3ECc65oXndQaaCrKqc',
    // );
    //await removeItem();
  };

  onEmailChange(email) {
    this.setState({ email: email });
  }

  onPasswordChange(password) {
    this.setState({ password: password });
  }

  //소셜 로그인
  onPressSocial = async (social) => {
    this.setState({
      socialModalVisible: !this.state.socialModalVisible,
      source: `http://127.0.0.1:5000/users/oauth/${social}`,
    });
  };

  closeSocialModal = async () => {
    this.setState({
      socialModalVisible: !this.state.socialModalVisible,
    });
    try {
      const value = await getItem();
      if (value) {
        this.props.navigation.replace('TabNavigator');
      }
    } catch (e) {
      console.log(e);
    }
  };

  // 일반 로그인
  doLogin() {
    axios
      .post('http://127.0.0.1:5000/users/login', {
        users: {
          email: this.state.email,
          password: this.state.password,
        },
      })
      .then((res) => {
        console.log(res.data.Authorization);
        const user_token = res.data.Authorization;
        this.set(user_token);
        this.read();
      })
      .catch((e) => {
        console.log(e);
        Alert.alert(
          '에러가 발생했습니다!',
          '다시 시도해주세요',
          [
            {
              text: '다시시도하기',
              onPress: () => this.doLogin(),
            },
          ],
          { cancelable: false },
        );
      });
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
            onChangeText={(emailValue) => this.setState({ email: emailValue })}
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
            secureTextEntry={true}
            onChangeText={(passwordValue) => this.setState({ password: passwordValue })}
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
              onPress={this.doLogin.bind(this)}
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
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                padding: 10,
              }}
              onPress={() => {
                this.props.navigation.navigate('SignUpScreen');
              }}
            >
              <Text style={{ fontSize: 14, color: 'white' }}>회원가입</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 14, color: 'white', paddingTop: 10 }}>|</Text>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                padding: 10,
              }}
              onPress={() => {
                this.props.navigation.navigate('FindIdScreen');
              }}
            >
              <Text style={{ fontSize: 14, color: 'white' }}>아이디 찾기</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 14, color: 'white', paddingTop: 10 }}>|</Text>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                padding: 10,
              }}
              onPress={() => {
                this.props.navigation.navigate('FindPwScreen');
              }}
            >
              <Text style={{ fontSize: 14, color: 'white' }}>비밀번호 찾기</Text>
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
  },
});
