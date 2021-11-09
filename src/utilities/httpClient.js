export default function httpClient(...params) {
  return fetch(...params).then(async (res) => {
    if (res.status === 200) {
      return res.json();
    } else {
      throw new Error((await res.json()).message);
    }
  });
}
