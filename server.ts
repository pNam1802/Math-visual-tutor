import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Fallback intelligent mathematical parser if API key is not yet configured or offline
function generateFallbackMathResponse(userPrompt: string) {
  const promptLower = userPrompt.toLowerCase();
  
  if (
    promptLower.includes('đường tròn lượng giác') || 
    promptLower.includes('sin') || 
    promptLower.includes('cos') || 
    promptLower.includes('lượng giác') ||
    promptLower.includes('trigonometry') ||
    promptLower.includes('unit circle')
  ) {
    return {
      is_math_question: true,
      topic: 'trigonometry',
      concept: 'unit_circle',
      title: 'Vòng tròn Đơn vị & Hàm Lượng giác',
      summary: 'Biểu diễn góc quay lượng giác θ và hình chiếu cos θ (trục hoành) & sin θ (trục tung).',
      params: {
        angleDeg: 45,
        radius: 1
      },
      param_ranges: {
        angleDeg: { min: 0, max: 360, step: 1, name: 'Góc quay θ', unit: '°' },
        radius: { min: 0.5, max: 2, step: 0.1, name: 'Bán kính R', unit: '' }
      },
      latex: '\\sin^2(\\theta) + \\cos^2(\\theta) = 1',
      steps: [
        {
          title: '1. Định nghĩa toạ độ điểm trên đường tròn',
          explanation: 'Với góc quay θ bất kỳ trên đường tròn đơn vị tâm O(0,0), toạ độ điểm M là M(cos θ, sin θ).',
          formula: 'M = (\\cos\\theta, \\sin\\theta)',
          visualHighlight: 'Điểm tròn màu cam trên đường viền biểu diễn toạ độ tức thời'
        },
        {
          title: '2. Đoạn thẳng chiếu cos và sin',
          explanation: 'Đoạn thẳng màu ngọc lục bảo trên trục Ox là cos θ. Đoạn thẳng đứng màu cam là sin θ.',
          formula: '\\cos(45^\\circ) = \\frac{\\sqrt{2}}{2} \\approx 0.71, \\quad \\sin(45^\\circ) = \\frac{\\sqrt{2}}{2} \\approx 0.71',
          visualHighlight: 'Tam giác vuông vuông góc với 2 trục toạ độ'
        },
        {
          title: '3. Hệ thức Pytago lượng giác cơ bản',
          explanation: 'Theo định lý Pytago trong tam giác vuông tạo bởi các hình chiếu, tổng bình phương hai cạnh góc vuông luôn bằng bình phương cạnh huyền r² = 1.',
          formula: '\\cos^2\\theta + \\sin^2\\theta = 1',
          visualHighlight: 'Cạnh huyền màu cam có độ dài cố định không đổi'
        }
      ]
    };
  }

  if (
    promptLower.includes('đạo hàm') || 
    promptLower.includes('tiếp tuyến') || 
    promptLower.includes('derivative') || 
    promptLower.includes('calculus') ||
    promptLower.includes('giải tích') ||
    promptLower.includes('lim')
  ) {
    return {
      is_math_question: true,
      topic: 'calculus',
      concept: 'derivative_tangent',
      title: 'Bản chất Hình học của Đạo hàm & Tiếp tuyến',
      summary: 'Đạo hàm f\'(x₀) là hệ số góc của đường tiếp tuyến khi khoảng cách cát tuyến Δx tiến về 0.',
      params: {
        x0: 1.0,
        deltaX: 0.8
      },
      param_ranges: {
        x0: { min: -2, max: 2, step: 0.1, name: 'Điểm xét x₀', unit: '' },
        deltaX: { min: 0.05, max: 2.0, step: 0.05, name: 'Bước nhảy Δx', unit: '' }
      },
      latex: "f'(x_0) = \\lim_{\\Delta x \\to 0} \\frac{f(x_0 + \\Delta x) - f(x_0)}{\\Delta x}",
      steps: [
        {
          title: '1. Cát tuyến nối hai điểm rời rạc',
          explanation: 'Xét hai điểm A(x₀, f(x₀)) và B(x₀ + Δx, f(x₀ + Δx)) trên đường cong f(x) = x². Hệ số góc cát tuyến là tỉ số Δy / Δx.',
          formula: 'k_{\\text{cát tuyến}} = \\frac{f(x_0 + \\Delta x) - f(x_0)}{\\Delta x}',
          visualHighlight: 'Đường thẳng đứt đoạn màu xám nối 2 điểm A và B'
        },
        {
          title: '2. Quá trình lấy giới hạn vi phân',
          explanation: 'Khi kéo thanh trượt giảm Δx dần về 0, điểm B trượt dần về sát điểm A.',
          formula: '\\Delta x \\to 0 \\implies k_{\\text{cát tuyến}} \\to k_{\\text{tiếp tuyến}}',
          visualHighlight: 'Cát tuyến dần xoay và tiệm cận tiếp tuyến thực tế'
        },
        {
          title: '3. Đường tiếp tuyến tức thời',
          explanation: 'Tại vị trí giới hạn Δx = 0, cát tuyến trở thành tiếp tuyến chính xác với hệ số góc k = 2x₀.',
          formula: "f'(1.0) = 2(1.0) = 2.0",
          visualHighlight: 'Đường tiếp tuyến màu cam đậm áp sát vào đường cong tại x₀'
        }
      ]
    };
  }

  if (
    promptLower.includes('vector') || 
    promptLower.includes('vecto') || 
    promptLower.includes('không gian 3d') || 
    promptLower.includes('3d') ||
    promptLower.includes('không gian')
  ) {
    return {
      is_math_question: true,
      topic: 'vector',
      concept: 'vector_3d_projection',
      title: 'Không gian Vector 3 Chiều & Hình chiếu Toạ độ',
      summary: 'Phân tích vector v = (x, y, z) thành 3 thành phần vuông góc và tính độ dài chuẩn Euclidean.',
      params: {
        vx: 3,
        vy: 4,
        vz: 3
      },
      param_ranges: {
        vx: { min: -5, max: 5, step: 0.5, name: 'Hoành độ vx (Ox)', unit: '' },
        vy: { min: -5, max: 5, step: 0.5, name: 'Tung độ vy (Oy)', unit: '' },
        vz: { min: -5, max: 5, step: 0.5, name: 'Cao độ vz (Oz)', unit: '' }
      },
      latex: '\\|\\vec{v}\\| = \\sqrt{v_x^2 + v_y^2 + v_z^2}',
      steps: [
        {
          title: '1. Hệ trục toạ độ không gian Oxyz',
          explanation: 'Ba trục đôi một vuông góc: Ox (đỏ), Oy (xanh lá), Oz (xanh dương).',
          formula: '\\vec{v} = v_x\\vec{i} + v_y\\vec{j} + v_z\\vec{k}',
          visualHighlight: 'Hộp toạ độ 3D bao quanh vector từ gốc toạ độ O(0,0,0)'
        },
        {
          title: '2. Hình chiếu lên mặt phẳng đáy (Oxy)',
          explanation: 'Điểm P(vx, vy, 0) trên mặt phẳng Oxy tạo đường chéo đáy có độ dài d = √(vx² + vy²).',
          formula: 'd_{\\text{đáy}} = \\sqrt{v_x^2 + v_y^2}',
          visualHighlight: 'Mặt đáy phẳng màu xanh lá với các đường dóng vuông góc'
        },
        {
          title: '3. Định lý Pytago trong không gian 3 chiều',
          explanation: 'Tam giác vuông tạo bởi đường chéo đáy, đoạn thẳng cao độ vz và vector v cho độ dài tổng thể.',
          formula: '\\|\\vec{v}\\| = \\sqrt{3^2 + 4^2 + 3^2} = \\sqrt{34} \\approx 5.83',
          visualHighlight: 'Mũi tên vector 3D màu cam - xanh nổi bật từ gốc O'
        }
      ]
    };
  }

  if (
    promptLower.includes('diện tích hình tròn') || 
    promptLower.includes('circle area') || 
    promptLower.includes('pi r^2') ||
    promptLower.includes('hình tròn') ||
    promptLower.includes('hình học')
  ) {
    return {
      is_math_question: true,
      topic: 'geometry_2d',
      concept: 'circle_area_decomposition',
      title: 'Chứng minh Diện tích Hình tròn S = πr²',
      summary: 'Phương pháp phân rã hình tròn thành n nan quạt và ghép thành hình bình hành xấp xỉ.',
      params: {
        radius: 4,
        slices: 16
      },
      param_ranges: {
        radius: { min: 1, max: 6, step: 0.5, name: 'Bán kính R', unit: 'cm' },
        slices: { min: 4, max: 32, step: 2, name: 'Số nan quạt cắt n', unit: '' }
      },
      latex: 'S = \\pi r^2 = \\lim_{n \\to \\infty} \\left( \\frac{C}{2} \\times r \\right)',
      steps: [
        {
          title: '1. Cắt lát hình tròn thành n nan quạt đều',
          explanation: 'Chia hình tròn bán kính r thành n mảnh tam giác cong đối xứng xen kẽ.',
          formula: 'C = 2\\pi r',
          visualHighlight: 'Các lát nan quạt màu cam và kem xen kẽ nhau'
        },
        {
          title: '2. Xếp đối đầu tạo thành hình bình hành',
          explanation: 'Đặt nửa số nan quạt hướng lên và nửa số nan quạt hướng xuống lồng vào nhau.',
          formula: '\\text{Đáy} \\approx \\pi r, \\quad \\text{Chiều cao} \\approx r',
          visualHighlight: 'Hình răng cưa lồng ghép với chiều dài đáy bằng nửa chu vi'
        },
        {
          title: '3. Giới hạn khi số lát cắt n tiến tới vô cùng',
          explanation: 'Khi n càng lớn, các cung cong trở thành đoạn thẳng vuông góc và hình răng cưa tiệm cận hình chữ nhật hoàn hảo diện tích πr × r = πr².',
          formula: 'S = (\\pi r) \\cdot r = \\pi r^2',
          visualHighlight: 'Diện tích bảo toàn nguyên vẹn xuyên suốt quá trình biến đổi'
        }
      ]
    };
  }

  // Default to Quadratic / Algebra equation
  return {
    is_math_question: true,
    topic: 'equation',
    concept: 'quadratic_equation',
    title: 'Khảo sát Hàm số & Phương trình Bậc hai',
    summary: 'Mô phỏng đồ thị parabol f(x) = ax² + bx + c, toạ độ đỉnh V và nghiệm giao với trục hoành.',
    params: {
      a: 1,
      b: -5,
      c: 6
    },
    param_ranges: {
      a: { min: -3, max: 3, step: 0.5, name: 'Hệ số a', unit: '' },
      b: { min: -8, max: 8, step: 0.5, name: 'Hệ số b', unit: '' },
      c: { min: -10, max: 10, step: 1, name: 'Hệ số c', unit: '' }
    },
    latex: 'ax^2 + bx + c = 0 \\iff x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    steps: [
      {
        title: '1. Xác định hệ số và hình dạng parabol',
        explanation: 'Hệ số a quyết định bề lõm: a > 0 parabol ngửa lên (cực tiểu), a < 0 parabol úp xuống (cực đại).',
        formula: 'f(x) = 1x^2 - 5x + 6',
        visualHighlight: 'Đường cong Parabol trên mặt phẳng toạ độ Oxy'
      },
      {
        title: '2. Tính toạ độ đỉnh Parabol',
        explanation: 'Đỉnh V nằm tại trục đối xứng x = -b/(2a) = 5/2 = 2.5, y = f(2.5) = -0.25.',
        formula: 'V\\left(-\\frac{b}{2a}, -\\frac{\\Delta}{4a}\\right) = V(2.5, -0.25)',
        visualHighlight: 'Điểm vàng nổi bật ở đáy parabol'
      },
      {
        title: '3. Biệt thức Delta và nghiệm phương trình',
        explanation: 'Δ = (-5)² - 4(1)(6) = 25 - 24 = 1 > 0 nên đồ thị cắt trục hoành tại 2 điểm phân biệt x₁ = 2 và x₂ = 3.',
        formula: 'x_1 = 2.0, \\quad x_2 = 3.0',
        visualHighlight: 'Hai chấm xanh lá trên trục hoành Ox'
      }
    ]
  };
}

// Gemini Structured Output API Endpoint
app.post('/api/math/analyze', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Query parameter is required.' });
      return;
    }

    const ai = getGenAI();
    if (!ai) {
      // Return intelligent structured math response if API key is not yet set
      const fallbackResult = generateFallbackMathResponse(query);
      res.json(fallbackResult);
      return;
    }

    const promptText = `Analyze the student's math question or concept: "${query}".

Determine if this is a valid mathematical or STEM visualization inquiry.
Classify into exactly one topic from: "geometry_2d", "geometry_3d", "algebra", "trigonometry", "vector", "calculus", "equation".

Select appropriate interactive sliders parameters in "params" with realistic initial values.
Provide corresponding "param_ranges" with min, max, step, and clear Vietnamese names for each parameter.
Write a clear LaTeX string for the core mathematical expression.
Provide 3 to 4 sequential, numbered explanation steps in Vietnamese with mathematical reasoning and visual highlights.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: promptText,
      config: {
        systemInstruction: `You are MathVisual Tutor, an elite visual mathematics tutor inspired by 3Blue1Brown (Grant Sanderson).
Your goal is to parse math queries and return pure structured JSON adhering to the strict schema.

TOPIC MAPPING GUIDE:
- "geometry_2d": 2D Euclidean geometry, circle area decomposition, polygon properties, triangle theorem, Pythagoras.
- "geometry_3d": 3D solids, spheres, cylinders, cubes, cross-sections.
- "vector": 2D and 3D vectors, vector additions, projections, coordinates, Euclidean norms.
- "algebra": polynomial graphs, quadratics, roots, factoring, parabolas, exponents.
- "trigonometry": unit circle, sine, cosine, tangent projections, waves, angles.
- "calculus": derivatives, slopes of secants vs tangents, limits, integrals, area under curves.
- "equation": solving linear/quadratic equations, number line roots, system of equations.

All explanations and titles must be in accurate, encouraging, academic Vietnamese.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            is_math_question: {
              type: Type.BOOLEAN,
              description: 'Whether this query is a mathematical question or concept.'
            },
            topic: {
              type: Type.STRING,
              enum: ['geometry_2d', 'geometry_3d', 'algebra', 'trigonometry', 'vector', 'calculus', 'equation'],
              description: 'The assigned visualization category.'
            },
            concept: {
              type: Type.STRING,
              description: 'Identifier for the concept e.g. quadratic_equation, unit_circle, derivative_tangent, vector_3d_projection, circle_area_decomposition.'
            },
            title: {
              type: Type.STRING,
              description: 'Concise title in Vietnamese.'
            },
            summary: {
              type: Type.STRING,
              description: 'Brief summary in Vietnamese.'
            },
            params: {
              type: Type.OBJECT,
              description: 'Key-value map of numerical parameters e.g. { a: 1, b: -5, c: 6 } or { angleDeg: 45 }.'
            },
            param_ranges: {
              type: Type.OBJECT,
              description: 'Map of slider ranges { min, max, step, name?, unit? } for each key in params.'
            },
            latex: {
              type: Type.STRING,
              description: 'Main formula in standard LaTeX notation.'
            },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: 'Step title in Vietnamese' },
                  explanation: { type: Type.STRING, description: 'Detailed step reasoning in Vietnamese' },
                  formula: { type: Type.STRING, description: 'Step formula in LaTeX' },
                  visualHighlight: { type: Type.STRING, description: 'Visual connection tip in Vietnamese' }
                },
                required: ['title', 'explanation']
              },
              description: 'Sequential breakdown steps.'
            }
          },
          required: ['is_math_question', 'topic', 'concept', 'params', 'param_ranges', 'latex', 'steps']
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('Empty response from Gemini API');
    }

    const parsedJson = JSON.parse(textOutput);
    res.json(parsedJson);
  } catch (err: any) {
    console.error('Error analyzing math query with Gemini:', err);
    // Graceful fallback to avoid breaking student workflow
    const fallback = generateFallbackMathResponse(req.body?.query || '');
    res.json(fallback);
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', engine: 'MathVisual Gemini Server' });
});

// Production and Vite Dev middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MathVisual Tutor server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
