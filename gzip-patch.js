(() => {
  "use strict";

  const originalDecrypt = SubtleCrypto.prototype.decrypt;

  SubtleCrypto.prototype.decrypt = async function patchedDecrypt(...args) {
    const decrypted = await originalDecrypt.apply(this, args);
    const bytes = new Uint8Array(decrypted);

    if (bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b) {
      if (!("DecompressionStream" in window)) {
        throw new Error("이 브라우저에서는 암호화 자료 압축 해제를 지원하지 않습니다.");
      }

      const stream = new Blob([bytes])
        .stream()
        .pipeThrough(new DecompressionStream("gzip"));

      return new Response(stream).arrayBuffer();
    }

    return decrypted;
  };
})();
