import { openDB } from "idb";

const initdb = async () =>
  openDB("jate", 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains("jate")) {
        console.log("jate database already exists");
        return;
      }
      db.createObjectStore("jate", { keyPath: "id", autoIncrement: true });
      console.log("jate database created");
    },
  });

// Put the content into the database
export const putDb = async (content) => {
  const jateDb = await openDB("jate", 1);
  const tx = jateDb.transaction("jate", "readwrite");
  const store = tx.objectStore("jate");
  const request = store.add({ content });
  const result = await request;
  console.log("Data saved to the database", result);
};

// Get the content from the database
export const getDb = async () => {
  try {
    const jateDb = await openDB("jate", 1);
    const tx = jateDb.transaction("jate", "readonly");
    const store = tx.objectStore("jate");
    const request = store.getAll();
    const result = await request;
    console.log("Data retrieved from the database:", result);
    return result;
  } catch (error) {
    console.error("Error retrieving data from the database:", error);
  }
};

initdb();
