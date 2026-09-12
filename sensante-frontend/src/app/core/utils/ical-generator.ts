import { RendezVousDTO } from '../models/rendez-vous.model';

/**
 * Générateur de fichier iCalendar (.ics) 100% conforme à la spécification RFC 5545.
 * Permet l'importation directe dans Google Calendar, Apple Calendar, Outlook et Android.
 */
export class ICalGenerator {

  public static generateAndDownload(rdv: RendezVousDTO): void {
    const icsContent = this.buildIcsContent(rdv);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    const cleanDate = (rdv.dateRendezVous || 'rdv').replace(/[^a-zA-Z0-9]/g, '-');
    a.download = `sensante-rdv-${cleanDate}.ics`;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 200);
  }

  private static buildIcsContent(rdv: RendezVousDTO): string {
    const now = new Date();
    const dtStamp = this.formatToIcsUtc(now);

    // Parsing date and time
    const dateStr = rdv.dateRendezVous || '2025-09-08';
    const timeStr = rdv.heureRendezVous || '09:30';
    
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);

    const startDate = new Date(year, month - 1, day, hours, minutes);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Durée estimée 1h

    const dtStart = this.formatToIcsLocal(startDate);
    const dtEnd = this.formatToIcsLocal(endDate);

    const uid = `sensante-${rdv.id || 'ref'}-${Date.now()}@sensante.sn`;
    const summary = this.escapeIcsText(`[SenSanté] ${rdv.titre || 'Consultation Dispensaire'} - ${rdv.nomEnfant || 'Patient'}`);
    const location = this.escapeIcsText(`${rdv.nomStructure || 'Centre de Santé'}, ${rdv.localisationSalle || 'Consultation'}`);
    const description = this.escapeIcsText(
      `Dossier: ${rdv.codeDossierRef || 'N/A'}\n` +
      `Praticien: ${rdv.nomPraticien || 'Médecin Référent'} (${rdv.specialitePraticien || 'Pédiatrie'})\n` +
      `Médiateur relais: ${rdv.nomRelais || 'Relais de Santé'} (${rdv.telephoneRelais || 'N/A'})\n\n` +
      `Instructions: ${rdv.instructionsTuteur || 'Apporter carnet de santé et QR code'}\n` +
      `Localisation: ${rdv.localisationSalle || 'Accueil'}`
    );

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//SenSante SN//Portail Parent Dispensaire//FR',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${dtStamp}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT2H',
      'ACTION:DISPLAY',
      'DESCRIPTION:Rappel Consultation SenSanté dans 2 heures',
      'END:VALARM',
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      'DESCRIPTION:Rappel Consultation SenSanté demain',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
  }

  private static formatToIcsLocal(d: Date): string {
    const pad = (n: number) => (n < 10 ? '0' + n : n.toString());
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  }

  private static formatToIcsUtc(d: Date): string {
    const pad = (n: number) => (n < 10 ? '0' + n : n.toString());
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
  }

  private static escapeIcsText(text: string): string {
    if (!text) return '';
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');
  }
}
