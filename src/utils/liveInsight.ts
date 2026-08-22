/**
 * Turns the current slider values into one sentence that names the number that
 * actually matters.
 *
 * A student dragging a slider sees six numbers change at once and has no way of
 * knowing which one carries the idea. These sentences point at it, and say what
 * it is doing, while it is happening.
 */

export interface LiveInsight {
  /** The sentence to show under the sliders. */
  text: string;
  /** True when the parameters are sitting on the conceptual punchline. */
  isKeyMoment: boolean;
}

/** Vietnamese decimal separator, since these strings are read by students. */
function num(value: number, digits = 2): string {
  return value.toFixed(digits).replace('.', ',');
}

export function getLiveInsight(
  concept: string | undefined,
  type: string,
  params: Record<string, number>
): LiveInsight | null {
  const key = concept || type;

  switch (key) {
    case 'derivative_tangent':
    case 'calculus':
    case 'derivative': {
      const x0 = params.x0 ?? 1;
      const dx = params.deltaX ?? 0.8;
      // f(x) = x², so the tangent slope is exactly 2x₀ and the secant slope
      // through x₀ and x₀+Δx works out to 2x₀ + Δx. Their gap is just Δx.
      const tangent = 2 * x0;
      const secant = 2 * x0 + dx;
      const gap = Math.abs(secant - tangent);
      return {
        text: `Δx = ${num(dx)} → cát tuyến dốc ${num(secant)}, tiếp tuyến dốc ${num(tangent)}. Còn cách nhau ${num(gap)} — kéo Δx nhỏ nữa, khoảng cách này sẽ về 0.`,
        isKeyMoment: gap < 0.15
      };
    }

    case 'unit_circle':
    case 'trigonometry':
    case 'trig_circle': {
      const deg = params.angleDeg ?? 45;
      const rad = (deg * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const sum = cos * cos + sin * sin;
      return {
        text: `θ = ${Math.round(deg)}° → cos θ = ${num(cos)} (bóng trên trục ngang), sin θ = ${num(sin)} (bóng trên trục dọc). cos²θ + sin²θ = ${num(sum, 3)} — luôn bằng 1, dù θ là bao nhiêu.`,
        isKeyMoment: Math.abs(cos) < 0.02 || Math.abs(sin) < 0.02
      };
    }

    case 'circle_area_decomposition':
    case 'geometry_2d':
    case 'circle_area': {
      const r = params.radius ?? 4;
      const n = Math.round(params.slices ?? 16);
      // Each sector's arc is a chord away from being a straight edge; the
      // relative error of that approximation falls off like 1/n².
      const errorPct = (100 * (1 - Math.sin(Math.PI / n) / (Math.PI / n)));
      return {
        text: `${n} nan quạt → cạnh trên còn cong, lệch khỏi hình chữ nhật ${num(errorPct)}%. Tăng số lát lên, chỗ cong duỗi dần thành đường thẳng, và diện tích vẫn nguyên πr² = ${num(Math.PI * r * r)}.`,
        isKeyMoment: n >= 40
      };
    }

    case 'quadratic_equation':
    case 'algebra':
    case 'equation':
    case 'quadratic': {
      const a = params.a ?? 1;
      const b = params.b ?? -5;
      const c = params.c ?? 6;
      const delta = b * b - 4 * a * c;
      // Δ measures how far the vertex sits from the x-axis, scaled by 4a.
      const vertexY = a !== 0 ? -delta / (4 * a) : 0;

      if (a === 0) {
        return {
          text: 'a = 0 → không còn là phương trình bậc hai nữa, đồ thị thành đường thẳng. Kéo a khác 0 để parabol quay lại.',
          isKeyMoment: true
        };
      }

      if (Math.abs(delta) < 0.4) {
        return {
          text: `Δ = ${num(delta)} ≈ 0 → đỉnh parabol vừa chạm đúng trục hoành. Hai nghiệm đã chập làm một. Kéo thêm chút nữa là đồ thị rời hẳn trục, hết nghiệm.`,
          isKeyMoment: true
        };
      }

      return {
        text:
          delta > 0
            ? `Δ = ${num(delta)} > 0 → đỉnh nằm cách trục hoành ${num(Math.abs(vertexY))} về phía ${vertexY < 0 ? 'dưới' : 'trên'}, nên parabol cắt trục tại 2 điểm. Δ chính là khoảng cách đó.`
            : `Δ = ${num(delta)} < 0 → đỉnh nằm hẳn ${vertexY > 0 ? 'trên' : 'dưới'} trục hoành ${num(Math.abs(vertexY))}, parabol không chạm trục. Vô nghiệm.`,
        isKeyMoment: false
      };
    }

    case 'vector_3d_projection':
    case 'vector':
    case 'geometry_3d':
    case 'vector_3d': {
      const vx = params.vx ?? 3;
      const vy = params.vy ?? 4;
      const vz = params.vz ?? 3;
      const base = Math.sqrt(vx * vx + vy * vy);
      const norm = Math.sqrt(vx * vx + vy * vy + vz * vz);
      return {
        text: `Đường chéo dưới đáy dài ${num(base)}, cao thêm ${num(Math.abs(vz))} → độ dài vector ${num(norm)}. Pytago dùng hai lần: một lần dưới mặt đáy, một lần dựng đứng lên.`,
        isKeyMoment: false
      };
    }

    default:
      return null;
  }
}
