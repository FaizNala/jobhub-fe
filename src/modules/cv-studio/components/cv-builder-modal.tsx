import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  X,
  Plus,
  Trash2,
  Pencil,
  Check,
  User,
  Briefcase,
  Cpu,
  GraduationCap,
  Users2,
  Award,
  ArrowRight,
  ChevronLeft,
  ExternalLink,
} from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';
import { Heading, Body, Label } from '@/components/atoms/typography';
import {
  CandidateProfile,
  UpdateProfileDto,
  WorkExperience,
  ProjectItem,
  OrganizationItem,
  Education,
  CertificationItem,
} from '../cv.types';

export interface CvBuilderModalProps {
  visible: boolean;
  profile: CandidateProfile | null;
  onClose: () => void;
  onSave: (dto: UpdateProfileDto) => Promise<void>;
}

export type TabKey =
  | 'identity'
  | 'skills'
  | 'experience'
  | 'projects'
  | 'education'
  | 'organizations'
  | 'certifications';

interface StepDefinition {
  id: TabKey;
  stepNumber: number;
  label: string;
  fullTitle: string;
  description: string;
}

const STEPS: StepDefinition[] = [
  {
    id: 'identity',
    stepNumber: 1,
    label: 'Contact',
    fullTitle: 'Contact & Pitch',
    description: 'Personal identity, verified contacts, and executive summary.',
  },
  {
    id: 'skills',
    stepNumber: 2,
    label: 'Skills',
    fullTitle: 'Core & Soft Skills',
    description: 'Domain tools, specialized competencies, and leadership strengths.',
  },
  {
    id: 'experience',
    stepNumber: 3,
    label: 'Experience',
    fullTitle: 'Work Experience',
    description: 'Career positions with measurable outcomes and responsibilities.',
  },
  {
    id: 'projects',
    stepNumber: 4,
    label: 'Projects',
    fullTitle: 'Featured Projects',
    description: 'Key initiatives, portfolios, and notable deliverables.',
  },
  {
    id: 'education',
    stepNumber: 5,
    label: 'Education',
    fullTitle: 'Formal Education',
    description: 'Academic degrees, institutions, and honors.',
  },
  {
    id: 'organizations',
    stepNumber: 6,
    label: 'Community',
    fullTitle: 'Leadership & Community',
    description: 'Extracurricular leadership, volunteering, and professional groups.',
  },
  {
    id: 'certifications',
    stepNumber: 7,
    label: 'Certs',
    fullTitle: 'Certifications',
    description: 'Professional credentials, licenses, and verified courses.',
  },
];

type EditingMode =
  | { type: 'experience'; id?: string }
  | { type: 'project'; id?: string }
  | { type: 'education'; id?: string }
  | { type: 'organization'; id?: string }
  | { type: 'certification'; id?: string }
  | null;

export const CvBuilderModal: React.FC<CvBuilderModalProps> = ({
  visible,
  profile,
  onClose,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('identity');
  const [editingMode, setEditingMode] = useState<EditingMode>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // 1. Identity & Contacts
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [summary, setSummary] = useState('');

  // 2. Skills
  const [hardSkills, setHardSkills] = useState<string[]>([]);
  const [newHardSkill, setNewHardSkill] = useState('');
  const [softSkills, setSoftSkills] = useState<string[]>([]);
  const [newSoftSkill, setNewSoftSkill] = useState('');

  // 3. Work Experiences
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [expRole, setExpRole] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expPeriod, setExpPeriod] = useState('');
  const [expLocation, setExpLocation] = useState('');
  const [expBullets, setExpBullets] = useState<string[]>([]);
  const [newBulletText, setNewBulletText] = useState('');

  // 4. Projects
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [projName, setProjName] = useState('');
  const [projRole, setProjRole] = useState('');
  const [projPeriod, setProjPeriod] = useState('');
  const [projUrl, setProjUrl] = useState('');
  const [projStack, setProjStack] = useState<string[]>([]);
  const [newStackTag, setNewStackTag] = useState('');
  const [projBullets, setProjBullets] = useState<string[]>([]);
  const [newProjBulletText, setNewProjBulletText] = useState('');

  // 5. Education
  const [education, setEducation] = useState<Education[]>([]);
  const [eduSchool, setEduSchool] = useState('');
  const [eduDegree, setEduDegree] = useState('');
  const [eduField, setEduField] = useState('');
  const [eduYear, setEduYear] = useState('');
  const [eduGpa, setEduGpa] = useState('');
  const [eduBullets, setEduBullets] = useState<string[]>([]);
  const [newEduBulletText, setNewEduBulletText] = useState('');

  // 6. Organizations
  const [organizations, setOrganizations] = useState<OrganizationItem[]>([]);
  const [orgName, setOrgName] = useState('');
  const [orgRole, setOrgRole] = useState('');
  const [orgPeriod, setOrgPeriod] = useState('');
  const [orgDesc, setOrgDesc] = useState('');
  const [orgBullets, setOrgBullets] = useState<string[]>([]);
  const [newOrgBulletText, setNewOrgBulletText] = useState('');

  // 7. Certifications
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [certName, setCertName] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certDate, setCertDate] = useState('');
  const [certUrl, setCertUrl] = useState('');

  // Load profile data on open
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setHeadline(profile.headline || '');
      setLocation(profile.location || '');
      setEmail(profile.contact?.email || '');
      setPhone(profile.contact?.phone || '');
      setPortfolio(profile.contact?.portfolio || '');
      setGithub(profile.contact?.github || '');
      setLinkedin(profile.contact?.linkedin || '');
      setSummary(profile.summary || '');
      setHardSkills(profile.hardSkills || profile.skills || []);
      setSoftSkills(profile.softSkills || []);
      setExperiences(profile.experiences || []);
      setProjects(profile.projects || []);
      setEducation(profile.education || []);
      setOrganizations(profile.organizations || []);
      setCertifications(profile.certifications || []);
      setEditingMode(null);
      setFormError(null);
    }
  }, [profile, visible]);

  useEffect(() => {
    if (Platform.OS !== 'web' || !visible) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (editingMode) {
          setEditingMode(null);
          setFormError(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [editingMode, onClose, visible]);

  // Stepper state
  const currentStepIndex = STEPS.findIndex(s => s.id === activeTab);
  const currentStep = currentStepIndex >= 0 ? STEPS[currentStepIndex] : STEPS[0];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;
  const nextStep = !isLastStep ? STEPS[currentStepIndex + 1] : null;

  const handleNextStep = () => {
    setFormError(null);
    if (!isLastStep) {
      Haptics.selectionAsync().catch(() => {});
      setEditingMode(null);
      setActiveTab(STEPS[currentStepIndex + 1].id);
    } else {
      handleSave();
    }
  };

  const handlePrevStep = () => {
    setFormError(null);
    if (!isFirstStep) {
      Haptics.selectionAsync().catch(() => {});
      setEditingMode(null);
      setActiveTab(STEPS[currentStepIndex - 1].id);
    }
  };

  const handleSelectStep = (tabId: TabKey) => {
    Haptics.selectionAsync().catch(() => {});
    setFormError(null);
    setEditingMode(null);
    setActiveTab(tabId);
  };

  const getBadgeCount = (id: TabKey): number | undefined => {
    switch (id) {
      case 'skills':
        return hardSkills.length + softSkills.length;
      case 'experience':
        return experiences.length;
      case 'projects':
        return projects.length;
      case 'education':
        return education.length;
      case 'organizations':
        return organizations.length;
      case 'certifications':
        return certifications.length;
      default:
        return undefined;
    }
  };

  // Skill Handlers
  const handleAddHardSkill = () => {
    const s = newHardSkill.trim();
    if (!s) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (!hardSkills.includes(s)) {
      setHardSkills([...hardSkills, s]);
    }
    setNewHardSkill('');
  };

  const handleRemoveHardSkill = (s: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setHardSkills(hardSkills.filter(x => x !== s));
  };

  const handleAddSoftSkill = () => {
    const s = newSoftSkill.trim();
    if (!s) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (!softSkills.includes(s)) {
      setSoftSkills([...softSkills, s]);
    }
    setNewSoftSkill('');
  };

  const handleRemoveSoftSkill = (s: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setSoftSkills(softSkills.filter(x => x !== s));
  };

  // Experience Handlers
  const handleStartAddExperience = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setExpRole('');
    setExpCompany('');
    setExpPeriod('');
    setExpLocation(location || '');
    setExpBullets([]);
    setNewBulletText('');
    setEditingMode({ type: 'experience' });
  };

  const handleStartEditExperience = (item: WorkExperience) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setExpRole(item.role);
    setExpCompany(item.company);
    setExpPeriod(item.period);
    setExpLocation(item.location || '');
    setExpBullets([...(item.highlights || [])]);
    setNewBulletText('');
    setEditingMode({ type: 'experience', id: item.id });
  };

  const handleSaveExperience = () => {
    if (!expRole.trim() || !expCompany.trim()) {
      setFormError('Please enter both role title and company name.');
      return;
    }
    setFormError(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    const finalBullets =
      expBullets.length > 0
        ? expBullets
        : newBulletText.trim()
        ? [newBulletText.trim()]
        : ['Delivered core role responsibilities and measurable team outcomes.'];

    if (editingMode?.id) {
      setExperiences(
        experiences.map(e =>
          e.id === editingMode.id
            ? {
                ...e,
                role: expRole.trim(),
                company: expCompany.trim(),
                period: expPeriod.trim() || '2024 - Present',
                location: expLocation.trim() || location,
                highlights: finalBullets,
              }
            : e
        )
      );
    } else {
      const newExp: WorkExperience = {
        id: `exp-${Date.now()}`,
        role: expRole.trim(),
        company: expCompany.trim(),
        period: expPeriod.trim() || '2024 - Present',
        location: expLocation.trim() || location,
        highlights: finalBullets,
      };
      setExperiences([newExp, ...experiences]);
    }
    setEditingMode(null);
  };

  const handleRemoveExperience = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setExperiences(experiences.filter(e => e.id !== id));
  };

  const handleAddExpBullet = () => {
    const b = newBulletText.trim();
    if (!b) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setExpBullets([...expBullets, b]);
    setNewBulletText('');
  };

  const handleRemoveExpBullet = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setExpBullets(expBullets.filter((_, i) => i !== index));
  };

  // Projects Handlers
  const handleStartAddProject = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setProjName('');
    setProjRole('');
    setProjPeriod('');
    setProjUrl('');
    setProjStack([]);
    setNewStackTag('');
    setProjBullets([]);
    setNewProjBulletText('');
    setEditingMode({ type: 'project' });
  };

  const handleStartEditProject = (item: ProjectItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setProjName(item.name);
    setProjRole(item.role);
    setProjPeriod(item.period);
    setProjUrl(item.url || '');
    setProjStack([...(item.techStack || [])]);
    setNewStackTag('');
    setProjBullets([...(item.highlights || [])]);
    setNewProjBulletText('');
    setEditingMode({ type: 'project', id: item.id });
  };

  const handleSaveProject = () => {
    if (!projName.trim() || !projRole.trim()) {
      setFormError('Please enter both project name and your role.');
      return;
    }
    setFormError(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    const finalBullets =
      projBullets.length > 0
        ? projBullets
        : newProjBulletText.trim()
        ? [newProjBulletText.trim()]
        : ['Delivered key project milestones and measurable results.'];

    if (editingMode?.id) {
      setProjects(
        projects.map(p =>
          p.id === editingMode.id
            ? {
                ...p,
                name: projName.trim(),
                role: projRole.trim(),
                period: projPeriod.trim() || '2024',
                url: projUrl.trim() || undefined,
                techStack: projStack,
                overview: p.overview || finalBullets[0],
                highlights: finalBullets,
              }
            : p
        )
      );
    } else {
      const newProj: ProjectItem = {
        id: `proj-${Date.now()}`,
        name: projName.trim(),
        role: projRole.trim(),
        period: projPeriod.trim() || '2024',
        url: projUrl.trim() || undefined,
        techStack: projStack,
        overview: finalBullets[0],
        highlights: finalBullets,
      };
      setProjects([newProj, ...projects]);
    }
    setEditingMode(null);
  };

  const handleRemoveProject = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleAddProjBullet = () => {
    const b = newProjBulletText.trim();
    if (!b) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setProjBullets([...projBullets, b]);
    setNewProjBulletText('');
  };

  const handleRemoveProjBullet = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setProjBullets(projBullets.filter((_, i) => i !== index));
  };

  const handleAddProjStack = () => {
    const t = newStackTag.trim();
    if (!t) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (!projStack.includes(t)) {
      setProjStack([...projStack, t]);
    }
    setNewStackTag('');
  };

  const handleRemoveProjStack = (tag: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setProjStack(projStack.filter(t => t !== tag));
  };

  // Education Handlers
  const handleStartAddEducation = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setEduSchool('');
    setEduDegree('');
    setEduField('');
    setEduYear('');
    setEduGpa('');
    setEduBullets([]);
    setNewEduBulletText('');
    setEditingMode({ type: 'education' });
  };

  const handleStartEditEducation = (item: Education) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setEduSchool(item.school);
    setEduDegree(item.degree);
    setEduField(item.field || '');
    setEduYear(item.year);
    setEduGpa(item.gpa || '');
    setEduBullets([...(item.highlights || [])]);
    setNewEduBulletText('');
    setEditingMode({ type: 'education', id: item.id });
  };

  const handleAddEduBullet = () => {
    const b = newEduBulletText.trim();
    if (!b) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setEduBullets([...eduBullets, b]);
    setNewEduBulletText('');
  };

  const handleRemoveEduBullet = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setEduBullets(eduBullets.filter((_, i) => i !== index));
  };

  const handleSaveEducation = () => {
    if (!eduSchool.trim() || !eduDegree.trim()) {
      setFormError('Please enter both institution and degree title.');
      return;
    }
    setFormError(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    const finalBullets =
      eduBullets.length > 0
        ? eduBullets
        : newEduBulletText.trim()
        ? [newEduBulletText.trim()]
        : undefined;

    if (editingMode?.id) {
      setEducation(
        education.map(e =>
          e.id === editingMode.id
            ? {
                ...e,
                school: eduSchool.trim(),
                degree: eduDegree.trim(),
                field: eduField.trim() || undefined,
                year: eduYear.trim() || '2024',
                gpa: eduGpa.trim() || undefined,
                highlights: finalBullets,
              }
            : e
        )
      );
    } else {
      const newEdu: Education = {
        id: `edu-${Date.now()}`,
        school: eduSchool.trim(),
        degree: eduDegree.trim(),
        field: eduField.trim() || undefined,
        year: eduYear.trim() || '2024',
        gpa: eduGpa.trim() || undefined,
        highlights: finalBullets,
      };
      setEducation([newEdu, ...education]);
    }
    setEditingMode(null);
  };

  const handleRemoveEducation = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setEducation(education.filter(e => e.id !== id));
  };

  // Organization Handlers
  const handleStartAddOrganization = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setOrgName('');
    setOrgRole('');
    setOrgPeriod('');
    setOrgDesc('');
    setOrgBullets([]);
    setNewOrgBulletText('');
    setEditingMode({ type: 'organization' });
  };

  const handleStartEditOrganization = (item: OrganizationItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setOrgName(item.organization);
    setOrgRole(item.role);
    setOrgPeriod(item.period);
    setOrgDesc(item.description || '');
    setOrgBullets([...(item.highlights || (item.description ? [item.description] : []))]);
    setNewOrgBulletText('');
    setEditingMode({ type: 'organization', id: item.id });
  };

  const handleAddOrgBullet = () => {
    const b = newOrgBulletText.trim();
    if (!b) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setOrgBullets([...orgBullets, b]);
    setNewOrgBulletText('');
  };

  const handleRemoveOrgBullet = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setOrgBullets(orgBullets.filter((_, i) => i !== index));
  };

  const handleSaveOrganization = () => {
    if (!orgName.trim() || !orgRole.trim()) {
      setFormError('Please enter both organization name and role.');
      return;
    }
    setFormError(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    const finalBullets =
      orgBullets.length > 0
        ? orgBullets
        : newOrgBulletText.trim()
        ? [newOrgBulletText.trim()]
        : orgDesc.trim()
        ? [orgDesc.trim()]
        : ['Contributed to community initiatives and team coordination.'];

    const finalDesc = orgDesc.trim() || finalBullets[0];

    if (editingMode?.id) {
      setOrganizations(
        organizations.map(o =>
          o.id === editingMode.id
            ? {
                ...o,
                organization: orgName.trim(),
                role: orgRole.trim(),
                period: orgPeriod.trim() || '2023 - Present',
                description: finalDesc,
                highlights: finalBullets,
              }
            : o
        )
      );
    } else {
      const newOrg: OrganizationItem = {
        id: `org-${Date.now()}`,
        organization: orgName.trim(),
        role: orgRole.trim(),
        period: orgPeriod.trim() || '2023 - Present',
        description: finalDesc,
        highlights: finalBullets,
      };
      setOrganizations([newOrg, ...organizations]);
    }
    setEditingMode(null);
  };

  const handleRemoveOrganization = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setOrganizations(organizations.filter(o => o.id !== id));
  };

  // Certification Handlers
  const handleStartAddCertification = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setCertName('');
    setCertIssuer('');
    setCertDate('');
    setCertUrl('');
    setEditingMode({ type: 'certification' });
  };

  const handleStartEditCertification = (item: CertificationItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setCertName(item.name);
    setCertIssuer(item.issuer);
    setCertDate(item.issueDate);
    setCertUrl(item.credentialUrl || '');
    setEditingMode({ type: 'certification', id: item.id });
  };

  const handleSaveCertification = () => {
    if (!certName.trim() || !certIssuer.trim()) {
      setFormError('Please enter both credential name and issuing organization.');
      return;
    }
    setFormError(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

    if (editingMode?.id) {
      setCertifications(
        certifications.map(c =>
          c.id === editingMode.id
            ? {
                ...c,
                name: certName.trim(),
                issuer: certIssuer.trim(),
                issueDate: certDate.trim() || '2024',
                credentialUrl: certUrl.trim() || undefined,
              }
            : c
        )
      );
    } else {
      const newCert: CertificationItem = {
        id: `cert-${Date.now()}`,
        name: certName.trim(),
        issuer: certIssuer.trim(),
        issueDate: certDate.trim() || '2024',
        credentialUrl: certUrl.trim() || undefined,
      };
      setCertifications([newCert, ...certifications]);
    }
    setEditingMode(null);
  };

  const handleRemoveCertification = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setCertifications(certifications.filter(c => c.id !== id));
  };

  // Save All Changes (Whole Dossier)
  const handleSave = async () => {
    if (!fullName.trim() || !headline.trim()) {
      setActiveTab('identity');
      setEditingMode(null);
      setFormError('Please enter your full name and professional headline.');
      return;
    }

    setFormError(null);
    setIsSaving(true);
    try {
      await onSave({
        fullName: fullName.trim(),
        headline: headline.trim(),
        location: location.trim(),
        summary: summary.trim(),
        contact: {
          email: email.trim(),
          phone: phone.trim(),
          location: location.trim(),
          portfolio: portfolio.trim(),
          github: github.trim(),
          linkedin: linkedin.trim(),
        },
        hardSkills,
        softSkills,
        skills: [...hardSkills, ...softSkills],
        experiences,
        projects,
        education,
        organizations,
        certifications,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => {}
      );
      onClose();
    } catch (err: any) {
      setFormError(err?.message || 'Unable to save CV changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!profile) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
          accessibilityLabel="Close CV builder modal"
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetContainer}>
          {/* Top Header */}
          <View style={styles.sheetHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.stepIndicatorRow}>
                <View style={styles.stepBadgeCurrent}>
                  <Text style={styles.stepBadgeCurrentText}>
                    STEP {currentStep.stepNumber} OF 7
                  </Text>
                </View>
                <Heading style={styles.sheetTitle}>{currentStep.fullTitle}</Heading>
              </View>
              <Body style={styles.sheetSubtitle}>{currentStep.description}</Body>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close modal">
              <X size={18} color="#121212" />
            </TouchableOpacity>
          </View>

          {/* Segmented Stepper Progress Bar (Matching Match Deck) */}
          <View style={styles.stepperProgressWrap}>
            <View style={styles.stepperSegmentsRow} accessibilityElementsHidden>
              {STEPS.map((step, idx) => {
                const isDone = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <View
                    key={step.id}
                    style={[
                      styles.stepperProgressSegment,
                      isDone && styles.stepperProgressSegmentDone,
                      isCurrent && styles.stepperProgressSegmentActive,
                    ]}
                  />
                );
              })}
            </View>
            <Text style={styles.stepperProgressLabel}>
              {currentStep.stepNumber} / {STEPS.length}
            </Text>
          </View>

          {/* Stepper Stage Tabs (Explore & Tracker Mechanism) - Only visible when not in sub-editor */}
          {!editingMode && (
            <View style={styles.stepperTabsContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.stepperScrollView}
                contentContainerStyle={styles.stepperScrollContent}>
                {STEPS.map(step => {
                  const isSelected = activeTab === step.id;
                  const count = getBadgeCount(step.id);

                  return (
                    <TouchableOpacity
                      key={step.id}
                      onPress={() => handleSelectStep(step.id)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      accessibilityLabel={`Step ${step.stepNumber}: ${step.fullTitle}`}
                      style={[
                        styles.stepPill,
                        isSelected ? styles.stepPillSelected : styles.stepPillDefault,
                      ]}>
                      <View
                        style={[
                          styles.stepNumBadge,
                          isSelected
                            ? styles.stepNumBadgeSelected
                            : styles.stepNumBadgeDefault,
                        ]}>
                        <Text
                          style={[
                            styles.stepNumText,
                            isSelected
                              ? styles.stepNumTextSelected
                              : styles.stepNumTextDefault,
                          ]}>
                          {step.stepNumber}
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.stepPillText,
                          isSelected
                            ? styles.stepPillTextSelected
                            : styles.stepPillTextDefault,
                        ]}>
                        {step.label}
                      </Text>

                      {count !== undefined && count > 0 ? (
                        <View
                          style={[
                            styles.stepCountBadge,
                            isSelected
                              ? styles.stepCountBadgeSelected
                              : styles.stepCountBadgeDefault,
                          ]}>
                          <Text
                            style={[
                              styles.stepCountText,
                              isSelected
                                ? styles.stepCountTextSelected
                                : styles.stepCountTextDefault,
                            ]}>
                            {count}
                          </Text>
                        </View>
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Validation / Save Error Banner */}
          {formError ? (
            <View style={styles.formErrorBanner} accessibilityLiveRegion="polite">
              <Text style={styles.formErrorText}>{formError}</Text>
            </View>
          ) : null}

          {/* Tab Content Body */}
          <ScrollView
            showsVerticalScrollIndicator={true}
            style={styles.modalScroll}
            contentContainerStyle={styles.scrollBody}>
            {/* ============================================================== */}
            {/* 1. Identity & Contact */}
            {/* ============================================================== */}
            {activeTab === 'identity' ? (
              <View style={styles.tabContent}>
                <View style={styles.inputGroup}>
                  <Label style={styles.inputLabel}>FULL NAME</Label>
                  <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="e.g. Alex Morgan"
                    placeholderTextColor="#5A5D54"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Label style={styles.inputLabel}>PROFESSIONAL HEADLINE</Label>
                  <TextInput
                    style={styles.input}
                    value={headline}
                    onChangeText={setHeadline}
                    placeholder="e.g. Senior Mobile Systems Architect"
                    placeholderTextColor="#5A5D54"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Label style={styles.inputLabel}>PRIMARY LOCATION</Label>
                  <TextInput
                    style={styles.input}
                    value={location}
                    onChangeText={setLocation}
                    placeholder="e.g. San Francisco, CA (Open to Remote)"
                    placeholderTextColor="#5A5D54"
                  />
                </View>

                <View style={styles.rowInputs}>
                  <View style={[styles.inputGroup, styles.flexInput]}>
                    <Label style={styles.inputLabel} numberOfLines={1}>
                      EMAIL ADDRESS
                    </Label>
                    <TextInput
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholder="e.g. alex@example.com"
                      placeholderTextColor="#5A5D54"
                    />
                  </View>
                  <View style={[styles.inputGroup, styles.flexInput]}>
                    <Label style={styles.inputLabel} numberOfLines={1}>
                      PHONE NUMBER
                    </Label>
                    <TextInput
                      style={styles.input}
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                      placeholder="e.g. +1 (555) 019-2834"
                      placeholderTextColor="#5A5D54"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Label style={styles.inputLabel}>PORTFOLIO / WEBSITE URL</Label>
                  <TextInput
                    style={styles.input}
                    value={portfolio}
                    onChangeText={setPortfolio}
                    autoCapitalize="none"
                    placeholder="e.g. https://alexmorgan.dev"
                    placeholderTextColor="#5A5D54"
                  />
                </View>

                <View style={styles.rowInputs}>
                  <View style={[styles.inputGroup, styles.flexInput]}>
                    <Label style={styles.inputLabel} numberOfLines={1}>
                      GITHUB HANDLE / URL
                    </Label>
                    <TextInput
                      style={styles.input}
                      value={github}
                      onChangeText={setGithub}
                      autoCapitalize="none"
                      placeholder="e.g. github.com/alexmorgan"
                      placeholderTextColor="#5A5D54"
                    />
                  </View>
                  <View style={[styles.inputGroup, styles.flexInput]}>
                    <Label style={styles.inputLabel} numberOfLines={1}>
                      LINKEDIN PROFILE
                    </Label>
                    <TextInput
                      style={styles.input}
                      value={linkedin}
                      onChangeText={setLinkedin}
                      autoCapitalize="none"
                      placeholder="e.g. linkedin.com/in/alexmorgan"
                      placeholderTextColor="#5A5D54"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelCountRow}>
                    <Label style={styles.inputLabel}>EXECUTIVE NARRATIVE (SUMMARY)</Label>
                    <Text style={styles.charCount}>{summary.length} / 600 chars</Text>
                  </View>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={summary}
                    onChangeText={t => setSummary(t.slice(0, 600))}
                    placeholder="Write a high-impact executive summary describing your domain expertise, engineering track record, and technical leadership..."
                    placeholderTextColor="#5A5D54"
                    multiline
                    textAlignVertical="top"
                  />
                </View>
              </View>
            ) : null}

            {/* ============================================================== */}
            {/* 2. Skills */}
            {/* ============================================================== */}
            {activeTab === 'skills' ? (
              <View style={styles.tabContent}>
                <View style={styles.inputGroup}>
                  <Label style={styles.inputLabel}>TECHNICAL SKILLS (HARD SKILLS)</Label>
                  <View style={styles.addTagRow}>
                    <TextInput
                      style={[styles.input, styles.flexInput]}
                      value={newHardSkill}
                      onChangeText={setNewHardSkill}
                      placeholder="e.g. Swift, Docker, GraphQL, Redis"
                      placeholderTextColor="#5A5D54"
                      onSubmitEditing={handleAddHardSkill}
                    />
                    <TouchableOpacity
                      onPress={handleAddHardSkill}
                      style={styles.addTagBtn}
                      activeOpacity={0.8}>
                      <Plus size={14} color="#121212" />
                      <Text style={styles.addTagBtnText}>ADD</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.chipsWrap}>
                    {hardSkills.map(s => (
                      <View key={s} style={styles.tagChip}>
                        <Text style={styles.tagText}>{s}</Text>
                        <TouchableOpacity
                          onPress={() => handleRemoveHardSkill(s)}
                          accessibilityLabel={`Remove ${s}`}>
                          <X size={12} color="#2F4F00" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={[styles.inputGroup, { marginTop: 18 }]}>
                  <Label style={styles.inputLabel}>SOFT SKILLS & LEADERSHIP</Label>
                  <View style={styles.addTagRow}>
                    <TextInput
                      style={[styles.input, styles.flexInput]}
                      value={newSoftSkill}
                      onChangeText={setNewSoftSkill}
                      placeholder="e.g. Mentorship, Cross-functional Squads"
                      placeholderTextColor="#5A5D54"
                      onSubmitEditing={handleAddSoftSkill}
                    />
                    <TouchableOpacity
                      onPress={handleAddSoftSkill}
                      style={styles.addTagBtn}
                      activeOpacity={0.8}>
                      <Plus size={14} color="#121212" />
                      <Text style={styles.addTagBtnText}>ADD</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.chipsWrap}>
                    {softSkills.map(s => (
                      <View key={s} style={[styles.tagChip, styles.softTagChip]}>
                        <Text style={[styles.tagText, styles.softTagText]}>{s}</Text>
                        <TouchableOpacity
                          onPress={() => handleRemoveSoftSkill(s)}
                          accessibilityLabel={`Remove ${s}`}>
                          <X size={12} color="#5A5D54" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ) : null}

            {/* ============================================================== */}
            {/* 3. Work Experience */}
            {/* ============================================================== */}
            {activeTab === 'experience' ? (
              <View style={styles.tabContent}>
                {editingMode?.type === 'experience' ? (
                  /* --- EXPERIENCE ITEM EDITOR --- */
                  <View style={styles.editorBox}>
                    <View style={styles.editorHeader}>
                      <Heading style={styles.editorTitle}>
                        {editingMode.id ? 'Edit Work Experience' : 'Add Work Experience'}
                      </Heading>
                      <TouchableOpacity
                        onPress={() => setEditingMode(null)}
                        style={styles.cancelEditorIconBtn}>
                        <X size={16} color="#5A5D54" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                      <Label style={styles.inputLabel}>JOB TITLE / ROLE</Label>
                      <TextInput
                        style={styles.input}
                        value={expRole}
                        onChangeText={setExpRole}
                        placeholder="e.g. Staff Mobile Architect"
                        placeholderTextColor="#5A5D54"
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Label style={styles.inputLabel}>COMPANY OR ORGANIZATION</Label>
                      <TextInput
                        style={styles.input}
                        value={expCompany}
                        onChangeText={setExpCompany}
                        placeholder="e.g. Stripe"
                        placeholderTextColor="#5A5D54"
                      />
                    </View>

                    <View style={styles.rowInputs}>
                      <View style={[styles.inputGroup, styles.flexInput]}>
                        <Label style={styles.inputLabel} numberOfLines={1}>
                          EMPLOYMENT PERIOD
                        </Label>
                        <TextInput
                          style={styles.input}
                          value={expPeriod}
                          onChangeText={setExpPeriod}
                          placeholder="e.g. 2022 - Present"
                          placeholderTextColor="#5A5D54"
                        />
                      </View>
                      <View style={[styles.inputGroup, styles.flexInput]}>
                        <Label style={styles.inputLabel} numberOfLines={1}>
                          LOCATION & MODE
                        </Label>
                        <TextInput
                          style={styles.input}
                          value={expLocation}
                          onChangeText={setExpLocation}
                          placeholder="e.g. San Francisco, CA (Remote)"
                          placeholderTextColor="#5A5D54"
                        />
                      </View>
                    </View>

                    {/* Google XYZ Impact Bullets Manager */}
                    <View style={[styles.inputGroup, { marginTop: 8 }]}>
                      <View style={styles.labelCountRow}>
                        <Label style={styles.inputLabel}>IMPACT HIGHLIGHTS (GOOGLE XYZ)</Label>
                        <Text style={styles.charCount}>{expBullets.length} bullets added</Text>
                      </View>
                      <Body style={styles.fieldHint}>
                        Format: Accomplished [X] measured by [Y] by doing [Z].
                      </Body>

                      {/* Current Bullets List */}
                      {expBullets.map((b, idx) => (
                        <View key={idx} style={styles.bulletRow}>
                          <Text style={styles.bulletPointDot}>•</Text>
                          <Text style={styles.bulletRowText}>{b}</Text>
                          <TouchableOpacity
                            onPress={() => handleRemoveExpBullet(idx)}
                            style={styles.removeBulletBtn}
                            accessibilityLabel={`Delete bullet ${idx + 1}`}>
                            <X size={13} color="#991B1B" />
                          </TouchableOpacity>
                        </View>
                      ))}

                      {/* Add New Bullet Input */}
                      <View style={styles.addBulletInputRow}>
                        <TextInput
                          style={[styles.input, styles.flexInput, { minHeight: 60 }]}
                          value={newBulletText}
                          onChangeText={setNewBulletText}
                          placeholder="e.g. Decreased app cold-start latency by 42% across 3M MAU by rearchitecting Hermes bundle initialization..."
                          placeholderTextColor="#5A5D54"
                          multiline
                        />
                        <TouchableOpacity
                          onPress={handleAddExpBullet}
                          style={styles.addBulletBtn}
                          activeOpacity={0.8}>
                          <Plus size={14} color="#121212" />
                          <Text style={styles.addBulletBtnText}>ADD BULLET</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Editor Footer Actions */}
                    <View style={styles.editorActionRow}>
                      <TouchableOpacity
                        onPress={() => setEditingMode(null)}
                        style={styles.editorCancelBtn}>
                        <Text style={styles.editorCancelText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleSaveExperience}
                        style={styles.editorSaveBtn}>
                        <Check size={15} color="#121212" strokeWidth={2.5} />
                        <Text style={styles.editorSaveText}>
                          {editingMode.id ? 'Save Changes' : 'Add Experience'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  /* --- EXPERIENCE LIST VIEW --- */
                  <View style={styles.listViewContainer}>
                    <View style={styles.listHeaderRow}>
                      <View>
                        <Heading style={styles.listSectionTitle}>Work Experience</Heading>
                        <Body style={styles.listSectionSubtitle}>
                          {experiences.length} career positions documented
                        </Body>
                      </View>
                      <TouchableOpacity
                        onPress={handleStartAddExperience}
                        style={styles.addTagBtn}
                        activeOpacity={0.85}
                        accessibilityRole="button"
                        accessibilityLabel="Add Work Experience">
                        <Plus size={14} color="#121212" />
                        <Text style={styles.addTagBtnText}>ADD</Text>
                      </TouchableOpacity>
                    </View>

                    {experiences.length === 0 ? (
                      <View style={styles.emptyStateCard}>
                        <Briefcase size={28} color="#5A5D54" />
                        <Heading style={styles.emptyStateTitle}>No work experience added yet</Heading>
                        <Body style={styles.emptyStateText}>
                          Add your employment history with quantified achievements in Google XYZ format.
                        </Body>
                        <TouchableOpacity
                          onPress={handleStartAddExperience}
                          style={styles.emptyStateBtn}>
                          <Plus size={14} color="#121212" />
                          <Text style={styles.emptyStateBtnText}>Add First Experience</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      experiences.map(e => (
                        <View key={e.id} style={styles.cardItem}>
                          <View style={styles.cardItemHeadingGroup}>
                            <Heading style={styles.cardItemRole}>{e.role}</Heading>
                            <View style={styles.cardItemMetaRow}>
                              <Text style={styles.cardItemCompany}>{e.company}</Text>
                              <Text style={styles.metaDot}>•</Text>
                              <Text style={styles.cardItemPeriod}>{e.period}</Text>
                              {e.location ? (
                                <>
                                  <Text style={styles.metaDot}>•</Text>
                                  <Text style={styles.cardItemLocation}>{e.location}</Text>
                                </>
                              ) : null}
                            </View>
                          </View>

                          {/* Render all bullets */}
                          {e.highlights && e.highlights.length > 0 ? (
                            <View style={styles.cardBulletsContainer}>
                              {e.highlights.map((h, i) => (
                                <View key={i} style={styles.cardBulletRow}>
                                  <Text style={styles.cardBulletDot}>•</Text>
                                  <Text style={styles.cardBulletText}>{h}</Text>
                                </View>
                              ))}
                            </View>
                          ) : null}

                          {/* Bottom Actions Row: Long Edit + Compact Delete */}
                          <View style={styles.cardActionsRow}>
                            <TouchableOpacity
                              onPress={() => handleStartEditExperience(e)}
                              style={styles.cardEditLongBtn}
                              accessibilityRole="button"
                              accessibilityLabel={`Edit ${e.role} at ${e.company}`}>
                              <Pencil size={13} color="#121212" />
                              <Text style={styles.cardEditLongText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => handleRemoveExperience(e.id)}
                              style={styles.cardDeleteCompactBtn}
                              accessibilityRole="button"
                              accessibilityLabel={`Delete ${e.role} at ${e.company}`}>
                              <Trash2 size={14} color="#991B1B" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))
                    )}
                  </View>
                )}
              </View>
            ) : null}

            {/* ============================================================== */}
            {/* 4. Projects */}
            {/* ============================================================== */}
            {activeTab === 'projects' ? (
              <View style={styles.tabContent}>
                {editingMode?.type === 'project' ? (
                  /* --- PROJECT ITEM EDITOR --- */
                  <View style={styles.editorBox}>
                    <View style={styles.editorHeader}>
                      <Heading style={styles.editorTitle}>
                        {editingMode.id ? 'Edit Project' : 'Add Project'}
                      </Heading>
                      <TouchableOpacity
                        onPress={() => setEditingMode(null)}
                        style={styles.cancelEditorIconBtn}>
                        <X size={16} color="#5A5D54" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                      <Label style={styles.inputLabel}>PROJECT NAME</Label>
                      <TextInput
                        style={styles.input}
                        value={projName}
                        onChangeText={setProjName}
                        placeholder="e.g. React Native TurboEngine"
                        placeholderTextColor="#5A5D54"
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Label style={styles.inputLabel}>YOUR ROLE / CONTRIBUTION</Label>
                      <TextInput
                        style={styles.input}
                        value={projRole}
                        onChangeText={setProjRole}
                        placeholder="e.g. Creator & Core Contributor"
                        placeholderTextColor="#5A5D54"
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Label style={styles.inputLabel}>TIMELINE / YEAR</Label>
                      <TextInput
                        style={styles.input}
                        value={projPeriod}
                        onChangeText={setProjPeriod}
                        placeholder="e.g. 2024"
                        placeholderTextColor="#5A5D54"
                      />
                    </View>

                    {/* Tools & Stack Chips Manager */}
                    <View style={[styles.inputGroup, { marginTop: 6 }]}>
                      <Label style={styles.inputLabel}>TOOLS, STACK OR METHODS (OPTIONAL)</Label>
                      <View style={styles.addTagRow}>
                        <TextInput
                          style={[styles.input, styles.flexInput]}
                          value={newStackTag}
                          onChangeText={setNewStackTag}
                          placeholder="e.g. Figma, Excel, React Native, SQL"
                          placeholderTextColor="#5A5D54"
                          onSubmitEditing={handleAddProjStack}
                        />
                        <TouchableOpacity
                          onPress={handleAddProjStack}
                          style={styles.addTagBtn}
                          activeOpacity={0.8}>
                          <Plus size={14} color="#121212" />
                          <Text style={styles.addTagBtnText}>ADD</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.chipsWrap}>
                        {projStack.map(s => (
                          <View key={s} style={styles.tagChip}>
                            <Text style={styles.tagText}>{s}</Text>
                            <TouchableOpacity
                              onPress={() => handleRemoveProjStack(s)}
                              accessibilityLabel={`Remove tag ${s}`}>
                              <X size={12} color="#2F4F00" />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    </View>

                    {/* Google XYZ Impact Bullets Manager */}
                    <View style={[styles.inputGroup, { marginTop: 8 }]}>
                      <View style={styles.labelCountRow}>
                        <Label style={styles.inputLabel}>PROJECT HIGHLIGHTS (GOOGLE XYZ)</Label>
                        <Text style={styles.charCount}>{projBullets.length} bullets added</Text>
                      </View>
                      <Body style={styles.fieldHint}>
                        Format: Accomplished [X] measured by [Y] by doing [Z].
                      </Body>

                      {/* Current Bullets List */}
                      {projBullets.map((b, idx) => (
                        <View key={idx} style={styles.bulletRow}>
                          <Text style={styles.bulletPointDot}>•</Text>
                          <Text style={styles.bulletRowText}>{b}</Text>
                          <TouchableOpacity
                            onPress={() => handleRemoveProjBullet(idx)}
                            style={styles.removeBulletBtn}
                            accessibilityLabel={`Delete project bullet ${idx + 1}`}>
                            <X size={13} color="#991B1B" />
                          </TouchableOpacity>
                        </View>
                      ))}

                      {/* Add New Bullet Input */}
                      <View style={styles.addBulletInputRow}>
                        <TextInput
                          style={[styles.input, styles.flexInput, { minHeight: 60 }]}
                          value={newProjBulletText}
                          onChangeText={setNewProjBulletText}
                          placeholder="e.g. Achieved 12,000+ GitHub stars and adoption by 3 YC-backed production apps by designing a zero-copy Hermes bridge..."
                          placeholderTextColor="#5A5D54"
                          multiline
                        />
                        <TouchableOpacity
                          onPress={handleAddProjBullet}
                          style={styles.addBulletBtn}
                          activeOpacity={0.8}>
                          <Plus size={14} color="#121212" />
                          <Text style={styles.addBulletBtnText}>ADD BULLET</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Actions */}
                    <View style={styles.editorActionRow}>
                      <TouchableOpacity
                        onPress={() => setEditingMode(null)}
                        style={styles.editorCancelBtn}>
                        <Text style={styles.editorCancelText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleSaveProject}
                        style={styles.editorSaveBtn}>
                        <Check size={15} color="#121212" strokeWidth={2.5} />
                        <Text style={styles.editorSaveText}>
                          {editingMode.id ? 'Save Changes' : 'Add Project'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  /* --- PROJECT LIST VIEW --- */
                  <View style={styles.listViewContainer}>
                    <View style={styles.listHeaderRow}>
                      <View>
                        <Heading style={styles.listSectionTitle}>Featured Projects</Heading>
                        <Body style={styles.listSectionSubtitle}>
                          {projects.length} engineering projects showcased
                        </Body>
                      </View>
                      <TouchableOpacity
                        onPress={handleStartAddProject}
                        style={styles.addTagBtn}
                        activeOpacity={0.85}
                        accessibilityRole="button"
                        accessibilityLabel="Add Featured Project">
                        <Plus size={14} color="#121212" />
                        <Text style={styles.addTagBtnText}>ADD</Text>
                      </TouchableOpacity>
                    </View>

                    {projects.length === 0 ? (
                      <View style={styles.emptyStateCard}>
                        <Briefcase size={28} color="#5A5D54" />
                        <Heading style={styles.emptyStateTitle}>No projects added yet</Heading>
                        <Body style={styles.emptyStateText}>
                          Showcase open source libraries, system architectures, and core contributions.
                        </Body>
                        <TouchableOpacity
                          onPress={handleStartAddProject}
                          style={styles.emptyStateBtn}>
                          <Plus size={14} color="#121212" />
                          <Text style={styles.emptyStateBtnText}>Add First Project</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      projects.map(p => (
                        <View key={p.id} style={styles.cardItem}>
                          <View style={styles.cardItemHeadingGroup}>
                            <Heading style={styles.cardItemRole}>{p.name}</Heading>
                            <View style={styles.cardItemMetaRow}>
                              <Text style={styles.cardItemCompany}>{p.role}</Text>
                              <Text style={styles.metaDot}>•</Text>
                              <Text style={styles.cardItemPeriod}>{p.period}</Text>
                              {p.url ? (
                                <>
                                  <Text style={styles.metaDot}>•</Text>
                                  <Text style={styles.cardItemLocation}>{p.url}</Text>
                                </>
                              ) : null}
                            </View>
                          </View>

                          {p.techStack && p.techStack.length > 0 ? (
                            <View style={styles.chipsWrap}>
                              {p.techStack.map(s => (
                                <View key={s} style={styles.staticChip}>
                                  <Text style={styles.staticChipText}>{s}</Text>
                                </View>
                              ))}
                            </View>
                          ) : null}

                          {p.highlights && p.highlights.length > 0 ? (
                            <View style={styles.cardBulletsContainer}>
                              {p.highlights.map((h, i) => (
                                <View key={i} style={styles.cardBulletRow}>
                                  <Text style={styles.cardBulletDot}>•</Text>
                                  <Text style={styles.cardBulletText}>{h}</Text>
                                </View>
                              ))}
                            </View>
                          ) : p.overview ? (
                            <Body style={styles.itemOverviewText}>
                              {p.overview}
                            </Body>
                          ) : null}

                          {/* Bottom Actions Row: Long Edit + Compact Delete */}
                          <View style={styles.cardActionsRow}>
                            <TouchableOpacity
                              onPress={() => handleStartEditProject(p)}
                              style={styles.cardEditLongBtn}
                              accessibilityRole="button"
                              accessibilityLabel={`Edit ${p.name}`}>
                              <Pencil size={13} color="#121212" />
                              <Text style={styles.cardEditLongText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => handleRemoveProject(p.id)}
                              style={styles.cardDeleteCompactBtn}
                              accessibilityRole="button"
                              accessibilityLabel={`Delete ${p.name}`}>
                              <Trash2 size={14} color="#991B1B" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))
                    )}
                  </View>
                )}
              </View>
            ) : null}

            {/* ============================================================== */}
            {/* 5. Education */}
            {/* ============================================================== */}
            {activeTab === 'education' ? (
              <View style={styles.tabContent}>
                {editingMode?.type === 'education' ? (
                  /* --- EDUCATION ITEM EDITOR --- */
                  <View style={styles.editorBox}>
                    <View style={styles.editorHeader}>
                      <Heading style={styles.editorTitle}>
                        {editingMode.id ? 'Edit Education' : 'Add Education'}
                      </Heading>
                      <TouchableOpacity
                        onPress={() => setEditingMode(null)}
                        style={styles.cancelEditorIconBtn}>
                        <X size={16} color="#5A5D54" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                      <Label style={styles.inputLabel}>DEGREE LEVEL</Label>
                      <TextInput
                        style={styles.input}
                        value={eduDegree}
                        onChangeText={setEduDegree}
                        placeholder="e.g. Bachelor of Science"
                        placeholderTextColor="#5A5D54"
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Label style={styles.inputLabel}>UNIVERSITY / INSTITUTION</Label>
                      <TextInput
                        style={styles.input}
                        value={eduSchool}
                        onChangeText={setEduSchool}
                        placeholder="e.g. University of California, Berkeley"
                        placeholderTextColor="#5A5D54"
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Label style={styles.inputLabel}>FIELD OF STUDY / MAJOR</Label>
                      <TextInput
                        style={styles.input}
                        value={eduField}
                        onChangeText={setEduField}
                        placeholder="e.g. Computer Science & Software Engineering"
                        placeholderTextColor="#5A5D54"
                      />
                    </View>

                    <View style={styles.rowInputs}>
                      <View style={[styles.inputGroup, styles.flexInput]}>
                        <Label style={styles.inputLabel} numberOfLines={1}>
                          GRADUATION YEAR
                        </Label>
                        <TextInput
                          style={styles.input}
                          value={eduYear}
                          onChangeText={setEduYear}
                          placeholder="e.g. 2021"
                          placeholderTextColor="#5A5D54"
                        />
                      </View>
                      <View style={[styles.inputGroup, styles.flexInput]}>
                        <Label style={styles.inputLabel} numberOfLines={1}>
                          GPA / HONORS
                        </Label>
                        <TextInput
                          style={styles.input}
                          value={eduGpa}
                          onChangeText={setEduGpa}
                          placeholder="e.g. 3.85 / 4.0"
                          placeholderTextColor="#5A5D54"
                        />
                      </View>
                    </View>

                    {/* Academic Highlights & Coursework Bullets Manager */}
                    <View style={[styles.inputGroup, { marginTop: 8 }]}>
                      <View style={styles.labelCountRow}>
                        <Label style={styles.inputLabel}>ACADEMIC HONORS & HIGHLIGHTS</Label>
                        <Text style={styles.charCount}>{eduBullets.length} bullets added</Text>
                      </View>
                      <Body style={styles.fieldHint}>
                        e.g. Dean's Honor List, Capstone Thesis, Research Fellow, or relevant coursework.
                      </Body>

                      {/* Current Bullets List */}
                      {eduBullets.map((b, idx) => (
                        <View key={idx} style={styles.bulletRow}>
                          <Text style={styles.bulletPointDot}>•</Text>
                          <Text style={styles.bulletRowText}>{b}</Text>
                          <TouchableOpacity
                            onPress={() => handleRemoveEduBullet(idx)}
                            style={styles.removeBulletBtn}
                            accessibilityLabel={`Delete bullet ${idx + 1}`}>
                            <X size={13} color="#991B1B" />
                          </TouchableOpacity>
                        </View>
                      ))}

                      {/* Add New Bullet Input */}
                      <View style={styles.addBulletInputRow}>
                        <TextInput
                          style={[styles.input, styles.flexInput, { minHeight: 60 }]}
                          value={newEduBulletText}
                          onChangeText={setNewEduBulletText}
                          placeholder="e.g. Dean’s Honor List (Top 5% of class) across all 8 academic semesters..."
                          placeholderTextColor="#5A5D54"
                          multiline
                        />
                        <TouchableOpacity
                          onPress={handleAddEduBullet}
                          style={styles.addBulletBtn}
                          activeOpacity={0.8}>
                          <Plus size={14} color="#121212" />
                          <Text style={styles.addBulletBtnText}>ADD BULLET</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.editorActionRow}>
                      <TouchableOpacity
                        onPress={() => setEditingMode(null)}
                        style={styles.editorCancelBtn}>
                        <Text style={styles.editorCancelText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleSaveEducation}
                        style={styles.editorSaveBtn}>
                        <Check size={15} color="#121212" strokeWidth={2.5} />
                        <Text style={styles.editorSaveText}>
                          {editingMode.id ? 'Save Changes' : 'Add Education'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  /* --- EDUCATION LIST VIEW --- */
                  <View style={styles.listViewContainer}>
                    <View style={styles.listHeaderRow}>
                      <View>
                        <Heading style={styles.listSectionTitle}>Formal Education</Heading>
                        <Body style={styles.listSectionSubtitle}>
                          {education.length} academic degrees documented
                        </Body>
                      </View>
                      <TouchableOpacity
                        onPress={handleStartAddEducation}
                        style={styles.addTagBtn}
                        activeOpacity={0.85}
                        accessibilityRole="button"
                        accessibilityLabel="Add Formal Education">
                        <Plus size={14} color="#121212" />
                        <Text style={styles.addTagBtnText}>ADD</Text>
                      </TouchableOpacity>
                    </View>

                    {education.length === 0 ? (
                      <View style={styles.emptyStateCard}>
                        <GraduationCap size={28} color="#5A5D54" />
                        <Heading style={styles.emptyStateTitle}>No education listed yet</Heading>
                        <Body style={styles.emptyStateText}>
                          Add your university degrees, coursework, or academic credentials.
                        </Body>
                        <TouchableOpacity
                          onPress={handleStartAddEducation}
                          style={styles.emptyStateBtn}>
                          <Plus size={14} color="#121212" />
                          <Text style={styles.emptyStateBtnText}>Add First Degree</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      education.map(ed => (
                        <View key={ed.id} style={styles.cardItem}>
                          <View style={styles.cardItemHeadingGroup}>
                            <Heading style={styles.cardItemRole}>
                              {ed.degree} {ed.field ? `in ${ed.field}` : ''}
                            </Heading>
                            <View style={styles.cardItemMetaRow}>
                              <Text style={styles.cardItemCompany}>{ed.school}</Text>
                              <Text style={styles.metaDot}>•</Text>
                              <Text style={styles.cardItemPeriod}>{ed.year}</Text>
                              {ed.gpa ? (
                                <>
                                  <Text style={styles.metaDot}>•</Text>
                                  <Text style={styles.cardItemLocation}>{ed.gpa}</Text>
                                </>
                              ) : null}
                            </View>
                          </View>

                          {ed.highlights && ed.highlights.length > 0 ? (
                            <View style={styles.cardBulletsContainer}>
                              {ed.highlights.map((h, i) => (
                                <View key={i} style={styles.cardBulletRow}>
                                  <Text style={styles.cardBulletDot}>•</Text>
                                  <Text style={styles.cardBulletText}>{h}</Text>
                                </View>
                              ))}
                            </View>
                          ) : null}

                          {/* Bottom Actions Row: Long Edit + Compact Delete */}
                          <View style={styles.cardActionsRow}>
                            <TouchableOpacity
                              onPress={() => handleStartEditEducation(ed)}
                              style={styles.cardEditLongBtn}
                              accessibilityRole="button"
                              accessibilityLabel={`Edit ${ed.degree}`}>
                              <Pencil size={13} color="#121212" />
                              <Text style={styles.cardEditLongText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => handleRemoveEducation(ed.id)}
                              style={styles.cardDeleteCompactBtn}
                              accessibilityRole="button"
                              accessibilityLabel={`Delete ${ed.degree}`}>
                              <Trash2 size={14} color="#991B1B" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))
                    )}
                  </View>
                )}
              </View>
            ) : null}

            {/* ============================================================== */}
            {/* 6. Community & Organizations */}
            {/* ============================================================== */}
            {activeTab === 'organizations' ? (
              <View style={styles.tabContent}>
                {editingMode?.type === 'organization' ? (
                  /* --- ORGANIZATION ITEM EDITOR --- */
                  <View style={styles.editorBox}>
                    <View style={styles.editorHeader}>
                      <Heading style={styles.editorTitle}>
                        {editingMode.id ? 'Edit Leadership & Org' : 'Add Leadership & Org'}
                      </Heading>
                      <TouchableOpacity
                        onPress={() => setEditingMode(null)}
                        style={styles.cancelEditorIconBtn}>
                        <X size={16} color="#5A5D54" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                      <Label style={styles.inputLabel}>ORGANIZATION / INITIATIVE</Label>
                      <TextInput
                        style={styles.input}
                        value={orgName}
                        onChangeText={setOrgName}
                        placeholder="e.g. React Native Indonesia Community"
                        placeholderTextColor="#5A5D54"
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Label style={styles.inputLabel}>ROLE / LEADERSHIP POSITION</Label>
                      <TextInput
                        style={styles.input}
                        value={orgRole}
                        onChangeText={setOrgRole}
                        placeholder="e.g. Chapter Lead & Conference Speaker"
                        placeholderTextColor="#5A5D54"
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Label style={styles.inputLabel}>TENURE / PERIOD</Label>
                      <TextInput
                        style={styles.input}
                        value={orgPeriod}
                        onChangeText={setOrgPeriod}
                        placeholder="e.g. 2023 - Present"
                        placeholderTextColor="#5A5D54"
                      />
                    </View>

                    {/* Leadership & Initiative Bullets Manager */}
                    <View style={[styles.inputGroup, { marginTop: 8 }]}>
                      <View style={styles.labelCountRow}>
                        <Label style={styles.inputLabel}>LEADERSHIP & INITIATIVE BULLETS</Label>
                        <Text style={styles.charCount}>{orgBullets.length} bullets added</Text>
                      </View>
                      <Body style={styles.fieldHint}>
                        Describe key responsibilities, community size, events organized, or mentoring.
                      </Body>

                      {/* Current Bullets List */}
                      {orgBullets.map((b, idx) => (
                        <View key={idx} style={styles.bulletRow}>
                          <Text style={styles.bulletPointDot}>•</Text>
                          <Text style={styles.bulletRowText}>{b}</Text>
                          <TouchableOpacity
                            onPress={() => handleRemoveOrgBullet(idx)}
                            style={styles.removeBulletBtn}
                            accessibilityLabel={`Delete bullet ${idx + 1}`}>
                            <X size={13} color="#991B1B" />
                          </TouchableOpacity>
                        </View>
                      ))}

                      {/* Add New Bullet Input */}
                      <View style={styles.addBulletInputRow}>
                        <TextInput
                          style={[styles.input, styles.flexInput, { minHeight: 60 }]}
                          value={newOrgBulletText}
                          onChangeText={setNewOrgBulletText}
                          placeholder="e.g. Hosted 6 technical panel sessions on React Native Architecture with 400+ mobile devs..."
                          placeholderTextColor="#5A5D54"
                          multiline
                        />
                        <TouchableOpacity
                          onPress={handleAddOrgBullet}
                          style={styles.addBulletBtn}
                          activeOpacity={0.8}>
                          <Plus size={14} color="#121212" />
                          <Text style={styles.addBulletBtnText}>ADD BULLET</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Label style={styles.inputLabel}>COMMUNITY OVERVIEW (OPTIONAL)</Label>
                      <TextInput
                        style={[styles.input, { minHeight: 45 }]}
                        value={orgDesc}
                        onChangeText={setOrgDesc}
                        placeholder="Brief one-line summary of the community..."
                        placeholderTextColor="#5A5D54"
                      />
                    </View>

                    <View style={styles.editorActionRow}>
                      <TouchableOpacity
                        onPress={() => setEditingMode(null)}
                        style={styles.editorCancelBtn}>
                        <Text style={styles.editorCancelText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleSaveOrganization}
                        style={styles.editorSaveBtn}>
                        <Check size={15} color="#121212" strokeWidth={2.5} />
                        <Text style={styles.editorSaveText}>
                          {editingMode.id ? 'Save Changes' : 'Add Organization'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  /* --- ORGANIZATION LIST VIEW --- */
                  <View style={styles.listViewContainer}>
                    <View style={styles.listHeaderRow}>
                      <View>
                        <Heading style={styles.listSectionTitle}>Leadership & Community</Heading>
                        <Body style={styles.listSectionSubtitle}>
                          {organizations.length} activities documented
                        </Body>
                      </View>
                      <TouchableOpacity
                        onPress={handleStartAddOrganization}
                        style={styles.addTagBtn}
                        activeOpacity={0.85}
                        accessibilityRole="button"
                        accessibilityLabel="Add Leadership & Community">
                        <Plus size={14} color="#121212" />
                        <Text style={styles.addTagBtnText}>ADD</Text>
                      </TouchableOpacity>
                    </View>

                    {organizations.length === 0 ? (
                      <View style={styles.emptyStateCard}>
                        <Users2 size={28} color="#5A5D54" />
                        <Heading style={styles.emptyStateTitle}>No community leadership added</Heading>
                        <Body style={styles.emptyStateText}>
                          Document open source leadership, meetup coordination, or tech advisory roles.
                        </Body>
                        <TouchableOpacity
                          onPress={handleStartAddOrganization}
                          style={styles.emptyStateBtn}>
                          <Plus size={14} color="#121212" />
                          <Text style={styles.emptyStateBtnText}>Add Leadership Role</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      organizations.map(o => (
                        <View key={o.id} style={styles.cardItem}>
                          <View style={styles.cardItemHeadingGroup}>
                            <Heading style={styles.cardItemRole}>{o.role}</Heading>
                            <View style={styles.cardItemMetaRow}>
                              <Text style={styles.cardItemCompany}>{o.organization}</Text>
                              <Text style={styles.metaDot}>•</Text>
                              <Text style={styles.cardItemPeriod}>{o.period}</Text>
                            </View>
                          </View>

                          {o.highlights && o.highlights.length > 0 ? (
                            <View style={styles.cardBulletsContainer}>
                              {o.highlights.map((h, i) => (
                                <View key={i} style={styles.cardBulletRow}>
                                  <Text style={styles.cardBulletDot}>•</Text>
                                  <Text style={styles.cardBulletText}>{h}</Text>
                                </View>
                              ))}
                            </View>
                          ) : o.description ? (
                            <Body style={styles.itemOverviewText}>{o.description}</Body>
                          ) : null}

                          {/* Bottom Actions Row: Long Edit + Compact Delete */}
                          <View style={styles.cardActionsRow}>
                            <TouchableOpacity
                              onPress={() => handleStartEditOrganization(o)}
                              style={styles.cardEditLongBtn}
                              accessibilityRole="button"
                              accessibilityLabel={`Edit ${o.role}`}>
                              <Pencil size={13} color="#121212" />
                              <Text style={styles.cardEditLongText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => handleRemoveOrganization(o.id)}
                              style={styles.cardDeleteCompactBtn}
                              accessibilityRole="button"
                              accessibilityLabel={`Delete ${o.role}`}>
                              <Trash2 size={14} color="#991B1B" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))
                    )}
                  </View>
                )}
              </View>
            ) : null}

            {/* ============================================================== */}
            {/* 7. Certifications */}
            {/* ============================================================== */}
            {activeTab === 'certifications' ? (
              <View style={styles.tabContent}>
                {editingMode?.type === 'certification' ? (
                  /* --- CERTIFICATION ITEM EDITOR --- */
                  <View style={styles.editorBox}>
                    <View style={styles.editorHeader}>
                      <Heading style={styles.editorTitle}>
                        {editingMode.id ? 'Edit Certification' : 'Add Certification'}
                      </Heading>
                      <TouchableOpacity
                        onPress={() => setEditingMode(null)}
                        style={styles.cancelEditorIconBtn}>
                        <X size={16} color="#5A5D54" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                      <Label style={styles.inputLabel}>CERTIFICATION NAME</Label>
                      <TextInput
                        style={styles.input}
                        value={certName}
                        onChangeText={setCertName}
                        placeholder="e.g. AWS Certified Solutions Architect - Professional"
                        placeholderTextColor="#5A5D54"
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Label style={styles.inputLabel}>ISSUING AUTHORITY</Label>
                      <TextInput
                        style={styles.input}
                        value={certIssuer}
                        onChangeText={setCertIssuer}
                        placeholder="e.g. Amazon Web Services"
                        placeholderTextColor="#5A5D54"
                      />
                    </View>

                    <View style={styles.rowInputs}>
                      <View style={[styles.inputGroup, styles.flexInput]}>
                        <Label style={styles.inputLabel} numberOfLines={1}>
                          ISSUE YEAR / DATE
                        </Label>
                        <TextInput
                          style={styles.input}
                          value={certDate}
                          onChangeText={setCertDate}
                          placeholder="e.g. 2024"
                          placeholderTextColor="#5A5D54"
                        />
                      </View>
                      <View style={[styles.inputGroup, styles.flexInput]}>
                        <Label style={styles.inputLabel} numberOfLines={1}>
                          CREDENTIAL URL
                        </Label>
                        <TextInput
                          style={styles.input}
                          value={certUrl}
                          onChangeText={setCertUrl}
                          autoCapitalize="none"
                          placeholder="e.g. credly.com/earner/..."
                          placeholderTextColor="#5A5D54"
                        />
                      </View>
                    </View>

                    <View style={styles.editorActionRow}>
                      <TouchableOpacity
                        onPress={() => setEditingMode(null)}
                        style={styles.editorCancelBtn}>
                        <Text style={styles.editorCancelText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleSaveCertification}
                        style={styles.editorSaveBtn}>
                        <Check size={15} color="#121212" strokeWidth={2.5} />
                        <Text style={styles.editorSaveText}>
                          {editingMode.id ? 'Save Changes' : 'Add Certification'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  /* --- CERTIFICATION LIST VIEW --- */
                  <View style={styles.listViewContainer}>
                    <View style={styles.listHeaderRow}>
                      <View>
                        <Heading style={styles.listSectionTitle}>Certifications & Credentials</Heading>
                        <Body style={styles.listSectionSubtitle}>
                          {certifications.length} verified credentials
                        </Body>
                      </View>
                      <TouchableOpacity
                        onPress={handleStartAddCertification}
                        style={styles.addTagBtn}
                        activeOpacity={0.85}
                        accessibilityRole="button"
                        accessibilityLabel="Add Certification">
                        <Plus size={14} color="#121212" />
                        <Text style={styles.addTagBtnText}>ADD</Text>
                      </TouchableOpacity>
                    </View>

                    {certifications.length === 0 ? (
                      <View style={styles.emptyStateCard}>
                        <Award size={28} color="#5A5D54" />
                        <Heading style={styles.emptyStateTitle}>No certifications added yet</Heading>
                        <Body style={styles.emptyStateText}>
                          Add verified industry certifications, cloud licenses, or specialized credentials.
                        </Body>
                        <TouchableOpacity
                          onPress={handleStartAddCertification}
                          style={styles.emptyStateBtn}>
                          <Plus size={14} color="#121212" />
                          <Text style={styles.emptyStateBtnText}>Add First Certificate</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      certifications.map(c => (
                        <View key={c.id} style={styles.cardItem}>
                          <View style={styles.cardItemHeadingGroup}>
                            <Heading style={styles.cardItemRole}>{c.name}</Heading>
                            <View style={styles.cardItemMetaRow}>
                              <Text style={styles.cardItemCompany}>{c.issuer}</Text>
                              <Text style={styles.metaDot}>•</Text>
                              <Text style={styles.cardItemPeriod}>{c.issueDate}</Text>
                              {c.credentialUrl ? (
                                <>
                                  <Text style={styles.metaDot}>•</Text>
                                  <Text style={styles.cardItemLocation}>{c.credentialUrl}</Text>
                                </>
                              ) : null}
                            </View>
                          </View>

                          {/* Bottom Actions Row: Long Edit + Compact Delete */}
                          <View style={styles.cardActionsRow}>
                            <TouchableOpacity
                              onPress={() => handleStartEditCertification(c)}
                              style={styles.cardEditLongBtn}
                              accessibilityRole="button"
                              accessibilityLabel={`Edit ${c.name}`}>
                              <Pencil size={13} color="#121212" />
                              <Text style={styles.cardEditLongText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => handleRemoveCertification(c.id)}
                              style={styles.cardDeleteCompactBtn}
                              accessibilityRole="button"
                              accessibilityLabel={`Delete ${c.name}`}>
                              <Trash2 size={14} color="#991B1B" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))
                    )}
                  </View>
                )}
              </View>
            ) : null}
          </ScrollView>

          {/* Stepper Footer Controls - Only visible when not in sub-editor */}
          {!editingMode && (
            <View style={styles.sheetFooter}>
              <View style={styles.footerNavRow}>
                {currentStepIndex > 0 ? (
                  <TouchableOpacity
                    onPress={handlePrevStep}
                    style={styles.backBtn}
                    accessibilityRole="button"
                    accessibilityLabel="Previous Step">
                    <ChevronLeft size={16} color="#121212" strokeWidth={2.2} />
                    <Text style={styles.backBtnText}>Back</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.cancelBtn}
                    accessibilityRole="button"
                    accessibilityLabel="Cancel">
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={handleNextStep}
                  disabled={isSaving}
                  style={styles.nextBtn}
                  accessibilityRole="button"
                  accessibilityLabel={
                    isLastStep
                      ? 'Save Dossier Changes'
                      : `Next: ${nextStep?.fullTitle}`
                  }>
                  {isSaving ? (
                    <ActivityIndicator size="small" color="#121212" />
                  ) : (
                    <>
                      <Text style={styles.nextBtnText}>
                        {isLastStep
                          ? 'Save Dossier Changes'
                          : `Next: ${nextStep?.label}`}
                      </Text>
                      {isLastStep ? (
                        <Check size={16} color="#121212" strokeWidth={2.5} />
                      ) : (
                        <ArrowRight size={16} color="#121212" strokeWidth={2.5} />
                      )}
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {!isLastStep && (
                <TouchableOpacity
                  onPress={handleSave}
                  disabled={isSaving}
                  style={styles.quickSaveBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Save all changes and close">
                  <Text style={styles.quickSaveText}>Save & Exit</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 18, 18, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    height: '90%',
    maxHeight: '94%',
    borderWidth: 1,
    borderColor: '#E2E6DC',
    overflow: 'hidden',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerLeft: {
    gap: 3,
    flex: 1,
    paddingRight: 10,
  },
  stepIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepBadgeCurrent: {
    backgroundColor: '#EFFCD3',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: '#B8F23E',
  },
  stepBadgeCurrentText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2F4F00',
    letterSpacing: 0.3,
  },
  sheetTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: -0.2,
  },
  sheetSubtitle: {
    fontSize: 11,
    color: '#5A5D54',
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F4F6F0',
    borderWidth: 1,
    borderColor: '#E2E6DC',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  formErrorBanner: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: Radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  formErrorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#991B1B',
  },
  stepperProgressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  stepperSegmentsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  stepperProgressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D6DCD0',
  },
  stepperProgressSegmentDone: {
    backgroundColor: '#121212',
  },
  stepperProgressSegmentActive: {
    backgroundColor: '#2E6F00',
  },
  stepperProgressLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5A5D54',
    letterSpacing: 0.2,
    fontVariant: ['tabular-nums'],
  },
  stepperTabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F4F6F0',
  },
  stepperScrollView: {
    flexGrow: 0,
    height: 58,
  },
  stepperScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    gap: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  stepPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    minHeight: 44,
    borderRadius: Radius.full,
    borderWidth: 1,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  stepPillDefault: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8ECDF',
  },
  stepPillSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  stepNumBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumBadgeDefault: {
    backgroundColor: '#F4F6F0',
  },
  stepNumBadgeSelected: {
    backgroundColor: '#121212',
  },
  stepNumText: {
    fontSize: 10,
    fontWeight: '800',
  },
  stepNumTextDefault: {
    color: '#5A5D54',
  },
  stepNumTextSelected: {
    color: '#B8F23E',
  },
  stepPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  stepPillTextDefault: {
    color: '#5A5D54',
  },
  stepPillTextSelected: {
    color: '#121212',
    fontWeight: '800',
  },
  stepCountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.full,
  },
  stepCountBadgeDefault: {
    backgroundColor: '#F4F6F0',
  },
  stepCountBadgeSelected: {
    backgroundColor: 'rgba(18, 18, 18, 0.12)',
  },
  stepCountText: {
    fontSize: 10,
    fontWeight: '700',
  },
  stepCountTextDefault: {
    color: '#5A5D54',
  },
  stepCountTextSelected: {
    color: '#121212',
  },
  modalScroll: {
    flex: 1,
  },
  scrollBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  tabContent: {
    gap: 14,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#343830',
    letterSpacing: 0.4,
  },
  fieldHint: {
    fontSize: 11,
    color: '#5A5D54',
  },
  labelCountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  charCount: {
    fontSize: 10.5,
    color: '#5A5D54',
  },
  input: {
    backgroundColor: '#F9FAF7',
    borderWidth: 1.5,
    borderColor: '#E8ECDF',
    borderRadius: Radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#121212',
  },
  textArea: {
    minHeight: 100,
    lineHeight: 20,
  },
  flexInput: {
    flex: 1,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 10,
  },
  addTagRow: {
    flexDirection: 'row',
    gap: 8,
  },
  addTagBtn: {
    minHeight: 44,
    backgroundColor: '#B8F23E',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  addTagBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#121212',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  tagChip: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFFCD3',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: '#B8F23E',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2F4F00',
  },
  softTagChip: {
    backgroundColor: '#F4F6F0',
    borderColor: '#E8ECDF',
  },
  softTagText: {
    color: '#343830',
    fontWeight: '600',
  },
  staticChip: {
    backgroundColor: '#F4F6F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: '#E8ECDF',
  },
  staticChipText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#343830',
  },

  /* --- List-First Architecture Styles --- */
  listViewContainer: {
    gap: 12,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  listSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#121212',
  },
  listSectionSubtitle: {
    fontSize: 11,
    color: '#5A5D54',
  },
  emptyStateCard: {
    backgroundColor: '#F9FAF7',
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D8DCCF',
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  emptyStateTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#121212',
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 11.5,
    color: '#5A5D54',
    textAlign: 'center',
    maxWidth: 280,
  },
  emptyStateBtn: {
    minHeight: 44,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#121212',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  emptyStateBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#121212',
  },
  cardItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E8ECDF',
    padding: 14,
    gap: 10,
  },
  cardItemHeadingGroup: {
    flex: 1,
    gap: 3,
  },
  cardItemRole: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#121212',
  },
  cardItemMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5,
  },
  cardItemCompany: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2F4F00',
  },
  metaDot: {
    fontSize: 10,
    color: '#5A5D54',
  },
  cardItemPeriod: {
    fontSize: 11,
    color: '#5A5D54',
  },
  cardItemLocation: {
    fontSize: 11,
    color: '#5A5D54',
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F4F6F0',
  },
  cardEditLongBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 44,
    backgroundColor: '#F4F6F0',
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: '#E2E6DC',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  cardEditLongText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#121212',
  },
  cardDeleteCompactBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  cardBulletsContainer: {
    gap: 5,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F4F6F0',
  },
  cardBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  cardBulletDot: {
    fontSize: 12,
    color: '#2F4F00',
    lineHeight: 18,
  },
  cardBulletText: {
    flex: 1,
    fontSize: 11.5,
    color: '#343830',
    lineHeight: 17,
  },
  itemOverviewText: {
    fontSize: 11.5,
    color: '#343830',
    lineHeight: 17,
  },

  /* --- Sub-Editor Form Styles --- */
  editorBox: {
    backgroundColor: '#F9FAF7',
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: '#E8ECDF',
    padding: 16,
    gap: 12,
  },
  editorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECDF',
    paddingBottom: 10,
  },
  editorTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#121212',
  },
  cancelEditorIconBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8ECDF',
    borderRadius: Radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  bulletPointDot: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2F4F00',
    lineHeight: 16,
    marginTop: 1,
  },
  bulletRowText: {
    flex: 1,
    fontSize: 11.5,
    color: '#121212',
    lineHeight: 16,
  },
  removeBulletBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -6,
    marginRight: -6,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  addBulletInputRow: {
    gap: 8,
    marginTop: 4,
  },
  addBulletBtn: {
    minHeight: 44,
    backgroundColor: '#B8F23E',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: Radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  addBulletBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#121212',
  },
  editorActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E8ECDF',
    paddingTop: 12,
  },
  editorCancelBtn: {
    minHeight: 44,
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: Radius.sm,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E6DC',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  editorCancelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5A5D54',
  },
  editorSaveBtn: {
    minHeight: 44,
    justifyContent: 'center',
    backgroundColor: '#B8F23E',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: Radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  editorSaveText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#121212',
  },

  /* --- Stepper Footer --- */
  sheetFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    borderTopWidth: 1,
    borderTopColor: '#F4F6F0',
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  footerNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: Radius.sm,
    backgroundColor: '#F4F6F0',
    borderWidth: 1,
    borderColor: '#E2E6DC',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  backBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#121212',
  },
  cancelBtn: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: Radius.sm,
    backgroundColor: '#F4F6F0',
    borderWidth: 1,
    borderColor: '#E2E6DC',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  cancelBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#5A5D54',
  },
  nextBtn: {
    flex: 1,
    minHeight: 48,
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: Radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  nextBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.3,
  },
  quickSaveBtn: {
    minHeight: 44,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  quickSaveText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5A5D54',
    textDecorationLine: 'underline',
  },
});
