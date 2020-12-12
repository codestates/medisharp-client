import React from 'react';
import { View, Text, Image } from 'react-native';
import { ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

import * as FileSystem from 'expo-file-system';

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
    const { hasPermission, cameraType } = this.state;
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
                <Image source={this.state.image} style={{ width: '100%', height: window.width }} />
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
                <TouchableOpacity onPress={this.savePhoto}>
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
        //this.savePhoto(img.uri);
        this.setState({ photo: img.uri, image: img, show: false });
        //this.handleSubmit();
      }
    }
  };
  savePhoto = async () => {
    try {
      console.log(FileSystem.cacheDirectory);
      // const getImg = await FileSystem.getInfoAsync(this.state.photo);
      // console.log(getImg);
      this.props.navigation.navigate('CheckStack', {
        uri: this.state.photo,
      });
    } catch (error) {
      console.log(error);
    }
  };
  // savePhoto = async () => {
  //   try {
  //     const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  //     if (status === 'granted') {
  //       const asset = await MediaLibrary.createAssetAsync(this.state.photo);
  //       let album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
  //       if (album === null) {
  //         album = await MediaLibrary.createAlbumAsync(ALBUM_NAME, asset);
  //       } else {
  //         await MediaLibrary.addAssetsToAlbumAsync([asset], album.id);
  //       }
  //     } else {
  //       this.setState({ hasPermission: false });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // upload = async () => {
  //   this.setState({ photo: img.uri, image: img, show: false });
  //   this.handleSubmit();
  // };
  pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
    });
    console.log('pickImage: ', result); //pickImage:  {cancelled: false, uri: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD…v7EhjkvIwl2TuZs5A9Pxro4rsS7oA3LHOW/pWUmZ2d9T/2Q==", width: 3024, height: 4032} 로 잘 찍힘
    //uri가 data:image/jpeg;base64 형식이다. data형식의 jpeg인 image이며 base64로 인코딩되어 있다는 뜻이다.
    //이 뒤에 붙을 이미지를 텍스트로 인코딩해야한다.
    if (!result.cancelled) {
      this.setState({ photo: result.uri });
    }
    this.handleSubmit();
  };
  //이제 서버 전송전에 formData를 만들어 이미지 및 다른 정보를 보낼 준비를 합니다.
  //여기서 Blob를 핸들링 해야합니다.
  //다시 formData를 만들어봅시다
  //https://kyounghwan01.github.io/blog/React/image-upload/#base64-%EB%B3%80%ED%99%98
  handleSubmit = () => {
    // dataURL 값이 data:image/jpeg:base64,~~~~~~~ 이므로 ','를 기점으로 잘라서 ~~~~~인 부분만 다시 인코딩
    const byteString = atob(this.state.photo.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ia], {
      type: 'image/jpeg',
    });
    const file = new File([blob], 'image.jpg');
    let form_data = new FormData();
    console.log('handleSubmit photo: ', file);
    form_data.append('image', blob);
    console.log('handleSubmit form_data: ', form_data.entries().next());
    let url = 'http://localhost:5000/medicines/image';
    axios
      .post(url, form_data, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  };
}
