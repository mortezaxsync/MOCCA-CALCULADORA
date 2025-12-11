import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { getFirestore, collection, addDoc, query, where, orderBy, getDocs, Timestamp } from "firebase/firestore";

// --- CONFIGURAÇÃO PROJETO MOCCA ---
const firebaseConfig = {
  apiKey: "AIzaSyBjWF7a0TR7cYzYELSgFt4Qv8m8Nj_rowY",
  authDomain: "mocca-62337.firebaseapp.com",
  projectId: "mocca-62337",
  storageBucket: "mocca-62337.firebasestorage.app",
  messagingSenderId: "673316672390",
  appId: "1:673316672390:web:9c7d8b05bce014e5a8d207",
  measurementId: "G-21LHQGYK88"
};

// Inicialização Direta
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const provider = new GoogleAuthProvider();

export interface SavedExtraction {
  id?: string;
  flour: number;
  bran: number;
  yieldPercentage: number;
  date: Timestamp;
  userId: string;
}

// Funções de Serviço

// 1. Login com Google
export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error: any) {
    console.error("Erro no login:", error);
    return null;
  }
};

// 2. Salvar Extração
export const saveExtraction = async (user: User, data: { flour: number, bran: number, yieldPercentage: number }) => {
  try {
    await addDoc(collection(db, "extractions"), {
      userId: user.uid,
      flour: data.flour,
      bran: data.bran,
      yieldPercentage: data.yieldPercentage,
      date: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error("Erro ao salvar:", error);
    return false;
  }
};

// 3. Buscar Histórico
export const getHistory = async (user: User): Promise<SavedExtraction[]> => {
  try {
    const q = query(
      collection(db, "extractions"), 
      where("userId", "==", user.uid),
      orderBy("date", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const history: SavedExtraction[] = [];
    
    querySnapshot.forEach((doc) => {
      history.push({ id: doc.id, ...doc.data() } as SavedExtraction);
    });
    
    return history;
  } catch (error: any) {
    console.error("Erro ao buscar histórico:", error);
    return [];
  }
};

// Helper de compatibilidade (sempre retorna true pois as chaves estão no código)
export const isFirebaseReady = () => true;

// Funções para ConfigModal
export const saveFirebaseConfiguration = (config: string) => {
  try {
    localStorage.setItem('mocca_custom_firebase_config', config);
    return true;
  } catch (e) {
    console.error("Erro ao salvar configuração", e);
    return false;
  }
};

export const resetFirebaseConfiguration = () => {
  localStorage.removeItem('mocca_custom_firebase_config');
};