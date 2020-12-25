import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import SocialWebviewModal from './SocialWebviewModal';
import { useAsyncStorage } from '@react-native-community/async-storage';
const { setItem, getItem, removeItem } = useAsyncStorage('@yag_olim');

const window = Dimensions.get('window');

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
    //await this.read();
    // await setItem(
    //   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0.UgGrWBSBD2t1PHbjRRr3kSqWr3ECc65oXndQaaCrKqc',
    // );
    await removeItem();
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
      <View style={{ height: '100%', backgroundColor: 'white', alignItems: 'center' }}>
        <View
          style={{
            backgroundColor: '#76a991',
            width: '100%',
            height: window.height * 0.5,
            borderBottomRightRadius: 50,
            borderBottomLeftRadius: 50,
            alignItems: 'center',
          }}
        >
          <Image
            style={{
              width: window.width * 0.2,
              height: window.width * 0.2,
              resizeMode: 'center',
              marginTop: window.height * 0.2,
            }}
            source={require('../../../assets/logoWhite.png')}
          />
          <Text style={{ fontSize: 28, fontWeight: '200', color: 'white' }}>약올림</Text>
        </View>
        <View style={styles.LoginBox}>
          <Text style={{ color: '#76a991', fontSize: 16 }}>E-mail</Text>
          <TextInput
            value={this.state.email}
            autoCompleteType={'email'}
            placeholder={''}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(emailValue) => this.setState({ email: emailValue })}
            underlineColorAndroid="transparent"
            style={styles.TextInputBox}
          />
          <Text style={{ color: '#76a991', fontSize: 16 }}>Password</Text>
          <TextInput
            autoCompleteType={'password'}
            placeholder={''}
            secureTextEntry={true}
            onChangeText={(passwordValue) => this.setState({ password: passwordValue })}
            underlineColorAndroid="transparent"
            placeholderTextColor="#999"
            style={styles.TextInputBox}
          />
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#76a991',
              width: window.width * 0.7,
              borderRadius: 100,
              height: 45,
              padding: 10,
              marginTop: 10,
              marginBottom: 15,
            }}
            onPress={this.doLogin.bind(this)}
          >
            <Text
              style={{ color: 'white', fontSize: 18, fontWeight: '200' }}
              onPress={this.doLogin.bind(this)}
            >
              약올림 로그인
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
                backgroundColor: '#ffef53',
                width: window.width * 0.7,
                borderRadius: 100,
                height: 45,
                padding: 10,
                marginBottom: 10,
              }}
              onPress={() => this.onPressSocial('kakao')}
            >
              <Text style={{ color: '#745b5b', fontSize: 18, fontWeight: '200' }}>
                카카오 로그인
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('SignUpScreen');
              }}
            >
              <Text style={styles.TextStyle}>회원가입</Text>
            </TouchableOpacity>
            <Text style={styles.TextStyle}> | </Text>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('FindIdScreen');
              }}
            >
              <Text style={styles.TextStyle}>아이디 찾기</Text>
            </TouchableOpacity>
            <Text style={styles.TextStyle}> | </Text>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('FindPwScreen');
              }}
            >
              <Text style={styles.TextStyle}>비밀번호 찾기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  LoginBox: {
    borderRadius: 50,
    backgroundColor: 'white',
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '40%',
    width: window.width * 0.8,
    height: window.width * 0.9,
  },
  TextInputBox: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#c4c4c4',
    borderStyle: 'solid',
    height: 40,
    width: window.width * 0.7,
    marginTop: 5,
    marginBottom: 15,
    backgroundColor: 'white',
    paddingLeft: 10,
  },
  TextStyle: { fontSize: 14, color: '#76a991' },
});
