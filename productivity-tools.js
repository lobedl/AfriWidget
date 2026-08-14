function onReady(fn) { if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', fn); } else { fn(); } }
(function () {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const number = (value, fallback = 0) => {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  const money = value => number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const copyText = async value => {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch (error) {
      const area = document.createElement('textarea');
      area.value = value;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      const copied = document.execCommand('copy');
      area.remove();
      return copied;
    }
  };
  const showStatus = (element, message, tone = 'teal') => {
    if (!element) return;
    element.textContent = message;
    element.className = `mt-3 text-sm font-semibold ${tone === 'rose' ? 'text-rose-600' : 'text-teal-700'}`;
  };

  const pdfSafe = value => String(value || '')
    .replace(/[^\x20-\x7E]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();

  const pdfEscape = value => pdfSafe(value)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');

  const wrapPdfText = (value, maxLength = 76) => {
    const words = pdfSafe(value).split(' ').filter(Boolean);
    const lines = [];
    let line = '';
    words.forEach(word => {
      if ((line + (line ? ' ' : '') + word).length > maxLength && line) {
        lines.push(line);
        line = word;
      } else {
        line += (line ? ' ' : '') + word;
      }
    });
    if (line) lines.push(line);
    return lines.length ? lines : [''];
  };

  const makePdf = content => {
    const objects = [
      '<< /Type /Catalog /Pages 2 0 R >>',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /ProcSet [/PDF /Text] /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
      `<< /Length ${new TextEncoder().encode(content).length} >>\nstream\n${content}\nendstream`
    ];
    // Build the final file from explicit UTF-8 bytes. This keeps the PDF
    // xref offsets and stream length correct in mobile/embedded browsers.
    let pdf = '%PDF-1.4\n';
    const offsets = [0];
    objects.forEach((object, index) => {
      offsets[index + 1] = pdf.length;
      pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });
    const xrefOffset = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    offsets.slice(1).forEach(offset => { pdf += `${String(offset).padStart(10, '0')} 00000 n \n`; });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    return new TextEncoder().encode(pdf);
  };

  const pdfDataUrl = bytes => {
    let binary = '';
    const chunkSize = 0x8000;
    for (let index = 0; index < bytes.length; index += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
    }
    return `data:application/pdf;base64,${btoa(binary)}`;
  };

  function initInvoiceGenerator() {
    const rows = $('#invoiceItems');
    if (!rows) return;
    let itemId = 0;
    let generated = false;

    const markDirty = () => {
      generated = false;
      $('#invoicePreview')?.classList.add('hidden');
      $('#invoiceTotals')?.classList.add('hidden');
      $('#downloadInvoicePdf')?.classList.add('hidden');
      const status = $('#invoiceStatus');
      if (status) {
        status.textContent = 'Review your details, then generate the invoice or receipt.';
        status.className = 'mt-3 text-sm font-semibold text-slate-500';
      }
    };

    const addRow = (item = '', qty = 1, price = '') => {
      itemId += 1;
      const row = document.createElement('div');
      row.className = 'invoice-item grid grid-cols-12 gap-2 items-center';
      row.innerHTML = `
        <label class="sr-only" for="invoiceItem${itemId}">Item or service</label>
        <input id="invoiceItem${itemId}" class="invoice-name col-span-5 bg-slate-50 border-2 border-slate-200 rounded-lg px-3 py-2" placeholder="Item or service" value="${String(item).replace(/"/g, '&quot;')}" />
        <label class="sr-only" for="invoiceQty${itemId}">Quantity</label>
        <input id="invoiceQty${itemId}" class="invoice-qty col-span-2 bg-slate-50 border-2 border-slate-200 rounded-lg px-3 py-2" type="number" min="0" step="any" value="${qty}" />
        <label class="sr-only" for="invoicePrice${itemId}">Unit price</label>
        <input id="invoicePrice${itemId}" class="invoice-price col-span-3 bg-slate-50 border-2 border-slate-200 rounded-lg px-3 py-2" type="number" min="0" step="any" placeholder="0.00" value="${price}" />
        <output class="invoice-line-total col-span-1 text-right text-sm font-semibold text-slate-700">0.00</output>
        <button type="button" class="invoice-remove col-span-1 text-slate-400 hover:text-rose-600 text-xl" aria-label="Remove item">×</button>
      `;
      rows.appendChild(row);
      $$('.invoice-name, .invoice-qty, .invoice-price', row).forEach(input => {
        input.addEventListener('input', () => {
          calculate();
          markDirty();
        });
      });
      $('.invoice-remove', row).addEventListener('click', () => {
        if ($$('.invoice-item', rows).length > 1) row.remove();
        calculate();
        markDirty();
      });
    };

    const calculate = () => {
      let subtotal = 0;
      $$('.invoice-item', rows).forEach(row => {
        const total = number($('.invoice-qty', row).value, 0) * number($('.invoice-price', row).value, 0);
        subtotal += total;
        $('.invoice-line-total', row).textContent = money(total);
      });
      const discountRate = Math.max(0, number($('#invoiceDiscount')?.value, 0));
      const taxRate = Math.max(0, number($('#invoiceTax')?.value, 0));
      const discount = subtotal * discountRate / 100;
      const taxable = Math.max(0, subtotal - discount);
      const tax = taxable * taxRate / 100;
      const total = taxable + tax;
      $('#invoiceSubtotal').textContent = money(subtotal);
      $('#invoiceDiscountAmount').textContent = `− ${money(discount)}`;
      $('#invoiceTaxAmount').textContent = money(tax);
      $('#invoiceGrandTotal').textContent = money(total);
      $('#invoicePreviewSubtotal').textContent = money(subtotal);
      $('#invoicePreviewDiscount').textContent = `− ${money(discount)}`;
      $('#invoicePreviewTax').textContent = money(tax);
      $('#invoicePreviewTotal').textContent = money(total);
      const currency = $('#invoiceCurrency')?.value || 'USD';
      $$('.invoice-currency').forEach(element => { element.textContent = currency; });
      $('#invoicePreviewNumber').textContent = $('#invoiceNumber')?.value || 'INV-001';
      $('#invoicePreviewType').textContent = $('#invoiceType')?.value || 'INVOICE';
      $('#invoicePreviewDate').textContent = $('#invoiceDate')?.value || new Date().toISOString().slice(0, 10);
      $('#invoicePreviewSender').textContent = $('#invoiceSenderName')?.value || 'Your business name';
      $('#invoicePreviewSenderDetails').textContent = [$('#invoiceSenderEmail')?.value, $('#invoiceSenderAddress')?.value].filter(Boolean).join(' · ') || 'Your contact details';
      $('#invoicePreviewClient').textContent = $('#invoiceClientName')?.value || 'Client name';
      $('#invoicePreviewClientDetails').textContent = [$('#invoiceClientEmail')?.value, $('#invoiceClientAddress')?.value].filter(Boolean).join(' · ') || 'Client contact details';
      const previewRows = $('#invoicePreviewItems');
      previewRows.innerHTML = '';
      $$('.invoice-item', rows).forEach(row => {
        const name = $('.invoice-name', row).value.trim();
        if (!name && !number($('.invoice-price', row).value)) return;
        const tr = document.createElement('tr');
        [name || 'Item', $('.invoice-qty', row).value || '0', money(number($('.invoice-price', row).value)), money(number($('.invoice-qty', row).value) * number($('.invoice-price', row).value))].forEach(value => {
          const cell = document.createElement('td');
          cell.className = 'border-b border-slate-200 px-3 py-2';
          cell.textContent = value;
          tr.appendChild(cell);
        });
        previewRows.appendChild(tr);
      });
    };

    addRow();
    $('#addInvoiceItem')?.addEventListener('click', () => {
      addRow();
      markDirty();
    });
    ['invoiceDiscount', 'invoiceTax', 'invoiceCurrency', 'invoiceNumber', 'invoiceDate', 'invoiceSenderName', 'invoiceSenderEmail', 'invoiceSenderAddress', 'invoiceClientName', 'invoiceClientEmail', 'invoiceClientAddress'].forEach(id => {
      $(`#${id}`)?.addEventListener('input', () => {
        calculate();
        markDirty();
      });
      $(`#${id}`)?.addEventListener('change', () => {
        calculate();
        markDirty();
      });
    });
    $('#invoiceType')?.addEventListener('change', () => {
      calculate();
      markDirty();
    });
    $('#invoiceDate').value = new Date().toISOString().slice(0, 10);
    $('#generateInvoice')?.addEventListener('click', () => {
      calculate();
      generated = true;
      $('#invoicePreview')?.classList.remove('hidden');
      $('#invoiceTotals')?.classList.remove('hidden');
      $('#downloadInvoicePdf')?.classList.remove('hidden');
      showStatus($('#invoiceStatus'), 'Invoice or receipt generated. You can now download the PDF.');
    });
    $('#downloadInvoicePdf')?.addEventListener('click', () => {
      if (!generated) {
        showStatus($('#invoiceStatus'), 'Generate the invoice or receipt before downloading.', 'rose');
        return;
      }
      calculate();
      const currency = $('#invoiceCurrency')?.value || 'USD';
      const type = $('#invoiceType')?.value || 'INVOICE';
      const invoiceNumber = $('#invoiceNumber')?.value || 'INV-001';
      const date = $('#invoiceDate')?.value || new Date().toISOString().slice(0, 10);
      const sender = $('#invoiceSenderName')?.value || 'Your business name';
      const senderDetails = [$('#invoiceSenderEmail')?.value, $('#invoiceSenderAddress')?.value].filter(Boolean).join(' - ') || 'Your contact details';
      const client = $('#invoiceClientName')?.value || 'Client name';
      const clientDetails = [$('#invoiceClientEmail')?.value, $('#invoiceClientAddress')?.value].filter(Boolean).join(' - ') || 'Client contact details';
      const items = $$('.invoice-item', rows).map(row => ({
        name: $('.invoice-name', row).value.trim() || 'Item',
        quantity: $('.invoice-qty', row).value || '0',
        price: number($('.invoice-price', row).value),
        total: number($('.invoice-qty', row).value) * number($('.invoice-price', row).value)
      })).filter(item => item.name !== 'Item' || item.price);
      const subtotal = $('#invoicePreviewSubtotal')?.textContent || '0.00';
      const discount = $('#invoicePreviewDiscount')?.textContent || '- 0.00';
      const tax = $('#invoicePreviewTax')?.textContent || '0.00';
      const total = $('#invoicePreviewTotal')?.textContent || '0.00';

      const commands = [];
      const text = (font, size, x, y, value, color = '0.06 0.09 0.15') => {
        commands.push(`${color} rg BT /${font} ${size} Tf ${x} ${y} Td (${pdfEscape(value)}) Tj ET`);
      };
      const line = (x1, y1, x2, y2, color = '0.82 0.85 0.89', width = 1) => {
        commands.push(`${color} RG ${width} w ${x1} ${y1} m ${x2} ${y2} l S`);
      };
      const rectangle = (x, y, width, height, color) => {
        commands.push(`${color} rg ${x} ${y} ${width} ${height} re f`);
      };

      rectangle(0, 790, 595, 52, '0.06 0.09 0.15');
      text('F2', 22, 48, 812, 'AfriWidget', '1 1 1');
      text('F1', 10, 48, 797, 'Professional document template', '0.98 0.80 0.08');
      text('F2', 24, 400, 812, type, '0.98 0.80 0.08');
      text('F1', 9, 48, 758, `Document number: ${invoiceNumber}`, '0.29 0.35 0.42');
      text('F1', 9, 400, 758, `Date: ${date}`, '0.29 0.35 0.42');
      line(48, 746, 547, 746, '0.98 0.80 0.08', 3);

      text('F2', 9, 48, 710, 'FROM', '0.63 0.39 0.02');
      text('F2', 12, 48, 692, sender);
      wrapPdfText(senderDetails, 39).slice(0, 2).forEach((value, index) => text('F1', 9, 48, 676 - index * 13, value, '0.29 0.35 0.42'));
      text('F2', 9, 325, 710, 'BILL TO', '0.63 0.39 0.02');
      text('F2', 12, 325, 692, client);
      wrapPdfText(clientDetails, 39).slice(0, 2).forEach((value, index) => text('F1', 9, 325, 676 - index * 13, value, '0.29 0.35 0.42'));

      rectangle(48, 606, 499, 28, '0.94 0.96 0.97');
      text('F2', 9, 58, 616, 'ITEM / SERVICE');
      text('F2', 9, 340, 616, 'QTY');
      text('F2', 9, 405, 616, 'UNIT PRICE');
      text('F2', 9, 490, 616, 'TOTAL');
      let y = 586;
      items.slice(0, 14).forEach(item => {
        const itemLines = wrapPdfText(item.name, 39).slice(0, 2);
        text('F1', 9, 58, y, itemLines[0]);
        if (itemLines[1]) text('F1', 9, 58, y - 12, itemLines[1], '0.29 0.35 0.42');
        text('F1', 9, 340, y, item.quantity);
        text('F1', 9, 405, y, `${currency} ${money(item.price)}`);
        text('F1', 9, 490, y, `${currency} ${money(item.total)}`);
        line(48, y - 14, 547, y - 14);
        y -= itemLines.length > 1 ? 32 : 25;
      });
      if (!items.length) {
        text('F1', 9, 58, y, 'No line items added');
        line(48, y - 14, 547, y - 14);
        y -= 25;
      }

      const totalsY = Math.max(y - 18, 210);
      text('F1', 10, 365, totalsY, 'Subtotal');
      text('F1', 10, 480, totalsY, `${currency} ${subtotal}`);
      text('F1', 10, 365, totalsY - 22, 'Discount');
      text('F1', 10, 480, totalsY - 22, `${currency} ${discount}`);
      text('F1', 10, 365, totalsY - 44, 'Tax / VAT');
      text('F1', 10, 480, totalsY - 44, `${currency} ${tax}`);
      line(355, totalsY - 56, 547, totalsY - 56, '0.06 0.09 0.15', 1.5);
      text('F2', 13, 365, totalsY - 78, 'TOTAL');
      text('F2', 13, 465, totalsY - 78, `${currency} ${total}`);
      text('F1', 8, 48, 72, 'Created locally with AfriWidget. Please review all details before sending.', '0.58 0.63 0.69');

      showStatus($('#invoiceStatus'), 'Preparing your PDF…');
      const url = pdfDataUrl(makePdf(commands.join('\n')));
      const link = document.createElement('a');
      link.href = url;
      const safeNumber = pdfSafe(invoiceNumber).replace(/[^a-z0-9_-]/gi, '-') || 'invoice';
      link.download = `${safeNumber}-afriwidget-${Date.now()}.pdf`;
      link.rel = 'noopener';
      link.style.cssText = 'position:fixed;left:-9999px;width:1px;height:1px;';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => link.remove(), 60000);
      showStatus($('#invoiceStatus'), 'PDF download started.');
    });
    markDirty();
  }

  function initReadingEstimator() {
    const input = $('#readingText');
    if (!input) return;
    const update = () => {
      const text = input.value;
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const sentences = text.trim() ? (text.match(/[^.!?]+[.!?]+/g) || []).length || 1 : 0;
      const speechRate = number($('#speechRate').value, 130);
      const silentMinutes = words / 225;
      const speechMinutes = words / speechRate;
      $('#readingWords').textContent = words.toLocaleString();
      $('#readingChars').textContent = text.length.toLocaleString();
      $('#readingSentences').textContent = sentences.toLocaleString();
      $('#silentTime').textContent = words ? `${silentMinutes < 1 ? '< 1' : Math.ceil(silentMinutes)} min` : '0 min';
      $('#spokenTime').textContent = words ? `${speechMinutes < 1 ? '< 1' : Math.ceil(speechMinutes)} min` : '0 min';
    };
    input.addEventListener('input', update);
    $('#speechRate').addEventListener('change', update);
    $('#clearReading').addEventListener('click', () => { input.value = ''; update(); input.focus(); });
    update();
  }

  function initCaseConverter() {
    const input = $('#caseInput');
    if (!input) return;
    const titleCase = value => value.toLowerCase().replace(/\b\w/g, character => character.toUpperCase());
    const sentenceCase = value => value.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, match => match.toUpperCase());
    const camelCase = value => {
      const parts = value.toLowerCase().trim().split(/[^a-z0-9]+/i).filter(Boolean);
      return parts.map((part, index) => index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)).join('');
    };
    const slugify = value => value.toLowerCase().trim().replace(/<[^>]*>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const actions = {
      uppercase: value => value.toUpperCase(),
      lowercase: value => value.toLowerCase(),
      titlecase: titleCase,
      sentencecase: sentenceCase,
      camelcase: camelCase,
      slugify
    };
    $$('.case-action').forEach(button => button.addEventListener('click', () => {
      input.value = actions[button.dataset.action](input.value);
      input.dispatchEvent(new Event('input'));
    }));
    $('#removeSpaces').addEventListener('click', () => { input.value = input.value.replace(/[ \t]+/g, ' ').trim(); input.dispatchEvent(new Event('input')); });
    $('#removeBreaks').addEventListener('click', () => { input.value = input.value.replace(/\s*\r?\n\s*/g, ' ').replace(/ {2,}/g, ' ').trim(); input.dispatchEvent(new Event('input')); });
    $('#stripHtml').addEventListener('click', () => { const box = document.createElement('div'); box.innerHTML = input.value; input.value = box.textContent || ''; input.dispatchEvent(new Event('input')); });
    $('#removeDuplicateLines').addEventListener('click', () => {
      input.value = [...new Set(input.value.split(/\r?\n/))].join('\n');
      input.dispatchEvent(new Event('input'));
    });
    $('#copyCaseText').addEventListener('click', async () => {
      const copied = await copyText(input.value);
      showStatus($('#caseStatus'), copied ? 'Text copied to clipboard.' : 'Copy failed. Select the text manually.', copied ? 'teal' : 'rose');
    });
    $('#clearCase').addEventListener('click', () => { input.value = ''; input.dispatchEvent(new Event('input')); });
    const update = () => {
      $('#caseChars').textContent = input.value.length.toLocaleString();
      $('#caseWords').textContent = input.value.trim() ? input.value.trim().split(/\s+/).length.toLocaleString() : '0';
    };
    input.addEventListener('input', update);
    update();
  }

  function initImageResizer() {
    const fileInput = $('#imageFile');
    if (!fileInput) return;
    const canvas = $('#imageCanvas');
    const context = canvas.getContext('2d');
    let sourceImage = null;
    let originalWidth = 0;
    let originalHeight = 0;
    let fileBase = 'resized-image';
    const setStatus = (message, tone = 'teal') => showStatus($('#imageStatus'), message, tone);
    const updateHeight = () => {
      if ($('#lockRatio').checked && originalWidth) {
        $('#imageHeight').value = Math.max(1, Math.round(number($('#imageWidth').value, originalWidth) * originalHeight / originalWidth));
      }
    };
    const draw = () => {
      if (!sourceImage) return;
      const width = Math.max(1, Math.round(number($('#imageWidth').value, originalWidth)));
      const height = Math.max(1, Math.round(number($('#imageHeight').value, originalHeight)));
      canvas.width = width;
      canvas.height = height;
      context.clearRect(0, 0, width, height);
      context.drawImage(sourceImage, 0, 0, width, height);
      $('#imageDimensions').textContent = `${width} × ${height}px`;
      $('#downloadImage').disabled = false;
    };
    const loadFile = file => {
      if (!file || !file.type.startsWith('image/')) {
        setStatus('Please choose a valid image file.', 'rose');
        return;
      }
      fileBase = file.name.replace(/\.[^.]+$/, '') || 'resized-image';
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        sourceImage = image;
        originalWidth = image.naturalWidth;
        originalHeight = image.naturalHeight;
        $('#imageWidth').value = originalWidth;
        $('#imageHeight').value = originalHeight;
        $('#imagePreview').src = url;
        $('#imagePreview').classList.remove('hidden');
        $('#imageDropzone').classList.add('hidden');
        $('#imageControls').classList.remove('hidden');
        $('#imageOriginalDimensions').textContent = `${originalWidth} × ${originalHeight}px`;
        setStatus('Image loaded locally. Nothing was uploaded.');
        draw();
      };
      image.onerror = () => setStatus('That image could not be read in this browser.', 'rose');
      image.src = url;
    };
    fileInput.addEventListener('change', () => loadFile(fileInput.files[0]));
    const dropzone = $('#imageDropzone');
    ['dragenter', 'dragover'].forEach(event => dropzone.addEventListener(event, e => { e.preventDefault(); dropzone.classList.add('border-teal-500', 'bg-teal-50'); }));
    ['dragleave', 'drop'].forEach(event => dropzone.addEventListener(event, e => { e.preventDefault(); dropzone.classList.remove('border-teal-500', 'bg-teal-50'); }));
    dropzone.addEventListener('drop', e => loadFile(e.dataTransfer.files[0]));
    $('#imageWidth').addEventListener('input', () => { updateHeight(); draw(); });
    $('#imageHeight').addEventListener('input', draw);
    $('#lockRatio').addEventListener('change', updateHeight);
    $('#imageFormat').addEventListener('change', draw);
    $('#imageQuality').addEventListener('input', () => { $('#qualityValue').textContent = `${$('#imageQuality').value}%`; });
    $('#downloadImage').addEventListener('click', () => {
      if (!sourceImage) return;
      draw();
      const format = $('#imageFormat').value;
      const quality = number($('#imageQuality').value, 85) / 100;
      const mime = format === 'jpg' ? 'image/jpeg' : `image/${format}`;
      const link = document.createElement('a');
      link.download = `${fileBase}-${$('#imageWidth').value}x${$('#imageHeight').value}.${format}`;
      link.href = canvas.toDataURL(mime, quality);
      link.click();
      setStatus(`${format.toUpperCase()} download started.`);
    });
  }

  function initWhatsappQr() {
    const phone = $('#whatsappPhone');
    if (!phone) return;
    const generate = () => {
      const code = $('#countryCode').value;
      const digits = phone.value.replace(/\D/g, '');
      const message = $('#whatsappMessage').value.trim();
      const link = digits ? `https://wa.me/${code.replace('+', '')}${digits}${message ? `?text=${encodeURIComponent(message)}` : ''}` : '';
      $('#whatsappUrl').value = link;
      $('#whatsappChat').href = link || '#';
      $('#whatsappChat').classList.toggle('pointer-events-none', !link);
      $('#whatsappChat').classList.toggle('opacity-50', !link);
      const qr = $('#whatsappQr');
      qr.innerHTML = '';
      if (!link) {
        $('#whatsappOutput').classList.add('hidden');
        return;
      }
      $('#whatsappOutput').classList.remove('hidden');
      const qrLib = window.QRCode || window.qrcode;
      if (qrLib) {
        if (typeof qrLib.toCanvas === 'function') {
          const canvas = document.createElement('canvas');
          canvas.width = 220;
          canvas.height = 220;
          qr.appendChild(canvas);
          qrLib.toCanvas(canvas, link, { width: 220, margin: 2, color: { dark: '#0f172a', light: '#ffffff' } }, function (err) {
            if (err) console.error('QR generation error:', err);
          });
        } else if (typeof qrLib === 'function') {
          new qrLib(qr, { text: link, width: 220, height: 220, colorDark: '#0f172a', colorLight: '#ffffff' });
        }
      }
    };
    [phone, $('#countryCode'), $('#whatsappMessage')].forEach(input => input.addEventListener('input', generate));
    $('#countryCode').addEventListener('change', generate);
    $('#generateWhatsapp').addEventListener('click', () => {
      if (!phone.value.replace(/\D/g, '')) {
        showStatus($('#whatsappStatus'), 'Enter a phone number first.', 'rose');
        return;
      }
      generate();
      showStatus($('#whatsappStatus'), 'WhatsApp link generated.');
    });
    $('#copyWhatsapp').addEventListener('click', async () => {
      if (!$('#whatsappUrl').value) return;
      const copied = await copyText($('#whatsappUrl').value);
      showStatus($('#whatsappStatus'), copied ? 'Link copied to clipboard.' : 'Copy failed. Select the link manually.', copied ? 'teal' : 'rose');
    });
    $('#downloadQr').addEventListener('click', () => {
      const qrCanvas = $('#whatsappQr canvas');
      if (!qrCanvas) {
        showStatus($('#whatsappStatus'), 'Generate a link before downloading the QR code.', 'rose');
        return;
      }
      const link = document.createElement('a');
      link.download = 'whatsapp-qr-code.png';
      link.href = qrCanvas.toDataURL('image/png');
      link.click();
    });
    generate();
  }

  onReady(() => {
    const menuButton = $('#mobileMenuBtn');
    const menu = $('#mobileMenu');
    if (menuButton && menu) menuButton.addEventListener('click', () => menu.classList.toggle('open'));
    initInvoiceGenerator();
    initReadingEstimator();
    initCaseConverter();
    initImageResizer();
    initWhatsappQr();
  });
})();