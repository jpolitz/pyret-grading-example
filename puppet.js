const { parseArgs } = require('node:util');
const { readFileSync, writeFileSync } = require('fs');
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

function __getTests(elts) {
  function __getTest(elt) {
      if(elt.className.includes('passing-test')) {
        return { kind: 'passed', content: elt.innerText };
      }
      else if(elt.className.includes('failing-test')) {
        return { kind: 'failed', content: elt.innerText };
      }
      else {
        return { kind: 'unknown', content: elt.innerText };
      }
  }
  return elts.map(__getTest);
}


(async() => {
  if(!values['program']) { console.error("Use --program or -p to specify the program"); }
  const program = String(readFileSync(values['program']));
  console.log(program);
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto('http://code.pyret.org/editor', {waitUntil: 'networkidle2'});
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
  await page.waitForSelector(".check-block-header", { visible: true });

  const headers = await page.$$eval(".check-block-header", hs => hs.map(h => h.click()));
  const results = await page.$(".test-results");
  console.log(results);
  const jsonResults = await results.$$eval(".check-block-test", __getTests);
  console.log(jsonResults);

  const gradescopeJSON = {
    score: 0.0,
    tests: jsonResults.map(jr => {
      const score = jr.kind === 'passed' ? 1 : 0;
      return {
        score: score,
        output: jr.content,
        output_format: "text"
      };
    })
  }

  await page.pdf({path: 'page.pdf', format: 'A4'});

  writeFileSync("results.json", JSON.stringify(gradescopeJSON));

  await browser.close();
})();

