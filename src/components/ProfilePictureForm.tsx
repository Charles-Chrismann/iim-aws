import { post } from '@aws-amplify/api';
import { uploadData } from 'aws-amplify/storage';
import { DetailedHTMLProps, FormEventHandler, InputHTMLAttributes, useEffect } from 'react';

export function ProfilePictureForm({ userId }: { userId: string }) {

  useEffect(() => {
    async function main() {
      
      const res = await post({
        path: "/getUser",
        apiName: 'users',
        options: {
          body: {
            id: "82558424-80c1-707b-7080-74987f47c82a"
          },
          // queryParams: {
          //   id: "123"
          // },
        }
      }).response

      console.log(res)
    }

    main()
  }, [])

  async function onInput(e: any) {
    console.log(e)
    const file = e.target.files[0]
    console.log(file)
    try {
      const result = await uploadData({
        path: `users/${userId}/avatar.${file.type.split('/')[1]}`, 
        // path: 'public/album/2024/1.jpg', 
        // Alternativ ely, path: ({identityId}) => `protected/${identityId}/album/2024/1.jpg`
        data: file,
        options: {
          onProgress: (progress) => {
            console.log(progress)
          }
        }
      }).result;
      console.log('Succeeded: ', result);
      console.log('Succeeded: ', result.path);

      await post({
        path: "/getUser",
        apiName: 'users',
        options: {
          body: {
            id: "123"
          }
        }
      })
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
