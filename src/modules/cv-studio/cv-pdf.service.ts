import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { CandidateProfile } from './cv.types';

function escapeHtml(value?: string | null): string {
  if (!value) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Generates escaped, ATS-compliant A4 HTML aligned with CvDocumentPreview styling.
 */
export function generateResumeHtml(profile: CandidateProfile): string {
  const contacts = [
    profile.location,
    profile.contact?.phone,
    profile.contact?.email,
    profile.contact?.linkedin,
    profile.contact?.github,
    profile.contact?.portfolio,
  ]
    .filter(Boolean)
    .map(c => escapeHtml(c));

  const hardOrFallbackSkills =
    profile.hardSkills && profile.hardSkills.length > 0
      ? profile.hardSkills
      : profile.skills || [];

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(profile.fullName || 'Candidate')} - Resume</title>
  <style>
    @page {
      size: A4;
      margin: 14mm 16mm;
    }
    * {
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #121212;
      background: #FFFFFF;
      margin: 0;
      padding: 0;
      line-height: 1.45;
      font-size: 10pt;
    }
    .header {
      text-align: center;
      margin-bottom: 14px;
    }
    .name {
      font-size: 18pt;
      font-weight: 800;
      letter-spacing: 0.4px;
      margin: 0 0 4px 0;
      color: #121212;
    }
    .headline {
      font-size: 10.5pt;
      font-weight: 700;
      color: #2F4F00;
      margin: 0 0 5px 0;
    }
    .contacts {
      font-size: 8.5pt;
      color: #4B5563;
    }
    .section {
      margin-top: 13px;
    }
    .section-title {
      font-size: 9.5pt;
      font-weight: 800;
      letter-spacing: 0.7px;
      border-bottom: 1px solid #121212;
      padding-bottom: 3px;
      margin: 0 0 7px 0;
      text-transform: uppercase;
      color: #121212;
    }
    .entry-block {
      margin-bottom: 8px;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .row-split {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 12px;
    }
    .role-title {
      font-weight: 700;
      font-size: 9.5pt;
      color: #121212;
    }
    .period {
      font-size: 8.5pt;
      color: #4B5563;
      font-weight: 600;
      white-space: nowrap;
    }
    .subtitle {
      font-size: 8.5pt;
      font-weight: 700;
      color: #2F4F00;
      margin-bottom: 3px;
    }
    .meta-note {
      font-size: 8pt;
      color: #4B5563;
      margin-bottom: 3px;
    }
    .summary-copy {
      font-size: 9pt;
      color: #2C3028;
    }
    ul {
      margin: 3px 0 6px 0;
      padding-left: 18px;
    }
    li {
      font-size: 8.5pt;
      color: #2C3028;
      margin-bottom: 2px;
      line-height: 1.4;
    }
    .skills-row {
      font-size: 8.5pt;
      margin-bottom: 4px;
      line-height: 1.4;
      color: #2C3028;
    }
    .skills-label {
      font-weight: 700;
      color: #121212;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="name">${escapeHtml(profile.fullName)}</h1>
    <div class="headline">${escapeHtml(profile.headline)}</div>
    <div class="contacts">${contacts.join(' &nbsp;|&nbsp; ')}</div>
  </div>

  ${profile.summary ? `
  <div class="section">
    <div class="section-title">Professional Summary</div>
    <div class="summary-copy">${escapeHtml(profile.summary)}</div>
  </div>` : ''}

  ${(hardOrFallbackSkills.length > 0 || (profile.softSkills?.length ?? 0) > 0) ? `
  <div class="section">
    <div class="section-title">Technical &amp; Professional Skills</div>
    ${hardOrFallbackSkills.length > 0 ? `
      <div class="skills-row"><span class="skills-label">Core &amp; Technical Skills:</span> ${hardOrFallbackSkills.map(s => escapeHtml(s)).join(', ')}</div>
    ` : ''}
    ${profile.softSkills && profile.softSkills.length > 0 ? `
      <div class="skills-row"><span class="skills-label">Leadership &amp; Soft Skills:</span> ${profile.softSkills.map(s => escapeHtml(s)).join(', ')}</div>
    ` : ''}
  </div>` : ''}

  ${profile.experiences && profile.experiences.length > 0 ? `
  <div class="section">
    <div class="section-title">Work Experience</div>
    ${profile.experiences.map(e => `
      <div class="entry-block">
        <div class="row-split">
          <span class="role-title">${escapeHtml(e.role)}</span>
          <span class="period">${escapeHtml(e.period)}</span>
        </div>
        <div class="row-split">
          <span class="subtitle">${escapeHtml(e.company)}</span>
          <span class="period">${escapeHtml(e.location)}</span>
        </div>
        ${e.highlights && e.highlights.length > 0 ? `
          <ul>
            ${e.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${profile.projects && profile.projects.length > 0 ? `
  <div class="section">
    <div class="section-title">Projects</div>
    ${profile.projects.map(p => `
      <div class="entry-block">
        <div class="row-split">
          <span class="role-title">${escapeHtml(p.name)}</span>
          <span class="period">${escapeHtml(p.period)}</span>
        </div>
        <div class="subtitle">${escapeHtml(p.role)}</div>
        ${p.techStack && p.techStack.length > 0 ? `
          <div class="meta-note">Tools &amp; Stack: ${p.techStack.map(t => escapeHtml(t)).join(', ')}</div>
        ` : ''}
        ${p.highlights && p.highlights.length > 0 ? `
          <ul>
            ${p.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
          </ul>
        ` : (p.overview || p.description) ? `<div class="summary-copy">${escapeHtml(p.overview || p.description)}</div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${profile.organizations && profile.organizations.length > 0 ? `
  <div class="section">
    <div class="section-title">Leadership &amp; Organizations</div>
    ${profile.organizations.map(o => `
      <div class="entry-block">
        <div class="row-split">
          <span class="role-title">${escapeHtml(o.role)}</span>
          <span class="period">${escapeHtml(o.period)}</span>
        </div>
        <div class="subtitle">${escapeHtml(o.organization)}</div>
        ${o.highlights && o.highlights.length > 0 ? `
          <ul>
            ${o.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
          </ul>
        ` : o.description ? `<div class="summary-copy">${escapeHtml(o.description)}</div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${profile.education && profile.education.length > 0 ? `
  <div class="section">
    <div class="section-title">Education</div>
    ${profile.education.map(ed => `
      <div class="entry-block">
        <div class="row-split">
          <span class="role-title">${escapeHtml(ed.degree)}${ed.field ? `, ${escapeHtml(ed.field)}` : ''}</span>
          <span class="period">${escapeHtml(ed.year)}</span>
        </div>
        <div class="row-split">
          <span class="subtitle">${escapeHtml(ed.school)}</span>
          <span class="period">${ed.gpa ? `GPA: ${escapeHtml(ed.gpa)}` : ''}</span>
        </div>
        ${ed.highlights && ed.highlights.length > 0 ? `
          <ul>
            ${ed.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${profile.certifications && profile.certifications.length > 0 ? `
  <div class="section">
    <div class="section-title">Certifications</div>
    <ul>
      ${profile.certifications.map(c => `
        <li><strong>${escapeHtml(c.name)}</strong> - ${escapeHtml(c.issuer)} (${escapeHtml(c.issueDate)})</li>
      `).join('')}
    </ul>
  </div>` : ''}
</body>
</html>
  `.trim();
}

/**
 * Fallback print stylesheet when iframe printing is unavailable on Web.
 */
export function ensureWebPrintStyles(): void {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  const styleId = 'jobhub-ats-print-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      @media print {
        @page {
          size: A4;
          margin: 14mm 16mm;
        }
        html, body {
          background: #ffffff !important;
          color: #000000 !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        body > * {
          visibility: hidden !important;
        }
        #ats-cv-paper, #ats-cv-paper * {
          visibility: visible !important;
        }
        #ats-cv-paper {
          position: static !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          border: none !important;
          box-shadow: none !important;
          elevation: 0 !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

function printHtmlViaHiddenIframe(html: string): boolean {
  if (typeof document === 'undefined' || typeof window === 'undefined') return false;
  try {
    const existing = document.getElementById('jobhub-print-frame');
    if (existing?.parentNode) {
      existing.parentNode.removeChild(existing);
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'jobhub-print-frame';
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const frameDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!frameDoc || !iframe.contentWindow) {
      document.body.removeChild(iframe);
      return false;
    }

    frameDoc.open();
    frameDoc.write(html);
    frameDoc.close();

    const frameWindow = iframe.contentWindow;
    setTimeout(() => {
      try {
        frameWindow.focus();
        frameWindow.print();
      } finally {
        setTimeout(() => {
          if (iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
          }
        }, 1200);
      }
    }, 60);

    return true;
  } catch {
    return false;
  }
}

async function createScopedPdfFile(profile: CandidateProfile): Promise<string> {
  const html = generateResumeHtml(profile);
  const { uri, base64 } = await Print.printToFileAsync({ html, base64: true });

  const cleanFilename = `${(profile.fullName || 'Candidate').replace(/[^a-zA-Z0-9_-]+/g, '_')}_Resume.pdf`;
  const baseDir = (FileSystem.cacheDirectory || FileSystem.documentDirectory || '').replace(/\/?$/, '/');
  const targetUri = `${baseDir}${cleanFilename}`;

  try {
    const fileInfo = await FileSystem.getInfoAsync(targetUri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(targetUri, { idempotent: true });
    }
  } catch {
    // Ignore cleanup errors
  }

  if (base64) {
    await FileSystem.writeAsStringAsync(targetUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
  } else {
    await FileSystem.copyAsync({
      from: uri,
      to: targetUri,
    });
  }

  return targetUri;
}

export async function exportResumePdf(profile: CandidateProfile): Promise<boolean> {
  if (Platform.OS === 'web') {
    const html = generateResumeHtml(profile);
    if (!printHtmlViaHiddenIframe(html)) {
      ensureWebPrintStyles();
      if (typeof window !== 'undefined') {
        window.print();
      }
    }
    return true;
  }

  try {
    const pdfUri = await createScopedPdfFile(profile);
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(pdfUri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
        dialogTitle: `Export ${profile.fullName}'s Resume PDF`,
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to export PDF:', error);
    return false;
  }
}

export async function shareResumePdf(profile: CandidateProfile): Promise<boolean> {
  return exportResumePdf(profile);
}
