import { Project, Task, TaskContainer } from "./views/taksManager/model/task";

var request: IDBOpenDBRequest;
var db: IDBDatabase;
let version = 1;
const dbName = "TaskEm";

export enum Stores {
  Projects = "Projects",
  Tasks = "Tasks",
  Containers = "Containers",
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
      db = (event.target as IDBOpenDBRequest).result;

      // if the data object store doesn't exist, create it
      if (!db.objectStoreNames.contains(Stores.Projects)) {
        db.createObjectStore(Stores.Projects, {
          autoIncrement: false,
        });
      }

      if (!db.objectStoreNames.contains(Stores.Tasks)) {
        db.createObjectStore(Stores.Tasks, {
          autoIncrement: false,
        });
      }

      if (!db.objectStoreNames.contains(Stores.Containers)) {
        console.log("Creating containers store");
        db.createObjectStore(Stores.Containers, {
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

export async function setProject(Project: Project) {
  try {
    await initDB();

    const transaction = db.transaction([Stores.Projects], "readwrite");

    const objectStore = transaction.objectStore(Stores.Projects);
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

export async function setContainers(projectId: string, containers: TaskContainer[]) {
  try {
    await initDB();

    const transaction = db.transaction([Stores.Containers], "readwrite");
    console.log({ projectId, containers });

    const objectStore = transaction.objectStore(Stores.Containers);

    containers.forEach((container) => {
      const request = objectStore.put(container, container.containerId);

      request.onsuccess = (event) => {
        console.log("Item stored successfully:", event);
      };

      request.onerror = (event) => {
        console.error("Error storing item:", event.target.error);
      };
    });
  } catch (error) {
    console.log(error);
  }
}

export async function setTask(Task: Task) {
  try {
    await initDB();

    const transaction = db.transaction([Stores.Tasks], "readwrite");
    // console.log(db, transaction);
    console.log(Task);

    const objectStore = transaction.objectStore(Stores.Tasks);
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

export async function getTasks() {
  try {
    await initDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(["Tasks"], "readwrite");
      const objectStore = transaction.objectStore("Tasks");

      const request = objectStore.getAll();
      request.onsuccess = (event) => {
        const result = (event.target as IDBOpenDBRequest).result;
        resolve(result); // Resolve the Promise with the data
      };
    });
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
        const result = (event.target as IDBOpenDBRequest).result;
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

export async function getContainers() {
  try {
    await initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([Stores.Containers], "readwrite");
      const objectStore = transaction.objectStore(Stores.Containers);
      const request = objectStore.getAll();

      request.onsuccess = (event) => {
        const result = event.target.result;
        const mappedContainers = result.sort((a, b) => a.position - b.position);
        resolve(mappedContainers); // Resolve the Promise with the data
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

export async function putTask(Task: Task) {
  try {
    await initDB();

    const transaction = db.transaction([Stores.Tasks], "readwrite");
    // console.log(db, transaction);

    const objectStore = transaction.objectStore(Stores.Tasks);
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

export async function putProject(project: Project) {
  try {
    await initDB();

    const transaction = db.transaction([Stores.Projects], "readwrite");
    // console.log(db, transaction);

    const objectStore = transaction.objectStore(Stores.Projects);
    const id = project.projectId;
    console.log({ id });
    const request = objectStore.put(project, id);
    request.onsuccess = (event) => {
      // event.target.result === customer.ssn;
      console.log(event);
    };
  } catch (error) {
    console.log(error);
  }
}

export async function removeProject(projectId: string) {
  try {
    await initDB();

    const transaction = db.transaction([Stores.Projects], "readwrite");

    const objectStore = transaction.objectStore(Stores.Projects);
    const request = objectStore.delete(projectId);
    request.onsuccess = (event) => {
      // event.target.result === customer.ssn;
      console.log(event);
    };
  } catch (error) {
    console.log(error);
  }
}
