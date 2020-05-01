export const buildReq = (init: RequestInit) => {
  //method: string, body: BodyInit, headers: HeadersInit_) : RequestInit => {
  const { mode } = init;
  return {
    ...init,
    mode: mode || "cors",
  };
};

export const buildGetReq = (init: RequestInit): RequestInit =>
  buildReq({ ...init, method: "GET" });
export const buildPostReq = (init: RequestInit): RequestInit =>
  buildReq({ ...init, method: "POST" });
