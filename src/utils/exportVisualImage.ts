/**
 * Utility to export SVG or Three.js 3D WebGL visual stages to high-quality PNG images
 */

function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove Vietnamese diacritics for clean filenames
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function exportVisualStageToPNG(
  stageElement: HTMLElement | null,
  topicTitle: string
): Promise<boolean> {
  if (!stageElement) return false;

  const baseFileName = slugify(topicTitle) || 'math-visual';
  const fileName = `${baseFileName}.png`;
  const isDark = document.documentElement.classList.contains('dark');
  const bgColor = isDark ? '#0F1219' : '#FAF7F2';

  // 1. Check for 3D Three.js WebGL canvas first
  const webglCanvas = stageElement.querySelector('canvas');
  if (webglCanvas) {
    try {
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = webglCanvas.width || 1200;
      offscreenCanvas.height = webglCanvas.height || 840;
      const ctx = offscreenCanvas.getContext('2d');
      if (!ctx) return false;

      // Draw solid background so transparency looks clean on all devices
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
      ctx.drawImage(webglCanvas, 0, 0, offscreenCanvas.width, offscreenCanvas.height);

      offscreenCanvas.toBlob((blob) => {
        if (!blob) return;
        downloadBlob(blob, fileName);
      }, 'image/png');

      return true;
    } catch (err) {
      console.error('Failed to export 3D Canvas:', err);
      return false;
    }
  }

  // 2. Otherwise, check for SVG element (2D visual engines)
  const svg = stageElement.querySelector('svg');
  if (!svg) return false;

  try {
    const clonedSvg = svg.cloneNode(true) as SVGSVGElement;
    
    // Ensure XMLNS attributes
    clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

    const viewBox = svg.viewBox.baseVal;
    const baseW = viewBox && viewBox.width > 0 ? viewBox.width : (svg.clientWidth || 600);
    const baseH = viewBox && viewBox.height > 0 ? viewBox.height : (svg.clientHeight || 400);

    clonedSvg.setAttribute('width', `${baseW}`);
    clonedSvg.setAttribute('height', `${baseH}`);

    // Inline computed styles for elements so Tailwind classes & colors carry over
    const originalElements = Array.from(svg.querySelectorAll('*'));
    const clonedElements = Array.from(clonedSvg.querySelectorAll('*'));

    clonedElements.forEach((clonedEl, i) => {
      const origEl = originalElements[i];
      if (origEl instanceof SVGElement && clonedEl instanceof SVGElement) {
        const computed = window.getComputedStyle(origEl);
        if (computed.fill && computed.fill !== 'none') {
          clonedEl.style.fill = computed.fill;
        }
        if (computed.stroke && computed.stroke !== 'none') {
          clonedEl.style.stroke = computed.stroke;
        }
        if (computed.color) {
          clonedEl.style.color = computed.color;
        }
        if (computed.fontFamily) {
          clonedEl.style.fontFamily = computed.fontFamily;
        }
        if (computed.fontSize) {
          clonedEl.style.fontSize = computed.fontSize;
        }
        if (computed.fontWeight) {
          clonedEl.style.fontWeight = computed.fontWeight;
        }
      }
    });

    const svgString = new XMLSerializer().serializeToString(clonedSvg);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const blobURL = URL.createObjectURL(svgBlob);

    return new Promise<boolean>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        // Render at 2x resolution for high-DPI crystal clear PNG
        const scaleFactor = 2;
        const exportW = baseW * scaleFactor;
        const exportH = baseH * scaleFactor;

        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = exportW;
        offscreenCanvas.height = exportH;
        const ctx = offscreenCanvas.getContext('2d');

        if (!ctx) {
          URL.revokeObjectURL(blobURL);
          resolve(false);
          return;
        }

        // Draw solid background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, exportW, exportH);

        // Draw SVG image
        ctx.drawImage(img, 0, 0, exportW, exportH);
        URL.revokeObjectURL(blobURL);

        offscreenCanvas.toBlob((blob) => {
          if (!blob) {
            resolve(false);
            return;
          }
          downloadBlob(blob, fileName);
          resolve(true);
        }, 'image/png');
      };

      img.onerror = () => {
        URL.revokeObjectURL(blobURL);
        resolve(false);
      };

      img.src = blobURL;
    });
  } catch (err) {
    console.error('Failed to export SVG:', err);
    return false;
  }
}

function downloadBlob(blob: Blob, fileName: string) {
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => {
    URL.revokeObjectURL(downloadUrl);
  }, 1000);
}
