import type { ColorTag } from '../types/flower';

interface RecommendParams {
  occasion: string;
  colors: ColorTag[];
  budget: number;
}

export interface RecommendResult {
  message: string;
  flowerIds: string[];
}

export async function getFlowerRecommendation(params: RecommendParams): Promise<RecommendResult> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error('VITE_GROQ_API_KEY not set');

  const prompt = `당신은 꽃다발 전문 플로리스트입니다. 아래 조건에 맞는 꽃 3가지를 추천해주세요.

상황: ${params.occasion}
선호 색상: ${params.colors.length > 0 ? params.colors.join(', ') : '제한 없음'}
예산: ₩${params.budget.toLocaleString()} 이하

꽃 목록 ID: flower-01(장미/레드), flower-02(튤립/핑크), flower-03(국화/화이트), flower-04(연꽃/퍼플), flower-05(혼합부케/혼합), flower-06(해바라기/옐로우), flower-07(벚꽃/핑크), flower-08(라벤더/퍼플), flower-09(카네이션/화이트), flower-10(데이지/화이트), flower-11(수국/핑크), flower-12(델피늄/블루), flower-13(유칼립투스/혼합), flower-14(수레국화/블루), flower-15(철쭉/핑크)

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 절대 포함하지 마세요:
{"message":"한 문장 추천 이유","flowerIds":["flower-xx","flower-xx","flower-xx"]}`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      max_tokens: 256,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message ?? `Groq API error: ${res.status}`);
  }

  const data = await res.json();
  const text = data.choices[0].message.content.trim();
  return JSON.parse(text) as RecommendResult;
}
