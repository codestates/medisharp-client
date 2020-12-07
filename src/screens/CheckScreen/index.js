import React, { Component } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import * as FileSystem from 'expo-file-system';

export default class CheckScreen extends Component {
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
    console.log(getImg['uri']);
    this.setState({ getImg: getImg['uri'] });
  }

  render() {
    return (
      <View style={styles.loginContainer}>
        <Image style={{ width: 300, height: 300 }} source={{ uri: this.state.getImg }} />
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
