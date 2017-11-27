const util = require('../../src/util');

describe('Expect package (sanitization):', () => {
    
  it('sanitizes &', () => {
    let sanitized = util.sanitize({
      value: 'test.x.y.&.fest.z'
    });
    expect(sanitized).toBe('test.x.y.&amp;.fest.z');
  });

  it('sanitizes strings with surrogate pairs correctly', () => {
    let sanitized = util.sanitize({
      value: '&日本語&'
    });
    expect(sanitized).toBe('&amp;日本語&amp;');
  });

  it('sanitizes < and >', () => {
    let sanitized = util.sanitize({
      value: '<div>This is a html element</div>'
    });
    expect(sanitized).toBe('&lt;div&gt;This is a html element&lt;/div&gt;');
  });

  it('sanitizes " and \'', () => {
    let sanitized = util.sanitize({
      value: 'attribute="test"'
    });
    expect(sanitized).toBe('attribute=&quot;test&quot;');
  });

  it('does not sanitize ( or ) if not in strict mode', () => {
    let sanitized = util.sanitize({
      value: '(do not sanitize this)'
    });
    expect(sanitized).toBe('(do not sanitize this)');
  });

  it('sanitizes ( and ) if in strict mode', () => {
    let sanitized = util.sanitize({
      value: '(sanitize this)',
      strict: true
    });
    expect(sanitized).toBe('&lpar;sanitize this&rpar;');
  });

  it('does not sanitize { or } if not in strict mode', () => {
    let sanitized = util.sanitize({
      value: '{do not sanitize this}'
    });
    expect(sanitized).toBe('{do not sanitize this}');
  });

  it('sanitizes { and } if in strict mode', () => {
    let sanitized = util.sanitize({
      value: '{sanitize this}',
      strict: true
    });
    expect(sanitized).toBe('&lbrace;sanitize this&rbrace;');
  });

  it('does not sanitize [ or ] if not in strict mode', () => {
    let sanitized = util.sanitize({
      value: '[do not sanitize this]'
    });
    expect(sanitized).toBe('[do not sanitize this]');
  });

  it('sanitizes [ and ] if in strict mode', () => {
    let sanitized = util.sanitize({
      value: '[sanitize this]',
      strict: true
    });
    expect(sanitized).toBe('&lbrack;sanitize this&rbrack;');
  });

  it('does not sanitize ! if not in strict mode', () => {
    let sanitized = util.sanitize({
      value: 'do not sanitize this!'
    });
    expect(sanitized).toBe('do not sanitize this!');
  });

  it('sanitizes ! if in strict mode', () => {
    let sanitized = util.sanitize({
      value: 'sanitize this!',
      strict: true
    });
    expect(sanitized).toBe('sanitize this&excl;');
  });

  it('does not sanitize @ if not in strict mode', () => {
    let sanitized = util.sanitize({
      value: 'do not sanitize this@'
    });
    expect(sanitized).toBe('do not sanitize this@');
  });

  it('sanitizes @ if in strict mode', () => {
    let sanitized = util.sanitize({
      value: 'sanitize this@',
      strict: true
    });
    expect(sanitized).toBe('sanitize this&commat;');
  });

  it('does not sanitize $ if not in strict mode', () => {
    let sanitized = util.sanitize({
      value: 'do not sanitize this$'
    });
    expect(sanitized).toBe('do not sanitize this$');
  });

  it('sanitizes $ if in strict mode', () => {
    let sanitized = util.sanitize({
      value: 'sanitize this$',
      strict: true
    });
    expect(sanitized).toBe('sanitize this&dollar;');
  });

  it('does not sanitize = if not in strict mode', () => {
    let sanitized = util.sanitize({
      value: 'do not sanitize this='
    });
    expect(sanitized).toBe('do not sanitize this=');
  });

  it('sanitizes = if in strict mode', () => {
    let sanitized = util.sanitize({
      value: 'sanitize this=',
      strict: true
    });
    expect(sanitized).toBe('sanitize this&equals;');
  });

  it('does not sanitize + if not in strict mode', () => {
    let sanitized = util.sanitize({
      value: 'do not sanitize this+'
    });
    expect(sanitized).toBe('do not sanitize this+');
  });

  it('sanitizes + if in strict mode', () => {
    let sanitized = util.sanitize({
      value: 'sanitize this+',
      strict: true
    });
    expect(sanitized).toBe('sanitize this&plus;');
  });

  it('does not sanitize @ if is in the list of allowed characters', () => {
    let sanitized = util.sanitize({
      value: 'test@sanitize.com!',
      strict: true,
      allowed: ['@']
    });
    expect(sanitized).toBe('test@sanitize.com&excl;');
  });

  it('does not sanitize \' if is in the list of allowed characters', () => {
    let sanitized = util.sanitize({
      value: 'Don\'t ruin this text',
      strict: true,
      allowed: ['\'']
    });
    expect(sanitized).toBe('Don\'t ruin this text');
  });

  it('sanitizes part of a text with several allowed characters', () => {
    let sanitized = util.sanitize({
      value: 'Some basic math like 1 + 2 = 3 should be allowed! :)',
      strict: true,
      allowed: ['+', '=']
    });
    expect(sanitized).toBe('Some basic math like 1 + 2 = 3 should be allowed&excl; :&rpar;');
  });

  it('sanitizes strings with surrogate pairs correctly in strict mode', () => {
    let sanitized = util.sanitize({
      value: '<p>"Japanese" in japanese is 日本語!</p>',
      strict: true
    });
    expect(sanitized).toBe('&lt;p&gt;&quot;Japanese&quot; in japanese is 日本語&excl;&lt;/p&gt;');
  });

  it('can sanitize a longer string with multiple entities', () => {
    let sanitized = util.sanitize({
      value: '<div class="test" data-someattribute="hello">Wow, this sure will get sanitized!</div>',
      strict: true
    });
    expect(sanitized).toBe('&lt;div class&equals;&quot;test&quot; data-someattribute&equals;&quot;hello&quot;&gt;Wow, this sure will get sanitized&excl;&lt;/div&gt;');
  });
});
    