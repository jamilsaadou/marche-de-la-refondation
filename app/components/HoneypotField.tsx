'use client';

import { useEffect, useState } from 'react';

/**
 * Composant Honeypot - Protection anti-bot simple et efficace
 * 
 * Ce composant utilise plusieurs techniques pour détecter les bots :
 * 1. Champ caché (honeypot) - Les bots remplissent souvent tous les champs
 * 2. Délai minimum de soumission - Les humains prennent du temps pour remplir un formulaire
 * 3. Vérification JavaScript - Les bots simples n'exécutent pas toujours JS
 */

interface HoneypotFieldProps {
  onValidate: (isBot: boolean) => void;
}

export default function HoneypotField({ onValidate }: HoneypotFieldProps) {
  const [formStartTime] = useState(Date.now());
  const [jsEnabled, setJsEnabled] = useState(false);

  useEffect(() => {
    // Indiquer que JavaScript est activé
    setJsEnabled(true);
  }, []);

  const validateSubmission = () => {
    const honeypotField = document.getElementById('website_url') as HTMLInputElement;
    const emailConfirm = document.getElementById('email_confirm') as HTMLInputElement;
    
    // Vérification 1: Le honeypot ne doit pas être rempli
    if (honeypotField && honeypotField.value !== '') {
      console.warn('[SECURITY] Bot détecté - Honeypot rempli');
      onValidate(true);
      return false;
    }

    // Vérification 2: Le champ de confirmation email ne doit pas être rempli
    if (emailConfirm && emailConfirm.value !== '') {
      console.warn('[SECURITY] Bot détecté - Champ confirmation rempli');
      onValidate(true);
      return false;
    }

    // Vérification 3: JavaScript doit être activé
    if (!jsEnabled) {
      console.warn('[SECURITY] Bot détecté - JavaScript désactivé');
      onValidate(true);
      return false;
    }

    // Vérification 4: Délai minimum de soumission (5 secondes)
    const timeTaken = Date.now() - formStartTime;
    if (timeTaken < 5000) {
      console.warn('[SECURITY] Bot détecté - Soumission trop rapide');
      onValidate(true);
      return false;
    }

    // Toutes les vérifications passées
    onValidate(false);
    return true;
  };

  // Exposer la fonction de validation globalement
  useEffect(() => {
    (window as any).validateHoneypot = validateSubmission;
  }, [jsEnabled, formStartTime]);

  return (
    <>
      {/* Champ honeypot - Caché visuellement mais présent dans le DOM */}
      <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
        <label htmlFor="website_url">
          Site web (ne pas remplir)
        </label>
        <input
          type="text"
          id="website_url"
          name="website_url"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Deuxième champ piège - Confirmation email */}
      <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
        <label htmlFor="email_confirm">
          Confirmer votre email
        </label>
        <input
          type="email"
          id="email_confirm"
          name="email_confirm"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Champ caché pour vérifier JavaScript */}
      <input
        type="hidden"
        name="js_enabled"
        value={jsEnabled ? 'true' : 'false'}
      />

      {/* Timestamp de début du formulaire */}
      <input
        type="hidden"
        name="form_start_time"
        value={formStartTime.toString()}
      />
    </>
  );
}

/**
 * Hook pour utiliser la validation honeypot
 */
export function useHoneypotValidation() {
  const [isBot, setIsBot] = useState<boolean | null>(null);

  const validate = () => {
    if (typeof window !== 'undefined' && (window as any).validateHoneypot) {
      return (window as any).validateHoneypot();
    }
    return true; // Par défaut, autoriser si le validateur n'est pas disponible
  };

  return { isBot, validate, setIsBot };
}
