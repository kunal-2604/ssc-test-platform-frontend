export const getOrCreateDeviceId = () => {
  let deviceId = localStorage.getItem("deviceId");

  if (!deviceId) {
    deviceId = `device_${crypto.randomUUID()}`;
    localStorage.setItem("deviceId", deviceId);
  }

  return deviceId;
};
