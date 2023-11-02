import { Project, Task, TaskContainer } from "./views/taksManager/model/task";

var request: IDBOpenDBRequest;
var db: IDBDatabase;
let version = 1;
const dbName = "TaskEm";

export enum Stores {
  Projects = "Projects",
  Tasks = "Tasks",
  Containers = "Containers",
  Events = "Events",
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
        db.createObjectStore(Stores.Containers, {
          autoIncrement: false,
        });
      }

      if (!db.objectStoreNames.contains(Stores.Events)) {
        db.createObjectStore(Stores.Events, {
          autoIncrement: false,
        });
      }
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
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
    console.log({ Project });

    const request = objectStore.put(Project, id);
    request.onsuccess = (event) => {
      // event.target.result === customer.ssn;
      console.log(event);
    };
  } catch (error) {
    console.log(error);
  }
}

export async function setContainers(containers: TaskContainer[]) {
  try {
    await initDB();

    const transaction = db.transaction([Stores.Containers], "readwrite");

    const objectStore = transaction.objectStore(Stores.Containers);

    containers.forEach((container) => {
      const request = objectStore.put(container, container.containerId);

      request.onsuccess = (event) => {
        console.log("Item stored successfully:", event);
      };

      request.onerror = (event) => {
        const error = (event.target as IDBOpenDBRequest).error;
        console.error("Error storing item:", error);
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

    const objectStore = transaction.objectStore(Stores.Tasks);
    const id = Task.taskId;

    const request = objectStore.put(Task, id);
    request.onsuccess = (event) => {};
  } catch (error) {
    console.log(error);
  }
}

export async function getTasks() {
  try {
    await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([Stores.Tasks], "readwrite");
      const objectStore = transaction.objectStore(Stores.Tasks);

      const request = objectStore.getAll();
      request.onsuccess = (event) => {
        const result = (event.target as IDBOpenDBRequest).result;
        resolve(result); // Resolve the Promise with the data
      };

      request.onerror = (event) => {
        const error = (event.target as IDBOpenDBRequest).error;
        reject(error);
      };
    });
  } catch (error) {
    console.log(error);
  }
}

export async function deleteTask(tasks: Task[]) {
  try {
    await initDB();

    const transaction = db.transaction([Stores.Tasks], "readwrite");
    const objectStore = transaction.objectStore(Stores.Tasks);

    tasks.forEach((task) => {
      const request = objectStore.delete(task.taskId);

      request.onsuccess = (event) => {
        console.log("Item deleted successfully:", event);
      };

      request.onerror = (event) => {
        const error = (event.target as IDBOpenDBRequest).error;
        console.error("Error storing item:", error);
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
      const transaction = db.transaction([Stores.Projects], "readwrite");
      const objectStore = transaction.objectStore(Stores.Projects);
      const request = objectStore.getAll();

      request.onsuccess = (event) => {
        const result = (event.target as IDBOpenDBRequest).result;
        resolve(result);
      };

      request.onerror = (event) => {
        const error = (event.target as IDBOpenDBRequest).error;
        reject(error);
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
        const result = (event.target as IDBOpenDBRequest).result;
        resolve(result); // Resolve the Promise with the data
      };

      request.onerror = (event) => {
        const error = (event.target as IDBOpenDBRequest).error;
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

export async function deleteContainers(containers: TaskContainer[]) {
  try {
    await initDB();

    const transaction = db.transaction([Stores.Containers], "readwrite");
    const objectStore = transaction.objectStore(Stores.Containers);

    containers.forEach((container) => {
      console.log(container);
      const request = objectStore.delete(container.containerId);

      request.onsuccess = (event) => {
        console.log("Item deleted successfully:", event);
      };

      request.onerror = (event) => {
        const error = (event.target as IDBOpenDBRequest).error;
        console.error("Error storing item:", error);
      };
    });
  } catch (error) {
    console.log(error);
  }
}

export async function storeEvents(eventData: any) {
  try {
    await initDB();

    const transaction = db.transaction([Stores.Events], "readwrite");

    const objectStore = transaction.objectStore(Stores.Events);
    const request = objectStore.put(eventData, eventData.id);
    request.onsuccess = (event) => {
      console.log(event);
    };
  } catch (error) {
    console.log(error);
  }
}

export async function getEvents() {
  try {
    await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([Stores.Events], "readwrite");

      const objectStore = transaction.objectStore(Stores.Events);
      const request = objectStore.getAll();
      request.onsuccess = (event) => {
        const result = (event.target as IDBOpenDBRequest).result;
        resolve(result);
      };

      request.onerror = (event) => {
        reject(request);
        console.log(event);
      };
    });
  } catch (error) {
    console.log(error);
  }
}

export async function deleteEvent(eventId: number) {
  try {
    await initDB();

    const transaction = db.transaction([Stores.Events], "readwrite");

    const objectStore = transaction.objectStore(Stores.Events);
    const request = objectStore.delete(eventId);
    request.onsuccess = (event) => {
      console.log(event);
    };
  } catch (error) {
    console.log(error);
  }
}
