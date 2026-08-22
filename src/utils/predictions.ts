/**
 * One prediction per concept, asked before the worked steps are revealed.
 *
 * Reading an explanation feels like understanding and usually is not. Committing
 * to an answer first is what makes the explanation land: a student who guessed
 * wrong now has a question they actually want answered. Every distractor below
 * is a misconception students genuinely hold, not filler.
 */

export interface Prediction {
  question: string;
  options: string[];
  /** Index into options. */
  correctIndex: number;
  /** Shown after answering, whichever option was chosen. */
  explanation: string;
}

export function getPrediction(
  concept: string | undefined,
  type: string
): Prediction | null {
  const key = concept || type;

  switch (key) {
    case 'quadratic_equation':
    case 'algebra':
    case 'equation':
    case 'quadratic':
      return {
        question: 'Khi Δ < 0, đồ thị parabol sẽ như thế nào?',
        options: [
          'Cắt trục hoành tại đúng 1 điểm',
          'Không chạm trục hoành ở đâu cả',
          'Nằm hoàn toàn phía dưới trục hoành'
        ],
        correctIndex: 1,
        explanation:
          'Δ < 0 nghĩa là đỉnh parabol nằm hẳn về một phía của trục hoành, nên đồ thị không cắt trục ở đâu. Lưu ý: nó có thể nằm hoàn toàn phía TRÊN trục — nếu a > 0 — chứ không nhất thiết ở dưới. "Vô nghiệm" chỉ có nghĩa là không giao nhau.'
      };

    case 'unit_circle':
    case 'trigonometry':
    case 'trig_circle':
      return {
        question: 'Khi θ quay từ 0° đến 360°, giá trị cos²θ + sin²θ thay đổi ra sao?',
        options: [
          'Tăng dần rồi giảm',
          'Dao động giữa −1 và 1',
          'Luôn luôn bằng 1'
        ],
        correctIndex: 2,
        explanation:
          'Luôn bằng 1, không phụ thuộc θ. Vì cos θ và sin θ là hai cạnh góc vuông của một tam giác có cạnh huyền là bán kính, mà bán kính đường tròn đơn vị luôn bằng 1. Đây là định lý Pytago viết lại, không phải một công thức mới.'
      };

    case 'derivative_tangent':
    case 'calculus':
    case 'derivative':
      return {
        question: 'Khi Δx nhỏ dần về 0, độ dốc của cát tuyến sẽ tiến về đâu?',
        options: [
          'Về 0, vì Δx tiến về 0',
          'Về đúng độ dốc của tiếp tuyến',
          'Về vô cùng, vì mẫu số tiến về 0'
        ],
        correctIndex: 1,
        explanation:
          'Cả tử số và mẫu số cùng tiến về 0, nên tỉ số của chúng không tiến về 0 mà cũng không ra vô cùng — nó tiến về một số hữu hạn. Số đó chính là độ dốc tiếp tuyến, và ta gọi nó là đạo hàm.'
      };

    case 'circle_area_decomposition':
    case 'geometry_2d':
    case 'circle_area':
      return {
        question: 'Khi cắt hình tròn thành càng nhiều nan quạt rồi ghép lại, diện tích hình ghép sẽ ra sao?',
        options: [
          'Tăng lên, vì hình ngày càng vuông vắn',
          'Giảm đi, vì bị cắt vụn',
          'Không đổi, dù cắt bao nhiêu lát'
        ],
        correctIndex: 2,
        explanation:
          'Cắt rồi ghép không thêm cũng không bớt phần nào — diện tích được bảo toàn tuyệt đối. Thứ duy nhất thay đổi là HÌNH DẠNG: càng nhiều lát, hình càng giống chữ nhật, và ta tính được diện tích của chữ nhật đó. Đó chính là mẹo của phép chứng minh.'
      };

    case 'vector_3d_projection':
    case 'vector':
    case 'geometry_3d':
    case 'vector_3d':
      return {
        question: 'Nếu đổi dấu cả ba toạ độ của vector, độ dài của nó sẽ thế nào?',
        options: [
          'Cũng đổi dấu thành số âm',
          'Không đổi',
          'Bằng 0'
        ],
        correctIndex: 1,
        explanation:
          'Không đổi. Công thức bình phương từng thành phần trước khi cộng, nên dấu bị triệt tiêu. Vector mới chỉ ngược hướng vector cũ, còn dài đúng bằng nó — và độ dài thì không bao giờ âm.'
      };

    default:
      return null;
  }
}
