(() => {
  "use strict";

  const originalJson = Response.prototype.json;

  Response.prototype.json = async function patchedJson() {
    const payload = await originalJson.call(this);

    if (payload && Array.isArray(payload.parts) && !payload.data) {
      const responses = await Promise.all(
        payload.parts.map((part) => fetch(part, { cache: "no-store" }))
      );

      if (responses.some((response) => !response.ok)) {
        throw new Error("암호화된 일정 자료 일부를 불러오지 못했습니다.");
      }

      payload.data = (await Promise.all(responses.map((response) => response.text()))).join("");
    }

    return payload;
  };
})();
