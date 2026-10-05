import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
import { buildEnvironment } from './env.mjs';
import { readSiteConfig } from '../src/config/site.ts';
import { projects, services } from '../src/content/site.ts';

const env = buildEnvironment();
const site = readSiteConfig(env);
async function start(required) {
  const reservation = createServer();
  reservation.listen(0, '127.0.0.1');
  await once(reservation, 'listening');
  const port = reservation.address().port;
  await new Promise(resolve => reservation.close(resolve));
  const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', String(port)], {
    env: { ...env, NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1', SUPABASE_REQUIRED: String(required), NEXT_PUBLIC_SUPABASE_URL: '', NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: '', SUPABASE_SECRET_KEY: '' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  child.stdout.on('data', chunk => { output = (output + chunk).slice(-4000); });
  child.stderr.on('data', chunk => { output = (output + chunk).slice(-4000); });
  const base = `http://127.0.0.1:${port}`;
  async function stop() {
    if (child.exitCode !== null || child.signalCode !== null) return;
    const ended = once(child, 'exit'); child.kill(); await ended;
  }
  try {
    for (let i = 0; i < 60; i++) {
      if (child.exitCode !== null) throw new Error('Server exited: ' + output);
      try { if ((await fetch(base + '/api/health/live', { signal: AbortSignal.timeout(1000) })).ok) return { base, stop }; } catch { /* Startup polling. */ }
      await delay(150);
    }
    throw new Error('Startup timed out: ' + output);
  } catch (error) { await stop(); throw error; }
}
function checkMedia(html,home){
  assert.ok(!/<iframe\b/i.test(html));
  for(const img of html.matchAll(/<img\b[^>]*>/g))assert.match(img[0],/alt="[^"]*"/,'Every image needs an alt attribute');
  if(!home)assert.ok(!/<video\b/i.test(html),'No unsupplied project videos');
  assert.ok(html.includes('ANAYAFX'));
  assert.ok(!/Private Commission|13102223333|www\.facebook\.com|Espacio para|>FOTO</.test(html),'No invented projects, contacts or Spanish filler labels');
}
const app = await start(false);
try {
  const response = await fetch(app.base);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('x-frame-options'), 'DENY');
  const html = await response.text();
  assert.match(html, /<html lang="en"/);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
  assert.ok(html.includes('Skip to content'));
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
  assert.ok(canonical, 'The rendered page must contain a canonical link');
  assert.equal(new URL(canonical[1]).href, new URL(site.origin).href);
  const robots = await (await fetch(app.base + '/robots.txt')).text();
  const sitemap = await (await fetch(app.base + '/sitemap.xml')).text();
  if (!site.indexable) {
    assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
    assert.match(html, /content="noindex, nofollow"/);
    assert.match(robots, /Disallow: \/\s/);
    assert.ok(!sitemap.includes('<loc>'));
  } else {
    assert.equal(response.headers.get('x-robots-tag'), null);
    assert.ok(sitemap.includes(`<loc>${site.origin}/</loc>`));
  }
  assert.equal((await fetch(app.base + '/ruta-inexistente')).status, 404);
  assert.equal((await fetch(app.base + '/api/health/ready')).status, 200);
  assert.ok(html.includes('/videos/home-banner.mp4'));
  assert.ok(html.includes('poster="/videos/home-banner-poster.jpg"'));
  assert.equal((html.match(/<video\b/g)||[]).length,1);
  assert.ok(!/<video[^>]*autoplay/i.test(html),'Playback starts after the intro and respects reduced motion');
  assert.ok(html.includes('service-gallery'), 'Home must render the interactive service gallery');
  assert.ok(html.includes('service-loop-ring'), 'Home keeps its original 3D service carousel');
  assert.equal((html.match(/class="featured-project /g)||[]).length,3,'Home keeps its three original featured rows');
  assert.equal((html.match(/class="elastic-panel/g)||[]).length,12,'The lower Home gallery contains all twelve projects');
  assert.ok(!html.includes('Color mode'), 'The theme selector is retired');
  checkMedia(html,true);
  const pages = ['/work', '/services', '/rentals', '/studio', '/about', '/contact', '/faqs', ...projects.map(project => '/work/' + project.slug), ...services.map(service => '/services/' + service.slug)];
  for (const page of pages) {
    const result = await fetch(app.base + page);
    assert.equal(result.status, 200, page + ' must load');
    const body = await result.text();
    assert.equal((body.match(/<h1[ >]/g) || []).length, 1, page + ' must have one H1');
    assert.ok(body.includes(`rel="canonical" href="${site.origin}${page}"`), page + ' must have its own canonical');
    checkMedia(body,false);
    assert.ok(!/Milton Keynes/.test(body), page + ' must contain Anaya content only');
    if (page === '/services') {
      assert.ok(body.includes('service-list'), 'Services must render the original list view');
      assert.equal((body.match(/class="elastic-panel/g)||[]).length,12,'Services also contains the twelve projects');
    }
  }
  for(const [from,to] of [['/faq','/faqs'],['/work/holoflux-coachella','/work/coachella'],['/work/the-sphere-las-vegas','/work/eagles-sphere'],['/services/spacial-projection-and-special-fx','/services/spatial-projection-and-special-fx'],['/info','/about'],['/hone','/about'],['/play','/services/immersive-and-interactive-experiences']]){
    const result=await fetch(app.base+from,{redirect:'manual'});
    assert.ok([307,308].includes(result.status),from);
    assert.equal(new URL(result.headers.get('location'),app.base).pathname,to);
  }
  for(const asset of ['/brand/original-logo.png','/videos/home-banner.mp4','/videos/home-banner-poster.jpg',...projects.flatMap(project=>project.image?[project.image]:[])]) {
    const assetResponse=await fetch(app.base+asset,{method:'HEAD'});
    assert.equal(assetResponse.status,200,asset);
    assert.ok(Number(assetResponse.headers.get('content-length'))>0,asset);
  }
  assert.equal((await fetch(app.base + '/work/missing-project')).status, 404);
  assert.equal((await fetch(app.base + '/services/missing-service')).status, 404);
  console.log('PASS: ' + (pages.length + 1) + ' routes, individual canonicals, semantic headings, supplied media and missing-item 404s.');
  console.log('PASS: homepage, canonical, language, indexing, headers, sitemap, 404 and public health.');
} finally { await app.stop(); }

const dependent = await start(true);
try {
  assert.equal((await fetch(dependent.base + '/api/health/live')).status, 200);
  assert.equal((await fetch(dependent.base + '/api/health/ready')).status, 503);
  assert.equal((await fetch(dependent.base)).status, 200);
  console.log('PASS: required backend unavailable -> readiness 503; public pages remain usable.');
} finally { await dependent.stop(); }
