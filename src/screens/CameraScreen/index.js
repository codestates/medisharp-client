import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { ActivityIndicator, Dimensions, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import axios from 'axios';

import medisharpLogo from '../../img/medisharpLogo.png';

import { useAsyncStorage } from '@react-native-community/async-storage';
const { getItem } = useAsyncStorage('@yag_olim');

const window = Dimensions.get('window');

export default class CameraScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      hasPermission: null,
      cameraType: Camera.Constants.Type.back,
      photo: null,
      image: require('../../img/medicineBox.png'), //디폴트 이미지
      show: true,
      isLoading: false,
      update: this.props.navigation.getParam('update'),
      item: this.props.navigation.getParam('item'),
      clickedDate: this.props.navigation.getParam('clickedDate'),
    };
    this.cameraRef = React.createRef();
  }

  componentDidMount = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status === 'granted') {
      this.setState({ hasPermission: true });
    } else {
      this.setState({ hasPermission: true });
      // this.setState({ hasPermission: false });
    }
  };

  render() {
    const { hasPermission, cameraType, isLoading } = this.state;
    if (isLoading === true) {
      return (
        <View style={styles.loginContainer}>
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
      if (hasPermission === true) {
        if (this.state.show) {
          return (
            <View>
              <Camera
                style={{ width: '100%', height: window.width, marginTop: 30 }}
                type={cameraType}
                ratio="1:1"
                ref={(ref) => {
                  this.camera = ref;
                }}
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    flexDirection: 'row',
                  }}
                >
                  {/* // FLIP : 전면/후면 카메라 변경 버튼, */}
                  <View
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      backgroundColor: 'white',
                      width: 50,
                      height: 50,
                      borderRadius: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <TouchableOpacity onPress={this.switchCameraType}>
                      <Icon name="camera-party-mode" size={35} color={'#649A8D'} />
                    </TouchableOpacity>
                  </View>
                </View>
              </Camera>
              {/* // SNAP : 사진 촬영 버튼 */}
              <View
                style={{
                  position: 'absolute',
                  bottom: -(window.height - window.width) * 0.5,
                  backgroundColor: '#649A8D',
                  width: 100,
                  height: 100,
                  left: window.width * 0.5 - 50,
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <TouchableOpacity onPress={this.takePhoto}>
                  <Icon name="camera" size={60} color={'white'} />
                </TouchableOpacity>
              </View>
            </View>
          );
        } else {
          return (
            <View>
              <Camera
                style={{ width: '100%', height: window.width, marginTop: 30 }}
                type={cameraType}
                ref={(ref) => {
                  this.camera = ref;
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                  }}
                >
                  <Image
                    source={this.state.image}
                    style={{ width: '100%', height: window.width }}
                  />
                  {/* // Retake Photo : 사진 재촬영 버튼 */}
                </View>
              </Camera>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <View
                  style={{
                    backgroundColor: '#649A8D',
                    margin: window.width * 0.15,
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <TouchableOpacity onPress={() => this.setState({ show: true })}>
                    <Icon name="camera-retake" size={60} color={'white'} />
                  </TouchableOpacity>
                </View>
                {/* // Upload Photo : 사진 업로드 버튼 */}
                <View
                  style={{
                    backgroundColor: '#649A8D',
                    margin: window.width * 0.15,
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <TouchableOpacity onPress={this.handleSubmit}>
                    <Icon name="check-bold" size={60} color={'white'} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }
      } else if (hasPermission === false) {
        return (
          <View>
            <Text>Don't have Permission for this App.</Text>
          </View>
        );
      } else {
        return (
          <View>
            <ActivityIndicator color="white" size={1} />
          </View>
        );
      }
    }
  }

  switchCameraType = () => {
    console.log('switch');
    const { cameraType } = this.state;
    if (cameraType === Camera.Constants.Type.front) {
      this.setState({
        cameraType: Camera.Constants.Type.back,
      });
    } else {
      this.setState({
        cameraType: Camera.Constants.Type.front,
      });
    }
  };

  takePhoto = async () => {
    if (this.cameraRef) {
      console.log('takePhoto');
      let img = await this.camera.takePictureAsync({ quality: 0.5 });
      if (img) {
        console.log('photo uri: ', img.uri);
        this.setState({ photo: img.uri, image: img, show: false });
      }
    }
  };

  handleSubmit = async () => {
    // 웹에서 실행시
    // const byteString = atob(this.state.photo.split(',')[1]);
    // const ab = new ArrayBuffer(byteString.length);
    // const ia = new Uint8Array(ab);
    // for (let i = 0; i < byteString.length; i++) {
    //   ia[i] = byteString.charCodeAt(i);
    // }
    // const blob = new Blob([ia], {
    //   type: 'image/jpeg',
    // });
    // const file = new File([blob], 'image.jpg');
    // let form_data = new FormData();
    // console.log('handleSubmit photo: ', file);
    // form_data.append('image', blob);
    // console.log('handleSubmit form_data: ', form_data.entries().next());
    // console.log('form data: ', form_data);

    // async function get_token() {
    //   const token = await getItem();
    //   return token;
    // }
    // get_token()
    //   .then((token) => {
    //     axios
    //       .post('http://127.0.0.1:5000/medicines/image', form_data, {
    //         headers: {
    //           'content-type': 'multipart/form-data',
    //           Authorization: token,
    //         },
    //       })
    //       .then((res) => {
    //         this.props.navigation.navigate('CheckScreen', {
    //           uri: this.state.photo,
    //           mediname: res.data.prediction,
    //         });
    //       })
    //       .catch((err) => console.log(err));
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });

    // 모바일에서 실행시
    await this.setState({ isLoading: true });
    let fileName = this.state.photo.split('Camera')[1];
    let form_data = new FormData();
    form_data.append('image', {
      name: fileName,
      type: 'image/jpeg',
      uri: this.state.photo,
    });
    console.log('form data: ', form_data);
    async function get_token() {
      const token = await getItem();
      return token;
    }
    get_token()
      .then((token) => {
        axios
          .post('http://127.0.0.1:5000/medicines/image', form_data, {
            headers: {
              'content-type': 'multipart/form-data',
              Authorization: token,
            },
          })
          .then((res) => {
            this.props.navigation.navigate('CheckScreen', {
              form_data: form_data,
              uri: this.state.photo,
              mediname: res.data.prediction,
              update: this.state.update,
              item: this.state.item,
              clickedDate: this.state.clickedDate,
            });
          })
          .catch((err) => {
            console.log(err);
            Alert.alert(
              '에러가 발생했습니다!',
              '다시 시도해주세요',
              [
                {
                  text: '다시시도하기',
                  onPress: () => this.handleSubmit(),
                },
              ],
              { cancelable: false },
            );
          });
      })
      .catch((err) => {
        console.error(err);
        Alert.alert(
          '에러가 발생했습니다!',
          '다시 시도해주세요',
          [
            {
              text: '다시시도하기',
              onPress: () => this.handleSubmit(),
            },
          ],
          { cancelable: false },
        );
      });
  };

  //   this.props.navigation.navigate('CheckScreen', {
  //     form_data: form_data,
  //     uri: this.state.photo,
  //     mediname: null,
  //   });
  // };
  // savePhoto = async () => {
  //   try {
  //     console.log(FileSystem.cacheDirectory);
  //     // const getImg = await FileSystem.getInfoAsync(this.state.photo);
  //     // console.log(getImg);
  //     this.props.navigation.navigate('CheckScreen', {
  //       uri: this.state.photo,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
}

const styles = StyleSheet.create({
  loginContainer: {
    alignItems: 'center',
    height: '100%',
  },
});
