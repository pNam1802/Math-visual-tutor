/**
 * Short "try this" jumps that aim a student at the edges of a concept.
 *
 * Understanding usually forms where a rule stops working: a < 0 flips the
 * parabola, Δ < 0 removes the roots entirely, four sectors look nothing like a
 * rectangle. The app already lets anyone drag to those places; nothing ever
 * suggests it. These turn aimless dragging into guided discovery.
 */

export interface ExploreChallenge {
  /** Chip label — an invitation, not an instruction. */
  label: string;
  /** What to watch for once the parameters land. */
  hint: string;
  /** Parameter values this challenge jumps to. */
  params: Record<string, number>;
}

export function getExploreChallenges(
  concept: string | undefined,
  type: string
): ExploreChallenge[] {
  const key = concept || type;

  switch (key) {
    case 'quadratic_equation':
    case 'algebra':
    case 'equation':
    case 'quadratic':
      return [
        {
          label: 'Cho a âm',
          hint: 'Parabol lật úp xuống. Đỉnh vốn là điểm thấp nhất, giờ thành cao nhất — nhưng cách tìm đỉnh không đổi.',
          params: { a: -1, b: -5, c: 6 }
        },
        {
          label: 'Ép Δ = 0',
          hint: 'Đỉnh chạm đúng trục hoành. Hai nghiệm chập làm một — đây là ranh giới giữa có nghiệm và vô nghiệm.',
          params: { a: 1, b: -4, c: 4 }
        },
        {
          label: 'Làm cho vô nghiệm',
          hint: 'Δ < 0: parabol rời hẳn trục hoành, không cắt ở đâu cả. Vô nghiệm không phải lỗi — nó là hình học.',
          params: { a: 1, b: -2, c: 5 }
        }
      ];

    case 'unit_circle':
    case 'trigonometry':
    case 'trig_circle':
      return [
        {
          label: 'θ = 90°',
          hint: 'Bóng trên trục ngang biến mất hoàn toàn: cos 90° = 0. Còn bóng dọc dài hết cỡ: sin 90° = 1.',
          params: { angleDeg: 90 }
        },
        {
          label: 'θ = 180°',
          hint: 'Ngược lại: sin 180° = 0, còn cos 180° = −1. Dấu âm chỉ có nghĩa là bóng đổ về bên trái gốc.',
          params: { angleDeg: 180 }
        },
        {
          label: 'θ = 225°',
          hint: 'Cả cos lẫn sin đều âm — điểm M nằm ở góc phần tư thứ ba. Dấu của chúng chính là hướng của hai cái bóng.',
          params: { angleDeg: 225 }
        }
      ];

    case 'derivative_tangent':
    case 'calculus':
    case 'derivative':
      return [
        {
          label: 'Δx lớn nhất',
          hint: 'Cát tuyến lệch xa tiếp tuyến nhất. Đây là lúc phép xấp xỉ tệ nhất — hãy nhớ hình này.',
          params: { x0: 1, deltaX: 2 }
        },
        {
          label: 'Δx nhỏ nhất',
          hint: 'Hai đường gần như chồng lên nhau. Δx chưa bằng 0, nhưng độ dốc đã sát 2 — đó là ý nghĩa của giới hạn.',
          params: { x0: 1, deltaX: 0.05 }
        },
        {
          label: 'Xét tại đỉnh x₀ = 0',
          hint: 'Tiếp tuyến nằm ngang, độ dốc bằng 0. Đạo hàm bằng 0 chính là dấu hiệu của điểm cực trị.',
          params: { x0: 0, deltaX: 0.5 }
        }
      ];

    case 'circle_area_decomposition':
    case 'geometry_2d':
    case 'circle_area':
      return [
        {
          label: 'Chỉ 4 nan quạt',
          hint: 'Hình ghép trông chẳng giống chữ nhật chút nào. Đây là lý do phép chứng minh bắt buộc phải cho n lớn.',
          params: { radius: 4, slices: 4 }
        },
        {
          label: 'Cắt nhiều nhất',
          hint: 'Cạnh cong đã duỗi gần thành đường thẳng. Diện tích chưa hề đổi suốt quá trình — chỉ hình dạng đổi.',
          params: { radius: 4, slices: 32 }
        },
        {
          label: 'Bán kính nhỏ nhất',
          hint: 'r nhỏ đi thì diện tích giảm theo bình phương, không phải giảm đều. Gấp đôi r là gấp bốn diện tích.',
          params: { radius: 1, slices: 24 }
        }
      ];

    case 'vector_3d_projection':
    case 'vector':
    case 'geometry_3d':
    case 'vector_3d':
      return [
        {
          label: 'Ép vz = 0',
          hint: 'Vector nằm hẳn trong mặt đáy. Bài toán 3 chiều thu về đúng Pytago 2 chiều quen thuộc.',
          params: { vx: 3, vy: 4, vz: 0 }
        },
        {
          label: 'Chỉ còn một trục',
          hint: 'Độ dài vector đúng bằng vx. Toạ độ nào bằng 0 thì trục đó không đóng góp gì vào độ dài.',
          params: { vx: 4, vy: 0, vz: 0 }
        },
        {
          label: 'Cho toạ độ âm',
          hint: 'Vector đổi hướng nhưng độ dài không đổi — vì công thức bình phương mọi thành phần trước khi cộng.',
          params: { vx: -3, vy: 4, vz: -3 }
        }
      ];

    default:
      return [];
  }
}
