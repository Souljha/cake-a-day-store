import { db } from './firebaseService';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { MENU_DATA } from '../constants';
import { MenuCategory } from '../types';

const menuRef = () => doc(db, 'config', 'menu');

export const getMenuCategories = async (): Promise<MenuCategory[]> => {
  try {
    const snapshot = await getDoc(menuRef());
    if (snapshot.exists()) {
      return snapshot.data().categories as MenuCategory[];
    }
    // First run — seed Firestore from the local constants
    await saveMenuCategories(MENU_DATA);
    return MENU_DATA;
  } catch (error) {
    console.error('Error loading menu from Firebase:', error);
    return MENU_DATA;
  }
};

export const saveMenuCategories = async (categories: MenuCategory[]): Promise<boolean> => {
  try {
    await setDoc(menuRef(), { categories });
    return true;
  } catch (error) {
    console.error('Error saving menu to Firebase:', error);
    return false;
  }
};
