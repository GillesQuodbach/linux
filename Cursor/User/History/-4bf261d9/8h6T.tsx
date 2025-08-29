import React from 'react';
import { View } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useAuthRequestResult } from 'expo-auth-session';
import { GoogleAuthProvider, signInWithCredential, OAuthProvider } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useAuth } from '../state/authStore';

export default function SocialAuthButtons() {
  const [, , googlePrompt] = Google.useAuthRequest({
    iosClientId: 'GOOGLE_IOS_CLIENT_ID',
    androidClientId: 'GOOGLE_ANDROID_CLIENT_ID',
    webClientId: 'GOOGLE_WEB_CLIENT_ID',
    responseType: 'id_token',
  });
  useAuthRequestResult(async (result) => {
    if (result?.type === 'success' && result.authentication?.idToken) {
      const credential = GoogleAuthProvider.credential(result.authentication.idToken);
      const res = await signInWithCredential(auth, credential);
      await useAuth.getState().setAuth(true, res.user.uid);
    }
  });

  return (
    <View style={{ gap: 8 }}>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
        cornerRadius={8}
        style={{ width: '100%', height: 44 }}
        onPress={async () => {
          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            });
            const provider = new OAuthProvider('apple.com');
            const authCredential = provider.credential({ idToken: credential.identityToken ?? '' });
            const res = await signInWithCredential(auth, authCredential);
            await useAuth.getState().setAuth(true, res.user.uid);
          } catch (e) {
            // ignore cancellations
          }
        }}
      />
      {/* Google button via prompt */}
      <View style={{ height: 44, borderRadius: 8, overflow: 'hidden' }}>
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={8}
          style={{ width: '100%', height: 44 }}
          onPress={() => googlePrompt()}
        />
      </View>
    </View>
  );
}


