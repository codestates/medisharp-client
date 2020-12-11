import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

import AsyncStorage, { useAsyncStorage } from '@react-native-community/async-storage';
const { getItem } = useAsyncStorage('@yag_olim');

export default class CheckScreen extends Component {
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
            // this.props.navigation.navigate('CheckScreen', {
            //   uri: this.state.photo,
            //   mediname: res.data.prediction,
            // });
            this.setState({ mediname: res.data.prediction, isLoading: false });
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

  render() {
    return this.state.isLoading ? (
      <View style={styles.loginContainer}>
        <Image style={{ width: 300, height: 300 }} source={{ uri: this.state.getImg }} />
        <Text>Loading...</Text>
      </View>
    ) : (
      <View style={styles.loginContainer}>
        <Image style={{ width: 300, height: 300 }} source={{ uri: this.state.getImg }} />
        <Text>{this.state.mediname}</Text>
        <TouchableOpacity>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#313131' }}>
            이 약이 맞아요!
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#313131' }}>
            직접 등록할래요!
          </Text>
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
});
