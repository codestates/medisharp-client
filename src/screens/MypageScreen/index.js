import React from 'react';
import axios from 'axios';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { NavigationEvents } from 'react-navigation';

import { useAsyncStorage } from '@react-native-community/async-storage';
const { getItem } = useAsyncStorage('@yag_olim');

const window = Dimensions.get('window');

export default class Mypage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      useremail: '',
    };
    async function get_token() {
      const token = await getItem();
      return token;
    }
    get_token()
      .then((token) => {
        axios({
          method: 'get',
          url: 'http://127.0.0.1:5000/users', //https://hj-medisharp.herokuapp.com/users',
          headers: {
            Authorization: token,
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
          });
      })
      .catch((err) => {
        console.error(err);
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
        <NavigationEvents
          onDidFocus={(payload) => {
            if (this.props.navigation.getParam('edit_user')) {
              let { email, full_name } = this.props.navigation.getParam('edit_user');
              this.setState({ name: full_name, useremail: email });
            }
          }}
        />
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
              마이페이지
            </Text>
          </View>
        </View>
        <ScrollView>
          {/* -- 이름 뷰 -- */}
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
            <Text style={styles.placeholderText}>{this.state.name}</Text>
          </View>

          {/* -- 이메일 뷰 -- */}
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
              이메일
            </Text>
            <Text style={styles.placeholderText}>{this.state.useremail}</Text>
          </View>

          {/* -- 수정하기 버튼 -- */}
          <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 20, marginLeft: -20 }}>
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
                  marginTop: 15,
                  alignItems: 'center',
                  width: window.width * 0.7,
                  height: window.height * 0.075,
                  backgroundColor: '#6a9c90',
                  borderRadius: 20,
                }}
              >
                <Text style={{ fontSize: 20, color: 'white' }}>수정하기</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* -- 로그아웃 버튼 -- */}
          <View style={{ alignItems: 'center', marginBottom: 20, marginLeft: -20 }}>
            <TouchableOpacity
              onPress={() => {
                constole.log('로그아웃 마치 내 월급');
              }}
            >
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: window.width * 0.7,
                  height: window.height * 0.075,
                  backgroundColor: '#9a6464',
                  borderRadius: 20,
                }}
              >
                <Text style={{ fontSize: 20, color: 'white' }}>로그아웃</Text>
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
