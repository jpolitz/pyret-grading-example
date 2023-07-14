const { parseArgs } = require('node:util');
const { readFileSync } = require('fs');
const puppeteer = require('puppeteer');

const options = {
  program: {
    type: 'string',
    short: 'p',
  },
  tests: {
    type: 'string',
    short: 't',
  }
};
const {
  values,
  positionals,
} = parseArgs({ options });


(async() => {
  if(!values['program']) { console.error("Use --program or -p to specify the program"); }
  const program = String(readFileSync(values['program']));
  console.log(program);
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:4999/editor', {waitUntil: 'networkidle2'});
  await page.evaluate("window.CM = $('.CodeMirror')[0].CodeMirror");
  await page.evaluate("function f(program) { window.CM.setValue(program); }");
  await page.evaluate(`f(\`${program}\`)`);
  await page.evaluate(`window.RUN_CODE(\`${program}\`)`);
  await page.waitForSelector(".repl-prompt", { visible: true });
  /*
  try {
    await page.waitForSelector(".check-results-done-rendering", { timeout: 5000 });
  }
  catch(e) {
    console.error("Waited for check results too long. ", e);
  }
  */
  // GET TEST RESULTS SOMEHOW

  const tests = String(readFileSync(values['tests']));
  console.log(tests);
  await page.evaluate(`window.RUN_INTERACTION(\`${tests}\`)`);
  await page.waitForSelector(".repl-prompt", { visible: true });
  await page.pdf({path: 'page.pdf', format: 'A4'});

  await browser.close();
})();

