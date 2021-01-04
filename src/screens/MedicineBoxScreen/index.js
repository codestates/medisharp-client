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
  Alert,
} from 'react-native';
import axios from 'axios';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { NavigationEvents } from 'react-navigation';
import medisharpLogo from '../../img/medisharpLogo.png';
import { useAsyncStorage } from '@react-native-community/async-storage';

const { getItem } = useAsyncStorage('@yag_olim');

const window = Dimensions.get('window');
let verticalMargin = window.height * 0.02;

const MedicineBox = ({ navigation }) => {
  const [myMedicines, setMyMedicines] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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
          Alert.alert(
            '에러가 발생했습니다!',
            '다시 시도해주세요',
            [
              {
                text: '다시시도하기',
                onPress: () => useEffectForMedicines(),
              },
            ],
            { cancelable: false },
          );
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

  if (isLoading === true) {
    //로딩
    return (
      <View style={{ height: '100%', backgroundColor: 'white', alignItems: 'center' }}>
        <View
          style={{
            backgroundColor: '#76a991',
            width: '100%',
            height: window.height * 0.5,
            borderBottomRightRadius: 50,
            borderBottomLeftRadius: 50,
            alignItems: 'center',
          }}
        >
          <NavigationEvents
            onDidFocus={(payload) => {
              useEffectForMedicines();
            }}
          />
          <Image
            style={{
              width: window.width * 0.2,
              height: window.width * 0.2,
              resizeMode: 'center',
              marginTop: window.height * 0.2,
            }}
            source={require('../../../assets/logoWhite.png')}
          />
          <Text style={{ fontSize: 28, fontWeight: '200', color: 'white' }}>약올림</Text>
        </View>
        <View style={{ marginTop: '20%' }}>
          <ActivityIndicator size={60} color="#76a991" />
        </View>
      </View>
    );
  } else {
    if (cameraTabSelected) {
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
              useEffectForMedicines();
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
              약통
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
              나의 약 모두보기
            </Text>
          </View>

          {/* -- 콘텐츠 시작 -- */}

          <View
            style={{
              width: window.width - 20,
              marginTop: 0,
              marginBottom: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingLeft: 20,
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
            style={{ width: window.width - 40, marginLeft: 20 }}
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
                      borderBottomColor: '#76a991',
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
                        borderRadius: 15,
                      }}
                    />
                    <View
                      style={{
                        width: window.width * 0.5,
                        marginLeft: 20,
                        justifyContent: 'center',
                        color: '#76a991',
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        style={{ fontSize: 16, fontWeight: 'bold', lineHeight: 16 }}
                      >
                        {item.name}
                      </Text>
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
            paddingTop: getStatusBarHeight() + verticalMargin,
            height: window.height * 0.9,
          }}
        >
          <NavigationEvents
            onDidFocus={(payload) => {
              useEffectForMedicines();
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
              약통
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
              나의 약 모두보기
            </Text>
          </View>

          {/* -- 콘텐츠 시작 -- */}

          <View
            style={{
              width: window.width - 20,
              marginTop: 0,
              marginBottom: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingLeft: 20,
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
            style={{ width: window.width - 40, marginLeft: 20 }}
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
                      borderBottomColor: '#76a991',
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
                        borderRadius: 15,
                      }}
                    />
                    <View
                      style={{
                        width: window.width * 0.5,
                        marginLeft: 20,
                        justifyContent: 'center',
                        color: '#76a991',
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        style={{ fontSize: 16, fontWeight: 'bold', lineHeight: 16 }}
                      >
                        {item.name}
                      </Text>
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
    marginTop: 10,
    width: window.width * 0.43,
    height: window.width * 0.15,
    backgroundColor: '#76a991',
    borderRadius: 30,
    alignContent: 'center',
    justifyContent: 'center',
  },
  medicineByChangeTabNotSelected: {
    marginTop: 10,
    width: window.width * 0.43,
    height: window.width * 0.15,
    borderColor: '#76a991',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 30,
    alignContent: 'center',
    justifyContent: 'center',
  },
  medicineByChangeTabSelectedText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  medicineByChangeTabNotSelectedText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#76a991',
  },
});
