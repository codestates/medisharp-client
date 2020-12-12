// CheckScreen 에도 이미지를 불러왔기때문에 가장 유사할 것같아서 붙여넣기 해두었습니다!
// 늘 감사합니다아아

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
      uri: this.props.navigation.getParam('uri'),
      getImg: '../../img/loginMain.png',
    };
  }

  async componentDidMount() {
    const getImg = await FileSystem.getInfoAsync(this.state.uri);
    this.setState({ getImg: getImg['uri'] });
  }

  render() {
    return (
      <View style={styles.loginContainer}>
        <Text>직접입력페이지</Text>
        <Image
          style={{
            width: window.width - 40,
            height: window.width - 40,
            marginTop: 50,
            borderRadius: 50,
          }}
          source={{ uri: this.state.getImg }}
        />
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
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
