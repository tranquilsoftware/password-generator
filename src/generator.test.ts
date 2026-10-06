// Known-answer vectors for deterministic mode. Expected values were produced
// by the original implementation (the deployed build) and agree across V8 and
// JavaScriptCore. If one fails, the change broke every user's derived passwords.
// Runs with `npm test` (Node), `bun src/generator.test.ts`, or a browser module.
import { generateDeterministicSecret as gen } from './generator.ts';
import { DEFAULT_GENERATOR_OPTIONS as D } from './constants.ts';

const SEED = 'correct horse battery staple';
const SALT = 'github.com';

const vectors: [string, Promise<string>, string][] = [
  ['defaults', gen(SEED, SALT, D),
    'bBA@Nr#=Rc!CT=T#e5w8pnX&kry*cbDW#kjXxRYg2$Wm4g4Y^RJUBA8c=DYd$#n7'],
  ['len16 lower+num', gen(SEED, SALT, { ...D, length: 16, uppercase: false, symbols: false }),
    'cd4bjmejpjc493gr'],
  ['len512 all+ambig', gen(SEED, SALT, { ...D, length: 512, allowAmbiguous: true }),
    '4-^HcFZZc#bmGnTaoKW=UB_Hf8%6GpFqNcOq0n550Y9&p*i8Ks2elhdF@SIQp-n_tURdlbwwlNiIc9qQqfJWGZV*3G4Ec0bb#GDT=ih^pAnxSybm13eJcwHTs&C%SziiL07_U*PPU4Ta-bHSH+L!J$1nXzYx-c*dYpkieH$O-g*EzF9&VM!r0Dqi+ajIzGHHgJF9rTBkGtFQ8RdEdX=L-Pi9KmvjUSTTAlybJ9DDJLH6aT_x_@r2p5TbMENC0U99AlybJ9DDJLH6aT_x_@r2p5TbMENC0U99gJF9rTBkGtFQ8RdEdX=L-Pi9KmvjUSTTYpkieH$O-g*EzF9&VM!r0Dqi+ajIzGHHL07_U*PPU4Ta-bHSH+L!J$1nXzYx-c*d#GDT=ih^pAnxSybm13eJcwHTs&C%SziitURdlbwwlNiIc9qQqfJWGZV*3G4Ec0bbNcOq0n550Y9&p*i8Ks2elhdF@SIQp-n_4-^HcFZZc#bmGnTaoKW=UB_Hf8%6GpFq'],
  ['unicode', gen('café \u{1F510} пароль 密码', 'ünïcødé', D),
    '7PkpTFN82SBgzF4SmCjZCWRs%GYG4+NxTy=P4qxga3kHZqQ3+m_Am72Ear9rchxX'],
  ['symbols only', gen('seed', 'salt', { ...D, length: 20, uppercase: false, lowercase: false, numbers: false }),
    '-+=@_@!%=$^@**!+=$+*'],
  ['bulk 0', gen(SEED, SALT, D, 0),
    'KT+eujRD^aLPXPYTBub8VAQ29e#hdWLhu4h^G_2nb@vy8y94kUCU6jzNV^Y-%7v-'],
  ['bulk 1', gen(SEED, SALT, D, 1),
    'LdYFAERGPMZKSg%@&hjkreyG3ARDLLbMv%9qjp2ryw!u3HaXcJ_=D^LrPj2nvv#w'],
  ['bulk 999', gen(SEED, SALT, D, 999),
    '4n2&nzEH^Z^-xdGNhdEghXwNBy!^Hu3mQNacAMpsb!beKErx-%p*-8JxkLWbsGP+'],
  ['NFD seed', gen('café', 'x', D), await gen('café', 'x', D)],
  ['CRLF seed', gen('a\r\nb', 'x', D), await gen('a\nb', 'x', D)],
  ['padded seed+salt', gen(` ${SEED}\t`, `${SALT} `, D), await gen(SEED, SALT, D)],
  ['padded salt bulk', gen(SEED, `${SALT} `, D, 0), await gen(SEED, SALT, D, 0)],
  ['blank seed', gen('   ', SALT, D), ''],
  ['blank salt bulk', gen(SEED, '', D, 0), ''],
];

let failed = 0;
for (const [name, actual, expected] of vectors) {
  const got = await actual;
  if (got !== expected) {
    failed++;
    console.error(`FAIL ${name}\n  expected ${JSON.stringify(expected)}\n  got      ${JSON.stringify(got)}`);
  }
}
if (failed) throw new Error(`${failed}/${vectors.length} deterministic vectors failed`);
console.log(`ok ${vectors.length}/${vectors.length} deterministic vectors`);
