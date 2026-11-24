import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { CandidateProfile } from './cv.types';

/**
 * Generates clean, ATS-compliant HTML for PDF generation according to official Expo docs.
 */
export function generateResumeHtml(profile: CandidateProfile): string {
  const contacts = [
    profile.location,
    profile.contact?.phone,
    profile.contact?.email,
    profile.contact?.linkedin,
    profile.contact?.github,
  ].filter(Boolean);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${profile.fullName} - Resume</title>
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
      letter-spacing: 0.5px;
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
      color: #555555;
    }
    .section {
      margin-top: 13px;
    }
    .section-title {
      font-size: 9.5pt;
      font-weight: 800;
      letter-spacing: 0.6px;
      border-bottom: 1.5px solid #D8DEC9;
      padding-bottom: 3px;
      margin: 0 0 6px 0;
      text-transform: uppercase;
      color: #121212;
    }
    .row-split {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .role-title {
      font-weight: 700;
      font-size: 9.5pt;
      color: #121212;
    }
    .period {
      font-size: 8.5pt;
      color: #555555;
      font-weight: 500;
    }
    .subtitle {
      font-size: 8.5pt;
      font-weight: 700;
      color: #2F4F00;
      margin-bottom: 3px;
    }
    ul {
      margin: 3px 0 7px 0;
      padding-left: 18px;
    }
    li {
      font-size: 8.5pt;
      color: #2B2E28;
      margin-bottom: 2px;
      line-height: 1.4;
    }
    .skills-row {
      font-size: 8.5pt;
      margin-bottom: 4px;
      line-height: 1.4;
    }
    .skills-label {
      font-weight: 700;
      color: #121212;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="name">${profile.fullName}</h1>
    <div class="headline">${profile.headline}</div>
    <div class="contacts">${contacts.join(' &nbsp;|&nbsp; ')}</div>
  </div>

  ${profile.summary ? `
  <div class="section">
    <div class="section-title">Professional Summary</div>
    <div style="font-size: 9pt; color: #2B2E28;">${profile.summary}</div>
  </div>` : ''}

  ${(profile.hardSkills?.length > 0 || profile.softSkills?.length > 0 || (profile.skills && profile.skills.length > 0)) ? `
  <div class="section">
    <div class="section-title">Technical & Professional Skills</div>
    ${(profile.hardSkills && profile.hardSkills.length > 0) ? `
      <div class="skills-row"><span class="skills-label">Technical Skills:</span> ${profile.hardSkills.join(', ')}</div>
    ` : (profile.skills && profile.skills.length > 0) ? `
      <div class="skills-row"><span class="skills-label">Technical Skills:</span> ${profile.skills.join(', ')}</div>
    ` : ''}
    ${(profile.softSkills && profile.softSkills.length > 0) ? `
      <div class="skills-row"><span class="skills-label">Soft Skills:</span> ${profile.softSkills.join(', ')}</div>
    ` : ''}
  </div>` : ''}

  ${profile.experiences && profile.experiences.length > 0 ? `
  <div class="section">
    <div class="section-title">Work Experience</div>
    ${profile.experiences.map(e => `
      <div style="margin-bottom: 8px;">
        <div class="row-split">
          <span class="role-title">${e.role}</span>
          <span class="period">${e.period}</span>
        </div>
        <div class="row-split">
          <span class="subtitle">${e.company}</span>
          <span class="period">${e.location || ''}</span>
        </div>
        ${e.highlights && e.highlights.length > 0 ? `
          <ul>
            ${e.highlights.map(h => `<li>${h}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${profile.projects && profile.projects.length > 0 ? `
  <div class="section">
    <div class="section-title">Projects</div>
    ${profile.projects.map(p => `
      <div style="margin-bottom: 8px;">
        <div class="row-split">
          <span class="role-title">${p.name}</span>
          <span class="period">${p.period}</span>
        </div>
        <div class="subtitle">${p.role}</div>
        ${p.techStack && p.techStack.length > 0 ? `
          <div style="font-size: 8pt; color: #555; margin-bottom: 2px;">Technologies: ${p.techStack.join(', ')}</div>
        ` : ''}
        ${p.highlights && p.highlights.length > 0 ? `
          <ul>
            ${p.highlights.map(h => `<li>${h}</li>`).join('')}
          </ul>
        ` : p.overview ? `<div style="font-size: 8.5pt; color: #444;">${p.overview}</div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${profile.organizations && profile.organizations.length > 0 ? `
  <div class="section">
    <div class="section-title">Leadership & Organizations</div>
    ${profile.organizations.map(o => `
      <div style="margin-bottom: 8px;">
        <div class="row-split">
          <span class="role-title">${o.role}</span>
          <span class="period">${o.period}</span>
        </div>
        <div class="subtitle">${o.organization}</div>
        ${o.highlights && o.highlights.length > 0 ? `
          <ul>
            ${o.highlights.map(h => `<li>${h}</li>`).join('')}
          </ul>
        ` : o.description ? `<div style="font-size: 8.5pt; color: #444;">${o.description}</div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${profile.education && profile.education.length > 0 ? `
  <div class="section">
    <div class="section-title">Education</div>
    ${profile.education.map(ed => `
      <div style="margin-bottom: 8px;">
        <div class="row-split">
          <span class="role-title">${ed.degree}${ed.field ? `, ${ed.field}` : ''}</span>
          <span class="period">${ed.year}</span>
        </div>
        <div class="row-split">
          <span class="subtitle">${ed.school}</span>
          <span class="period">${ed.gpa ? `GPA: ${ed.gpa}` : ''}</span>
        </div>
        ${ed.highlights && ed.highlights.length > 0 ? `
          <ul>
            ${ed.highlights.map(h => `<li>${h}</li>`).join('')}
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
        <li><strong>${c.name}</strong> - ${c.issuer} (${c.issueDate})</li>
      `).join('')}
    </ul>
  </div>` : ''}
</body>
</html>
  `.trim();
}

/**
 * Injects print stylesheet for Web platform so only the clean ATS paper sheet is printed.
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
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
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

/**
 * Compiles a real .pdf file and safely stores it within the app's permitted scoped cache directory,
 * guaranteeing that ExpoSharing.shareAsync has explicit read permissions on Android & iOS.
 */
async function createScopedPdfFile(profile: CandidateProfile): Promise<string> {
  const html = generateResumeHtml(profile);
  // Request base64 output so we can directly write into the permitted scoped directory
  const { uri, base64 } = await Print.printToFileAsync({ html, base64: true });

  const cleanFilename = `${(profile.fullName || 'Candidate').replace(/\s+/g, '_')}_Resume.pdf`;
  const baseDir = (FileSystem.cacheDirectory || FileSystem.documentDirectory || '').replace(/\/?$/, '/');
  const targetUri = `${baseDir}${cleanFilename}`;

  try {
    const fileInfo = await FileSystem.getInfoAsync(targetUri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(targetUri, { idempotent: true });
    }
  } catch {
    // Ignore cleanup error
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

/**
 * Exports the resume as a real PDF file.
 * - On Native (Android / iOS): Compiles .pdf and saves/shares via expo-sharing from permitted scoped cache directory.
 * - On Web: Uses window.print() (which opens the browser's "Save as PDF" dialog with pure ATS layout).
 */
export async function exportResumePdf(profile: CandidateProfile): Promise<boolean> {
  if (Platform.OS === 'web') {
    ensureWebPrintStyles();
    if (typeof window !== 'undefined') {
      window.print();
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

/**
 * Shares the resume as a real PDF file.
 * - On Native (Android / iOS): Compiles .pdf and shares via expo-sharing from permitted scoped cache directory.
 * - On Web: Uses window.print().
 */
export async function shareResumePdf(profile: CandidateProfile): Promise<boolean> {
  if (Platform.OS === 'web') {
    ensureWebPrintStyles();
    if (typeof window !== 'undefined') {
      window.print();
    }
    return true;
  }

  try {
    const pdfUri = await createScopedPdfFile(profile);
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(pdfUri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
        dialogTitle: `Share ${profile.fullName}'s Resume PDF`,
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to share PDF:', error);
    return false;
  }
}
