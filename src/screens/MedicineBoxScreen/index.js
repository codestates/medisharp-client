import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { get } from 'react-native/Libraries/Utilities/PixelRatio';
import { NavigationEvents } from 'react-navigation';

import medisharpLogo from '../../img/medisharpLogo.png';

import { useAsyncStorage } from '@react-native-community/async-storage';
const { getItem } = useAsyncStorage('@yag_olim');

const window = Dimensions.get('window');

const MedicineBox = ({ navigation }) => {
  const [myMedicines, setMyMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    useEffectForMedicines();
  }, []);

  const useEffectForMedicines = () => {
    async function get_token() {
      const token = await getItem();
      return token;
    }
    get_token().then((token) => {
      axios({
        method: 'get',
        url: 'http://127.0.0.1:5000/medicines',
        headers: {
          Authorization: token,
        },
      })
        .then((data) => {
          setMyMedicines(data.data.results);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
        });
    });
  };

  let MedicineByCamera = [];
  let MedicineBySelf = [];
  myMedicines.forEach((el) => {
    if (el.camera === true) {
      MedicineByCamera.push(el);
    } else {
      MedicineBySelf.push(el);
    }
  });

  const [cameraTabSelected, setCameraTabSelected] = useState(true);
  const [selfTabSelected, setSelfTabSelected] = useState(false);

  const tabChange = () => {
    setCameraTabSelected(!cameraTabSelected);
    setSelfTabSelected(!selfTabSelected);
  };

  //console.log('MyMedicine배열길이: ', myMedicines, myMedicines.length);

  if (isLoading === true) {
    //로딩
    return (
      <View style={styles.loginContainer}>
        <NavigationEvents
          onDidFocus={(payload) => {
            useEffectForMedicines();
          }}
        />
        <View style={[styles.container, styles.horizontal]}>
          <Image
            style={{ width: 77, height: 71, marginTop: '60%', marginBottom: '20%' }}
            source={medisharpLogo}
          />
          <ActivityIndicator size={60} color="#6a9c90" />
        </View>
      </View>
    );
  } else {
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
          <NavigationEvents
            onDidFocus={(payload) => {
              useEffectForMedicines();
            }}
          />
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
            data={MedicineByCamera}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setIsLoading(true);
                    navigation.navigate('MedicineDetail', { MedicineData: item });
                  }}
                >
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
                      style={{
                        width: window.width * 0.35,
                        resizeMode: 'contain',
                        marginBottom: 10,
                      }}
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
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          ></FlatList>
        </View>
      );
    } else {
      return (
        <View
          style={{
            backgroundColor: 'white',
            height: window.height * 0.92 - 1,
            paddingLeft: 20,
            paddingTop: getStatusBarHeight(),
          }}
        >
          <NavigationEvents
            onDidFocus={(payload) => {
              useEffectForMedicines();
            }}
          />
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
            data={MedicineBySelf}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setIsLoading(true);
                    navigation.navigate('MedicineDetail', { MedicineData: item });
                  }}
                >
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
                      style={{
                        width: window.width * 0.35,
                        resizeMode: 'contain',
                        marginBottom: 10,
                      }}
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
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          ></FlatList>
        </View>
      );
    }
  }
};

export default MedicineBox;

const styles = StyleSheet.create({
  loginContainer: {
    alignItems: 'center',
    height: '100%',
  },
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
