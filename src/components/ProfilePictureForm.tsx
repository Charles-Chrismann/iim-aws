import { post } from '@aws-amplify/api';
import { uploadData } from 'aws-amplify/storage';
import amplifyconfig from '../aws-exports';
import { useState } from 'react';

export function ProfilePictureForm({ user, setUser }: { user: Record<string, any>, setUser: Function }) {
  const [cacheInvalidator, setCacheInvalidator] = useState(crypto.randomUUID())

  async function onInput(e: any) {
    const file = e.target.files[0]

    try {
      const result = await uploadData({
        path: `users/${user.id}/avatar.${file.type.split('/')[1]}`,
        data: file,
        options: {
          onProgress: (progress) => {
            console.log(progress)
          }
        }
      }).result;

      const res = await post({
        path: "/updateUser",
        apiName: 'users',
        options: {
          body: {
            id: user.id,
            avatarS3Path: result.path
          }
        }
      }).response

      if (res.statusCode === 200) {
        setUser({ ...user, avatarS3Path: result.path })
        setCacheInvalidator(crypto.randomUUID())
      }
    } catch (error) {
      console.log('Error : ', error);
    }
  }


  return (
    <div
      style={{
        maxWidth: "768px",
        margin: "1rem auto",
        padding: "1.5rem",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        fontFamily: "sans-serif",
        background: "#fff",
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {
        user.avatarS3Path &&
        <>
          <img
            style={{
              width: '100%',
              aspectRatio: 1,
              objectFit: 'cover'
            }}
            src={`https://${(amplifyconfig as any)["aws_user_files_s3_bucket"]}.s3.${(amplifyconfig as any)["aws_user_files_s3_bucket_region"]}.amazonaws.com/${user.avatarS3Path}?a=${cacheInvalidator}`}
            alt='user avatar'
          />
          <div className='p-4 text-center'>
            <label htmlFor="avatar">Changer d'avatar</label>
          </div>
        </>
      }

      {
        !user.avatarS3Path &&
        <div 
          style={{
            width: "100%",
            aspectRatio: 1,
            display: "grid",
            placeItems: "center"
          }}
        >
          <label htmlFor="avatar">Ajouter un avatar</label>
        </div>
      }

      <input type="file" name="avatar" id="avatar" onChange={onInput} hidden />
    </div >
  )
}
