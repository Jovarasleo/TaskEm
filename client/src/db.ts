import { IdbAction } from "./store/slices/types";
import { Project, Task, TaskContainer } from "./views/taskManager/model/task";

let request: IDBOpenDBRequest;
let db: IDBDatabase;
const version = 2;
const dbName = "TaskEm";

export enum Stores {
  Projects = "Projects",
  Tasks = "Tasks",
  Containers = "Containers",
  Events = "Events",
}

export interface EventData {
  key: IDBValidKey;
  value: IdbAction;
}

export const initDB = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (db) {
      return resolve(true);
    }

    const checkVersionRequest = indexedDB.open(dbName);

    checkVersionRequest.onsuccess = (event) => {
      const existingDB = (event.target as IDBOpenDBRequest).result;
      const existingVersion = existingDB.version;
      existingDB.close(); // Close the old connection

      if (existingVersion !== version) {
        console.log(
          `Upgrading database from version ${existingVersion} to ${version}. Resetting DB...`
        );
        resetDatabase(resolve);
      } else {
        console.log("Database is up-to-date.");
        openDatabase(resolve);
      }
    };

    checkVersionRequest.onerror = () => {
      console.error("Error checking database version.");
      resolve(false);
    };
  });
};

const resetDatabase = (resolve: (value: boolean) => void) => {
  const deleteRequest = indexedDB.deleteDatabase(dbName);

  deleteRequest.onsuccess = () => {
    console.log("Database deleted successfully.");
    openDatabase(resolve);
  };

  deleteRequest.onerror = () => {
    console.error("Error deleting database.");
    resolve(false);
  };
};

const openDatabase = (resolve: (value: boolean) => void) => {
  request = indexedDB.open(dbName, version);

  request.onupgradeneeded = (event) => {
    const db = (event.target as IDBRequest).result;
    console.log(`Setting up database schema for version ${version}`);

    if (!db.objectStoreNames.contains(Stores.Projects)) {
      db.createObjectStore(Stores.Projects, { autoIncrement: false });
    }

    if (!db.objectStoreNames.contains(Stores.Tasks)) {
      const store = db.createObjectStore(Stores.Tasks, { autoIncrement: false });
      store.createIndex("projectIdIndex", "projectId", { unique: false });
    }

    if (!db.objectStoreNames.contains(Stores.Containers)) {
      const store = db.createObjectStore(Stores.Containers, { autoIncrement: false });
      store.createIndex("projectIdIndex", "projectId", { unique: false });
    }

    if (!db.objectStoreNames.contains(Stores.Events)) {
      db.createObjectStore(Stores.Events, { autoIncrement: true });
    }
  };

  request.onsuccess = (event) => {
    db = (event.target as IDBOpenDBRequest).result;
    console.log("Database initialized with version:", db.version);
    resolve(true);
  };

  request.onerror = () => {
    console.error("Database initialization failed.");
    resolve(false);
  };
};

export async function setProject(project: Project) {
  try {
    await initDB();

    const transaction = db.transaction([Stores.Projects], "readwrite");

    const objectStore = transaction.objectStore(Stores.Projects);
    const id = project.projectId;

    const request = objectStore.put(project, id);
    request.onsuccess = (event) => {
      console.log(event);
    };
  } catch (error) {
    console.log(error);
  }
}

export async function setContainer(container: TaskContainer) {
  try {
    await initDB();

    const transaction = db.transaction([Stores.Containers], "readwrite");
    const objectStore = transaction.objectStore(Stores.Containers);
    const request = objectStore.put(container, container.containerId);

    request.onsuccess = (event) => {
      console.log("Item stored successfully:", event);
    };

    request.onerror = (event) => {
      const error = (event.target as IDBOpenDBRequest).error;
      console.error("Error storing item:", error);
    };
  } catch (error) {
    console.log(error);
  }
}

export async function setTask(task: Task) {
  try {
    await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([Stores.Tasks], "readwrite");

      const objectStore = transaction.objectStore(Stores.Tasks);
      const id = task.taskId;

      const request = objectStore.put(task, id);
      request.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result;
        resolve(result); // Resolve the Promise with the data
      };

      request.onerror = (event) => {
        const error = (event.target as IDBRequest).error;
        reject(error);
      };
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getTasksIdb(projectId: string): Promise<Task[]> {
  try {
    await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([Stores.Tasks], "readwrite");
      const objectStore = transaction.objectStore(Stores.Tasks);

      const index = objectStore.index("projectIdIndex");
      const request = index.getAll(projectId);

      request.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result;
        resolve(result);
      };

      request.onerror = (event) => {
        const error = (event.target as IDBRequest).error;
        reject(error);
      };
    });
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function deleteTask(task: Task) {
  try {
    await initDB();

    const transaction = db.transaction([Stores.Tasks], "readwrite");
    const objectStore = transaction.objectStore(Stores.Tasks);

    const request = objectStore.delete(task.taskId);

    request.onsuccess = (event) => {
      console.log("Item deleted successfully:", event);
    };

    request.onerror = (event) => {
      const error = (event.target as IDBOpenDBRequest).error;
      console.error("Error storing item:", error);
    };
  } catch (error) {
    console.log(error);
  }
}

export async function getProjectsIdb(): Promise<Project[]> {
  try {
    await initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([Stores.Projects], "readwrite");
      const objectStore = transaction.objectStore(Stores.Projects);
      const request = objectStore.getAll();

      request.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result;
        resolve(result);
      };

      request.onerror = (event) => {
        const error = (event.target as IDBRequest).error;
        reject(error);
      };
    });
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to handle it higher up in the call stack
  }
}

export async function getContainersIdb(projectId: string): Promise<TaskContainer[]> {
  try {
    await initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([Stores.Containers], "readwrite");
      const objectStore = transaction.objectStore(Stores.Containers);

      const index = objectStore.index("projectIdIndex");
      const request = index.getAll(projectId);

      request.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result;
        resolve(result); // Resolve the Promise with the data
      };

      request.onerror = (event) => {
        const error = (event.target as IDBRequest).error;
        reject(error);
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

    const objectStore = transaction.objectStore(Stores.Tasks);
    const id = Task.taskId;

    const request = objectStore.put(Task, id);
    request.onsuccess = (event) => {
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

    const objectStore = transaction.objectStore(Stores.Projects);
    const id = project.projectId;

    const request = objectStore.put(project, id);
    request.onsuccess = (event) => {
      console.log(event);
    };
  } catch (error) {
    console.log(error);
  }
}

export async function deleteProject(projectInfo: { projectId: string }) {
  try {
    await initDB();

    const { projectId } = projectInfo;

    const transaction = db.transaction([Stores.Projects], "readwrite");
    const objectStore = transaction.objectStore(Stores.Projects);
    const request = objectStore.delete(projectId);
    request.onsuccess = (event) => {
      console.log(event);
    };
  } catch (error) {
    console.log(error);
  }
}

export async function syncAllProjects(projects: Project[]) {
  try {
    await initDB();

    const transaction = db.transaction([Stores.Projects], "readwrite");
    const objectStore = transaction.objectStore(Stores.Projects);

    // Step 1: Clear all existing projects
    const clearRequest = objectStore.clear();

    clearRequest.onsuccess = async () => {
      // Step 2: Add new projects
      for (const project of projects) {
        const id = project.projectId;
        const addRequest = objectStore.add(project, id);
        addRequest.onerror = (event) => console.error("Error adding project", event);
      }
    };

    clearRequest.onerror = (event) => {
      console.error("Error clearing projects", event);
    };
  } catch (error) {
    console.log(error);
  }
}

export async function syncAllTasks(tasks: Task[]) {
  try {
    await initDB();

    const transaction = db.transaction([Stores.Tasks], "readwrite");
    const objectStore = transaction.objectStore(Stores.Tasks);

    const clearRequest = objectStore.clear();

    clearRequest.onsuccess = async () => {
      for (const task of tasks) {
        const id = task.taskId;
        const addRequest = objectStore.add(task, id);
        addRequest.onerror = (event) => console.error("Error adding task", event);
      }
    };

    clearRequest.onerror = (event) => {
      console.error("Error clearing tasks", event);
    };
  } catch (error) {
    console.log(error);
  }
}

export async function syncAllContainers(containers: TaskContainer[]) {
  try {
    await initDB();

    const transaction = db.transaction([Stores.Containers], "readwrite");
    const objectStore = transaction.objectStore(Stores.Containers);

    const clearRequest = objectStore.clear();

    clearRequest.onsuccess = async () => {
      for (const container of containers) {
        const id = container.containerId;
        const addRequest = objectStore.add(container, id);
        addRequest.onerror = (event) => console.error("Error adding container", event);
      }
    };

    clearRequest.onerror = (event) => {
      console.error("Error clearing containers", event);
    };
  } catch (error) {
    console.log(error);
  }
}

export async function deleteContainer(container: TaskContainer) {
  try {
    await initDB();

    const transaction = db.transaction([Stores.Containers], "readwrite");
    const objectStore = transaction.objectStore(Stores.Containers);

    const request = objectStore.delete(container.containerId);

    request.onsuccess = (event) => {
      console.log("Item deleted successfully:", event);
    };

    request.onerror = (event) => {
      const error = (event.target as IDBOpenDBRequest).error;
      console.error("Error storing item:", error);
    };
  } catch (error) {
    console.log(error);
  }
}

export async function storeEvents(eventData: IdbAction) {
  try {
    await initDB();

    const transaction = db.transaction([Stores.Events], "readwrite");
    const objectStore = transaction.objectStore(Stores.Events);

    const request = objectStore.put(eventData);

    request.onerror = (event) => {
      const error = (event.target as IDBOpenDBRequest).error;
      console.error("Error storing item:", error);
    };
  } catch (error) {
    console.log("store event fails 2", error);
  }
}

export async function getEvents(): Promise<EventData[]> {
  try {
    await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([Stores.Events], "readwrite");
      const objectStore = transaction.objectStore(Stores.Events);

      const valuesRequest = objectStore.getAll();
      const keysRequest = objectStore.getAllKeys();

      valuesRequest.onsuccess = () => {
        keysRequest.onsuccess = () => {
          const values = valuesRequest.result;
          const keys = keysRequest.result;

          // Combine keys and values into an array of objects
          const events = keys.map((key, index) => ({
            key,
            value: values[index],
          }));
          resolve(events);
        };
      };

      valuesRequest.onerror = (event) => reject(event);
      keysRequest.onerror = (event) => reject(event);
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function deleteEvent(eventKey: IDBValidKey) {
  try {
    await initDB();

    const transaction = db.transaction([Stores.Events], "readwrite");

    const objectStore = transaction.objectStore(Stores.Events);
    const request = objectStore.delete(eventKey);
    request.onsuccess = (event) => {
      console.log(event);
    };
  } catch (error) {
    console.log(error);
  }
}
