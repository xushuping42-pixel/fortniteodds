import {readFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const paths=['fortnite-pirate-token','fortnite-token-odds','treasure-hour-fortnite','fortnite-chest-tracker'];
const sitemap=readFileSync('sitemap.xml','utf8');
for(const slug of paths){
 const html=readFileSync(`${slug}/index.html`,'utf8');
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,slug+' must have one H1');
 assert(html.includes(`rel="canonical" href="https://fortniteodds.xyz/${slug}/"`),slug+' canonical');
 assert(!/noindex/i.test(html),slug+' must be indexable');
 assert(sitemap.includes(`https://fortniteodds.xyz/${slug}/`),slug+' sitemap');
 for(const target of paths)if(target!==slug)assert(html.includes(`href="/${target}/"`),slug+' missing cluster link '+target);
 for(const match of html.matchAll(/(?:src|href)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)){
  const p=match[1];assert(existsSync('.'+p+(p.endsWith('/')?'index.html':'')),slug+' broken link '+p);
 }
 for(const script of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)){
  if(script[1].includes('application/ld+json'))JSON.parse(script[2]);
  else new vm.Script(script[2]);
 }
}
new vm.Script(readFileSync('assets/guides.js','utf8'));
const home=readFileSync('index.html','utf8');assert.equal((home.match(/id="pirate-token-guide-entry"/g)||[]).length,1);
assert(!sitemap.includes('/fortnite-treasure-hour/'),'Redirect should not be in sitemap');
assert(readFileSync('fortnite-treasure-hour/index.html','utf8').includes('rel="canonical" href="https://fortniteodds.xyz/treasure-hour-fortnite/"'));
console.log('PASS: four indexable pages, canonicals, sitemap, cluster links, local assets, structured data and script syntax.');
