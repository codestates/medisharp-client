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

const window = Dimensions.get('window');
let verticalMargin = window.height * 0.02;

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
          onPress: () => this.props.navigation.replace('LoginScreen'),
        },
        {
          text: '회원가입 할래요',
          onPress: () => this.props.navigation.replace('SignUpScreen'),
        },
        { text: '다시 찾을래요', onPress: () => console.log('다시 찾을래요') },
      ],
      { cancelable: false },
    );
  };

  onFindId() {
    axios({
      method: 'get',
      url: 'http://127.0.0.1:5000/users/email',
      params: {
        full_name: this.state.name,
        mobile: this.state.phoneNumber,
      },
    })
      .then((data) => {
        console.log(data.data.email);
        const userEmail = data.data.email[0];
        this.createThreeButtonAlert(userEmail);
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
          paddingTop: getStatusBarHeight() + verticalMargin,
          height: window.height,
        }}
      >
        <View
          style={{
            alignSelf: 'flex-start',
            backgroundColor: '#76a991',
            padding: 10,
            paddingLeft: 25,
            paddingRight: 25,
            borderTopRightRadius: 35,
            borderBottomRightRadius: 35,
            marginBottom: verticalMargin,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: '200',
              color: 'white',
            }}
          >
            약 올림
          </Text>
          <Text
            style={{
              color: 'white',
              marginTop: 5,
              fontSize: 24,
              fontWeight: 'bold',
              paddingBottom: 5,
            }}
          >
            아이디 찾기
          </Text>
        </View>
        <ScrollView style={{ paddingLeft: 20 }}>
          {/* -- 이름 입력 뷰 -- */}
          <View style={styles.textInputBox}>
            <Text style={styles.textInputTitle}>이름</Text>
            <TextInput
              style={styles.placeholderText}
              placeholder="이름을 입력하세요."
              placeholderTextColor={'#c4c4c4'}
              maxLength={12}
              onChangeText={(nameValue) => this.handleSignUpValue('name', nameValue)}
              defaultValue={this.state.name}
            />
          </View>
          <Text style={styles.nonAvailableText}>{this.state.isAvailedName}</Text>

          {/* -- 전화번호 입력 뷰 -- */}
          <View style={styles.textInputBox}>
            <Text style={styles.textInputTitle}>전화번호</Text>
            <TextInput
              style={styles.placeholderText}
              placeholder="공백없이 숫자만 입력하세요."
              placeholderTextColor={'#c4c4c4'}
              maxLength={11}
              onChangeText={(phoneNumberValue) =>
                this.handleSignUpValue('phoneNumber', phoneNumberValue)
              }
              defaultValue={this.state.phone}
            />
          </View>
          <Text style={styles.nonAvailableText}>{this.state.isAvailedPhoneNumber}</Text>

          {/* -- 확인 버튼 -- */}
          <View style={{ alignItems: 'center', marginTop: -10, marginBottom: 30, marginLeft: -20 }}>
            <TouchableOpacity
              onPress={() => {
                this.onFindId();
              }}
            >
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: window.width * 0.7,
                  height: window.height * 0.075,
                  backgroundColor: '#76a991',
                  borderRadius: 100,
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
  textInputBox: {
    marginBottom: verticalMargin,
    borderBottomWidth: 1,
    borderBottomColor: '#76a991',
    borderStyle: 'solid',
    width: window.width - 40,
  },
  textInputTitle: {
    paddingLeft: 10,
    marginBottom: 5,
    fontSize: 18,
    fontWeight: '200',
    color: '#76a991',
  },
  placeholderText: {
    fontSize: 16,
    width: window.width - 40,
    paddingLeft: 10,
  },
  nonAvailableText: {
    marginTop: -verticalMargin,
    marginBottom: verticalMargin,
    paddingLeft: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffaaaa',
  },
});
