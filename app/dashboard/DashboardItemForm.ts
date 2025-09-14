import { getAuth } from '@react-native-firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from '@react-native-firebase/firestore';

// Firestore instance
const db = getFirestore();
const auth = getAuth();

export interface Item {
  id: string;
  name: string;
  description: string;
  tags: string[];
  createdBy: string;
  createdAt: any;
}

export const listenToItems = (callback: (items: Item[]) => void, onError: (err: any) => void) => {
  const q = query(collection(db, 'items'), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      if (!snapshot || snapshot.empty) {
        callback([]);
        return;
      }
      const itemsData = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Item[];
      callback(itemsData);
    },
    (error) => {
      onError(error);
    }
  );
};

export const addItem = async (name: string, description: string, tags: string[]) => {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be logged in to create an item.');

  await addDoc(collection(db, 'items'), {
    name,
    description,
    tags,
    createdBy: user.uid,
    createdAt: serverTimestamp(),
  });
};

export const deleteItem = async (itemId: string) => {
  await deleteDoc(doc(db, 'items', itemId));
};
