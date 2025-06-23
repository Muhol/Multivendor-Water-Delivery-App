import { Platform } from 'react-native';
import { Alert } from 'react-native';


const CloudinaryUpload = async (uri: string, name: string | null | undefined ) => {
  const cloudName = 'dn5f0jksu';
  const uploadPreset = 'vepo_uploads';

  const formData = new FormData();

  const file = {
    uri,
    type: Platform.OS === 'ios' ? 'image/jpeg' : 'image/*',
    name,
  };

  formData.append('file', file as any);
  formData.append('upload_preset', uploadPreset);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    // console.log('Cloudinary upload success:', data);
    return data;
  } catch (err:any) {
    console.error('Cloudinary upload error:', err);
    Alert.alert("")
    throw err;
  }
};

export default CloudinaryUpload;
