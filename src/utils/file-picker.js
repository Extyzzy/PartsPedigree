import { Alert, Platform, ActionSheetIOS } from 'react-native';
import {DocumentPicker, DocumentPickerUtil} from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';
import Picker from 'react-native-picker/index';
import { FileData } from "../models/file-data";
import { ImageUtils } from "./image-utils";
import { pickerStyle } from "../components/picker/picker.style";
import { attachmentsTags } from "../constants/attachments-tags";

export class FilePicker {
    static show() {
        if (Platform.OS === 'android') {
            return showDocumentPicker();
        } else {
            return new Promise((resolve, reject) => {
                ActionSheetIOS.showActionSheetWithOptions({
                        options: ['Take a Photo', 'Select Image', 'Select File', 'Cancel'],
                        destructiveButtonIndex: 2,
                        cancelButtonIndex: 2,
                    },
                    (buttonIndex) => {
                        switch (buttonIndex) {
                            case 0:
                             return resolve(takePhoto());
                            case 1:
                                return resolve(showImageGallery());
                            case 2:
                                return resolve(showDocumentPicker());
                            default:
                                return reject();
                        }
                    });
            });
        }
    }
}

async function showDocumentPicker(): Promise<FileData> {
    return new Promise(resolve => {
      const options = {
        title: 'Select File',
        customButtons: [{ name: 'file', title: 'Select File' }],
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };

      ImagePicker.showImagePicker(options, async (response) => {
        if (response.didCancel) {
          return reject();
        }

        if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        }

        if (response.customButton === 'file') {
           return DocumentPicker.show({
            filetype: [DocumentPickerUtil.allFiles()],
          },(error,res) => {
            if(error){
              resolve(null)
            } else {
              const { uri, fileName, type } = res;

              resolve(new FileData(uri, fileName, type));
            }
          });
        }

        const { uri, fileName, type, originalRotation } = response;

        let rotation = 0;

        if (originalRotation === 90) {
          rotation = 90;
        } else if (originalRotation === 270) {
          rotation = -90;
        }

        // const resizedImage = await ImageUtils.resizeImage(uri, response.height, response.width, rotation);

        const image = new FileData(uri, fileName, type);

        return resolve(image);
    });
  });
}

function showImageGallery(): Promise<FileData> {
    return new Promise((resolve, reject) => {
        const options = {
            title: 'Select Image',
        };

        ImagePicker.launchImageLibrary(options, async (response) => {
            if (response.didCancel) {
                return reject();
            }

            if (response.error) {
                Alert('Error', response.error && response.error.message || response.error);

                return reject(response.error);
            }

            const { uri, fileName, type, originalRotation } = response;

            let rotation = 0;

            if (originalRotation === 90) {
                rotation = 90;
            } else if (originalRotation === 270) {
                rotation = -90;
            }

            // const resizedImage = await ImageUtils.resizeImage(uri, response.height, response.width, rotation);

            const image = new FileData(uri, fileName, type);
            //image.description = await showTagPicker();

            return resolve(image);
        });
    })
}

function takePhoto(): Promise<FileData> {
  return new Promise((resolve, reject) => {
    const options = {
      title: 'Take Photo',
    };

    ImagePicker.launchCamera(options, async (response) => {
      if (response.didCancel) {
        return reject();
      }

      if (response.error) {
        Alert('Error', response.error && response.error.message || response.error);

        return reject(response.error);
      }

      const { uri, fileName, type, originalRotation } = response;

      let rotation = 0;

      if (originalRotation === 90) {
        rotation = 90;
      } else if (originalRotation === 270) {
        rotation = -90;
      }

      // const resizedImage = await ImageUtils.resizeImage(uri, response.height, response.width, rotation);

      const image = new FileData(uri, fileName, type);
      //image.description = await showTagPicker();

      return resolve(image);
    });
  })
}

function showTagPicker() {
    return new Promise((resolve, reject) => {
        Picker.init({
            ...pickerStyle,
            pickerTitleText: "Select Tag for Attachment",
            pickerData: attachmentsTags,
            selectedValue: [attachmentsTags[0]],
            onPickerConfirm: (data, idx) => {
                resolve(attachmentsTags[idx]);
            },
            onPickerCancel: () => {
                reject();
            }
        });

        Picker.show();
    });
}
