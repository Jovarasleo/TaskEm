var request: IDBOpenDBRequest;
var db: IDBDatabase;
let version = 1;
const dbName = "TaskEm";

export enum Stores {
  Projects = "Projects",
  Tasks = "Tasks",
}

export const initDB = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // open the connection

    if (db) {
      // If the database connection already exists, resolve immediately
      return resolve(true);
    }

    request = indexedDB.open(dbName, version);

    request.onupgradeneeded = (event) => {
      db = event?.target?.result;

      // if the data object store doesn't exist, create it
      if (!db.objectStoreNames.contains(Stores.Projects)) {
        console.log("Creating projects store");
        db.createObjectStore(Stores.Projects, {
          autoIncrement: false,
        });
      }

      if (!db.objectStoreNames.contains(Stores.Tasks)) {
        db.createObjectStore(Stores.Tasks, {
          autoIncrement: false,
        });
      }
      // no need to resolve here
    };

    request.onsuccess = (event) => {
      db = event?.target?.result;
      //   version = db.version;
      console.log("request.onsuccess - initDB", version);
      resolve(true);
    };

    request.onerror = () => {
      resolve(false);
    };
  });
};

export async function createProject(Project) {
  try {
    await initDB();

    const transaction = db.transaction(["Projects"], "readwrite");
    // console.log(db, transaction);
    console.log(Project);

    const objectStore = transaction.objectStore("Projects");
    const id = Project.projectId;
    console.log({ id });
    const request = objectStore.put(Project, id);
    request.onsuccess = (event) => {
      // event.target.result === customer.ssn;
      console.log(event);
    };
  } catch (error) {
    console.log(error);
  }
}

export async function createTask(Task) {
  try {
    await initDB();

    const transaction = db.transaction(["Tasks"], "readwrite");
    // console.log(db, transaction);
    console.log(Task);

    const objectStore = transaction.objectStore("Tasks");
    const id = Task.taskId;

    console.log({ id });
    const request = objectStore.put(Task, id);
    request.onsuccess = (event) => {
      // event.target.result === customer.ssn;
      console.log(event);
    };
  } catch (error) {
    console.log(error);
  }
}

export async function getTask(Task) {
  try {
    await initDB();

    const transaction = db.transaction(["Tasks"], "readwrite");
    // console.log(db, transaction);
    console.log(Task);

    const objectStore = transaction.objectStore("Tasks");
    const id = Task;

    console.log({ id });
    const request = objectStore.get(id);
    request.onsuccess = (event) => {
      // event.target.result === customer.ssn;
      console.log(event);
      return event.target.result;
    };
  } catch (error) {
    console.log(error);
  }
}

export async function getProjects() {
  try {
    await initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["Projects"], "readwrite");
      const objectStore = transaction.objectStore("Projects");
      const request = objectStore.getAll();

      request.onsuccess = (event) => {
        const result = event.target.result;
        resolve(result); // Resolve the Promise with the data
      };

      request.onerror = (event) => {
        reject(event.target.error); // Reject the Promise in case of an error
      };
    });
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to handle it higher up in the call stack
  }
}

export async function editTask(Project) {
  try {
    await initDB();

    const transaction = db.transaction(["Projects"], "readwrite");
    // console.log(db, transaction);
    console.log(Project);

    const objectStore = transaction.objectStore("Projects");
    const id = Project.projectId;
    console.log({ id });
    const request = objectStore.put(Project, id);
    request.onsuccess = (event) => {
      // event.target.result === customer.ssn;
      console.log(event);
    };
  } catch (error) {
    console.log(error);
  }
}
