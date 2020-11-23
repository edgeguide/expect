import { containsUnsafe } from "../../src/util/index";

describe("Expect package (sanitization):", () => {
  it("blocks &", () => {
    const unsafe = containsUnsafe({
      value: "test.x.y.&.fest.z",
    });
    expect(unsafe).toBe(true);
  });

  it("blocks strings with surrogate pairs correctly", () => {
    const unsafe = containsUnsafe({
      value: "&日本語&",
    });
    expect(unsafe).toBe(true);
  });

  it("blocks < and >", () => {
    const unsafe = containsUnsafe({
      value: "<div>This is a html element</div>",
    });
    expect(unsafe).toBe(true);
  });

  it("blocks \" and '", () => {
    const unsafe = containsUnsafe({
      value: 'attribute="test"',
    });
    expect(unsafe).toBe(true);
  });

  it("does not block ( or ) if not in strict mode", () => {
    const unsafe = containsUnsafe({
      value: "(do not block this)",
    });
    expect(unsafe).toBe(false);
  });

  it("blocks ( and ) if in strict mode", () => {
    const unsafe = containsUnsafe({
      value: "(block this)",
      strict: true,
    });
    expect(unsafe).toBe(true);
  });

  it("does not block { or } if not in strict mode", () => {
    const unsafe = containsUnsafe({
      value: "{do not block this}",
    });
    expect(unsafe).toBe(false);
  });

  it("blocks { and } if in strict mode", () => {
    const unsafe = containsUnsafe({
      value: "{block this}",
      strict: true,
    });
    expect(unsafe).toBe(true);
  });

  it("does not block [ or ] if not in strict mode", () => {
    const unsafe = containsUnsafe({
      value: "[do not block this]",
    });
    expect(unsafe).toBe(false);
  });

  it("block [ and ] if in strict mode", () => {
    const unsafe = containsUnsafe({
      value: "[block this]",
      strict: true,
    });
    expect(unsafe).toBe(true);
  });

  it("does not block ! if not in strict mode", () => {
    const unsafe = containsUnsafe({
      value: "do not block this!",
    });
    expect(unsafe).toBe(false);
  });

  it("blocks ! if in strict mode", () => {
    const unsafe = containsUnsafe({
      value: "block this!",
      strict: true,
    });
    expect(unsafe).toBe(true);
  });

  it("does not block @ if not in strict mode", () => {
    const unsafe = containsUnsafe({
      value: "do not block this@",
    });
    expect(unsafe).toBe(false);
  });

  it("blocks @ if in strict mode", () => {
    const unsafe = containsUnsafe({
      value: "block this@",
      strict: true,
    });
    expect(unsafe).toBe(true);
  });

  it("does not block $ if not in strict mode", () => {
    const unsafe = containsUnsafe({
      value: "do not block this$",
    });
    expect(unsafe).toBe(false);
  });

  it("blocks $ if in strict mode", () => {
    const unsafe = containsUnsafe({
      value: "block this$",
      strict: true,
    });
    expect(unsafe).toBe(true);
  });

  it("does not block = if not in strict mode", () => {
    const unsafe = containsUnsafe({
      value: "do not block this=",
    });
    expect(unsafe).toBe(false);
  });

  it("blocks = if in strict mode", () => {
    const unsafe = containsUnsafe({
      value: "block this=",
      strict: true,
    });
    expect(unsafe).toBe(true);
  });

  it("does not block + if not in strict mode", () => {
    const unsafe = containsUnsafe({
      value: "do not block this+",
    });
    expect(unsafe).toBe(false);
  });

  it("blocks + if in strict mode", () => {
    const unsafe = containsUnsafe({
      value: "block this+",
      strict: true,
    });
    expect(unsafe).toBe(true);
  });

  it("does not block @ if is in the list of allowed characters", () => {
    const unsafe = containsUnsafe({
      value: "test@sanitize.com",
      strict: true,
      allowed: ["@"],
    });
    expect(unsafe).toBe(false);
  });

  it("does not block ' if is in the list of allowed characters", () => {
    const unsafe = containsUnsafe({
      value: "Don't block this text",
      strict: true,
      allowed: ["'"],
    });
    expect(unsafe).toBe(false);
  });

  it("does not block part of a text with several allowed characters", () => {
    const unsafe = containsUnsafe({
      value: "Some basic math like 1 + 2 = 3 should be allowed! :)",
      strict: true,
      allowed: ["+", "=", "!", ")"],
    });
    expect(unsafe).toBe(false);
  });

  it("blocks strings with surrogate pairs correctly in strict mode", () => {
    const unsafe = containsUnsafe({
      value: '<p>"Japanese" in japanese is 日本語!</p>',
      strict: true,
    });
    expect(unsafe).toBe(true);
  });

  it("can block a longer string with multiple entities", () => {
    const unsafe = containsUnsafe({
      value:
        '<div class="test" data-someattribute="hello">Wow, this sure will get safe!</div>',
      strict: true,
    });
    expect(unsafe).toBe(true);
  });
});
