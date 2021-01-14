import React, { useEffect, useState } from 'react';
import 'moment/locale/ko';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';

const window = Dimensions.get('window');
let verticalMargin = window.height * 0.02;

export default class CameraNoticeScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      update: this.props.navigation.getParam('update'),
      item: this.props.navigation.getParam('item'),
      clickedDate: this.props.navigation.getParam('clickedDate'),
    };
  }

  render() {
    return (
      <View style={{ height: window.height * 0.92 - 40, marginTop: 40, alignItems: 'center' }}>
        <View
          style={{
            paddingTop: '50%',
            width: window.width * 0.7,
            justifyContent: 'center',
            marginBottom: '30%',
          }}
        >
          <Text style={{ fontSize: 18, lineHeight: 30, fontWeight: '200', textAlign: 'center' }}>
            의약품만 검색 가능하며{'\n'} 촬영여건에 따라 {'\n'}인식이 불가능 할 수 있습니다.
          </Text>
        </View>

        <View style={{ marginTop: 10 }}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('CameraStack', {
                update: this.state.update,
                item: this.state.item,
                clickedDate: this.state.clickedDate,
              })
            }
          >
            <View
              style={{
                justifyContent: 'center',
                marginTop: 10,
                alignItems: 'center',
                width: window.width * 0.7,
                height: window.height * 0.075,
                backgroundColor: '#76a991',
                borderRadius: window.height * 0.075,
              }}
            >
              <Text style={{ fontSize: 20, color: 'white' }}>촬영하기</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
