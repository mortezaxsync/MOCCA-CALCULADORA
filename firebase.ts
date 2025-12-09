import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { getFirestore, collection, addDoc, query, where, orderBy, getDocs, Timestamp, enableIndexedDbPersistence } from "firebase/firestore";

// --- CONFIGURAÇÃO DO FIREBASE ---
// IMPORTANTE: Para o app funcionar no seu celular, você DEVE criar um projeto no Firebase
// e colar suas chaves reais abaixo.
// Link: https://console.firebase.google.com/
const firebaseConfig = {
  apiKey: "AIzaSyD-YOUR_ACTUAL_API_KEY_HERE",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// Validação simples para evitar erro silencioso se o usuário não configurar
const isConfigured = firebaseConfig.apiKey.includes("YOUR_ACTUAL_API_KEY");

if (isConfigured) {
  console.warn("⚠️ ALERTA: As chaves do Firebase não foram configuradas. O login e salvamento não funcionarão.");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Tenta habilitar cache offline (útil para apps mobile)
// Nota: Em alguns ambientes de navegador restritos, isso pode falhar, então usamos catch.
try {
  // enableIndexedDbPersistence(db).catch((err) => {
  //   if (err.code == 'failed-precondition') {
  //       console.log('Múltiplas abas abertas, persistência habilitada apenas em uma.');
  //   } else if (err.code == 'unimplemented') {
  //       console.log('Navegador não suporta persistência offline.');
  //   }
  // });
  // Comentado pois imports via CDN as vezes tem problemas com persistência explícita dependendo da versão,
  // mas o Firestore padrão já gerencia cache em memória muito bem.
} catch (e) {
  console.log("Persistência offline não suportada neste ambiente.");
}

const provider = new GoogleAuthProvider();

export interface SavedExtraction {
  id?: string;
  flour: number;
  bran: number;
  yieldPercentage: number;
  date: Timestamp; // Firestore timestamp
  userId: string;
}

// Funções de Serviço

// 1. Login com Google
export const signInWithGoogle = async (): Promise<User | null> => {
  if (isConfigured) {
    alert("ERRO DE CONFIGURAÇÃO:\n\nVocê precisa configurar as chaves do Firebase no arquivo firebase.ts antes de fazer login.\n\nSubstitua 'YOUR_ACTUAL_API_KEY_HERE' pelas chaves do seu projeto no console.firebase.google.com");
    return null;
  }
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error: any) {
    console.error("Erro no login:", error);
    alert(`Erro ao conectar com Google: ${error.message}`);
    return null;
  }
};

// 2. Salvar Extração
export const saveExtraction = async (user: User, data: { flour: number, bran: number, yieldPercentage: number }) => {
  if (isConfigured) return false;
  
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
  if (isConfigured) return [];

  try {
    // Tenta a query com ordenação
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
    
    // Fallback: Se falhar por falta de índice (erro comum 'failed-precondition'), 
    // tenta buscar sem ordenar e ordena no cliente.
    if (error.code === 'failed-precondition' || error.message.includes('index')) {
        console.warn("Índice faltando. Tentando busca sem ordenação no servidor...");
        try {
            const qFallback = query(
                collection(db, "extractions"), 
                where("userId", "==", user.uid)
            );
            const snapshot = await getDocs(qFallback);
            const history: SavedExtraction[] = [];
            snapshot.forEach((doc) => {
                history.push({ id: doc.id, ...doc.data() } as SavedExtraction);
            });
            // Ordena via Javascript
            return history.sort((a, b) => b.date.seconds - a.date.seconds);
        } catch (e) {
            return [];
        }
    }
    return [];
  }
};

export { auth };