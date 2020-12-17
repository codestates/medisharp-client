import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import axios from 'axios';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { get } from 'react-native/Libraries/Utilities/PixelRatio';

import { useAsyncStorage } from '@react-native-community/async-storage';
const { getItem } = useAsyncStorage('@yag_olim');

const window = Dimensions.get('window');

const MedicineBox = () => {
  const [myMedicines, setMyMedicines] = useState([]);

  useEffect(() => {
    console.log('{{{{{{{{{{내 약 목록들 받아온다!!!}}}}}}}}}}');
    async function get_token() {
      const token = await getItem();
      return token;
    }
    get_token().then((token) => {
      axios({
        method: 'get',
        url: 'https://hj-medisharp.herokuapp.com/medicines',
        headers: {
          Authorization: token,
        },
      })
        .then((data) => {
          console.log('{{{{{{{{응답받았다!!}}}}}}}');
          setMyMedicines(data.data.results);
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }, []);

  console.log('{{{{{get my medicine 받아온 myMedicines: ', myMedicines);

  // 받아온 다음에 이를 fakeMedicineByCamera.medicine, fakeMedicineBySelf.medicine로 나눠야함
  let fakeMedicineByCamera = [];
  let fakeMedicineBySelf = [];
  myMedicines.forEach((el) => {
    if (el.camera === true) {
      fakeMedicineByCamera.push(el);
    } else {
      fakeMedicineBySelf.push(el);
    }
  });
  console.log('{{{{{{{{{{fakeMedicineByCamera}}}}}}}}: ', fakeMedicineByCamera);
  console.log('{{{{{{{{{{fakeMedicineBySelf}}}}}}}}: ', fakeMedicineBySelf);

  const [cameraTabSelected, setCameraTabSelected] = useState(true);
  const [selfTabSelected, setSelfTabSelected] = useState(false);

  const tabChange = () => {
    setCameraTabSelected(!cameraTabSelected);
    setSelfTabSelected(!selfTabSelected);
  };

  if (cameraTabSelected) {
    return (
      <View
        style={{
          backgroundColor: 'white',
          height: window.height * 0.92 - 1,
          paddingLeft: 20,
          paddingTop: getStatusBarHeight(),
        }}
      >
        <Text
          style={{
            marginTop: 30,
            fontSize: 24,
          }}
        >
          약통
        </Text>
        <View
          style={{
            borderBottomStyle: 'solid',
            borderBottomWidth: 5,
            borderBottomColor: '#6a9c90',
            alignSelf: 'flex-start',
            marginBottom: 15,
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
            나의 약 모두보기
          </Text>
        </View>

        <View
          style={{
            width: window.width - 40,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <TouchableOpacity onPress={tabChange} style={styles.medicineByChangeTabSelected}>
            <Text style={styles.medicineByChangeTabSelectedText}>카메라로 등록한 약</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={tabChange} style={styles.medicineByChangeTabNotSelected}>
            <Text style={styles.medicineByChangeTabNotSelectedText}>직접 등록한 약</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          style={{ width: window.width - 40 }}
          data={fakeMedicineByCamera}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                height: window.height * 0.12,
                marginTop: 10,
                marginBottom: 5,
                borderBottomColor: '#6a9c90',
                borderBottomWidth: 1,
                borderStyle: 'solid',
                flexDirection: 'row',
                justifyContent: 'flex-start',
              }}
            >
              <Image
                source={{ uri: item.image_dir }}
                style={{ width: window.width * 0.35, resizeMode: 'contain', marginBottom: 10 }}
              />
              <View
                style={{
                  width: window.width * 0.35,
                  marginLeft: 20,
                  justifyContent: 'center',
                  color: '#6a9c90',
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
                {/* <Text ellipsizeMode={'tail'} numberOfLines={1}>
                  {item.title}
                </Text> */}
                {/* <Text>{item.effect}</Text> */}
              </View>
            </View>
          )}
        ></FlatList>
      </View>
    );
  } else {
    return (
      <View style={{ backgroundColor: 'white', height: window.height * 0.92 - 1, paddingLeft: 20 }}>
        <Text
          style={{
            marginTop: 30,
            fontSize: 24,
          }}
        >
          약통
        </Text>
        <View
          style={{
            borderBottomStyle: 'solid',
            borderBottomWidth: 5,
            borderBottomColor: '#6a9c90',
            alignSelf: 'flex-start',
            marginBottom: 15,
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
            나의 약 모두보기
          </Text>
        </View>

        <View
          style={{
            width: window.width - 40,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <TouchableOpacity onPress={tabChange} style={styles.medicineByChangeTabNotSelected}>
            <Text style={styles.medicineByChangeTabNotSelectedText}>카메라로 등록한 약</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={tabChange} style={styles.medicineByChangeTabSelected}>
            <Text style={styles.medicineByChangeTabSelectedText}>직접 등록한 약</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          style={{ width: window.width - 40 }}
          data={fakeMedicineBySelf}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                height: window.height * 0.12,
                marginTop: 10,
                marginBottom: 5,
                borderBottomColor: '#6a9c90',
                borderBottomWidth: 1,
                borderStyle: 'solid',
                flexDirection: 'row',
                justifyContent: 'flex-start',
              }}
            >
              <Image
                source={{ uri: item.image_dir }}
                style={{ width: window.width * 0.35, resizeMode: 'contain', marginBottom: 10 }}
              />
              <View
                style={{
                  width: window.width * 0.35,
                  marginLeft: 20,
                  justifyContent: 'center',
                  color: '#6a9c90',
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
                {/* <Text ellipsizeMode={'tail'} numberOfLines={1}>
                  {item.title}
                </Text> */}
                {/* <Text>{item.effect}</Text> */}
              </View>
            </View>
          )}
        ></FlatList>
      </View>
    );
  }
};

export default MedicineBox;

const styles = StyleSheet.create({
  medicineByChangeTabSelected: {
    backgroundColor: '#6a9c90',
    borderRadius: 40,
    width: (window.width - 40) * 0.47,
    height: 40,
    justifyContent: 'center',
  },
  medicineByChangeTabNotSelected: {
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#6a9c90',
    borderRadius: 40,
    width: (window.width - 40) * 0.47,
    height: 40,
    justifyContent: 'center',
  },
  medicineByChangeTabSelectedText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  medicineByChangeTabNotSelectedText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6a9c90',
  },
});
