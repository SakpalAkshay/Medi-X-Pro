import { Client, Account, Databases, Storage, Avatars } from "appwrite";

export const appwriteConfig = {
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    url: import.meta.env.VITE_APPWRITE_URL,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
    doctorCollectionId: import.meta.env.VITE_APPWRITE_DOCTOR_COLLECTION_ID,
    patientCollectionId: import.meta.env.VITE_APPWRITE_PATIENT_COLLECTION_ID,
    historyCollectionId: import.meta.env.VITE_APPWRITE_HISTORY_COLLECTION_ID
};

export const client = new Client();

client.setEndpoint(appwriteConfig.url);
client.setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
