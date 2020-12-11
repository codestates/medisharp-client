import React, { useEffect, useState } from 'react';
import 'moment/locale/ko';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const window = Dimensions.get('window');

const CameraNoticeScreen = ({ navigation, route }) => {
  return (
    <View>
      <Text>의약품만 검색 가능하며 촬영여건에 따라 인식이 불가능 할 수 있습니다.</Text>
      <TouchableOpacity onPress={() => navigation.navigate('CameraScreen')}>
        <Text>촬영하기</Text>
        <Icon name="pills" size={35} color={'#649A8D'} />
      </TouchableOpacity>
    </View>
  );
};

export default CameraNoticeScreen;
