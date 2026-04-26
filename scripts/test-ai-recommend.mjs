/**
 * 꽃 추천 AI 테스트 (Groq)
 * 실행: node --env-file=.env scripts/test-ai-recommend.mjs
 */

const PROMPT = `당신은 꽃다발 전문 플로리스트입니다. 아래 조건에 맞는 꽃 3가지를 추천해주세요.

상황: 생일 선물
선호 색상: 핑크, 화이트
예산: ₩30,000 이하

꽃 목록: flower-01(장미/레드), flower-02(튤립/핑크), flower-03(국화/화이트), flower-04(연꽃/퍼플), flower-05(혼합부케/혼합), flower-06(해바라기/옐로우), flower-07(벚꽃/핑크), flower-08(라벤더/퍼플), flower-09(카네이션/화이트), flower-10(데이지/화이트), flower-11(수국/핑크), flower-12(델피늄/블루), flower-13(유칼립투스/혼합), flower-14(수레국화/블루), flower-15(철쭉/핑크)

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 절대 포함하지 마세요:
{"message":"한 문장 추천 이유","flowerIds":["flower-xx","flower-xx","flower-xx"]}`;

async function testGroq() {
  const key = process.env.GROQ_API_KEY;
  if (!key) return { error: 'GROQ_API_KEY 없음' };

  const start = Date.now();
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      max_tokens: 256,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: PROMPT }],
    }),
  });
  const ms = Date.now() - start;
  const data = await res.json();
  if (!res.ok) return { error: data.error?.message ?? res.status, ms };

  const text = data.choices[0].message.content.trim();
  const inputTokens = data.usage?.prompt_tokens ?? 0;
  const outputTokens = data.usage?.completion_tokens ?? 0;
  return { ms, text, inputTokens, outputTokens };
}

async function main() {
  console.log('🌸 Groq (Llama 3.1) 꽃 추천 테스트\n');

  const r = await testGroq();

  if (r.error) {
    console.log(`❌ 오류: ${r.error}`);
    return;
  }

  console.log(`⏱  응답시간: ${r.ms}ms`);
  console.log(`🪙 토큰: input ${r.inputTokens} / output ${r.outputTokens} (무료)`);

  try {
    const parsed = JSON.parse(r.text);
    console.log(`\n✅ JSON 유효`);
    console.log(`💬 추천 이유: ${parsed.message}`);
    console.log(`🌸 추천 꽃:   ${parsed.flowerIds?.join(', ')}`);
  } catch {
    console.log(`⚠️  JSON 파싱 실패`);
    console.log(`Raw: ${r.text.slice(0, 200)}`);
  }
}

main().catch(console.error);
