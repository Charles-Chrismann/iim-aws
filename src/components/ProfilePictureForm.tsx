import { uploadData } from 'aws-amplify/storage';
import { DetailedHTMLProps, FormEventHandler, InputHTMLAttributes } from 'react';

export function ProfilePictureForm({ userId }: { userId: string }) {

  async function onInput(e: any) {
    console.log(e)
    const file = e.target.files[0]
    console.log(file)
    try {
      const result = await uploadData({
        path: 'public/album/2025/1.jpg', 
        // path: 'public/album/2024/1.jpg', 
        // Alternatively, path: ({identityId}) => `protected/${identityId}/album/2024/1.jpg`
        data: file,
        options: {
          onProgress: (progress) => {
            console.log(progress)
          }
        }
      }).result;
      console.log('Succeeded: ', result);
    } catch (error) {
      console.log('Error : ', error);
    }
  }


  return (
    <div>
      <input type="file" name="tes" id="test" onChange={onInput} />
    </div>
  )
}
