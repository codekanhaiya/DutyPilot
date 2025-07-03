const filenames = {
  members: "members.json",
  rooms: "rooms.json",
  timings: "timings.json",
};

export const fetchMembers = async () => {
  if (window.electron?.readData) {
    try {
      const data = await window.electron.readData(filenames.members);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error reading members data:", error);
      return [];
    }
  } else {
    console.error("Electron API not available");
    return [];
  }
};

export const saveMembers = async (members) => {
  if (window.electron?.readData && window.electron?.writeData) {
    try {
      await window.electron.writeData(filenames.members, members);
    } catch (error) {
      console.error("Error writing members data:", error);
    }
  } else {
    console.error("Electron APIs not available.");
  }
};

export const fetchRooms = async () => {
  if (window.electron?.readData) {
    try {
      const data = await window.electron.readData(filenames.rooms);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error reading rooms data:", error);
      return [];
    }
  } else {
    console.error("Electron API not available");
    return [];
  }
};

export const saveRooms = async (data) => {
  if (window.electron?.readData && window.electron?.writeData) {
    try {
      await window.electron.writeData(filenames.rooms, data);
    } catch (error) {
      console.error("Error writing rooms data:", error);
    }
  } else {
    console.error("Electron APIs not available.");
  }
};

export const fetchTimings = async () => {
  if (window.electron?.readData) {
    try {
      const data = await window.electron.readData(filenames.timings);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error reading timings data:", error);
      return [];
    }
  } else {
    console.error("Electron API not available");
    return [];
  }
};

export const saveTimings = async (data) => {
  if (window.electron?.readData && window.electron?.writeData) {
    try {
      await window.electron.writeData(filenames.timings, data);
    } catch (error) {
      console.error("Error writing timings data:", error);
    }
  } else {
    console.error("Electron APIs not available.");
  }
};
