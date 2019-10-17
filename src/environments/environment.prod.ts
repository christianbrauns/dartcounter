import {firebaseConfig} from '../config/firebase-config';
import {Environment} from './environment.interface';

export const environment: Environment = {
  production: true,
  firebase: firebaseConfig
};
