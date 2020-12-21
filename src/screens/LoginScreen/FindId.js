import React from 'react';
import axios from 'axios';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import { NavigationEvents } from 'react-navigation';

const window = Dimensions.get('window');

export default class FindId extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      phoneNumber: '',
      isAvailedName: '',
      isAvailedPhoneNumber: '',
    };
  }

  handleSignUpValue = (key, value) => {
    if (key === 'name') {
      var namereg = /^[가-힣]+$/;
      var name = value;
      if (name.length > 0 && false === namereg.test(name)) {
        this.setState({
          isAvailedName: '올바른 이름 형식이 아닙니다.',
        });
      } else {
        this.setState({ isAvailedName: '' });
        this.setState({ name: value });
      }
    }
    if (key === 'phoneNumber') {
      var phoneNumberreg = /^[0-9]+$/;
      var phoneNumber = value;
      if (phoneNumber.length > 0 && false === phoneNumberreg.test(phoneNumber)) {
        this.setState({
          isAvailedPhoneNumber: '공백없이 숫자만 입력하세요.',
        });
      } else {
        this.setState({ isAvailedPhoneNumber: '' });
        this.setState({ phoneNumber: value });
      }
    }
  };

  createThreeButtonAlert = (mail) => {
    Alert.alert(
      '약올림에 등록된 이메일 : ',
      `${mail}`,
      [
        {
          text: 'OK',
          onPress: () => this.props.navigation.navigate('LoginScreen'),
        },
        {
          text: '회원가입 할래요',
          onPress: () => this.props.navigation.navigate('SignUpScreen'),
        },
        { text: '다시 찾을래요', onPress: () => console.log('다시 찾을래요') },
      ],
      { cancelable: false },
    );
  };

  onFindId() {
    axios({
      method: 'get',
      url: 'https://yag-olim-test-prod.herokuapp.com/users/email',
      params: {
        full_name: this.state.name,
        mobile: this.state.phoneNumber,
      },
    })
      .then((data) => {
        console.log(data.data.email);
        const userEmail = data.data.email;
        this.createThreeButtonAlert(userEmail).bind(this);
      })
      .catch((e) => {
        console.log(e);
        Alert.alert(
          '에러가 발생했습니다!',
          '다시 시도해주세요',
          [
            {
              text: '다시시도하기',
              onPress: () => this.onFindId(),
            },
          ],
          { cancelable: false },
        );
      });
  }

  render() {
    return (
      <View
        style={{
          backgroundColor: 'white',
          paddingTop: getStatusBarHeight(),
          height: window.height,
          paddingLeft: 20,
        }}
      >
        <NavigationEvents onDidFocus={(payload) => {}} />
        <View>
          <Text
            style={{
              marginTop: 30,
              fontSize: 24,
              fontWeight: '300',
            }}
          >
            약 올림
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
              아이디 찾기
            </Text>
          </View>
        </View>
        <ScrollView>
          {/* -- 이름 입력 뷰 -- */}
          <View
            style={{
              marginBottom: window.height * 0.01,
              borderBottomWidth: 1,
              borderBottomColor: '#6A9C90',
              borderStyle: 'solid',
              width: window.width - 40,
            }}
          >
            <Text
              style={{
                paddingLeft: 10,
                fontSize: 18,
                fontWeight: 'bold',
                color: '#6a9c90',
              }}
            >
              이름
            </Text>
            <TextInput
              style={styles.placeholderText}
              placeholder="이름을 입력하세요."
              placeholderTextColor={'gray'}
              maxLength={12}
              onChangeText={(nameValue) => this.handleSignUpValue('name', nameValue)}
              defaultValue={this.state.name}
            />
          </View>
          <Text style={styles.nonAvailableText}>{this.state.isAvailedName}</Text>

          {/* -- 전화번호 입력 뷰 -- */}
          <View
            style={{
              marginBottom: window.height * 0.01,
              borderBottomWidth: 1,
              borderBottomColor: '#6A9C90',
              borderStyle: 'solid',
              width: window.width - 40,
            }}
          >
            <Text style={styles.seclectText}>전화번호</Text>
            <TextInput
              style={styles.placeholderText}
              placeholder="공백없이 숫자만 입력하세요."
              placeholderTextColor={'gray'}
              maxLength={11}
              onChangeText={(phoneNumberValue) =>
                this.handleSignUpValue('phoneNumber', phoneNumberValue)
              }
              defaultValue={this.state.phone}
            />
          </View>
          <Text style={styles.nonAvailableText}>{this.state.isAvailedPhoneNumber}</Text>

          {/* -- 확인 버튼 -- */}
          <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 20, marginLeft: -20 }}>
            <TouchableOpacity
              onPress={() => {
                this.onFindId();
              }}
            >
              <View
                style={{
                  justifyContent: 'center',
                  marginTop: 15,
                  alignItems: 'center',
                  width: window.width * 0.7,
                  height: window.height * 0.075,
                  backgroundColor: '#6a9c90',
                  borderRadius: 20,
                }}
              >
                <Text style={{ fontSize: 20, color: 'white' }}>아이디 찾기</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewBox: {
    marginBottom: window.height * 0.005,
    width: window.width - 40,
    borderBottomWidth: 1,
    borderBottomColor: '#6A9C90',
    borderStyle: 'solid',
  },
  seclectView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
  },
  seclectText: {
    marginTop: 30,
    paddingLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6a9c90',
  },
  placeholderText: {
    textAlign: 'right',
    fontSize: 18,
    width: window.width - 40,
    padding: 10,
    paddingBottom: 5,
  },
  nonAvailableText: {
    paddingLeft: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9a6464',
  },
});
