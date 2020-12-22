import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';

import { useAsyncStorage } from '@react-native-community/async-storage';
const { getItem, removeItem } = useAsyncStorage('@yag_olim');

export default class LoadingScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      isAuthorized: false,
    };
  }

  read = async () => {
    try {
      const value = await getItem();
      if (value) {
        console.log('success');
        this.setState({ isAuthorized: true });
        console.log(value);
      }
    } catch (e) {
      console.log(e);
    }
  };

  async componentDidMount() {
    await removeItem();
    // await this.read();
    // if (this.state.isAuthorized === true) {
    //   this.props.navigation.replace('TabNavigator');
    // } else {
    //   this.props.navigation.replace('LoginScreen');
    // }
    this.props.navigation.replace('LoginScreen');
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
