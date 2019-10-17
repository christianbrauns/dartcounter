export interface FirebaseConfig {
  apiKey: string;
  appId: string;
  authDomain: string;
  databaseURL: string;
  measurementId: string;
  messagingSenderId: string;
  projectId: string;
  storageBucket: string;
}

export interface Environment {
  firebase: FirebaseConfig;
  production: boolean;
}
