const fs = require("node:fs");

const appPath = "app.js";
const indexPath = "index.html";
let app = fs.readFileSync(appPath, "utf8");

const startMarker = "  async function decryptPayload(username, password) {";
const endMarker = "\n  function setIdleTimer()";
const start = app.indexOf(startMarker);
const end = app.indexOf(endMarker, start);

if (start < 0 || end < 0) {
  throw new Error("decryptPayload block was not found in app.js");
}

const replacement = `  async function loadEncryptedBytes(payload) {
    if (Array.isArray(payload.parts) && payload.parts.length) {
      const chunks = await Promise.all(payload.parts.map(async (path) => {
        const response = await fetch(path, { cache: "no-store" });
        if (!response.ok) throw new Error("암호화 자료 조각을 불러오지 못했습니다.");
        return (await response.text()).trim();
      }));
      return b64ToBytes(chunks.join(""));
    }
    if (!payload.data) throw new Error("암호화 자료가 비어 있습니다.");
    return b64ToBytes(payload.data);
  }

  async function decompressPayload(bytes, compression) {
    if (compression !== "gzip") return bytes;
    if (!("DecompressionStream" in window)) {
      throw new Error("이 브라우저에서는 압축 자료를 열 수 없습니다. 최신 브라우저로 접속해 주세요.");
    }
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }

  async function decryptPayload(username, password) {
    const response = await fetch("./payload.json", { cache: "no-store" });
    if (!response.ok) throw new Error("자료 파일을 불러오지 못했습니다.");
    const payload = await response.json();
    const material = enc.encode(\`${'${username}'}\\0${'${password}'}\`);
    const baseKey = await crypto.subtle.importKey("raw", material, "PBKDF2", false, ["deriveKey"]);
    const key = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: b64ToBytes(payload.salt), iterations: payload.iterations, hash: "SHA-256" },
      baseKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: b64ToBytes(payload.iv), additionalData: b64ToBytes(payload.aad), tagLength: 128 },
      key,
      await loadEncryptedBytes(payload)
    );
    const decoded = await decompressPayload(new Uint8Array(plaintext), payload.compression);
    return JSON.parse(dec.decode(decoded));
  }
`;

app = app.slice(0, start) + replacement + app.slice(end);
fs.writeFileSync(appPath, app);

let index = fs.readFileSync(indexPath, "utf8");
index = index.replace(/app\.js(?:\?v=\d+)?/g, "app.js?v=3");
fs.writeFileSync(indexPath, index);
