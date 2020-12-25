import React from 'react';
import axios from 'axios';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { StackActions, NavigationActions, NavigationEvents } from 'react-navigation';

import { useAsyncStorage } from '@react-native-community/async-storage';
const { getItem, removeItem } = useAsyncStorage('@yag_olim');

const window = Dimensions.get('window');
let verticalMargin = window.height * 0.02;

export default class Mypage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      useremail: '',
      token: '',
    };
    const get_token = async () => {
      const token = await getItem();
      this.setState({ token: token });
    };
    const getUserInfo = () => {
      axios({
        method: 'get',
        url: 'http://127.0.0.1:5000/users',
        headers: {
          Authorization: this.state.token,
        },
      })
        .then((data) => {
          let { email, full_name } = data.data.results;
          this.setState({
            name: full_name,
            useremail: email,
          });
        })
        .catch((err) => {
          console.error(err);
          Alert.alert(
            '에러가 발생했습니다!',
            '다시 시도해주세요',
            [
              {
                text: '다시시도하기',
                onPress: () => getUserInfo(),
              },
            ],
            { cancelable: false },
          );
        });
    };

    get_token().then(() => {
      getUserInfo();
    });
  }

  resetAction = StackActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({
        routeName: 'LoginScreen',
      }),
    ],
  });

  logout = async () => {
    try {
      await removeItem();
      this.props.navigation.dispatch(this.resetAction);
    } catch (e) {
      console.log(e);
      Alert.alert(
        '에러가 발생했습니다!',
        '다시 시도해주세요',
        [
          {
            text: '다시시도하기',
            onPress: () => this.logout(),
          },
        ],
        { cancelable: false },
      );
    }
  };

  render() {
    return (
      <View
        style={{
          backgroundColor: 'white',
          paddingTop: getStatusBarHeight() + verticalMargin,
          height: window.height * 0.9,
        }}
      >
        <NavigationEvents
          onDidFocus={(payload) => {
            if (this.props.navigation.getParam('edit_user')) {
              let { email, full_name } = this.props.navigation.getParam('edit_user');
              this.setState({ name: full_name, useremail: email });
            }
          }}
        />
        <View
          style={{
            alignSelf: 'flex-start',
            backgroundColor: '#76a991',
            padding: 10,
            paddingLeft: 25,
            paddingRight: 25,
            borderTopRightRadius: 35,
            borderBottomRightRadius: 35,
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: '200',
              color: 'white',
            }}
          >
            약올림
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
            마이페이지
          </Text>
        </View>

        {/* -- 콘텐츠 시작 -- */}
        <View style={{ marginLeft: 20 }}>
          {/* -- 이름 뷰 -- */}
          <View
            style={{
              marginTop: window.height * 0.075,
              marginBottom: verticalMargin,
            }}
          >
            <Text style={styles.textInputTitle}>이름</Text>
            <Text style={styles.placeholderText}>{this.state.name}</Text>
          </View>
          {/* -- 이메일 뷰 -- */}
          <View
            style={{
              marginBottom: window.height * 0.075,
            }}
          >
            <Text style={styles.textInputTitle}>이메일</Text>
            <Text style={styles.placeholderText}>{this.state.useremail}</Text>
          </View>
        </View>

        {/* -- 수정하기 버튼 -- */}
        <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 20 }}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('EditMyinfoScreen', {
                name: this.state.name,
                useremail: this.state.useremail,
              });
            }}
          >
            <View
              style={{
                justifyContent: 'center',
                marginBottom: 20,
                width: window.width * 0.7,
                height: window.height * 0.075,
                backgroundColor: '#76a991',
                borderRadius: window.height * 0.075,
              }}
            >
              <Text style={{ fontSize: 20, color: 'white', textAlign: 'center' }}>수정하기</Text>
            </View>
          </TouchableOpacity>

          {/* -- 로그아웃 버튼 -- */}
          <TouchableOpacity onPress={this.logout}>
            <View
              style={{
                justifyContent: 'center',
                marginBottom: 20,
                width: window.width * 0.7,
                height: window.height * 0.075,
                backgroundColor: '#ffaaaa',
                borderRadius: window.height * 0.075,
              }}
            >
              <Text style={{ fontSize: 20, color: 'white', textAlign: 'center' }}>로그아웃</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInputTitle: {
    fontSize: 18,
    fontWeight: '200',
    color: '#626262',
    paddingLeft: 5,
  },
  placeholderText: {
    textAlign: 'right',
    fontSize: 18,
    padding: 5,
    width: window.width - 40,
    borderBottomWidth: 1,
    borderBottomColor: '#76a991',
    borderStyle: 'solid',
  },
});
