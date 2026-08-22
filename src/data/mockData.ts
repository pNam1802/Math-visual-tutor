import { TopicData } from '../types';

export const SUGGESTED_TOPICS: TopicData[] = [
  {
    id: 'quadratic',
    title: 'Phương trình bậc 2',
    category: 'Đại số',
    prompt: 'Giải phương trình bậc 2 x² - 5x + 6 = 0',
    initialMessage: 'Chào bạn! Mình đã dựng đồ thị hàm số bậc hai $y = x^2 - 5x + 6$ và phân tích các nghiệm hình học tương ứng. Bạn có thể kéo các thanh trượt tham số để quan sát sự dịch chuyển của đỉnh Parabol và giao điểm với trục hoành.',
    formulaSummary: 'f(x) = ax^2 + bx + c',
    type: 'quadratic',
    defaultValues: {
      a: 1,
      b: -5,
      c: 6,
      probeX: 2.5
    },
    params: [
      {
        id: 'a',
        name: 'Hệ số a (Độ cong)',
        symbol: 'a',
        min: -3,
        max: 3,
        step: 0.1,
        defaultValue: 1,
        description: 'a > 0 bề lõm quay lên, a < 0 bề lõm quay xuống'
      },
      {
        id: 'b',
        name: 'Hệ số b (Dịch chuyển ngang)',
        symbol: 'b',
        min: -10,
        max: 10,
        step: 0.5,
        defaultValue: -5,
        description: 'Ảnh hưởng đến vị trí trục đối xứng x = -b/(2a)'
      },
      {
        id: 'c',
        name: 'Hệ số c (Giao điểm Oy)',
        symbol: 'c',
        min: -10,
        max: 10,
        step: 0.5,
        defaultValue: 6,
        description: 'Tọa độ giao điểm đồ thị với trục tung (0, c)'
      }
    ],
    steps: [
      {
        id: 1,
        title: 'Xác định dạng phương trình và các hệ số',
        summary: 'Đưa phương trình về dạng chuẩn ax² + bx + c = 0',
        formula: '1x^2 + (-5)x + 6 = 0 \\implies a = 1, b = -5, c = 6',
        detail: 'Phương trình đã cho có dạng bậc hai tổng quát với hệ số chính $a = 1 \\neq 0$. Vì $a > 0$, parabol có bề lõm hướng lên trên và đạt giá trị nhỏ nhất tại đỉnh.',
        visualHighlight: 'Quan sát đồ thị parabol mở lên phía trên',
        keyTakeaway: 'Hệ số a quyết định chiều cong của Parabol.'
      },
      {
        id: 2,
        title: 'Tính biệt thức Delta (Δ)',
        summary: 'Biệt thức quyết định số lượng giao điểm với trục hoành Ox',
        formula: '\\Delta = b^2 - 4ac = (-5)^2 - 4(1)(6) = 25 - 24 = 1',
        detail: 'Vì $\\Delta = 1 > 0$, phương trình có đúng 2 nghiệm thực phân biệt. Về mặt hình học, parabol cắt trục hoành Ox tại 2 điểm phân biệt.',
        visualHighlight: 'Hai chấm tròn đánh dấu giao điểm x = 2 và x = 3 trên trục Ox',
        keyTakeaway: 'Δ > 0 tương ứng với 2 lần cắt trục Ox.'
      },
      {
        id: 3,
        title: 'Tính tọa độ đỉnh và trục đối xứng',
        summary: 'Tọa độ điểm cực tiểu của Parabol',
        formula: 'x_v = -\\frac{b}{2a} = \\frac{5}{2} = 2.5, \\quad y_v = -\\frac{\\Delta}{4a} = -\\frac{1}{4} = -0.25',
        detail: 'Trục đối xứng là đường thẳng đứng $x = 2.5$. Điểm cực tiểu $V(2.5, -0.25)$ nằm phía dưới trục hoành, chứng minh đồ thị phải cắt trục hoành tại 2 nhánh.',
        visualHighlight: 'Đường nét đứt màu chàm thể hiện trục đối xứng x = 2.5',
        keyTakeaway: 'Đỉnh V là điểm đối xứng hoàn hảo của hai nghiệm.'
      },
      {
        id: 4,
        title: 'Tìm 2 nghiệm x₁ và x₂',
        summary: 'Công thức nghiệm trực tiếp',
        formula: 'x_1 = \\frac{-(-5) - \\sqrt{1}}{2(1)} = 2, \\quad x_2 = \\frac{-(-5) + \\sqrt{1}}{2(1)} = 3',
        detail: 'Kết luận: Tập nghiệm của phương trình là $S = \\{2, 3\\}$. Ta có phân tích nhân tử: $(x - 2)(x - 3) = 0$.',
        visualHighlight: 'Vùng nghiệm sáng lên trên biểu đồ',
        keyTakeaway: 'Tập nghiệm chính xác: x = 2 hoặc x = 3.'
      }
    ],
    renderInfo: {
      domainX: [-1, 6],
      domainY: [-3, 10],
      title: 'Khảo sát hình học Parabol $y = ax^2 + bx + c$',
      description: 'Mô hình hóa hàm số bậc hai với trục đối xứng và 2 điểm giao cắt Ox'
    }
  },
  {
    id: 'trig_circle',
    title: 'Đường tròn lượng giác',
    category: 'Lượng giác',
    prompt: 'Trực quan hoá đường tròn lượng giác',
    initialMessage: 'Đường tròn đơn vị (bán kính R = 1) là công cụ nền tảng biểu diễn trực quan các giá trị Sin, Cos, Tan. Di chuyển thanh trượt góc θ để thấy sự thay đổi hình chiếu trên các trục tọa độ.',
    formulaSummary: '\\cos^2(\\theta) + \\sin^2(\\theta) = 1',
    type: 'trig_circle',
    defaultValues: {
      angleDeg: 45,
      showTan: 1,
      showGrid: 1
    },
    params: [
      {
        id: 'angleDeg',
        name: 'Góc lượng giác θ',
        symbol: 'θ',
        min: 0,
        max: 360,
        step: 1,
        defaultValue: 45,
        unit: '°',
        description: 'Góc quay ngược chiều kim đồng hồ từ tia Ox dương'
      }
    ],
    steps: [
      {
        id: 1,
        title: 'Định nghĩa đường tròn đơn vị',
        summary: 'Tâm tại gốc tọa độ O(0,0) và bán kính R = 1',
        formula: 'x^2 + y^2 = 1',
        detail: 'Mỗi điểm $M(x, y)$ trên đường tròn tương ứng với góc lượng giác $\\theta$. Hoành độ $x = \\cos(\\theta)$ và tung độ $y = \\sin(\\theta)$.',
        visualHighlight: 'Vòng tròn bán kính đơn vị màu chàm đậm',
        keyTakeaway: 'Tọa độ điểm M chính là (cos θ, sin θ).'
      },
      {
        id: 2,
        title: 'Hình chiếu Cosine (Trục hoành)',
        summary: 'Đoạn hình chiếu vuông góc lên trục Ox',
        formula: '\\cos(\\theta) = x_M \\in [-1, 1]',
        detail: 'Đoạn thẳng màu xanh lam dọc theo trục Ox biểu diễn giá trị $\\cos(\\theta)$. Tại $0^\\circ$ giá trị là $1$, tại $90^\\circ$ là $0$, tại $180^\\circ$ là $-1$.',
        visualHighlight: 'Đoạn thẳng ngang màu xanh dương trên trục Ox',
        keyTakeaway: 'Cos luôn biến thiên trong đoạn [-1, 1].'
      },
      {
        id: 3,
        title: 'Hình chiếu Sine (Trục tung)',
        summary: 'Đoạn hình chiếu vuông góc lên trục Oy',
        formula: '\\sin(\\theta) = y_M \\in [-1, 1]',
        detail: 'Đoạn thẳng màu đỏ/cam dọc theo trục Oy biểu diễn giá trị $\\sin(\\theta)$. Tạo thành tam giác vuông có cạnh huyền bằng $1$.',
        visualHighlight: 'Đoạn thẳng đứng màu cam trên trục Oy',
        keyTakeaway: 'Sin là chiều cao của tam giác vuông đơn vị.'
      },
      {
        id: 4,
        title: 'Đẳng thức Pytago lượng giác cơ bản',
        summary: 'Tổng bình phương hai cạnh góc vuông bằng bình phương cạnh huyền',
        formula: '\\sin^2(\\theta) + \\cos^2(\\theta) = 1^2 = 1',
        detail: 'Bất kể góc $\\theta$ mang giá trị bao nhiêu độ, định lý Pytago luôn bảo toàn mối liên hệ giữa Sin và Cos.',
        visualHighlight: 'Tam giác vuông màu vàng nhạt bên trong đường tròn',
        keyTakeaway: 'Cạnh huyền luôn luôn cố định bằng bán kính 1.'
      }
    ],
    renderInfo: {
      domainX: [-1.5, 1.5],
      domainY: [-1.5, 1.5],
      title: 'Đường tròn đơn vị tương tác',
      description: 'Khám phá hàm Sin, Cos và Tan qua tam giác lượng giác quay 360°'
    }
  },
  {
    id: 'derivative',
    title: 'Đạo hàm & Tiếp tuyến',
    category: 'Giải tích',
    prompt: 'Minh hoạ đạo hàm là gì bằng tiếp tuyến',
    initialMessage: 'Đạo hàm tại một điểm chính là hệ số góc (độ dốc) của đường tiếp tuyến với đồ thị tại điểm đó. Khi khoảng cách $\\Delta x \\to 0$, đường cát tuyến dần tiệm cận thành tiếp tuyến thực sự.',
    formulaSummary: "f'(x_0) = \\lim_{\\Delta x \\to 0} \\frac{f(x_0 + \\Delta x) - f(x_0)}{\\Delta x}",
    type: 'derivative',
    defaultValues: {
      x0: 1.0,
      deltaX: 0.8
    },
    params: [
      {
        id: 'x0',
        name: 'Điểm tiếp điểm x₀',
        symbol: 'x₀',
        min: -2.2,
        max: 2.2,
        step: 0.1,
        defaultValue: 1.0,
        description: 'Vị trí x mà ta muốn tính đạo hàm f(x) = x³ - 3x'
      },
      {
        id: 'deltaX',
        name: 'Bước cát tuyến Δx (Tiến về 0)',
        symbol: 'Δx',
        min: 0.05,
        max: 1.5,
        step: 0.05,
        defaultValue: 0.8,
        description: 'Kéo về mức nhỏ nhất để thấy cát tuyến trùng với tiếp tuyến'
      }
    ],
    steps: [
      {
        id: 1,
        title: 'Khảo sát hàm số nền f(x) = x³ - 3x',
        summary: 'Hàm bậc ba có cực đại tại x = -1 và cực tiểu tại x = 1',
        formula: 'f(x) = x^3 - 3x \\implies f\'(x) = 3x^2 - 3',
        detail: 'Đồ thị là đường cong liên tục. Ta chọn điểm xét $P(x_0, f(x_0))$ trên đường cong để nghiên cứu tốc độ thay đổi tức thời.',
        visualHighlight: 'Đường cong mượt mà màu tím Indigo',
        keyTakeaway: 'Hàm số uốn lượn có nhiều độ dốc khác nhau tùy thuộc vị trí x.'
      },
      {
        id: 2,
        title: 'Tốc độ biến thiên trung bình (Cát tuyến)',
        summary: 'Đường thẳng nối 2 điểm P(x₀) và Q(x₀ + Δx)',
        formula: 'm_{sec} = \\frac{f(x_0 + \\Delta x) - f(x_0)}{\\Delta x}',
        detail: 'Khi $\\Delta x$ còn lớn, đường cát tuyến (màu xám nét đứt) chỉ phản ánh tốc độ thay đổi trung bình trong khoảng cách đó.',
        visualHighlight: 'Đường cát tuyến màu xám cắt qua 2 điểm P và Q',
        keyTakeaway: 'Cát tuyến là ước lượng thô cho độ dốc.'
      },
      {
        id: 3,
        title: 'Quá trình lấy giới hạn Δx → 0',
        summary: 'Điểm Q di chuyển dọc theo đường cong dần nhập vào điểm P',
        formula: 'm_{tan} = \\lim_{\\Delta x \\to 0} m_{sec} = f\'(x_0)',
        detail: 'Khi kéo $\\Delta x \\to 0$, khoảng cách giữa hai điểm co lại, cát tuyến xoay dần và khớp hoàn hảo với tiếp tuyến duy nhất chạm vào đường cong.',
        visualHighlight: 'Đường tiếp tuyến màu vàng hổ phách (Amber)',
        keyTakeaway: 'Đạo hàm là giới hạn của hệ số góc cát tuyến.'
      },
      {
        id: 4,
        title: 'Phương trình tiếp tuyến tại tiếp điểm',
        summary: 'Dạng tiếp tuyến y = f\'(x₀)(x - x₀) + f(x₀)',
        formula: 'y - f(x_0) = f\'(x_0)(x - x_0)',
        detail: 'Tiếp tuyến là xấp xỉ tuyến tính tốt nhất của hàm phi tuyến tại lân cận điểm $x_0$.',
        visualHighlight: 'Tiếp điểm P màu vàng sáng nổi bật',
        keyTakeaway: 'Độ dốc tiếp tuyến phản ánh chính xác tốc độ biến thiên tức thời.'
      }
    ],
    renderInfo: {
      domainX: [-2.8, 2.8],
      domainY: [-4.5, 4.5],
      title: 'Mô phỏng giới hạn Cát tuyến → Tiếp tuyến',
      description: 'Trực quan hóa bản chất của phép vi phân $f\'(x)$'
    }
  },
  {
    id: 'vector_3d',
    title: 'Vector trong không gian 3D',
    category: 'Hình học Không gian',
    prompt: 'Vẽ và giải thích vector trong không gian 3D',
    initialMessage: 'Vector trong không gian $\\mathbb{R}^3$ được định nghĩa bằng bộ 3 tọa độ $(x, y, z)$. Đồ thị 3D chiếu trục isometric dưới đây giúp bạn quan sát các hình hộp tọa độ và tính độ dài chuẩn Euler.',
    formulaSummary: '\\|\\vec{v}\\| = \\sqrt{x^2 + y^2 + z^2}',
    type: 'vector_3d',
    defaultValues: {
      vx: 3,
      vy: 4,
      vz: 3,
      rotAngle: 35
    },
    params: [
      {
        id: 'vx',
        name: 'Tọa độ trục Ox (Trục đỏ)',
        symbol: 'x',
        min: -5,
        max: 5,
        step: 0.5,
        defaultValue: 3,
        description: 'Khoảng cách dọc theo trục hoành 3D'
      },
      {
        id: 'vy',
        name: 'Tọa độ trục Oy (Trục xanh lá)',
        symbol: 'y',
        min: -5,
        max: 5,
        step: 0.5,
        defaultValue: 4,
        description: 'Khoảng cách dọc theo trục sâu 3D'
      },
      {
        id: 'vz',
        name: 'Tọa độ trục Oz (Trục xanh dương)',
        symbol: 'z',
        min: -5,
        max: 5,
        step: 0.5,
        defaultValue: 3,
        description: 'Khoảng cách dọc theo chiều cao 3D'
      }
    ],
    steps: [
      {
        id: 1,
        title: 'Hệ trục tọa độ Descartes Oxyz',
        summary: '3 trục đôi một vuông góc tuân theo quy tắc bàn tay phải',
        formula: 'O(0,0,0), \\; \\vec{i} = (1,0,0), \\; \\vec{j} = (0,1,0), \\; \\vec{k} = (0,0,1)',
        detail: 'Không gian 3 chiều mở rộng từ mặt phẳng 2D bằng cách thêm trục thẳng đứng Oz. Mỗi điểm trong không gian được xác định duy nhất bởi bộ $(x, y, z)$.',
        visualHighlight: '3 trục tọa độ Ox (Đỏ), Oy (Lục), Oz (Lam)',
        keyTakeaway: 'Hệ trục Oxyz tạo nên bộ khung không gian 3 chiều.'
      },
      {
        id: 2,
        title: 'Hình hộp chữ nhật tọa độ',
        summary: 'Đường nét đứt tạo nên khối hộp chữ nhật định vị mũi vector',
        formula: 'P(x, y, z) = x\\vec{i} + y\\vec{j} + z\\vec{k}',
        detail: 'Hình chiếu của điểm $P$ xuống mặt phẳng $Oxy$ là $(x, y, 0)$. Chiều cao từ mặt đất lên điểm $P$ đúng bằng $z$.',
        visualHighlight: 'Khối hộp chữ nhật không gian nét đứt',
        keyTakeaway: 'Vector là đường chéo chính của khối hộp chữ nhật.'
      },
      {
        id: 3,
        title: 'Độ dài (Chuẩn Euclidean) của Vector',
        summary: 'Áp dụng định lý Pytago 2 lần liên tiếp trong không gian',
        formula: '\\|\\vec{v}\\| = \\sqrt{(\\sqrt{x^2 + y^2})^2 + z^2} = \\sqrt{x^2 + y^2 + z^2}',
        detail: 'Đoạn đường chéo đáy $d_{Oxy} = \\sqrt{x^2 + y^2}$. Đường chéo chính của khối hộp $\\|\\vec{v}\\| = \\sqrt{d^2 + z^2}$.',
        visualHighlight: 'Mũi tên vector màu tím Indigo đậm tỏa sáng',
        keyTakeaway: 'Độ dài luôn là số không âm biểu diễn khoảng cách từ gốc O.'
      },
      {
        id: 4,
        title: 'Vector đơn vị và hướng',
        summary: 'Chuẩn hóa vector về độ dài bằng 1',
        formula: '\\hat{u} = \\frac{\\vec{v}}{\\|\\vec{v}\\|} = \\left(\\frac{x}{\\|\\vec{v}\\|}, \\frac{y}{\\|\\vec{v}\\|}, \\frac{z}{\\|\\vec{v}\\|}\\right)',
        detail: 'Các thành phần này chính là cosin chỉ phương $(\\cos \\alpha, \\cos \\beta, \\cos \\gamma)$ với $\\cos^2 \\alpha + \\cos^2 \\beta + \\cos^2 \\gamma = 1$.',
        visualHighlight: 'Góc giữa vector và các trục tọa độ',
        keyTakeaway: 'Vector vừa chứa thông tin độ lớn, vừa xác định phương hướng trong không gian.'
      }
    ],
    renderInfo: {
      domainX: [-6, 6],
      domainY: [-6, 6],
      title: 'Mô hình không gian 3D Vector & Hình hộp Tọa độ',
      description: 'Hình chiếu Isometric tương tác của vector $\\vec{v} = (x, y, z)$'
    }
  },
  {
    id: 'circle_area',
    title: 'Diện tích hình tròn & Bán kính',
    category: 'Hình học phẳng',
    prompt: 'Diện tích hình tròn thay đổi thế nào theo bán kính',
    initialMessage: 'Tại sao diện tích hình tròn lại là $A = \\pi r^2$? Hãy thử trải các mảnh quạt (sector slices) ra để xem chúng ghép lại thành một hình chữ nhật có đáy xấp xỉ $\\pi r$ và chiều cao $r$.',
    formulaSummary: 'A = \\pi r^2 \\quad (\\text{hoặc } \\frac{dA}{dr} = 2\\pi r)',
    type: 'circle_area',
    defaultValues: {
      radius: 4,
      slices: 12,
      unwrapProgress: 0.6
    },
    params: [
      {
        id: 'radius',
        name: 'Bán kính hình tròn (r)',
        symbol: 'r',
        min: 1,
        max: 8,
        step: 0.5,
        defaultValue: 4,
        unit: 'cm',
        description: 'Khi r tăng gấp đôi, diện tích sẽ tăng gấp 4 lần (tỷ lệ bậc 2)'
      },
      {
        id: 'slices',
        name: 'Số mảnh cắt (N)',
        symbol: 'N',
        min: 4,
        max: 32,
        step: 2,
        defaultValue: 12,
        description: 'Số mảnh cắt càng nhiều thì hình trải ra càng vuông vức'
      }
    ],
    steps: [
      {
        id: 1,
        title: 'Mối quan hệ Chu vi & Bán kính',
        summary: 'Chu vi đường tròn bao quanh là C = 2πr',
        formula: 'C = 2\\pi r',
        detail: 'Định nghĩa số $\\pi$ là tỷ số giữa chu vi và đường kính của bất kỳ hình tròn nào: $\\pi = \\frac{C}{2r} \\approx 3.14159$.',
        visualHighlight: 'Đường viền tròn ngoài cùng',
        keyTakeaway: 'Chu vi tăng tuyến tính theo bán kính r.'
      },
      {
        id: 2,
        title: 'Phương pháp phân rã hình quạt (Archimedes)',
        summary: 'Cắt hình tròn thành N mảnh quạt bằng nhau',
        formula: '\\text{Mỗi mảnh có góc: } \\alpha = \\frac{360^\\circ}{N} = \\frac{2\\pi}{N}',
        detail: 'Khi chia đều thành $N$ mảnh quạt nhỏ và xếp so le đan xen vào nhau, các mảnh tạo thành một hình dạng gần giống hình bình hành.',
        visualHighlight: 'Các lát cắt nan quạt được tô màu xen kẽ',
        keyTakeaway: 'Diện tích tổng không đổi sau khi tái sắp xếp các mảnh.'
      },
      {
        id: 3,
        title: 'Xấp xỉ thành hình chữ nhật',
        summary: 'Khi số mảnh N tiến đến vô cùng (N → ∞)',
        formula: '\\text{Chiều dài đáy } b = \\frac{C}{2} = \\pi r, \\quad \\text{Chiều cao } h = r',
        detail: 'Mỗi cạnh uốn cong của mảnh quạt trở nên thẳng tắp. Tổng độ dài các đáy trên và dưới bằng đúng chu vi $2\\pi r$. Do đó, đáy hình chữ nhật dài $\\pi r$ và chiều cao là bán kính $r$.',
        visualHighlight: 'Khối trải phẳng các nan quạt dạng răng cưa',
        keyTakeaway: 'Hình phẳng tiến về hình chữ nhật kích thước (πr) × r.'
      },
      {
        id: 4,
        title: 'Công thức diện tích chính xác',
        summary: 'Diện tích = Đáy × Chiều cao',
        formula: 'A = b \\times h = (\\pi r) \\times r = \\pi r^2',
        detail: 'Mỗi khi $r$ tăng lên gấp đôi ($2r$), diện tích $A$ sẽ tăng gấp $2^2 = 4$ lần. Đạo hàm $\\frac{dA}{dr} = 2\\pi r$ cho thấy tốc độ mở rộng diện tích chính bằng chu vi viền ngoài!',
        visualHighlight: 'Vùng diện tích tô màu sáng với chỉ số A = πr²',
        keyTakeaway: 'Diện tích tăng theo lũy thừa bậc 2 của bán kính.'
      }
    ],
    renderInfo: {
      domainX: [-10, 10],
      domainY: [-10, 10],
      title: 'Chứng minh trực quan $A = \\pi r^2$',
      description: 'Phân tích trải mảnh quạt thành hình chữ nhật xấp xỉ'
    }
  }
];
